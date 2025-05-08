exports.TypeForumPedaCommandeSaisie =
	exports.TypeForumPedaCommandeRequete =
	exports.TypeGenreActionSurPostForum =
	exports.TypeRoleIndividuSujet =
	exports.TypeGenreVisiteurForum =
	exports.TypeActionPost =
	exports.TypeHeaderEtatPost =
	exports.TypeEtatPub =
	exports.TypeGenreModerationForum =
		void 0;
var TypeGenreModerationForum;
(function (TypeGenreModerationForum) {
	TypeGenreModerationForum["GMF_APriori"] = "GMF_APriori";
	TypeGenreModerationForum["GMF_APosteriori"] = "GMF_APosteriori";
})(
	TypeGenreModerationForum ||
		(exports.TypeGenreModerationForum = TypeGenreModerationForum = {}),
);
var TypeEtatPub;
(function (TypeEtatPub) {
	TypeEtatPub["EP_Ouvert"] = "EP_Ouvert";
	TypeEtatPub["EP_Ferme"] = "EP_Ferme";
	TypeEtatPub["EP_Verrou"] = "EP_Verrou";
	TypeEtatPub["EP_Suspendu"] = "EP_Suspendu";
})(TypeEtatPub || (exports.TypeEtatPub = TypeEtatPub = {}));
var TypeHeaderEtatPost;
(function (TypeHeaderEtatPost) {
	TypeHeaderEtatPost["HEP_Publie"] = "HEP_Publie";
	TypeHeaderEtatPost["HEP_Refuse"] = "HEP_Refuse";
	TypeHeaderEtatPost["HEP_SignaleModEnCours"] = "HEP_SignaleModEnCours";
	TypeHeaderEtatPost["HEP_SignaleMod"] = "HEP_SignaleMod";
	TypeHeaderEtatPost["HEP_Important"] = "HEP_Important";
	TypeHeaderEtatPost["HEP_SupprimeAuteur"] = "HEP_SupprimeAuteur";
	TypeHeaderEtatPost["HEP_AttenteValidation"] = "HEP_AttenteValidation";
	TypeHeaderEtatPost["HEP_Aucun"] = "HEP_Aucun";
})(
	TypeHeaderEtatPost || (exports.TypeHeaderEtatPost = TypeHeaderEtatPost = {}),
);
var TypeActionPost;
(function (TypeActionPost) {
	TypeActionPost[(TypeActionPost["AP_Repondre"] = 0)] = "AP_Repondre";
	TypeActionPost[(TypeActionPost["AP_Editer"] = 1)] = "AP_Editer";
	TypeActionPost[(TypeActionPost["AP_Supprimer"] = 2)] = "AP_Supprimer";
	TypeActionPost[(TypeActionPost["AP_SupprimerDefinitivement"] = 3)] =
		"AP_SupprimerDefinitivement";
	TypeActionPost[(TypeActionPost["AP_SignalerModeration"] = 4)] =
		"AP_SignalerModeration";
	TypeActionPost[(TypeActionPost["AP_Important"] = 5)] = "AP_Important";
	TypeActionPost[(TypeActionPost["AP_NonImportant"] = 6)] = "AP_NonImportant";
	TypeActionPost[(TypeActionPost["AP_SignalerSPR"] = 7)] = "AP_SignalerSPR";
	TypeActionPost[(TypeActionPost["AP_ExclureAuteur"] = 8)] = "AP_ExclureAuteur";
	TypeActionPost[(TypeActionPost["AP_Accepter"] = 9)] = "AP_Accepter";
	TypeActionPost[(TypeActionPost["AP_Refuser"] = 10)] = "AP_Refuser";
	TypeActionPost[(TypeActionPost["AP_TraiterSignalement"] = 11)] =
		"AP_TraiterSignalement";
})(TypeActionPost || (exports.TypeActionPost = TypeActionPost = {}));
var TypeGenreVisiteurForum;
(function (TypeGenreVisiteurForum) {
	TypeGenreVisiteurForum[(TypeGenreVisiteurForum["GVF_Responsable"] = 0)] =
		"GVF_Responsable";
	TypeGenreVisiteurForum[(TypeGenreVisiteurForum["GVF_Accompagnant"] = 1)] =
		"GVF_Accompagnant";
	TypeGenreVisiteurForum[(TypeGenreVisiteurForum["GVF_SPR"] = 2)] = "GVF_SPR";
})(
	TypeGenreVisiteurForum ||
		(exports.TypeGenreVisiteurForum = TypeGenreVisiteurForum = {}),
);
var TypeRoleIndividuSujet;
(function (TypeRoleIndividuSujet) {
	TypeRoleIndividuSujet[(TypeRoleIndividuSujet["RIS_Auteur"] = 0)] =
		"RIS_Auteur";
	TypeRoleIndividuSujet[(TypeRoleIndividuSujet["RIS_Moderateur"] = 1)] =
		"RIS_Moderateur";
	TypeRoleIndividuSujet[(TypeRoleIndividuSujet["RIS_Membre"] = 2)] =
		"RIS_Membre";
	TypeRoleIndividuSujet[(TypeRoleIndividuSujet["RIS_Visiteur"] = 3)] =
		"RIS_Visiteur";
})(
	TypeRoleIndividuSujet ||
		(exports.TypeRoleIndividuSujet = TypeRoleIndividuSujet = {}),
);
var TypeGenreActionSurPostForum;
(function (TypeGenreActionSurPostForum) {
	TypeGenreActionSurPostForum["APF_Aucune"] = "APF_Aucune";
	TypeGenreActionSurPostForum["APF_RefuserLePost"] = "APF_RefuserLePost";
	TypeGenreActionSurPostForum["APF_RefuserTousLesPosts"] =
		"APF_RefuserTousLesPosts";
})(
	TypeGenreActionSurPostForum ||
		(exports.TypeGenreActionSurPostForum = TypeGenreActionSurPostForum = {}),
);
var TypeForumPedaCommandeRequete;
(function (TypeForumPedaCommandeRequete) {
	TypeForumPedaCommandeRequete["fpcr_Sujets"] = "fpcr_Sujets";
	TypeForumPedaCommandeRequete["fpcr_DetailSujet"] = "fpcr_DetailSujet";
	TypeForumPedaCommandeRequete["fpcr_Posts"] = "fpcr_Posts";
	TypeForumPedaCommandeRequete["fpcr_ExclusSujet"] = "fpcr_ExclusSujet";
})(
	TypeForumPedaCommandeRequete ||
		(exports.TypeForumPedaCommandeRequete = TypeForumPedaCommandeRequete = {}),
);
var TypeForumPedaCommandeSaisie;
(function (TypeForumPedaCommandeSaisie) {
	TypeForumPedaCommandeSaisie["fpcs_CreerModifierSujet"] =
		"fpcs_CreerModifierSujet";
	TypeForumPedaCommandeSaisie["fpcs_SupprimerSujet"] = "fpcs_SupprimerSujet";
	TypeForumPedaCommandeSaisie["fpcs_DupliquerSujet"] = "fpcs_DupliquerSujet";
	TypeForumPedaCommandeSaisie["fpcs_NettoyerSujet"] = "fpcs_NettoyerSujet";
	TypeForumPedaCommandeSaisie["fpcs_ModifierEtatSujet"] =
		"fpcs_ModifierEtatSujet";
	TypeForumPedaCommandeSaisie["fpcs_ModifierExclusSujet"] =
		"fpcs_ModifierExclusSujet";
	TypeForumPedaCommandeSaisie["fpcs_ModifierConsigneVisibleSujet"] =
		"fpcs_ModifierConsigneVisibleSujet";
	TypeForumPedaCommandeSaisie["fpcs_Post_Creer"] = "fpcs_Post_Creer";
	TypeForumPedaCommandeSaisie["fpcs_Post_Editer"] = "fpcs_Post_Editer";
	TypeForumPedaCommandeSaisie["fpcs_Post_Action"] = "fpcs_Post_Action";
	TypeForumPedaCommandeSaisie["fpcs_Post_ModifierLu"] = "fpcs_Post_ModifierLu";
})(
	TypeForumPedaCommandeSaisie ||
		(exports.TypeForumPedaCommandeSaisie = TypeForumPedaCommandeSaisie = {}),
);
