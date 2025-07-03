exports.PiedBulletin_ParcoursEducatif = void 0;
const InterfaceParcoursPeda_1 = require("InterfaceParcoursPeda");
const ObjetInterface_1 = require("ObjetInterface");
const TypeGenreMaquetteBulletin_1 = require("TypeGenreMaquetteBulletin");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const AccessApp_1 = require("AccessApp");
class PiedBulletin_ParcoursEducatif extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			avecContenuVide: false,
			avecTitreModule: false,
			periodeCloture: false,
			droits: { avecSaisie: false },
		};
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
	}
	construireInstances() {
		this.identParcoursEducatif = this.add(
			InterfaceParcoursPeda_1.InterfaceParcoursPeda,
			null,
			(aInstance) => {
				aInstance.setAvecEventResizeNavigateur(false);
				aInstance.setOptions({
					ariaLabelListe: () => {
						return TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
						);
					},
				});
			},
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identParcoursEducatif;
		this.avecBandeau = this.params.avecTitreModule;
		this.AvecCadre = false;
	}
	construireStructureAffichageBandeau() {
		const T = [];
		T.push('<div class="EspaceBas EspaceHaut Gras">');
		T.push(
			TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_ParcoursEducatif,
			),
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.params.tabGenreParcours = this._getTabGenreParcours();
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		const lPeriode = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		let lEstPeriodeValable = true;
		if (!lPeriode || !lPeriode.existeNumero()) {
			lEstPeriodeValable = false;
		}
		return (
			lEstPeriodeValable &&
			this.params.tabGenreParcours.length > 0 &&
			(this.params.droits.avecSaisie ||
				this.params.listeEvntsParcoursPeda.count() > 0 ||
				this.params.avecContenuVide)
		);
	}
	_getTabGenreParcours() {
		const lTabGenreParcours = [];
		const lListe = this.params.listeGenreParcours;
		if (lListe && lListe.count() > 0) {
			for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
				const lElt = lListe.get(i);
				if (lElt.autorise) {
					lTabGenreParcours.push(lElt.getGenre());
				}
			}
		}
		return lTabGenreParcours;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				if (this.params.tabGenreParcours.length > 0) {
					const lTabGenreParcours = this._getTabGenreParcours();
					const lEstContexteProfs = [
						Enumere_Espace_1.EGenreEspace.Professeur,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Etablissement,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
					].includes(this.etatUtilSco.GenreEspace);
					Promise.resolve()
						.then(() => {
							return this.getInstance(
								this.identParcoursEducatif,
							).recupererDonnees2({
								classeGroupe: this.etatUtilSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Classe,
								),
								periode: this.etatUtilSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Periode,
								),
								listeEleves:
									this.params.contexte ===
									TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
										? this.etatUtilSco.Navigation.getRessources(
												Enumere_Ressource_1.EGenreRessource.Eleve,
											)
										: this.etatUtilSco.Navigation.getRessources(
												Enumere_Ressource_1.EGenreRessource.Classe,
											),
								pourClasseGroupeEntier:
									this.params.contexte !==
									TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
								genreMaquette: [
									Enumere_Onglet_1.EGenreOnglet.Bulletins,
									Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse,
								].includes(this.etatUtilSco.getGenreOnglet())
									? TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin
											.tGMB_Notes
									: TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin
											.tGMB_Competences,
							});
						})
						.then(() => {
							this.getInstance(this.identParcoursEducatif).setDonnees({
								droits: { avecSaisie: this.params.droits.avecSaisie },
								filtres: {
									avecCumulParEleves: false,
									avecCumulParGenreParcours: true,
									genreParcours: lTabGenreParcours,
								},
								ressources:
									this.params.contexte ===
									TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
										? this.etatUtilSco.Navigation.getRessources(
												Enumere_Ressource_1.EGenreRessource.Eleve,
											)
										: this.etatUtilSco.Navigation.getRessources(
												Enumere_Ressource_1.EGenreRessource.Classe,
											),
								genreMaquette: [
									Enumere_Onglet_1.EGenreOnglet.Bulletins,
									Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse,
								].includes(this.etatUtilSco.getGenreOnglet())
									? TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin
											.tGMB_Notes
									: TypeGenreMaquetteBulletin_1.TypeGenreMaquetteBulletin
											.tGMB_Competences,
								avecTitres: lEstContexteProfs,
								avecCompteurSurCumul: lEstContexteProfs,
							});
						});
				}
				break;
		}
	}
	getDonneesSaisie() {
		if (
			[
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
			].includes(this.params.modeAffichage)
		) {
			return this.getInstance(this.identParcoursEducatif).getDonneesSaisie();
		}
	}
	actualiserSurChangementTabOnglet() {
		if (this.getInstance(this.identParcoursEducatif)) {
			this.getInstance(
				this.identParcoursEducatif,
			).actualiserSurChangementTabOnglet();
		}
	}
}
exports.PiedBulletin_ParcoursEducatif = PiedBulletin_ParcoursEducatif;
