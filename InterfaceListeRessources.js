exports.InterfaceListeRessources = void 0;
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteListeRessources_1 = require("ObjetRequeteListeRessources");
const Enumere_TriElement_1 = require("Enumere_TriElement");
class InterfaceListeRessources extends InterfacePage_1.InterfacePage {
	construireInstances() {
		if (
			GEtatUtilisateur.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.ListeResponsables
		) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				function () {
					this._envoieRequete();
				},
				(aInstance) => {
					aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Classe]);
				},
			);
		}
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initListe.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListe;
		if (this.getInstance(this.identTripleCombo)) {
			this.AddSurZone.push(this.identTripleCombo);
		}
	}
	recupererDonnees() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		if (!this.getInstance(this.identTripleCombo)) {
			this._envoieRequete();
		}
	}
	_initListe(aListe) {
		let lColonnes, lNumeroColonneTriDefaut;
		switch (GEtatUtilisateur.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.ListeProfesseurs:
				lColonnes = [
					{
						id: Colonnes.civilite,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Civilite",
						),
						taille: 60,
					},
					{
						id: Colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: 140,
					},
					{
						id: Colonnes.prenom,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Prenom",
						),
						taille: 140,
					},
					{
						id: Colonnes.pp,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.ProfPrincipal",
						),
						taille: 140,
					},
					{
						id: Colonnes.discipline,
						titre: ObjetTraduction_1.GTraductions.getValeur("Discipline"),
						taille: 140,
					},
					{
						id: Colonnes.elevesTutores,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.ElevesTutores",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.HintElevesTutores",
						),
						taille: 140,
					},
				];
				lNumeroColonneTriDefaut = [Colonnes.nom, Colonnes.prenom];
				break;
			case Enumere_Onglet_1.EGenreOnglet.ListeResponsables:
				lColonnes = [
					{
						id: Colonnes.civilite,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Civilite",
						),
						taille: 60,
					},
					{
						id: Colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: 140,
					},
					{
						id: Colonnes.prenom,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Prenom",
						),
						taille: 140,
					},
				];
				lNumeroColonneTriDefaut = [Colonnes.nom, Colonnes.prenom];
				break;
			case Enumere_Onglet_1.EGenreOnglet.ListeClasses:
				lColonnes = [
					{
						id: Colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: 140,
					},
					{
						id: Colonnes.niveau,
						titre: ObjetTraduction_1.GTraductions.getValeur("Niveau"),
						taille: 100,
					},
					{
						id: Colonnes.notation,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Notation",
						),
						taille: 120,
					},
					{
						id: Colonnes.pp,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.ProfPrincipal",
						),
						taille: 250,
					},
				];
				lNumeroColonneTriDefaut = [Colonnes.nom, Colonnes.niveau];
				break;
			case Enumere_Onglet_1.EGenreOnglet.ListeGroupes:
				lColonnes = [
					{
						id: Colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: 140,
					},
					{
						id: Colonnes.classes,
						titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
						taille: 120,
					},
					{
						id: Colonnes.notation,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Notation",
						),
						taille: 120,
					},
				];
				lNumeroColonneTriDefaut = [Colonnes.nom, Colonnes.classes];
				break;
			case Enumere_Onglet_1.EGenreOnglet.ListePersonnels:
				lColonnes = [
					{
						id: Colonnes.fonction,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Fonction",
						),
						taille: 140,
					},
					{
						id: Colonnes.civilite,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Civilite",
						),
						taille: 70,
					},
					{
						id: Colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: 140,
					},
					{
						id: Colonnes.prenom,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.Prenom",
						),
						taille: 140,
					},
				];
				lNumeroColonneTriDefaut = [Colonnes.nom, Colonnes.prenom];
				break;
			default:
		}
		aListe.setOptionsListe({
			colonnes: lColonnes,
			nonEditable: true,
			scrollHorizontal: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		});
		GEtatUtilisateur.setTriListe({
			liste: aListe,
			tri: lNumeroColonneTriDefaut,
		});
	}
	_surReponseRequete(aJSON) {
		switch (GEtatUtilisateur.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.ListeProfesseurs:
			case Enumere_Onglet_1.EGenreOnglet.ListeResponsables:
			case Enumere_Onglet_1.EGenreOnglet.ListeClasses:
			case Enumere_Onglet_1.EGenreOnglet.ListeGroupes:
			case Enumere_Onglet_1.EGenreOnglet.ListePersonnels:
			case Enumere_Onglet_1.EGenreOnglet.ListeMatieres:
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_Ressources(aJSON.listeRessources),
				);
				break;
			default:
		}
	}
	_envoieRequete() {
		const lEtatUtil = GApplication.getEtatUtilisateur();
		new ObjetRequeteListeRessources_1.ObjetRequeteListeRessources(
			this,
			this._surReponseRequete,
		).lancerRequete({
			classe: lEtatUtil.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: lEtatUtil.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
		});
	}
}
exports.InterfaceListeRessources = InterfaceListeRessources;
class DonneesListe_Ressources extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false });
	}
	selectionParCellule() {
		return false;
	}
	avecMenuContextuel() {
		return false;
	}
	_getGenreTri(aListeColonnesTriInverse, aColonne, aGenreTri) {
		let result;
		if (aListeColonnesTriInverse.includes(this.getId(aColonne))) {
			result =
				aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
					? Enumere_TriElement_1.EGenreTriElement.Decroissant
					: Enumere_TriElement_1.EGenreTriElement.Croissant;
		} else {
			result = aGenreTri;
		}
		return result;
	}
	getTri(aColonne, aGenreTri) {
		const lTris = [];
		const lColonnesTriInverse = [
			Colonnes.lve,
			Colonnes.accompagnementPersonnalise,
		];
		if (!Array.isArray(aColonne)) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					this.getValeurPourTri.bind(this, aColonne),
					this._getGenreTri(lColonnesTriInverse, aColonne, aGenreTri),
				),
			);
		} else {
			for (let i = 0; i < aColonne.length; i++) {
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						this.getValeurPourTri.bind(this, aColonne[i]),
						this._getGenreTri(lColonnesTriInverse, aColonne[i], aGenreTri[i]),
					),
				);
			}
		}
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case Colonnes.lve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case Colonnes.accompagnementPersonnalise:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case Colonnes.couleur:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case Colonnes.couleurME:
			case Colonnes.fonction:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getHintForce(aParams) {
		if (aParams.idColonne === Colonnes.elevesTutores) {
			return aParams.article.elevesTutores;
		}
		return "";
	}
	getClass(aParams) {
		if (aParams.idColonne === Colonnes.elevesTutores) {
			return aParams.article.nbreElevesTutores > 3
				? "EspaceDroit AlignementDroit"
				: "";
		}
		return "";
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case Colonnes.civilite:
				return aParams.article.civ;
			case Colonnes.nom:
				return aParams.article.getLibelle();
			case Colonnes.prenom:
				return aParams.article.prenom;
			case Colonnes.niveau:
				return aParams.article.niveau;
			case Colonnes.notation:
				return aParams.article.notation;
			case Colonnes.pp:
				return aParams.article.pp;
			case Colonnes.discipline:
				return aParams.article.discipline;
			case Colonnes.classes:
				return aParams.article.classes;
			case Colonnes.fonction: {
				let lLibelle = aParams.article.fonction;
				if (aParams.article.estAccompagnant) {
					lLibelle += IE.jsx.str(
						IE.jsx.fragment,
						null,
						" ",
						IE.jsx.str("i", {
							class: "icon_accompagnant",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"PersonnelAccompagnant",
							),
						}),
					);
				}
				return lLibelle;
			}
			case Colonnes.couleur: {
				const H = [];
				H.push('<table style="background-color:');
				H.push(aParams.article.couleur);
				H.push("; width:20px;height:18px;");
				H.push('; border:solid 1px; border-color:black;">');
				H.push("<tr><td>&nbsp;</td></tr></table>");
				return H.join("");
			}
			case Colonnes.code:
				return aParams.article.code;
			case Colonnes.libelle:
				return aParams.article.getLibelle();
			case Colonnes.lve:
				return aParams.article.lve;
			case Colonnes.couleurME: {
				const lCouleurME = [];
				lCouleurME.push('<table style="background-color:');
				lCouleurME.push(aParams.article.matiereEquivalence.couleur);
				lCouleurME.push("; width:20px;height:18px;");
				lCouleurME.push('; border:solid 1px; border-color:black;">');
				lCouleurME.push("<tr><td>&nbsp;</td></tr></table>");
				return lCouleurME.join("");
			}
			case Colonnes.matiereEquivalence:
				return aParams.article.matiereEquivalence.getLibelle();
			case Colonnes.thematiqueEPI:
				return aParams.article.thematiqueEPI.getLibelle();
			case Colonnes.accompagnementPersonnalise:
				return aParams.article.accompagnementPersonnalise;
			case Colonnes.siecle:
				return aParams.article.siecle;
			case Colonnes.elevesTutores:
				if (aParams.article.nbreElevesTutores === 0) {
					return "";
				}
				return aParams.article.nbreElevesTutores > 3
					? aParams.article.nbreElevesTutores
					: aParams.article.elevesTutores;
			default:
		}
		return "";
	}
}
var Colonnes;
(function (Colonnes) {
	Colonnes["civilite"] = "civilite";
	Colonnes["nom"] = "nom";
	Colonnes["prenom"] = "prenom";
	Colonnes["niveau"] = "niveau";
	Colonnes["notation"] = "notation";
	Colonnes["pp"] = "pp";
	Colonnes["classes"] = "classes";
	Colonnes["fonction"] = "fonction";
	Colonnes["couleur"] = "couleur";
	Colonnes["code"] = "code";
	Colonnes["libelle"] = "libelle";
	Colonnes["couleurME"] = "couleurME";
	Colonnes["matiereEquivalence"] = "matiereEquivalence";
	Colonnes["accompagnementPersonnalise"] = "accompagnementPersonnalise";
	Colonnes["siecle"] = "siecle";
	Colonnes["thematiqueEPI"] = "thematiqueEPI";
	Colonnes["lve"] = "lve";
	Colonnes["discipline"] = "discipline";
	Colonnes["elevesTutores"] = "elevesTutores";
})(Colonnes || (Colonnes = {}));
