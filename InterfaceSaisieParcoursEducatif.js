exports.InterfaceSaisieParcoursEducatif = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const InterfaceParcoursPeda_1 = require("InterfaceParcoursPeda");
const Invocateur_1 = require("Invocateur");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeGenreMaquetteBulletin_1 = require("TypeGenreMaquetteBulletin");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const AccessApp_1 = require("AccessApp");
class InterfaceSaisieParcoursEducatif extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.params = {
			droits: {
				avecSaisie: this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieParcoursPedagogique,
				),
			},
			filtres: {
				avecCumulParEleves: true,
				avecCumulParGenreParcours: false,
				genreParcours: null,
			},
			genreMaquette:
				this.etatUtilSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_Bulletin
					? TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin.tGMB_Notes
					: TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin
							.tGMB_Competences,
		};
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evntSurDernierMenuDeroulant,
			this._initialiserTripleCombo,
		);
		this.identComboGenreParcours = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evntGenreParcours,
			this._initialiserComboGenreParcours,
		);
		this.identParcours = this.add(
			InterfaceParcoursPeda_1.InterfaceParcoursPeda,
		);
		this.IdPremierElement = this.getInstance(
			this.identTripleCombo,
		).getPremierElement();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identParcours;
		this.AddSurZone = [this.identTripleCombo, this.identComboGenreParcours];
	}
	evntSurDernierMenuDeroulant() {
		this.afficherPage();
	}
	evntGenreParcours(aParams) {
		let lGenre;
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (aParams.element) {
				lGenre = aParams.element.getGenre();
				this.etatUtilSco.Navigation.genreParcoursEducatif = lGenre;
			}
			if (aParams.element.autorise) {
				this.params.filtres.genreParcours = [];
				this.params.filtres.genreParcours.push(lGenre);
				this.params.filtres.avecCumulParGenreParcours =
					this.params.filtres.genreParcours.length > 1;
				this._afficher();
			} else {
				this.evenementAfficherMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"ParcoursPeda.NonAutoriseDansMaquette",
					),
				);
			}
		}
	}
	afficherPage() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		const lListeEleves = this.etatUtilSco.Navigation.getRessources(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		if (!lListeEleves || lListeEleves.count() === 0) {
			return;
		}
		let lPourClasse = false;
		if (lListeEleves.count() === 1 && !lListeEleves.existeNumero(0)) {
			lPourClasse = true;
			this.params.ressources = this.etatUtilSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			this.params.filtres.avecCumulParEleves = false;
		} else {
			this.params.ressources = lListeEleves;
			this.params.filtres.avecCumulParEleves = lListeEleves.count() > 1;
		}
		Promise.resolve()
			.then(() => {
				return this.getInstance(this.identParcours).recupererDonnees2({
					classeGroupe: this.etatUtilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
					periode: this.etatUtilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
					listeEleves: lListeEleves,
					pourClasseGroupeEntier: lPourClasse,
					genreMaquette: this.params.genreMaquette,
				});
			})
			.then((aListeGenreParcours) => {
				this._setListeGenreParcours(aListeGenreParcours);
			})
			.then(() => {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
					this,
					() => {
						return {
							genreGenerationPDF:
								TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
									.ParcoursEducatifCompetences,
							classeGroupe: this.etatUtilSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Classe,
							),
							periode: this.etatUtilSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Periode,
							),
							listeEleves: lListeEleves,
							pourClasseGroupeEntier: lPourClasse,
							genreMaquette: this.params.genreMaquette,
							genreParcours: this.etatUtilSco.Navigation.genreParcoursEducatif,
						};
					},
				);
			});
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			true,
		);
	}
	_initialiserComboGenreParcours(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 220,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"ParcoursPeda.ComboGenreParcours",
			),
		});
		aInstance.setVisible(false);
	}
	_setListeGenreParcours(aListeGenreParcours) {
		if (aListeGenreParcours && aListeGenreParcours.count() > 0) {
			aListeGenreParcours.setTri([ObjetTri_1.ObjetTri.init("Genre")]).trier();
			let lIndice = -1;
			if (!!this.etatUtilSco.Navigation.genreParcoursEducatif) {
				lIndice = aListeGenreParcours.getIndiceElementParFiltre((D) => {
					return (
						D.getGenre() === this.etatUtilSco.Navigation.genreParcoursEducatif
					);
				});
			}
			if (lIndice === -1) {
				lIndice = 0;
			}
			this.getInstance(this.identComboGenreParcours).setDonnees(
				aListeGenreParcours,
				lIndice,
			);
		}
		this.getInstance(this.identComboGenreParcours).setVisible(true);
	}
	_afficher() {
		const lEstContexteProfs = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
		].includes(this.etatUtilSco.GenreEspace);
		this.getInstance(this.identParcours).setDonnees({
			droits: this.params.droits,
			filtres: this.params.filtres,
			ressources: this.params.ressources,
			genreMaquette: this.params.genreMaquette,
			avecTitres: true,
			avecCompteurSurCumul: lEstContexteProfs,
		});
	}
}
exports.InterfaceSaisieParcoursEducatif = InterfaceSaisieParcoursEducatif;
