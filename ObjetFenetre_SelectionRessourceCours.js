exports.ObjetFenetre_SelectionRessourceCours = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const DonneesListe_SelectionRessourceCours_1 = require("DonneesListe_SelectionRessourceCours");
class ObjetFenetre_SelectionRessourceCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.indexBtnValider = 1;
		this.setOptionsFenetre({
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecTailleSelonContenu: true,
			avecColonneCodeMatiere: true,
			avecEditionListe: false,
			surEditionListe: null,
			editionCelluleAutorisee: null,
			suppressionLigneAutorisee: null,
			avecTriDonneesListe: true,
			sitesActifs: false,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					let lDisabled = false;
					if (aBoutonRepeat.element.index === 1) {
						lDisabled = aInstance._getListeSelectionnee().count() === 0;
					}
					return lDisabled;
				},
			},
			avecFiltre: function () {
				return (
					aInstance.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Salle ||
					aInstance.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Materiel
				);
			},
			cbFiltre: {
				getValue: function () {
					return aInstance.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Salle
						? ObjetFenetre_SelectionRessourceCours.uniquementSallesReservable
						: ObjetFenetre_SelectionRessourceCours.uniquementMaterielsReservable;
				},
				setValue: function (aValue) {
					if (
						aInstance.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Salle
					) {
						ObjetFenetre_SelectionRessourceCours.uniquementSallesReservable =
							aValue;
					} else {
						ObjetFenetre_SelectionRessourceCours.uniquementMaterielsReservable =
							aValue;
					}
					aInstance._actualiserListe();
				},
				getLibelle: function () {
					return aInstance.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Salle
						? ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.UniqementLesSallesReservables",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.UniqementLesMaterielsReservables",
							);
				},
			},
		});
	}
	setDonnees(aListeRessources, aGenreRessource, aListeSelection) {
		this.genreRessource = aGenreRessource;
		this.avecColonneCoche =
			this.genreRessource !== Enumere_Ressource_1.EGenreRessource.Matiere &&
			this.genreRessource !== Enumere_Ressource_1.EGenreRessource.LibelleCours;
		this.listeRessources =
			MethodesObjet_1.MethodesObjet.dupliquer(aListeRessources);
		this.afficher();
		const lColonnesListe = [];
		let lTitre = "";
		const lColonneNom = {
			id: DonneesListe_SelectionRessourceCours_1
				.DonneesListe_SelectionRessourceCours.colonnes.nom,
			titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 180),
		};
		if (this.avecColonneCoche) {
			lColonnesListe.push({
				id: DonneesListe_SelectionRessourceCours_1
					.DonneesListe_SelectionRessourceCours.colonnes.coche,
				titre: "",
				taille: 20,
			});
		}
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MatiereDisponible",
				);
				if (this.optionsFenetre.avecColonneCodeMatiere) {
					lColonnesListe.push({
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.code,
						titre: ObjetTraduction_1.GTraductions.getValeur("Code"),
						taille: 50,
					});
				}
				lColonnesListe.push({
					id: DonneesListe_SelectionRessourceCours_1
						.DonneesListe_SelectionRessourceCours.colonnes.nom,
					titre: ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					taille: "100%",
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.LibelleCours:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.Activites",
				);
				lColonnesListe.push({
					id: DonneesListe_SelectionRessourceCours_1
						.DonneesListe_SelectionRessourceCours.colonnes.nom,
					titre: ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					taille: "100%",
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.SalleDisponibles",
				);
				lColonnesListe.push(
					lColonneNom,
					{
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.capacite,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.CapaciteAbr",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.Capacite",
						),
						taille: 30,
					},
					{
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.infos,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.Infos",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.InformationsHint",
						),
						taille: 100,
					},
				);
				if (this.optionsFenetre.sitesActifs) {
					lColonnesListe.push({
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.site,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.site",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.siteHint",
						),
						taille: 100,
					});
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Classe:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ClassesDisponibles",
				);
				lColonnesListe.push(lColonneNom);
				break;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ProfDisponibles",
				);
				lColonnesListe.push(lColonneNom);
				break;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MaterielDisponibles",
				);
				lColonnesListe.push(
					lColonneNom,
					{
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.nbAReserver,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.TitreMaterielNbAReserver",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.HintMaterielNbAReserver",
						),
						taille: 60,
					},
					{
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.nbDispo,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.TitreMaterielNbADisponible",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.HintMaterielNbDisponible",
						),
						taille: 60,
					},
					{
						id: DonneesListe_SelectionRessourceCours_1
							.DonneesListe_SelectionRessourceCours.colonnes.infos,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.Infos",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.InformationsHint",
						),
						taille: 100,
					},
				);
				break;
			default:
		}
		this.setOptionsFenetre({ titre: lTitre });
		this.getInstance(this.identListe).setOptionsListe({
			colonnes: lColonnesListe,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: Math.min(500, GNavigateur.ecranH - 160),
			AvecSuppression: !!this.optionsFenetre.avecEditionListe,
			listeCreations: this.optionsFenetre.avecEditionListe ? 0 : null,
			avecLigneCreation: !!this.optionsFenetre.avecEditionListe,
			boutons: this.optionsFenetre.avecEditionListe
				? [
						{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
						{ genre: ObjetListe_1.ObjetListe.typeBouton.editer },
						{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer },
					]
				: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		});
		this._actualiserListe();
		if (aListeSelection && aListeSelection.count() > 0) {
			this.getInstance(this.identListe).setListeElementsSelection(
				aListeSelection,
			);
		}
	}
	surValidation(ANumeroBouton) {
		const lListeSelection = this._getListeSelectionnee(),
			lListeAjout = new ObjetListeElements_1.ObjetListeElements();
		lListeSelection.parcourir((D) => {
			lListeAjout.addElement(D);
			if (D._nbSaisieOccurrences > 1) {
				for (let i = 2; i <= D._nbSaisieOccurrences; i++) {
					lListeAjout.addElement(D);
				}
			}
		});
		this.fermer();
		this.callback.appel(
			ANumeroBouton === this.indexBtnValider,
			this.genreRessource,
			lListeAjout,
		);
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, function (aParametres) {
			switch (aParametres.genreEvenement) {
				case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
					if (this.optionsFenetre.surEditionListe) {
						this.optionsFenetre.surEditionListe({
							liste: this.listeRessources,
							parametres: aParametres,
						});
					}
					break;
			}
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div ie-if="avecFiltre" class="PetitEspaceBas">',
			'<ie-checkbox ie-model="cbFiltre"></ie-checkbox>',
			"</div>",
		);
		T.push(
			'<div id="' +
				this.getNomInstance(this.identListe) +
				'" class="Table"></div>',
		);
		return T.join("");
	}
	_getListeSelectionnee() {
		if (!this.avecColonneCoche) {
			const lElement = this.getInstance(this.identListe).getElementSelection();
			return lElement
				? new ObjetListeElements_1.ObjetListeElements().addElement(lElement)
				: new ObjetListeElements_1.ObjetListeElements();
		}
		return this.listeRessources
			? this.listeRessources.getListeElements((D) => {
					return !!D.selectionne;
				})
			: new ObjetListeElements_1.ObjetListeElements();
	}
	_actualiserListe() {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionRessourceCours_1.DonneesListe_SelectionRessourceCours(
				this.listeRessources,
				this.genreRessource,
				this.genreRessource === Enumere_Ressource_1.EGenreRessource.Salle
					? ObjetFenetre_SelectionRessourceCours.uniquementSallesReservable
					: ObjetFenetre_SelectionRessourceCours.uniquementMaterielsReservable,
			).setOptions({
				optionsFenetre: this.optionsFenetre,
				avecEvnt_ApresEdition: this.optionsFenetre.avecEditionListe,
				avecEvnt_ApresCreation: this.optionsFenetre.avecEditionListe,
				avecEvnt_ApresSuppression: this.optionsFenetre.avecEditionListe,
				avecTri: this.optionsFenetre.avecTriDonneesListe,
			}),
		);
		this.positionnerFenetre();
	}
}
exports.ObjetFenetre_SelectionRessourceCours =
	ObjetFenetre_SelectionRessourceCours;
ObjetFenetre_SelectionRessourceCours.uniquementSallesReservable = true;
ObjetFenetre_SelectionRessourceCours.uniquementMaterielsReservable = true;
