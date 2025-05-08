exports.ObjetEtatUtilisateur_Mobile = void 0;
const ObjetEtatUtilisateur_1 = require("ObjetEtatUtilisateur");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTri_1 = require("ObjetTri");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
class ObjetEtatUtilisateur_Mobile extends ObjetEtatUtilisateur_1.ObjetEtatUtilisateur {
	constructor() {
		super(...arguments);
		this.historiqueNavigation = {};
	}
	initialiser() {
		this.historiqueNavigation = {};
	}
	getOngletInfosPeriodes() {
		return this.Identification.getMembre().tableauOnglets[this.genreOnglet];
	}
	getListeClasses(aParams) {
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.voirTousLesEleves,
			) &&
			!this.applicationSco.parametresUtilisateur.get(
				"masquerDonneesAutresProfesseurs",
			)
		) {
			aParams.uniquementClasseEnseignee = false;
		}
		const lAvecClasse = aParams.avecClasse;
		const lAvecGroupe = aParams.avecGroupe;
		const lSeuleMesClasses = aParams.uniquementClasseEnseignee;
		const lSeuleClassePrincipal = aParams.uniquementClassePrincipal;
		const result = new ObjetListeElements_1.ObjetListeElements();
		let lListeClasses;
		if (!!this.listeClasses) {
			lListeClasses = this.listeClasses;
		} else if (!!this.Identification && !!this.Identification.getMembre()) {
			lListeClasses = this.Identification.getMembre().listeClasses;
		}
		if (!!lListeClasses) {
			const _EGenreClasse = { principal: 0, enseigne: 1, autre: 2 };
			lListeClasses.parcourir((aClasse) => {
				if (aClasse.estPrincipal) {
					aClasse.genreClasse = _EGenreClasse.principal;
				} else if (aClasse.enseigne) {
					aClasse.genreClasse = _EGenreClasse.enseigne;
				} else {
					aClasse.genreClasse = _EGenreClasse.autre;
				}
				let lAccepteClasse =
					(lAvecClasse &&
						aClasse.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Classe) ||
					(lAvecGroupe &&
						aClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe);
				if (lAccepteClasse) {
					lAccepteClasse =
						!lSeuleMesClasses || !!aClasse.estResponsable || !!aClasse.enseigne;
				}
				if (aParams.sansClasseDeRegroupement && aClasse.dansRegroupement) {
					lAccepteClasse = false;
				}
				if (lSeuleClassePrincipal && !aClasse.estPrincipal) {
					lAccepteClasse = false;
				}
				if (lAccepteClasse) {
					result.addElement(aClasse);
				}
			});
		}
		result.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.genreClasse;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== -1;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		result.trier();
		return result;
	}
	setGenreAffichage(aGenreAff) {
		this.genreAffichage = aGenreAff;
	}
	getGenreAffichage() {
		return this.genreAffichage;
	}
	setPeriodePourReleve(aPeriode) {
		this.periodePourReleve = aPeriode;
	}
	getPeriodePourReleve() {
		return this.periodePourReleve;
	}
	setPeriodePourBulletin(aPeriode) {
		this.periodePourBulletin = aPeriode;
	}
	getPeriodePourBulletin() {
		return this.periodePourBulletin;
	}
	setNavigationDate(aDate) {
		this.historiqueNavigation["Date"] = aDate;
	}
	getNavigationDate() {
		return !!this.historiqueNavigation["Date"]
			? this.historiqueNavigation["Date"]
			: null;
	}
	setNavigationCours(aCours) {
		this.historiqueNavigation["Cours"] = aCours;
	}
	getNavigationCours() {
		return !!this.historiqueNavigation["Cours"]
			? this.historiqueNavigation["Cours"]
			: null;
	}
	getNavigationTableauDeBord() {
		return this.historiqueNavigation["TableauDeBord"];
	}
	setNavigationTableauDeBord(aObjet) {
		this.historiqueNavigation["TableauDeBord"] = aObjet;
	}
	avecFicheEtablissement() {
		let lEtablissement;
		let lAvecInfo = false;
		if (this.listeInformationsEtablissements) {
			if (
				[
					Enumere_Espace_1.EGenreEspace.Mobile_Parent,
					Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				].includes(GEtatUtilisateur.GenreEspace)
			) {
				if (!!this.getMembre().Etablissement) {
					lEtablissement =
						this.listeInformationsEtablissements.getElementParNumero(
							this.getMembre().Etablissement.getNumero(),
						);
					if (!!lEtablissement && lEtablissement.avecInformations) {
						lAvecInfo = true;
					}
				}
			} else {
				for (
					let i = 0, lNbr = this.listeInformationsEtablissements.count();
					i < lNbr;
					i++
				) {
					lEtablissement = this.listeInformationsEtablissements.get(i);
					if (lEtablissement.avecInformations) {
						lAvecInfo = true;
					}
				}
			}
		}
		return lAvecInfo;
	}
	ongletEstVisible(aGenreOnglet) {
		return this.existeGenreOnglet(aGenreOnglet);
	}
}
exports.ObjetEtatUtilisateur_Mobile = ObjetEtatUtilisateur_Mobile;
