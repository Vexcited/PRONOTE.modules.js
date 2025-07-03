exports.PageTrombinoscopeClasse = void 0;
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteTrombinoscope_1 = require("ObjetRequeteTrombinoscope");
const ObjetTrombinoscope_1 = require("ObjetTrombinoscope");
const ObjetZoneTexte_1 = require("ObjetZoneTexte");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class PageTrombinoscopeClasse extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.triFiltre = false;
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
	}
	construireInstances() {
		if (
			this.etatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse ||
			this.etatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.Trombinoscope_EquipePedagogique
		) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
			if (
				this.identTripleCombo !== null &&
				this.identTripleCombo !== undefined &&
				this.getInstance(this.identTripleCombo) !== null
			) {
				this.IdPremierElement = this.getInstance(
					this.identTripleCombo,
				).getPremierElement();
			}
		} else {
			this.identZoneBandeau = this.add(ObjetZoneTexte_1.ObjetZoneTexte);
		}
		this.identPage = this.add(ObjetTrombinoscope_1.ObjetTrombinoscope);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbFiltre: {
				getValue: function (aGenre) {
					return aInstance.triFiltre === aGenre;
				},
				setValue: function (aGenre) {
					aInstance.triFiltre = aGenre;
					aInstance._afficherDonnees();
				},
			},
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPage;
		if (this.getInstance(this.identTripleCombo)) {
			this.AddSurZone = [this.identTripleCombo];
		} else {
			this.AddSurZone = [{ html: this._composeZoneBandeau() }];
		}
	}
	initialiserTripleCombo(aInstance) {
		const lGenres = [Enumere_Ressource_1.EGenreRessource.Classe];
		if (
			this.etatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPeriodeNotation,
			)
		) {
			lGenres.push(Enumere_Ressource_1.EGenreRessource.Periode);
		}
		aInstance.setParametres(lGenres);
	}
	recupererDonnees() {
		if (!this.getInstance(this.identTripleCombo)) {
			this.requeteTrombinoscope();
		}
	}
	evenementSurDernierMenuDeroulant() {
		this.requeteTrombinoscope();
	}
	actionSurRecupererDonnees(aParam) {
		this.listeRessources = aParam.ListeRessources;
		const lFiltres = (this.listeFiltres =
			new ObjetListeElements_1.ObjetListeElements());
		let lFiltreVide;
		this.listeRessources.genresRessources = [];
		const lHashRessource = {};
		this.listeRessources.parcourir((aRessource) => {
			if (aRessource.filtres && aRessource.filtres.count() > 0) {
				aRessource.filtres.parcourir((aFiltre) => {
					let lFiltre = lFiltres.getElementParElement(aFiltre);
					if (!lFiltre) {
						aFiltre.genreRessource = aRessource.getGenre();
						lFiltres.addElement(aFiltre);
						lFiltre = aFiltre;
					}
					if (!lFiltre.listeRessources) {
						lFiltre.listeRessources =
							new ObjetListeElements_1.ObjetListeElements();
					}
					lFiltre.listeRessources.addElement(aRessource);
				});
			} else {
				if (!lFiltreVide) {
					lFiltreVide = new ObjetElement_1.ObjetElement(
						aRessource.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Enseignant
							? ObjetTraduction_1.GTraductions.getValeur(
									"Trombinoscope.AucuneMatiere",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Trombinoscope.FonctionNonPrecisee",
								),
					);
					lFiltreVide.vide = true;
					lFiltreVide.listeRessources =
						new ObjetListeElements_1.ObjetListeElements();
					lFiltreVide.genreRessource = aRessource.getGenre();
					lFiltres.addElement(lFiltreVide);
				}
				lFiltreVide.listeRessources.addElement(aRessource);
			}
			if (!lHashRessource[aRessource.getGenre()]) {
				lHashRessource[aRessource.getGenre()] = {
					genre: aRessource.getGenre(),
					nb: 0,
				};
				this.listeRessources.genresRessources.push(
					lHashRessource[aRessource.getGenre()],
				);
			}
			lHashRessource[aRessource.getGenre()].nb += 1;
		});
		lFiltres.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.vide;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lFiltres.trier();
		this._afficherDonnees();
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Normale,
			this,
		);
		this.surResizeInterface();
	}
	getPageImpression() {
		return {
			titre1:
				ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
					this.etatUtilisateur.getGenreOnglet()
				],
			titre2:
				this.etatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse ||
				this.etatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.Trombinoscope_EquipePedagogique
					? (this.etatUtilisateur.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						).getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
							? ObjetTraduction_1.GTraductions.getValeur("Classe")
							: ObjetTraduction_1.GTraductions.getValeur("Groupe")) +
						" : " +
						this.etatUtilisateur.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						).getLibelle()
					: "",
			contenu:
				"<div>" +
				this.getInstance(this.identPage).construireTrombinoscope(true) +
				"</div>",
			controleur: this.getInstance(this.identPage).controleur,
		};
	}
	surResizeInterface() {
		super.surResizeInterface();
	}
	_composeZoneBandeau() {
		const H = [];
		H.push(
			'<div class="NoWrap">',
			'<ie-radio class="GrandEspaceGauche EspaceDroit Maigre" ie-model="rbFiltre(false)">',
			ObjetTraduction_1.GTraductions.getValeur("Trombinoscope.OrdreAlpha"),
			"</ie-radio>",
			'<ie-radio class="EspaceGauche Maigre" ie-model="rbFiltre(true)">',
			this.etatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Professeur
				? ObjetTraduction_1.GTraductions.getValeur("Trombinoscope.ParMatiere")
				: ObjetTraduction_1.GTraductions.getValeur("Trombinoscope.ParGenre"),
			"</ie-radio>",
			"</div>",
		);
		return H.join("");
	}
	requeteTrombinoscope() {
		let lParams;
		switch (this.etatUtilisateur.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse:
				lParams = {
					classe: this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
					periode: this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				};
				break;
			case Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Professeur:
				lParams = { trombiProfesseur: true };
				break;
			case Enumere_Onglet_1.EGenreOnglet.Trombinoscope_EquipePedagogique:
				lParams = {
					trombiEquipePedagogique: true,
					classe: this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
					periode: this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				};
				break;
			case Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Personnel:
				lParams = { trombiPersonnel: true };
				break;
			default:
		}
		new ObjetRequeteTrombinoscope_1.ObjetRequeteTrombinoscope(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(lParams);
	}
	_afficherDonnees() {
		let lMessage = "";
		if (
			this.etatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Professeur &&
			this.listeRessources.count() === 0
		) {
			lMessage =
				ObjetTraduction_1.GTraductions.getValeur("Message")[
					this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					).getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
						? Enumere_Message_1.EGenreMessage.AucunElevePourGroupe
						: Enumere_Message_1.EGenreMessage.AucunElevePourClasse
				];
		}
		this.getInstance(this.identPage).setDonnees({
			listeRessources: this.listeRessources,
			listeFiltres: this.listeFiltres,
			triParFiltre: this.triFiltre,
			message: lMessage,
		});
		this.surResizeInterface();
	}
}
exports.PageTrombinoscopeClasse = PageTrombinoscopeClasse;
