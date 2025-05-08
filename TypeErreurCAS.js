exports.TypeErreurCASUtil = exports.TypeErreurCAS = void 0;
var TypeErreurCAS;
(function (TypeErreurCAS) {
	TypeErreurCAS[(TypeErreurCAS["eCAS_IdentifiantSujet"] = 0)] =
		"eCAS_IdentifiantSujet";
	TypeErreurCAS[(TypeErreurCAS["eCAS_IdentifiantSAML"] = 1)] =
		"eCAS_IdentifiantSAML";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AttributsSAML"] = 2)] =
		"eCAS_AttributsSAML";
	TypeErreurCAS[(TypeErreurCAS["eCAS_FormatSAML_Result"] = 3)] =
		"eCAS_FormatSAML_Result";
	TypeErreurCAS[(TypeErreurCAS["eCAS_FormatSAML_Namespace"] = 4)] =
		"eCAS_FormatSAML_Namespace";
	TypeErreurCAS[(TypeErreurCAS["eCAS_samlValidate_Statut"] = 5)] =
		"eCAS_samlValidate_Statut";
	TypeErreurCAS[(TypeErreurCAS["eCAS_samlValidate_Message"] = 6)] =
		"eCAS_samlValidate_Message";
	TypeErreurCAS[(TypeErreurCAS["eCAS_serviceValidate_Statut"] = 7)] =
		"eCAS_serviceValidate_Statut";
	TypeErreurCAS[(TypeErreurCAS["eCAS_serviceValidate_Message"] = 8)] =
		"eCAS_serviceValidate_Message";
	TypeErreurCAS[(TypeErreurCAS["eCAS_TicketManquant"] = 9)] =
		"eCAS_TicketManquant";
	TypeErreurCAS[(TypeErreurCAS["eCAS_MethodeValidation"] = 10)] =
		"eCAS_MethodeValidation";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_IdCAS_sansSAML"] = 11)] =
		"eCAS_AucunTrouve_IdCAS_sansSAML";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_IdCAS_avecSAML"] = 12)] =
		"eCAS_AucunTrouve_IdCAS_avecSAML";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_Identite"] = 13)] =
		"eCAS_AucunTrouve_Identite";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_Identite_errIdCAS"] = 14)] =
		"eCAS_AucunTrouve_Identite_errIdCAS";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_IdPronote"] = 15)] =
		"eCAS_AucunTrouve_IdPronote";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_URLEspace"] = 16)] =
		"eCAS_AucunTrouve_URLEspace";
	TypeErreurCAS[(TypeErreurCAS["eCAS_AucunTrouve_AccesRefuse"] = 17)] =
		"eCAS_AucunTrouve_AccesRefuse";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_RNE"] = 18)] = "eCAS_Conf_RNE";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_URLServeurCAS"] = 19)] =
		"eCAS_Conf_URLServeurCAS";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_Autres"] = 20)] = "eCAS_Conf_Autres";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_Certificat_NonDefini"] = 21)] =
		"eCAS_Conf_Certificat_NonDefini";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_URLService_NonDefini"] = 22)] =
		"eCAS_Conf_URLService_NonDefini";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Conf_Certificat_errService"] = 23)] =
		"eCAS_Conf_Certificat_errService";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_IdCAS"] = 24)] =
		"eCAS_Plusieurs_IdCAS";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_Identite_Espaces"] = 25)] =
		"eCAS_Plusieurs_Identite_Espaces";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_Identite_Homonymes"] = 26)] =
		"eCAS_Plusieurs_Identite_Homonymes";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_Identite_CP_Espaces"] = 27)] =
		"eCAS_Plusieurs_Identite_CP_Espaces";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_Identite_CP_Homonymes"] = 28)] =
		"eCAS_Plusieurs_Identite_CP_Homonymes";
	TypeErreurCAS[(TypeErreurCAS["eCAS_Plusieurs_IdPronote"] = 29)] =
		"eCAS_Plusieurs_IdPronote";
	TypeErreurCAS[(TypeErreurCAS["eCAS_PersonnelVSEtDirection"] = 30)] =
		"eCAS_PersonnelVSEtDirection";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_Academie"] = 31)] =
		"eEduConnect_Academie";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_Etablissement"] = 32)] =
		"eEduConnect_Etablissement";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_NonTrouve"] = 33)] =
		"eEduConnect_NonTrouve";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_Responsabilite"] = 34)] =
		"eEduConnect_Responsabilite";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_VecteurIdentiteIncorrect"] = 35)] =
		"eEduConnect_VecteurIdentiteIncorrect";
	TypeErreurCAS[(TypeErreurCAS["eEduConnect_ErreurIndex"] = 36)] =
		"eEduConnect_ErreurIndex";
})(TypeErreurCAS || (exports.TypeErreurCAS = TypeErreurCAS = {}));
const TypeErreurCASUtil = {
	estErreurEduConnect(aTypeErreur) {
		return [
			TypeErreurCAS.eEduConnect_Academie,
			TypeErreurCAS.eEduConnect_Etablissement,
			TypeErreurCAS.eEduConnect_NonTrouve,
			TypeErreurCAS.eEduConnect_Responsabilite,
			TypeErreurCAS.eEduConnect_VecteurIdentiteIncorrect,
			TypeErreurCAS.eEduConnect_ErreurIndex,
		].includes(aTypeErreur);
	},
};
exports.TypeErreurCASUtil = TypeErreurCASUtil;
