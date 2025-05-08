exports.DonneesListe_Saisie_Competences = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_Saisie_Competences extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		const lApplicationSco = GApplication;
		const lEtatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.elementsStockageCopierColler =
			lEtatUtilisateurSco.getInfosSupp("GrillesCompetences");
		this.avecCreationDomaine = aParam.avecCreationDomaine;
		this.avecCreationCompetence = aParam.avecCreationCompetence;
		this.estGrilleModifiable = aParam.estGrilleModifiable;
		this.avecOptionsMenuContextuel = aParam.avecMenuContextuel;
		this.avecSousItems = aParam.avecSousItems;
		this.callbackAjouterElement = aParam.callbackAjouterElement;
		this.callbackCopierElements = aParam.callbackCopierElements;
		this.callbackCollerElements = aParam.callbackCollerElements;
		this.callbackCopierGrille = aParam.callbackCopierGrille;
		this.callbackCollerGrille = aParam.callbackCollerGrille;
		this.callbackDeplacer = aParam.callbackDeplacer;
		this.setOptions({
			avecEtatSaisie: false,
			avecMultiSelection:
				aParam.avecMultiSelection !== undefined
					? aParam.avecMultiSelection
					: true,
		});
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		if (
			aParams.article.Genre ===
			Enumere_Ressource_1.EGenreRessource.ElementPilier
		) {
			return (
				aParams.idColonne ===
					DonneesListe_Saisie_Competences.colonnes.lib_item ||
				aParams.idColonne ===
					DonneesListe_Saisie_Competences.colonnes.lib_sousItem
			);
		} else if (
			aParams.article.Genre === Enumere_Ressource_1.EGenreRessource.Competence
		) {
			return (
				aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.lib_sousItem
			);
		}
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			this._estCelluleAjout(
				aParams.idColonne,
				aParams.article,
				this.avecSousItems,
			)
		) {
			lClasses.push("AlignementMilieu", "Texte13");
		} else if (
			aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.niveau_equiv_ce ||
			aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.coefficient ||
			aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.nb_evaluations ||
			aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.nb_evaluationsHisto
		) {
			lClasses.push("AlignementMilieu");
		}
		if (
			aParams.article.Genre ===
				Enumere_Ressource_1.EGenreRessource.ElementPilier ||
			(aParams.article.Genre ===
				Enumere_Ressource_1.EGenreRessource.Competence &&
				!!this.avecSousItems)
		) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = ["AlignementMilieuVertical"];
		if (
			this._estCelluleAjout(
				aParams.idColonne,
				aParams.article,
				this.avecSousItems,
			) ||
			this._estCelluleDeploiement(
				aParams.idColonne,
				aParams.article,
				this.avecSousItems,
			) ||
			aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.domainesAssocies
		) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	avecContenuTronque(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Saisie_Competences.colonnes.elmtsSignifiants:
			case DonneesListe_Saisie_Competences.colonnes.auteur:
				return true;
		}
		return false;
	}
	avecDeploiement() {
		return true;
	}
	avecImageSurColonneDeploiement(aParams) {
		return this._estCelluleDeploiement(
			aParams.idColonne,
			aParams.article,
			this.avecSousItems,
		);
	}
	avecDeploiementSurColonne(aParams) {
		return this._estCelluleDeploiement(
			aParams.idColonne,
			aParams.article,
			this.avecSousItems,
		);
	}
	avecSuppression(aParams) {
		return this.estGrilleModifiable && aParams.article.libelleEditable;
	}
	avecEvenementSuppression() {
		return true;
	}
	getLibelleDraggable(aParams) {
		return aParams.article.getLibelle();
	}
	avecInterruptionSuppression() {
		return true;
	}
	suppressionConfirmation() {
		return false;
	}
	avecEdition(aParams) {
		if (this.estGrilleModifiable !== true) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_Saisie_Competences.colonnes.domainesAssocies:
				return true;
			case DonneesListe_Saisie_Competences.colonnes.libelle_bulletin:
				return aParams.article.libelleBulletinEditable || false;
			case DonneesListe_Saisie_Competences.colonnes.niveau_equiv_ce:
				return aParams.article.nivEquivalenceCEEditable || false;
			case DonneesListe_Saisie_Competences.colonnes.coefficient:
				return aParams.article.coefficientEditable || false;
			case DonneesListe_Saisie_Competences.colonnes.elmtsSignifiants:
				return aParams.article.elmtSignifiantEditable || false;
			case DonneesListe_Saisie_Competences.colonnes.evaluable:
				return aParams.article.evaluableEditable || false;
			case DonneesListe_Saisie_Competences.colonnes.niveaux:
				return aParams.article.niveauxEditable || false;
		}
		return (
			this._estCelluleDeLibelle(aParams.idColonne, aParams.article) &&
			aParams.article.libelleEditable === true
		);
	}
	avecEvenementEdition(aParams) {
		return (
			this.avecEdition(aParams) &&
			(aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.domainesAssocies ||
				aParams.idColonne ===
					DonneesListe_Saisie_Competences.colonnes.niveau_equiv_ce ||
				aParams.idColonne ===
					DonneesListe_Saisie_Competences.colonnes.elmtsSignifiants ||
				aParams.idColonne === DonneesListe_Saisie_Competences.colonnes.niveaux)
		);
	}
	avecEvenementApresEdition() {
		return true;
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne === DonneesListe_Saisie_Competences.colonnes.coefficient
		) {
			if (aParams.article.coefficient !== V) {
				aParams.article.coefficient = V;
			}
		} else if (
			aParams.idColonne === DonneesListe_Saisie_Competences.colonnes.evaluable
		) {
			aParams.article.evaluable = !!V;
		} else {
			const lValeur = V.trim();
			if (
				aParams.idColonne ===
				DonneesListe_Saisie_Competences.colonnes.libelle_bulletin
			) {
				if (aParams.article.libelleBulletin !== lValeur) {
					aParams.article.libelleBulletin = lValeur;
				}
			} else {
				if (aParams.article.Libelle !== lValeur) {
					aParams.article.Libelle = lValeur;
				}
			}
		}
	}
	getControleCaracteresInput(aParams) {
		let lTailleMax = this.parametresSco.tailleLibelleElementGrilleCompetence;
		if (
			aParams.idColonne ===
			DonneesListe_Saisie_Competences.colonnes.libelle_bulletin
		) {
			lTailleMax = 30;
		}
		return { tailleMax: lTailleMax };
	}
	getOptionsNote() {
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			avecAnnotation: false,
			sansNotePossible: false,
		};
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Saisie_Competences.colonnes.lib_competence:
			case DonneesListe_Saisie_Competences.colonnes.lib_item:
			case DonneesListe_Saisie_Competences.colonnes.lib_sousItem:
			case DonneesListe_Saisie_Competences.colonnes.libelle_bulletin:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_Saisie_Competences.colonnes.coefficient:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_Saisie_Competences.colonnes.evaluable:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEvenementSelectionClick(aParams) {
		return (
			this._estCelluleAjout(
				aParams.idColonne,
				aParams.article,
				this.avecSousItems,
			) && this.avecCreationCompetence === true
		);
	}
	avecTrimSurEdition() {
		return true;
	}
	avecEvenementApresCreation() {
		return true;
	}
	surCreation(D, V, aLigne) {
		if (aLigne === -1) {
			D.Libelle = V[2];
			D.Genre = Enumere_Ressource_1.EGenreRessource.ElementPilier;
			D.listeDomaines = null;
		} else {
			const lElementCompetenceParent = this.Donnees.get(aLigne);
			if (!!lElementCompetenceParent) {
				let lGenre;
				if (
					lElementCompetenceParent.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					lGenre = Enumere_Ressource_1.EGenreRessource.Competence;
				} else {
					lGenre = Enumere_Ressource_1.EGenreRessource.SousItem;
				}
				D.Libelle = V[2];
				D.Genre = lGenre;
				D.pere = lElementCompetenceParent;
				D.ordre = lElementCompetenceParent.nbFils + 1;
				D.libelleEditable = true;
				D.strNivEquivalenceCE = "";
				D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			}
		}
	}
	getValeur(aParams) {
		if (
			this._estCelluleAjout(
				aParams.idColonne,
				aParams.article,
				this.avecSousItems,
			)
		) {
			return this.avecCreationCompetence === true ? "+" : "";
		}
		switch (aParams.idColonne) {
			case DonneesListe_Saisie_Competences.colonnes.plus_competence:
				return "";
			case DonneesListe_Saisie_Competences.colonnes.deploy_competence:
				if (
					aParams.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					return "";
				}
				return "";
			case DonneesListe_Saisie_Competences.colonnes.lib_competence:
				if (
					aParams.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					const lLibelle = [aParams.article.getLibelle()];
					if (!!aParams.article.estActiviteLangagiere) {
						lLibelle.push('<span style="float:right;">');
						lLibelle.push(
							UtilitaireCompetences_1.TUtilitaireCompetences.construitInfoActiviteLangagiere(
								{ avecHint: true },
							),
						);
						lLibelle.push("</span>");
					}
					return lLibelle.join("");
				} else if (
					aParams.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.Competence
				) {
					return "";
				}
				return "";
			case DonneesListe_Saisie_Competences.colonnes.lib_item:
				if (
					aParams.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.Competence
				) {
					return aParams.article.getLibelle();
				}
				return "";
			case DonneesListe_Saisie_Competences.colonnes.lib_sousItem:
				if (
					aParams.article.Genre === Enumere_Ressource_1.EGenreRessource.SousItem
				) {
					return aParams.article.getLibelle();
				}
				return "";
			case DonneesListe_Saisie_Competences.colonnes.libelle_bulletin:
				return aParams.article.libelleBulletin || "";
			case DonneesListe_Saisie_Competences.colonnes.niveau_equiv_ce:
				return aParams.article.strNivEquivalenceCE || "";
			case DonneesListe_Saisie_Competences.colonnes.domainesAssocies:
				return aParams.article.strListeDomaines || "";
			case DonneesListe_Saisie_Competences.colonnes.coefficient:
				return aParams.article.coefficient || null;
			case DonneesListe_Saisie_Competences.colonnes.elmtsSignifiants:
				return aParams.article.libelleElmtSignifiant || "";
			case DonneesListe_Saisie_Competences.colonnes.evaluable:
				return !!aParams.article.evaluable;
			case DonneesListe_Saisie_Competences.colonnes.nb_evaluations:
				return aParams.article.nbEvals || "";
			case DonneesListe_Saisie_Competences.colonnes.nb_evaluationsHisto:
				return aParams.article.nbEvalsHisto || "";
			case DonneesListe_Saisie_Competences.colonnes.auteur:
				return aParams.article.libelleAuteur || "";
			case DonneesListe_Saisie_Competences.colonnes.niveaux:
				if (
					aParams.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.Competence
				) {
					return aParams.article.libelleNiveaux || "";
				}
		}
		return "";
	}
	getValeurParDefaut(aParams) {
		if (aParams.numeroLigneCreation >= 0) {
			const lPere = this.Donnees.get(aParams.numeroLigneCreation);
			if (!lPere) {
				return "";
			}
			return ObjetTraduction_1.GTraductions.getValeur(
				lPere.getGenre() === Enumere_Ressource_1.EGenreRessource.ElementPilier
					? "competencesGrilles.ListeCompetences.LibelleItemParDefaut"
					: "competencesGrilles.ListeCompetences.LibelleSousItemParDefaut",
				[lPere.nbFils + 1],
			);
		}
		return "";
	}
	getHintForce(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_Saisie_Competences.colonnes.domainesAssocies
		) {
			return aParams.article.hintListeDomaines || "";
		} else if (
			aParams.idColonne === DonneesListe_Saisie_Competences.colonnes.evaluable
		) {
			return !!aParams.article.evaluable
				? ObjetTraduction_1.GTraductions.getValeur(
						"competencesGrilles.ListeCompetences.CompetenceEvaluable",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"competencesGrilles.ListeCompetences.CompetenceNonEvaluable",
					);
		} else if (
			this._estCelluleDeLibelle(aParams.idColonne, aParams.article) &&
			aParams.article.libelleLong
		) {
			return aParams.article.libelleLong;
		}
		return "";
	}
	avecMenuContextuel(aParams) {
		return (
			this.avecOptionsMenuContextuel !== false &&
			(!!aParams.article || !!aParams.surFondListe)
		);
	}
	remplirMenuContextuel(aParametres) {
		if (aParametres.article) {
			if (
				aParametres.article.Genre ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier ||
				(this.avecSousItems &&
					aParametres.article.Genre ===
						Enumere_Ressource_1.EGenreRessource.Competence)
			) {
				const lEnabledMenuAjouter =
					this.estGrilleModifiable === true &&
					this.avecCreationCompetence === true &&
					!!aParametres.listeSelection &&
					aParametres.listeSelection.count() === 1;
				aParametres.menuContextuel.addCommande(
					DonneesListe_Saisie_Competences.commandeMenuContextuel.ajouter,
					aParametres.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
						? ObjetTraduction_1.GTraductions.getValeur(
								"competencesGrilles.ListeCompetences.AjouterItem",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competencesGrilles.ListeCompetences.AjouterSousItem",
							),
					lEnabledMenuAjouter,
				);
			}
			const lEnabledMenuModifier =
				this.estGrilleModifiable === true &&
				aParametres.listeSelection &&
				aParametres.listeSelection.count() === 1 &&
				this.avecEdition(aParametres);
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
				ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
				lEnabledMenuModifier,
			);
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
				this.avecSuppression(aParametres),
			);
			aParametres.menuContextuel.avecSeparateurSurSuivant();
		}
		let lListeElementSelectionnes = aParametres.listeSelection.getListeElements(
			(aElement) => {
				return (
					aElement &&
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Competence
				);
			},
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_Saisie_Competences.commandeMenuContextuel.copierElements,
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.ListeCompetences.CopierElementCompetence",
			),
			lListeElementSelectionnes.count() > 0,
			lListeElementSelectionnes,
		);
		lListeElementSelectionnes = aParametres.listeSelection.getListeElements(
			(aElement) => {
				return (
					aElement &&
					aElement.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
				);
			},
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_Saisie_Competences.commandeMenuContextuel.collerElements,
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.ListeCompetences.CollerElementCompetence",
			),
			this.estGrilleModifiable === true &&
				lListeElementSelectionnes.count() > 0 &&
				!!this.elementsStockageCopierColler.copieItems,
			lListeElementSelectionnes,
		);
		aParametres.menuContextuel.avecSeparateurSurSuivant();
		aParametres.menuContextuel.addCommande(
			DonneesListe_Saisie_Competences.commandeMenuContextuel.copierGrille,
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.GrilleCompetences.Copier_Grille",
			),
			this.Donnees.getListeElements().count() > 0,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_Saisie_Competences.commandeMenuContextuel.collerGrille,
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.GrilleCompetences.Coller_Grille",
			),
			this.estGrilleModifiable === true &&
				this.avecCreationDomaine &&
				!!this.elementsStockageCopierColler.copieGrille,
		);
	}
	evenementMenuContextuel(aParametres) {
		const lCommande = aParametres.numeroMenu;
		switch (lCommande) {
			case DonneesListe_Saisie_Competences.commandeMenuContextuel.ajouter:
				this.callbackAjouterElement(aParametres.ligne);
				aParametres.avecActualisation = false;
				return true;
			case DonneesListe_Saisie_Competences.commandeMenuContextuel
				.copierElements:
				this.callbackCopierElements(aParametres.ligneMenu.data);
				return true;
			case DonneesListe_Saisie_Competences.commandeMenuContextuel
				.collerElements:
				this.callbackCollerElements(aParametres.ligneMenu.data);
				return true;
			case DonneesListe_Saisie_Competences.commandeMenuContextuel.copierGrille:
				this.callbackCopierGrille();
				return true;
			case DonneesListe_Saisie_Competences.commandeMenuContextuel.collerGrille:
				this.callbackCollerGrille();
				return true;
		}
		return false;
	}
	autoriserDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		return (
			super.autoriserDeplacementElementSurLigne(
				aParamsLigneDestination,
				aParamsSource,
			) &&
			(aParamsLigneDestination.article.pere === aParamsSource.article.pere ||
				(!aParamsLigneDestination.article.pere && !aParamsSource.article.pere))
		);
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		this.callbackDeplacer(
			aParamsSource.article,
			aParamsLigneDestination.article,
		);
	}
	surSelectionLigne(J, D, aSelectionner) {
		D.selectionne = aSelectionner;
	}
	_estCelluleAjout(aIdColonne, D, aAvecSousItems) {
		if (D.Genre === Enumere_Ressource_1.EGenreRessource.ElementPilier) {
			return (
				aIdColonne === DonneesListe_Saisie_Competences.colonnes.plus_competence
			);
		} else if (
			D.Genre === Enumere_Ressource_1.EGenreRessource.Competence &&
			!!aAvecSousItems
		) {
			return (
				aIdColonne ===
				DonneesListe_Saisie_Competences.colonnes.deploy_competence
			);
		}
		return false;
	}
	_estCelluleDeploiement(aIdColonne, D, aAvecSousItems) {
		if (D.Genre === Enumere_Ressource_1.EGenreRessource.ElementPilier) {
			return (
				aIdColonne ===
				DonneesListe_Saisie_Competences.colonnes.deploy_competence
			);
		} else if (D.Genre === Enumere_Ressource_1.EGenreRessource.Competence) {
			return (
				aIdColonne ===
					DonneesListe_Saisie_Competences.colonnes.lib_competence &&
				aAvecSousItems
			);
		}
		return false;
	}
	_estCelluleDeLibelle(aIdColonne, D) {
		if (D.Genre === Enumere_Ressource_1.EGenreRessource.ElementPilier) {
			return (
				aIdColonne === DonneesListe_Saisie_Competences.colonnes.lib_competence
			);
		} else if (D.Genre === Enumere_Ressource_1.EGenreRessource.Competence) {
			return aIdColonne === DonneesListe_Saisie_Competences.colonnes.lib_item;
		} else if (D.Genre === Enumere_Ressource_1.EGenreRessource.SousItem) {
			return (
				aIdColonne === DonneesListe_Saisie_Competences.colonnes.lib_sousItem
			);
		}
		return false;
	}
}
exports.DonneesListe_Saisie_Competences = DonneesListe_Saisie_Competences;
DonneesListe_Saisie_Competences.commandeMenuContextuel = {
	ajouter: 1,
	copierElements: 2,
	collerElements: 3,
	copierGrille: 4,
	collerGrille: 5,
};
DonneesListe_Saisie_Competences.colonnes = {
	plus_competence: "cpt_saisie_plus_competence",
	deploy_competence: "cpt_saisie_deploy_competence",
	lib_competence: "cpt_saisie_libelle_competence",
	lib_item: "cpt_saisie_libelle_item",
	lib_sousItem: "cpt_saisie_libelle_sousItem",
	libelle_bulletin: "cpt_saisie_libelle_bulletin",
	niveau_equiv_ce: "cpt_saisie_niveau_equiv_ce",
	coefficient: "cpt_saisie_coefficient",
	domainesAssocies: "cpt_saisie_domainesAssoc",
	elmtsSignifiants: "cpt_saisie_elmtsSignigiants",
	evaluable: "cpt_saisie_evaluable",
	nb_evaluations: "cpt_saisie_nbEvaluations",
	nb_evaluationsHisto: "cpt_saisie_nbEvaluationsHisto",
	auteur: "cpt_saisie_auteur",
	niveaux: "cpt_saisie_niveaux",
};
