exports.InterfaceForumPedagogique = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const MoteurForumPedagogique_1 = require("MoteurForumPedagogique");
const DonneesListe_Forum_ListeSujets_1 = require("DonneesListe_Forum_ListeSujets");
const tag_1 = require("tag");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetForumVisuPosts_1 = require("ObjetForumVisuPosts");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_RessourceMatiere_1 = require("DonneesListe_RessourceMatiere");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const c_ident_filtre_tous = -100;
const c_ident_filter_aucun = c_ident_filtre_tous + 1;
class InterfaceForumPedagogique extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {};
		this.filtres = { c_ident_filtre_tous, c_ident_filter_aucun };
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.moteurForum = new MoteurForumPedagogique_1.MoteurForumPedagogique({
			pere: this,
			callbackActualisationSujets: async (aParams) => {
				await this._requeteSujetsPromise(aParams);
			},
			ouvrirEditionSujetPromise: () => {
				return Promise.reject("a implementer");
			},
		});
	}
	recupererDonnees() {
		this._requeteSujetsPromise();
	}
	construireInstances() {
		if (this.options.avecListeMatieres) {
			this.identListeMatieres = this.add(
				ObjetListe_1.ObjetListe,
				(aParametres) => {
					switch (aParametres.genreEvenement) {
						case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
							this.filtres.matiereSelec =
								aParametres.article &&
								aParametres.article.getNumero() === c_ident_filtre_tous
									? null
									: aParametres.article;
							this._actualiserSujetsPromise();
							break;
						}
					}
				},
				(aListe) => {
					aListe.setOptionsListe({
						skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					});
				},
			);
		}
		this.identListeSujets = this.add(
			ObjetListe_1.ObjetListe,
			this._surEvenementListeSujets,
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					nonEditableSurModeExclusif: true,
					avecOmbreDroite: true,
					avecLigneCreation: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.forum.avecCreationSujetForum,
					),
					titreCreation: ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.NouveauSujet",
					),
					messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.AucunForum",
					),
				});
			},
		);
		this.identPosts = this.add(
			ObjetForumVisuPosts_1.ObjetForumVisuPosts,
			null,
			(aInstance) => {
				if (IE.estMobile) {
					aInstance.Visible = false;
				}
				aInstance.init(this.moteurForum);
			},
		);
	}
	construireStructureAffichageAutre() {
		return (0, tag_1.tag)(
			"div",
			{ class: "InterfaceForumPedagogique" },
			this.options.avecListeMatieres
				? (0, tag_1.tag)("section", {
						class: "liste-matieres",
						id: this.getInstance(this.identListeMatieres).getNom(),
					})
				: "",
			(0, tag_1.tag)("section", {
				class: "liste-sujets",
				id: this.getInstance(this.identListeSujets).getNom(),
			}),
			(0, tag_1.tag)("aside", {
				class: ["posts"],
				id: this.getInstance(this.identPosts).getNom(),
			}),
		);
	}
	_requeteSujetsPromise(aParams) {
		let lSujetSelection = null;
		if (aParams && aParams.sujetSelection) {
			lSujetSelection = aParams.sujetSelection;
		}
		return this.moteurForum.requeteListeSujets().then((aListeSujets) => {
			this.donnees.listeSujets = aListeSujets;
			return this._actualiserSujetsPromise(lSujetSelection, aParams);
		});
	}
	_surEvenementListeSujets(aParametres) {
		const lInstanceListe = this.getInstance(this.identListeSujets);
		const lInstancePosts = this.getInstance(this.identPosts);
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.moteurForum.editerSujet(null);
				return;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				lInstancePosts.setSujet(lInstanceListe.getElementSelection(), {
					forcerChangementSujet: true,
					avecBasculeEcran: true,
				});
				return;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe
				.ModificationSelection: {
				if (!lInstanceListe.getElementSelection()) {
					lInstancePosts.setSujet(null);
				}
				return;
			}
		}
	}
	_constructionFiltres() {
		const lListeSujetsOrigine = this.donnees.listeSujets;
		let lAvecFiltresPossible = false;
		let lListeSujetsFiltre = new ObjetListeElements_1.ObjetListeElements().add(
			lListeSujetsOrigine,
		);
		const lListeMatieres = new ObjetListeElements_1.ObjetListeElements();
		lListeMatieres.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur("ToutesLesMatieres"),
				Numero: c_ident_filtre_tous,
				Genre: c_ident_filtre_tous,
				count: lListeSujetsOrigine.count(),
			}),
		);
		let lHorsMatiere = ObjetElement_1.ObjetElement.create({
			Libelle: ObjetTraduction_1.GTraductions.getValeur(
				"ForumPeda.HorsMatiere",
			),
			Numero: c_ident_filter_aucun,
			count: 0,
		});
		lListeMatieres.add(lHorsMatiere);
		lListeSujetsOrigine.parcourir((aSujet) => {
			let lMatiereTrouve = null;
			if (!aSujet.matiere) {
				lMatiereTrouve = lHorsMatiere;
			} else {
				lMatiereTrouve = lListeMatieres.getElementParElement(aSujet.matiere);
				if (!lMatiereTrouve) {
					lMatiereTrouve = ObjetElement_1.ObjetElement.create({
						Libelle: aSujet.matiere.Libelle,
						Numero: aSujet.matiere.Numero,
						couleurFond: aSujet.matiere.couleur,
						count: 0,
					});
					lListeMatieres.add(lMatiereTrouve);
				}
			}
			lMatiereTrouve.count += 1;
		});
		lListeMatieres
			.setTri([
				ObjetTri_1.ObjetTri.init((D) => D.getNumero() !== c_ident_filtre_tous),
				ObjetTri_1.ObjetTri.init((D) => D.getNumero() === c_ident_filter_aucun),
				ObjetTri_1.ObjetTri.init("Libelle"),
			])
			.trier();
		if (
			this.filtres.matiereSelec &&
			!lListeMatieres.getElementParElement(this.filtres.matiereSelec)
		) {
			this.filtres.matiereSelec = null;
		}
		if (this.options.avecListeMatieres) {
			let lIndiceSelection = 0;
			if (this.filtres.matiereSelec) {
				lIndiceSelection = lListeMatieres.getIndiceParNumeroEtGenre(
					this.filtres.matiereSelec.getNumero(),
				);
			}
			this.getInstance(this.identListeMatieres).setDonnees(
				new DonneesListe_RessourceMatiere_1.DonneesListe_RessourceMatiere(
					lListeMatieres,
				).setOptions({ genreToutesMatieres: c_ident_filtre_tous }),
			);
			this.getInstance(this.identListeMatieres).selectionnerLigne({
				ligne: lIndiceSelection || 0,
			});
			this.filtres.listeMatieresDisponibles = null;
		} else {
			this.filtres.listeMatieresDisponibles = lListeMatieres;
			lAvecFiltresPossible = true;
		}
		const lListeThemes = (this.filtres.listeThemesDisponibles =
			new ObjetListeElements_1.ObjetListeElements());
		if (this.moteurForum.avecGestionThemes()) {
			lAvecFiltresPossible = true;
			lListeThemes.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.TouslesThemes",
					),
					Numero: c_ident_filtre_tous,
					count: lListeSujetsOrigine.count(),
				}),
			);
			lListeSujetsOrigine.parcourir((aSujet) => {
				let lThemeTrouve = null;
				if (aSujet.listeThemes) {
					aSujet.listeThemes.parcourir((aTheme) => {
						lThemeTrouve = lListeThemes.getElementParElement(aTheme);
						if (!lThemeTrouve) {
							lThemeTrouve = ObjetElement_1.ObjetElement.create({
								Libelle: aTheme.Libelle,
								Numero: aTheme.Numero,
								count: 0,
							});
							lListeThemes.add(lThemeTrouve);
						}
						lThemeTrouve.count += 1;
					});
				}
			});
			lListeThemes
				.setTri([
					ObjetTri_1.ObjetTri.init(
						(D) => D.getNumero() !== c_ident_filtre_tous,
					),
					ObjetTri_1.ObjetTri.init("Libelle"),
				])
				.trier();
			if (
				this.filtres.themeSelec &&
				!lListeThemes.getElementParElement(this.filtres.themeSelec)
			) {
				this.filtres.themeSelec = null;
			}
		}
		const lListeModerations = (this.filtres.listeModerationsDisponibles =
			new ObjetListeElements_1.ObjetListeElements());
		let lAvecChoixAuteur = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.forum.avecCreationSujetForum,
		);
		if (!lAvecChoixAuteur) {
			lListeSujetsOrigine.parcourir((aSujet) => {
				if (
					aSujet.roles.contains(
						TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
					)
				) {
					lAvecChoixAuteur = true;
					return false;
				}
			});
		}
		if (lAvecChoixAuteur) {
			lListeModerations.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Auteur"),
					Numero: TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
					count: 0,
				}),
			);
		}
		if (
			[
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			].includes(this.etatUtilisateurSco.getUtilisateur().getGenre())
		) {
			lListeModerations.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.Moderateur",
					),
					Numero: TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
					count: 0,
				}),
			);
		}
		if (
			[
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			].includes(this.etatUtilisateurSco.getUtilisateur().getGenre())
		) {
			lListeModerations.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Membre"),
					Numero: TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Membre,
					count: 0,
				}),
			);
		}
		if (
			[Enumere_Ressource_1.EGenreRessource.Personnel].includes(
				this.etatUtilisateurSco.getUtilisateur().getGenre(),
			)
		) {
			lListeModerations.add(
				ObjetElement_1.ObjetElement.create({
					Libelle:
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Visiteur"),
					Numero: TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur,
					count: 0,
				}),
			);
		}
		if (lListeModerations.count() > 1) {
			lAvecFiltresPossible = true;
			lListeModerations.insererElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.Filtre_TousLesForums",
					),
					Numero: c_ident_filtre_tous,
					count: lListeSujetsOrigine.count(),
				}),
				0,
			);
		} else {
			this.filtres.listeModerationsDisponibles = null;
			this.filtres.moderationSelec = null;
		}
		const lInstanceListe = this.getInstance(this.identListeSujets);
		const lBoutons = [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }];
		if (lAvecFiltresPossible) {
			lBoutons.push({
				genre: ObjetListe_1.ObjetListe.typeBouton.filtrer,
				getDisabled: () => {
					const lListeSujets = this.donnees.listeSujets;
					return !lListeSujets || lListeSujets.count() === 0;
				},
			});
		}
		lInstanceListe.setOptionsListe({ boutons: lBoutons });
		return lListeSujetsFiltre;
	}
	_actualiserSujetsPromise(aSujetSelection, aParamsRetour) {
		const lInstanceListe = this.getInstance(this.identListeSujets);
		let lSujetSelectionPrecedent = lInstanceListe.getElementSelection();
		let lSujetSelection = aSujetSelection || lSujetSelectionPrecedent;
		const lListeSujetsFiltre = this._constructionFiltres();
		lInstanceListe.setDonnees(
			new DonneesListe_Forum_ListeSujets_1.DonneesListe_Forum_ListeSujets(
				lListeSujetsFiltre,
				this.filtres,
			).setOptions({ moteurForum: this.moteurForum }),
		);
		if (lSujetSelection) {
			lInstanceListe.setListeElementsSelection(
				new ObjetListeElements_1.ObjetListeElements().add(lSujetSelection),
				{ avecScroll: true },
			);
			lSujetSelection = lInstanceListe.getElementSelection();
		}
		return this.getInstance(this.identPosts).setSujet(
			lSujetSelection,
			Object.assign(
				{ forcerChangementSujet: false, avecBasculeEcran: false },
				aParamsRetour,
			),
		);
	}
}
exports.InterfaceForumPedagogique = InterfaceForumPedagogique;
