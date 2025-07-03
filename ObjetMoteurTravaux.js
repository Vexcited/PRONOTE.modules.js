exports.ObjetMoteurTravaux = void 0;
const TypeOrigineCreationAvanceeTravaux_1 = require("TypeOrigineCreationAvanceeTravaux");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetElement_1 = require("ObjetElement");
const TypeDestinationDemandeTravaux_1 = require("TypeDestinationDemandeTravaux");
const TypeGenreTravauxIntendance_1 = require("TypeGenreTravauxIntendance");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class ObjetMoteurTravaux {
	constructor() {
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		const lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
		let lGenreTravaux;
		switch (lGenreOnglet) {
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesTravaux:
				lGenreTravaux =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Maintenance;
				break;
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieSecretariat:
				lGenreTravaux =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Secretariat;
				break;
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesInformatique:
				lGenreTravaux =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Informatique;
				break;
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieCommandes:
				lGenreTravaux =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande;
				break;
			default:
				lGenreTravaux =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande;
				break;
		}
		this.genreTravaux = lGenreTravaux;
		let lAvecDemandeTravaux = false;
		let lUniquementMesDemandesTravaux = false;
		let lAvecExecutionTravaux = false;
		let lAvecGestionTravaux = false;
		let lAvecTransfert = false;
		switch (lGenreTravaux) {
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
				.GTI_Maintenance:
				lAvecDemandeTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecDemandeTravauxIntendance,
				);
				lUniquementMesDemandesTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.uniquementMesTravauxIntendance,
				);
				lAvecExecutionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecExecutionTravauxIntendance,
				);
				lAvecGestionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecGestionTravauxIntendance,
				);
				lAvecTransfert = [
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace);
				break;
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
				.GTI_Secretariat:
				lAvecDemandeTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecDemandeTachesSecretariat,
				);
				lUniquementMesDemandesTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.uniquementMesTachesSecretariat,
				);
				lAvecExecutionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecExecutionTachesSecretariat,
				);
				lAvecGestionTravaux = [
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				].includes(GEtatUtilisateur.GenreEspace);
				lAvecTransfert = false;
				break;
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
				.GTI_Informatique:
				lAvecDemandeTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecDemandeTachesInformatique,
				);
				lUniquementMesDemandesTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.uniquementMesTachesInformatique,
				);
				lAvecExecutionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecExecutionTachesInformatique,
				);
				lAvecGestionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecGestionTachesInformatique,
				);
				lAvecTransfert = [
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace);
				break;
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande:
				lAvecDemandeTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecDemandeCommandes,
				);
				lUniquementMesDemandesTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.uniquementMesCommandes,
				);
				lAvecExecutionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecExecutionCommandes,
				);
				lAvecGestionTravaux = lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.intendance.avecGestionCommandes,
				);
				lAvecTransfert = false;
				break;
		}
		const lDroits = {
			avecDemandeTravaux: lAvecDemandeTravaux,
			uniquementMesDemandesTravaux: lUniquementMesDemandesTravaux,
			avecExecutionTravaux: lAvecExecutionTravaux,
			avecGestionTravaux: lAvecGestionTravaux,
			avecTransfert: lAvecTransfert,
		};
		this.param = { droits: lDroits };
	}
	getGenreTravaux() {
		return this.genreTravaux;
	}
	estIdentificationEditable(aDemande) {
		return (
			this.avecDroitExecutant() &&
			aDemande.etat.getGenre() ===
				TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
					.OCAT_EnAttente &&
			this.estDemandeur(aDemande)
		);
	}
	estEditable(aDemande, aChamps) {
		if (!aChamps || !aDemande) {
			return false;
		}
		return (
			aDemande.colonnesEditables && aDemande.colonnesEditables.includes(aChamps)
		);
	}
	avecDroitDemandeTravaux() {
		return this.param.droits.avecDemandeTravaux;
	}
	avecDroitUniquementMesDemandesTravaux() {
		return this.param.droits.uniquementMesDemandesTravaux;
	}
	avecDroitExecutant() {
		return this.param.droits.avecExecutionTravaux;
	}
	avecDroitGestionTravaux() {
		return this.param.droits.avecGestionTravaux;
	}
	avecDroitTransfert() {
		return this.param.droits.avecTransfert;
	}
	estExecutant(aDemande) {
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			return !!aDemande.mAEteAttribue;
		}
		const lNumUserConnecte = GEtatUtilisateur.getUtilisateur().getNumero();
		const lEstPersonnel = [
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimMairie,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
		].includes(GEtatUtilisateur.GenreEspace);
		return (
			lEstPersonnel &&
			!!aDemande.listeExecutants &&
			aDemande.listeExecutants.getIndiceParNumeroEtGenre(lNumUserConnecte) !==
				undefined
		);
	}
	estRealisee(aDemande) {
		return (
			aDemande.etat.getGenre() ===
			TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
				.OCAT_Realise
		);
	}
	estDemandeur(aDemande) {
		const lNumUserConnecte = GEtatUtilisateur.getUtilisateur().getNumero();
		if (aDemande.demandeur) {
			return lNumUserConnecte === aDemande.demandeur.getNumero();
		} else {
			return false;
		}
	}
	estRealisable(aDemande) {
		return (
			this.estExecutant(aDemande) &&
			aDemande.etat.getGenre() !==
				TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
					.OCAT_EnAttente &&
			aDemande.etat.getGenre() !==
				TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
					.OCAT_Realise &&
			aDemande.etat.getGenre() !==
				TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
					.OCAT_Refuse
		);
	}
	creerCumulEtat(aListeAvecCumul, aListeDemandes, aPourPrimaire = false) {
		const lLibelleCumuls = {
			realisee: "",
			aRealiser: "",
			demandesEnvoyees: ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.ComboDemandesEnvoyees",
			),
			autres: ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.ComboAutres",
			),
		};
		const lAjouterCumul = (aListe) => {
			aListe.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: lLibelleCumuls.aRealiser,
					libellePere: 0,
				}),
			);
			aListe.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: lLibelleCumuls.realisee,
					libellePere: 1,
				}),
			);
			aListe.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: lLibelleCumuls.demandesEnvoyees,
					libellePere: 2,
				}),
			);
			aListe.addElement(
				ObjetElement_1.ObjetElement.create({
					Libelle: lLibelleCumuls.autres,
					libellePere: 3,
				}),
			);
		};
		switch (GEtatUtilisateur.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesInformatique:
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesTravaux:
				lLibelleCumuls.realisee = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboMissionsRealisees",
				);
				lLibelleCumuls.aRealiser = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboMissionsARealiser",
				);
				break;
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieSecretariat:
				lLibelleCumuls.realisee = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboTachesRealisees",
				);
				lLibelleCumuls.aRealiser = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboTachesARealiser",
				);
				break;
			case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieCommandes:
				lLibelleCumuls.realisee = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboCommandesRealisees",
				);
				lLibelleCumuls.aRealiser = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.ComboCommandesARealiser",
				);
				break;
		}
		if (aPourPrimaire) {
			const lListeDestination =
				TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.toListe();
			lListeDestination.parcourir((aCumulDestination) => {
				aCumulDestination.estDestination = true;
				aCumulDestination.destination = aCumulDestination.getGenre();
				aListeAvecCumul.addElement(aCumulDestination);
				lAjouterCumul(aListeAvecCumul);
				aListeAvecCumul.parcourir((aLigneCumul) => {
					aLigneCumul.estUnDeploiement = true;
					aLigneCumul.estDeploye = true;
					if (!aLigneCumul.estDestination && !aLigneCumul.pere) {
						aLigneCumul.pere = aCumulDestination;
						aLigneCumul.destination = aCumulDestination.getGenre();
					}
				});
			});
		} else {
			lAjouterCumul(aListeAvecCumul);
		}
		aListeAvecCumul.parcourir((aLigneCumul) => {
			aLigneCumul.estUnDeploiement = true;
			aLigneCumul.estDeploye = true;
		});
		const lListeDemandes = aListeDemandes;
		lListeDemandes.parcourir((aLigne) => {
			this.affectationPereDemande(
				aLigne,
				aListeAvecCumul,
				lLibelleCumuls,
				aPourPrimaire,
			);
		});
		return aListeAvecCumul;
	}
	affectationPereDemande(
		aDemande,
		aListeCumuls,
		aLibelleCumuls,
		aPourPrimaire,
	) {
		const composePere = (aLibelle) => {
			aDemande.pere = aListeCumuls.getElementParFiltre((aLigneCumul) => {
				let lResult = true;
				if (aPourPrimaire) {
					lResult = aLigneCumul.destination === aDemande.destination;
				}
				lResult = lResult && aLigneCumul.getLibelle() === aLibelle;
				return lResult;
			});
			aDemande.pere.estDeploye = true;
			aDemande.pere.estUnDeploiement = true;
			aListeCumuls.addElement(aDemande);
		};
		if (this.estExecutant(aDemande) && this.estRealisee(aDemande)) {
			composePere(aLibelleCumuls.realisee);
		} else if (this.estRealisable(aDemande)) {
			composePere(aLibelleCumuls.aRealiser);
		} else if (this.estDemandeur(aDemande)) {
			composePere(aLibelleCumuls.demandesEnvoyees);
		} else {
			aDemande.seulementConsult = true;
			composePere(aLibelleCumuls.autres);
		}
	}
	formaterListe(aListe) {
		let lListeDonnees = new ObjetListeElements_1.ObjetListeElements();
		if (aListe.count() > 0) {
			lListeDonnees = this.creerCumulEtat(
				lListeDonnees,
				aListe,
				this.etatUtilisateurSco.pourPrimaire(),
			);
		}
		const lTrisRecursif = [];
		if (this.etatUtilisateurSco.pourPrimaire()) {
			lTrisRecursif.push(ObjetTri_1.ObjetTri.init("destination"));
			lTrisRecursif.push(ObjetTri_1.ObjetTri.init("libellePere"));
		} else {
			lTrisRecursif.push(ObjetTri_1.ObjetTri.init("libellePere"));
		}
		lListeDonnees.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", lTrisRecursif),
		]);
		lListeDonnees.trier();
		return lListeDonnees;
	}
	static getListeJours() {
		return ObjetMoteurTravaux._getListeParTaille(32);
	}
	static getListeHeures() {
		return ObjetMoteurTravaux._getListeParTaille(24);
	}
	static getListeMinutes() {
		return ObjetMoteurTravaux._getListeParTaille(60);
	}
	static _getListeParTaille(ataille) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		Array.from({ length: ataille }, (v, i) => i.toString()).forEach((v) => {
			lListe.add(new ObjetElement_1.ObjetElement(v));
		});
		return lListe;
	}
	getTitreFenetre(aEtat, aDateCreation = null, aSeulementConsult = false) {
		switch (aEtat) {
			case Enumere_Etat_1.EGenreEtat.Creation:
				{
					const lDateCouranteFormat = ObjetDate_1.GDate.formatDate(
						ObjetDate_1.GDate.getDateCourante(),
						"%JJ/%MM/%AAAA",
					);
					switch (this.genreTravaux) {
						case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
							.GTI_Maintenance:
							return ObjetTraduction_1.GTraductions.getValeur(
								"TvxIntendance.TitreCreationTravaux",
								[lDateCouranteFormat],
							);
						case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
							.GTI_Commande:
							return ObjetTraduction_1.GTraductions.getValeur(
								"TvxIntendance.TitreCreationCommandes",
								[lDateCouranteFormat],
							);
						case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
							.GTI_Secretariat:
						case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
							.GTI_Informatique:
							return ObjetTraduction_1.GTraductions.getValeur(
								"TvxIntendance.TitreCreationTaches",
								[lDateCouranteFormat],
							);
					}
				}
				break;
			case Enumere_Etat_1.EGenreEtat.Modification: {
				let lDateModificationFormat = "";
				if (!!aDateCreation) {
					lDateModificationFormat = ObjetDate_1.GDate.formatDate(
						aDateCreation,
						"%JJ/%MM/%AAAA",
					);
				}
				switch (this.genreTravaux) {
					case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Maintenance:
						return aSeulementConsult
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreDemandeTravaux",
									[lDateModificationFormat],
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreModificationTravaux",
									[lDateModificationFormat],
								);
					case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Commande:
						return aSeulementConsult
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreDemandeCommande",
									[lDateModificationFormat],
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreModificationCommande",
									[lDateModificationFormat],
								);
					case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Secretariat:
					case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Informatique:
						return aSeulementConsult
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreDemandeTaches",
									[lDateModificationFormat],
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.TitreModificationTaches",
									[lDateModificationFormat],
								);
				}
			}
		}
		return "";
	}
	getOngletDestinationSelonGenreDemande(aGenreDemande) {
		return aGenreDemande ===
			TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Maintenance
			? Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesTravaux
			: Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesInformatique;
	}
	getMessageSuppression() {
		return this.genreTravaux ===
			TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande
			? ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Message.SupprimerCommande",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Message.SupprimerDemande",
				);
	}
}
exports.ObjetMoteurTravaux = ObjetMoteurTravaux;
