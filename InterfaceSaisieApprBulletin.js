const { MethodesObjet } = require("MethodesObjet.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
	_InterfaceSaisieApprReleveBulletin,
} = require("_InterfaceSaisieApprReleveBulletin.js");
const {
	ObjetPiedPageAppreciationsBulletin_Professeur,
} = require("ObjetPiedPageAppreciationsBulletin_Professeur.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { DonneesListe_ApprBulletin } = require("DonneesListe_ApprBulletin.js");
class InterfaceSaisieApprBulletin extends _InterfaceSaisieApprReleveBulletin {
	constructor(...aParams) {
		super(...aParams);
		this.typeReleveBulletin =
			TypeReleveBulletin.AppreciationsBulletinProfesseur;
	}
	instancierPiedBulletin() {
		return this.add(
			ObjetPiedPageAppreciationsBulletin_Professeur,
			_evntSurPied.bind(this),
			_initPied.bind(this),
		);
	}
	getDataPiedPage(aParam) {
		const lService = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Service,
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
			appreciation_sauvegarde: MethodesObjet.dupliquer(
				aParam.appreciationClasse,
			),
			strMatiere: GEtatUtilisateur.Navigation.getLibelleRessource(
				EGenreRessource.Matiere,
			),
			strClasse: LLibelleClasseGroupe,
			strGpeSeul: LLibelleGroupe,
			strMoySup: aParam.moySup,
			strMoyInf: aParam.moyInf,
			strMoyClasse: aParam.ligneTotal.strMoyEleve,
		};
	}
	addSurZoneMrFiche() {
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche"),
			getDisplay: "avecBoutonMrFiche",
		});
	}
	estColonnePositionnementEstVisible() {
		const lInstanceListe = this.getInstance(this.identListe);
		const lNumColonne = lInstanceListe.getNumeroColonneDIdColonne(
			DonneesListe_ApprBulletin.colonnes.niveauAcqu,
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
					return GTraductions.getTitreMFiche(
						"BulletinEtReleve.MFichePostionnement",
					);
				},
			},
		});
	}
}
function _initPied(aInstance) {
	aInstance.setParametres({ validationAuto: true });
	aInstance.initialiser(true);
}
function _evntSurPied(
	aParam,
	aEstEditionEltPgm,
	aEstEditionParamSynchroClasse,
) {
	if (aEstEditionEltPgm) {
		_saisirEltPgm.call(this, aParam);
	} else {
		if (aEstEditionParamSynchroClasse === true) {
			this.clbckSaisieApprClasse(aParam);
		} else {
			if (aParam.appreciation && aParam.appreciation_sauvegarde) {
				if (
					aParam.appreciation.appreciation !==
					aParam.appreciation_sauvegarde.appreciation
				) {
					_saisirAppreciationClasse.call(this, aParam.appreciation);
				}
			}
		}
	}
}
function _saisirEltPgm(aParam) {
	const lClasse = this._getInfoClasse();
	this.moteur.saisieEltsPgme({
		paramRequete: {
			classeGroupe: lClasse,
			periode: this.getPeriode(),
			service: this.getService(),
			listeEltsPgme: aParam.pied.listeElementsProgramme,
		},
		instanceListe: null,
		clbckSucces: function (aParamSucces) {
			this.donnees.pied.listeElementsProgramme = aParamSucces.listeEltsPgme;
			this.afficherPiedPage(this.donnees);
		}.bind(this),
		paramCellSuivante: aParam.navigation
			? aParam.navigation.suivante
			: { orientationVerticale: true },
		clbckEchec: function () {}.bind(this),
	});
}
function _saisirAppreciationClasse(aParam) {
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
			typeGenreAppreciation: TypeGenreAppreciation.GA_Bulletin_Professeur,
		},
	);
}
module.exports = InterfaceSaisieApprBulletin;
