exports.InterfaceSaisieApprBulletin = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const _InterfaceSaisieApprReleveBulletin_1 = require("_InterfaceSaisieApprReleveBulletin");
const ObjetPiedPageAppreciationsBulletin_Professeur_1 = require("ObjetPiedPageAppreciationsBulletin_Professeur");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const DonneesListe_ApprBulletin_1 = require("DonneesListe_ApprBulletin");
class InterfaceSaisieApprBulletin extends _InterfaceSaisieApprReleveBulletin_1._InterfaceSaisieApprReleveBulletin {
	constructor(...aParams) {
		super(...aParams);
		this.typeReleveBulletin =
			TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinProfesseur;
	}
	instancierPiedBulletin() {
		return this.add(
			ObjetPiedPageAppreciationsBulletin_Professeur_1.ObjetPiedPageAppreciationsBulletin_Professeur,
			this._evntSurPied.bind(this),
			this._initPied.bind(this),
		);
	}
	getDataPiedPage(aParam) {
		const lService = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Service,
		);
		const LLibelleClasse = lService.classe.getLibelle();
		const LLibelleGroupe = lService.groupe.getLibelle();
		const LLibelleClasseGroupe =
			LLibelleClasse +
			(LLibelleClasse && LLibelleGroupe ? " > " : "") +
			LLibelleGroupe;
		return {
			pied: aParam.pied,
			periode: this.getPeriode(),
			service: this.getService(),
			appreciation: aParam.appreciationClasse,
			appreciation_sauvegarde: MethodesObjet_1.MethodesObjet.dupliquer(
				aParam.appreciationClasse,
			),
			strMatiere: this.etatUtilisateurSco.Navigation.getLibelleRessource(
				Enumere_Ressource_1.EGenreRessource.Matiere,
			),
			strClasse: LLibelleClasseGroupe,
			strGpeSeul: LLibelleGroupe,
			strMoySup: aParam.moySup,
			strMoyInf: aParam.moyInf,
			strMoyClasse: aParam.ligneTotal.strMoyEleve,
		};
	}
	_afficherPiedPage(aParam) {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			const lDataPied = this.getDataPiedPage(aParam);
			this.getInstance(this.identPiedPage).setDonnees(lDataPied);
		}
	}
	_masquerVisibilitePiedPage(aMasquer) {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			$("#" + this.getNomInstance(this.identPiedPage).escapeJQ()).css(
				"display",
				aMasquer ? "none" : "",
			);
		}
	}
	addSurZoneMrFiche() {
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"btnMrFiche",
			),
			getDisplay: "avecBoutonMrFiche",
		});
	}
	estColonnePositionnementEstVisible() {
		const lInstanceListe = this.getInstance(this.identListe);
		const lNumColonne = lInstanceListe.getNumeroColonneDIdColonne(
			DonneesListe_ApprBulletin_1.DonneesListe_ApprBulletin.colonnes.niveauAcqu,
		);
		return lNumColonne !== -1;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBoutonMrFiche() {
				return aInstance.estColonnePositionnementEstVisible();
			},
			btnMrFiche: {
				event() {
					GApplication.getMessage().afficher({
						idRessource: "BulletinEtReleve.MFichePostionnement",
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(
						"BulletinEtReleve.MFichePostionnement",
					);
				},
			},
		});
	}
	_initPied(aInstance) {
		aInstance.setParametres({ validationAuto: true });
		aInstance.initialiser();
	}
	_evntSurPied(aParam, aEstEditionEltPgm, aEstEditionParamSynchroClasse) {
		if (aEstEditionEltPgm) {
			this._saisirEltPgm(aParam);
		} else {
			if (aEstEditionParamSynchroClasse === true) {
				this.clbckSaisieApprClasse(aParam);
			} else {
				if (
					"appreciation" in aParam &&
					aParam.appreciation &&
					aParam.appreciation_sauvegarde
				) {
					if (
						aParam.appreciation.appreciation !==
						aParam.appreciation_sauvegarde.appreciation
					) {
						this._saisirAppreciationClasse(aParam.appreciation);
					}
				}
			}
		}
	}
	_saisirEltPgm(aParam) {
		const lClasse = this._getInfoClasse();
		this.moteur.saisieEltsPgme({
			paramRequete: {
				classeGroupe: lClasse,
				periode: this.getPeriode(),
				service: this.getService(),
				listeEltsPgme: aParam.pied.listeElementsProgramme,
			},
			instanceListe: null,
			clbckSucces: (aParamSucces) => {
				this.donnees.pied.listeElementsProgramme = aParamSucces.listeEltsPgme;
				this.afficherPiedPage(this.donnees);
			},
			paramCellSuivante: aParam.navigation
				? aParam.navigation.suivante
				: { orientationVerticale: true },
			clbckEchec: () => {},
		});
	}
	_saisirAppreciationClasse(aParam) {
		this.saisieAppreciation(
			{
				instanceListe: null,
				estCtxPied: true,
				suivante: { orientationVerticale: this.estOrientationVerticale },
			},
			{
				classe: this.getClasse(),
				periode: this.getPeriode(),
				eleve: null,
				service: this.getService(),
				appreciation: aParam,
				typeGenreAppreciation:
					TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Professeur,
			},
		);
	}
}
exports.InterfaceSaisieApprBulletin = InterfaceSaisieApprBulletin;
