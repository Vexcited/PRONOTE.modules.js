exports.TypeModaliteCreneauRDVUtil =
	exports.TypeRDVCommandeSaisie =
	exports.TypeRDVCommandeRequete =
	exports.TypeEtatCreneauSessionRDV =
	exports.TypeNatureRDV =
	exports.TypeEtatRDV =
	exports.TypeModaliteCreneauRDV =
		void 0;
var TypeModaliteCreneauRDV;
(function (TypeModaliteCreneauRDV) {
	TypeModaliteCreneauRDV["tmcrdv_Presentiel"] = "tmcrdv_Presentiel";
	TypeModaliteCreneauRDV["tmcrdv_Telephonique"] = "tmcrdv_Telephonique";
	TypeModaliteCreneauRDV["tmcrdv_Visio"] = "tmcrdv_Visio";
	TypeModaliteCreneauRDV["tmcrdv_Libre"] = "tmcrdv_Libre";
})(
	TypeModaliteCreneauRDV ||
		(exports.TypeModaliteCreneauRDV = TypeModaliteCreneauRDV = {}),
);
var TypeEtatRDV;
(function (TypeEtatRDV) {
	TypeEtatRDV["terdv_RDVDemande"] = "terdv_RDVDemande";
	TypeEtatRDV["terdv_PropositionEnCours"] = "terdv_PropositionEnCours";
	TypeEtatRDV["terdv_PropositionRefusee"] = "terdv_PropositionRefusee";
	TypeEtatRDV["terdv_RDVValide"] = "terdv_RDVValide";
	TypeEtatRDV["terdv_RDVAnnule"] = "terdv_RDVAnnule";
	TypeEtatRDV["terdv_RDVRefuse"] = "terdv_RDVRefuse";
})(TypeEtatRDV || (exports.TypeEtatRDV = TypeEtatRDV = {}));
var TypeNatureRDV;
(function (TypeNatureRDV) {
	TypeNatureRDV["tNRDV_CreneauImpose"] = "tNRDV_CreneauImpose";
	TypeNatureRDV["tNRDV_UniqueInitiativeRespRDV"] =
		"tNRDV_UniqueInitiativeRespRDV";
	TypeNatureRDV["tNRDV_UniqueInitiativePublic"] =
		"tNRDV_UniqueInitiativePublic";
	TypeNatureRDV["tNRDV_EnSerie"] = "tNRDV_EnSerie";
	TypeNatureRDV["tNRDV_EnSerieCreneauxImposes"] =
		"tNRDV_EnSerieCreneauxImposes";
	TypeNatureRDV["tNRDV_DefDisposCreneauLibre"] = "tNRDV_DefDisposCreneauLibre";
})(TypeNatureRDV || (exports.TypeNatureRDV = TypeNatureRDV = {}));
var TypeEtatCreneauSessionRDV;
(function (TypeEtatCreneauSessionRDV) {
	TypeEtatCreneauSessionRDV["tecsrdv_Libre"] = "tecsrdv_Libre";
	TypeEtatCreneauSessionRDV["tecsrdv_Occupe"] = "tecsrdv_Occupe";
	TypeEtatCreneauSessionRDV["tecsrdv_Refuse"] = "tecsrdv_Refuse";
})(
	TypeEtatCreneauSessionRDV ||
		(exports.TypeEtatCreneauSessionRDV = TypeEtatCreneauSessionRDV = {}),
);
var TypeRDVCommandeRequete;
(function (TypeRDVCommandeRequete) {
	TypeRDVCommandeRequete["rdvcr_RDV"] = "rdvcr_RDV";
	TypeRDVCommandeRequete["rdvcr_Disponibilites"] = "rdvcr_Disponibilites";
	TypeRDVCommandeRequete["rdvcr_VerifierCreneaux"] = "rdvcr_VerifierCreneaux";
})(
	TypeRDVCommandeRequete ||
		(exports.TypeRDVCommandeRequete = TypeRDVCommandeRequete = {}),
);
var TypeRDVCommandeSaisie;
(function (TypeRDVCommandeSaisie) {
	TypeRDVCommandeSaisie["rdvcs_CreerRdvCreneauImpose"] =
		"rdvcs_CreerRdvCreneauImpose";
	TypeRDVCommandeSaisie["rdvcs_CreerDemandeRdv"] = "rdvcs_CreerDemandeRdv";
	TypeRDVCommandeSaisie["rdvcs_EditerRdv"] = "rdvcs_EditerRdv";
	TypeRDVCommandeSaisie["rdvcs_AnnulerRdv"] = "rdvcs_AnnulerRdv";
	TypeRDVCommandeSaisie["rdvcs_SupprimerRdv"] = "rdvcs_SupprimerRdv";
	TypeRDVCommandeSaisie["rdvcs_AccepterDemandeRdv"] =
		"rdvcs_AccepterDemandeRdv";
	TypeRDVCommandeSaisie["rdvcs_CreerPropositionRdv"] =
		"rdvcs_CreerPropositionRdv";
	TypeRDVCommandeSaisie["rdvcs_ValiderCreneauRdv"] = "rdvcs_ValiderCreneauRdv";
	TypeRDVCommandeSaisie["rdvcs_ModifierTelCible"] = "rdvcs_ModifierTelCible";
	TypeRDVCommandeSaisie["rdvcs_RefuserRdv"] = "rdvcs_RefuserRdv";
	TypeRDVCommandeSaisie["rdvcs_CreerRdvSerieAvecParents"] =
		"rdvcs_CreerRdvSerieAvecParents";
	TypeRDVCommandeSaisie["rdvcs_SupprimerSessionRdv"] =
		"rdvcs_SupprimerSessionRdv";
	TypeRDVCommandeSaisie["rdvcs_EditerSessionRdv"] = "rdvcs_EditerSessionRdv";
	TypeRDVCommandeSaisie["rdvcs_CreerRdvSerieAvecEleves"] =
		"rdvcs_CreerRdvSerieAvecEleves";
})(
	TypeRDVCommandeSaisie ||
		(exports.TypeRDVCommandeSaisie = TypeRDVCommandeSaisie = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const TypeModaliteCreneauRDVUtil = {
	getIcon(aModaliteCreneauRDV) {
		switch (aModaliteCreneauRDV) {
			case TypeModaliteCreneauRDV.tmcrdv_Presentiel:
				return "";
			case TypeModaliteCreneauRDV.tmcrdv_Visio:
				return "icon_cours_virtuel";
			case TypeModaliteCreneauRDV.tmcrdv_Telephonique:
				return "icon_phone";
			case TypeModaliteCreneauRDV.tmcrdv_Libre:
				return "icon_random";
			default:
				return "";
		}
	},
	getStr(aModaliteCreneauRDV) {
		switch (aModaliteCreneauRDV) {
			case TypeModaliteCreneauRDV.tmcrdv_Presentiel:
				return ObjetTraduction_1.GTraductions.getValeur("RDV.modaliteSite");
			case TypeModaliteCreneauRDV.tmcrdv_Visio:
				return ObjetTraduction_1.GTraductions.getValeur("RDV.modaliteVisio");
			case TypeModaliteCreneauRDV.tmcrdv_Telephonique:
				return ObjetTraduction_1.GTraductions.getValeur("RDV.modaliteTel");
			case TypeModaliteCreneauRDV.tmcrdv_Libre:
				return "";
			default:
				return "";
		}
	},
	toElement(aGenre) {
		const lElement = new ObjetElement_1.ObjetElement(
			TypeModaliteCreneauRDVUtil.getStr(aGenre),
			0,
			aGenre,
		);
		return lElement;
	},
	toListe(aGenresAExclure) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeModaliteCreneauRDV,
		)) {
			const lModalite = TypeModaliteCreneauRDV[lKey];
			if (!aGenresAExclure || !aGenresAExclure.includes(lModalite)) {
				let lElement = TypeModaliteCreneauRDVUtil.toElement(lModalite);
				lListe.addElement(lElement);
			}
		}
		return lListe;
	},
};
exports.TypeModaliteCreneauRDVUtil = TypeModaliteCreneauRDVUtil;
