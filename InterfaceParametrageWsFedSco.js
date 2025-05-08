exports.InterfaceParametrageWsFedSco = void 0;
const InterfaceParametrageWsFed_ServeurHttp_1 = require("InterfaceParametrageWsFed_ServeurHttp");
const WSGestionWsFed_1 = require("WSGestionWsFed");
class InterfaceParametrageWsFedSco extends InterfaceParametrageWsFed_ServeurHttp_1.InterfaceParametrageWsFed_ServeurHttp {
  constructor(...aParams) {
    super(...aParams);
    Object.assign(this.optionsWsFed, {
      avecAccesInvite: false,
      groupesUtilisateur: [
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_Professeurs,
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_Eleves,
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_Parents,
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_PersonnelsAdministratifs,
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_MaitresDeStage,
        WSGestionWsFed_1.ETypeProfilUtilisateurSvcW.Pu_Inspecteurs,
      ],
      largeurLibelleFenetre: 150,
    });
  }
}
exports.InterfaceParametrageWsFedSco = InterfaceParametrageWsFedSco;
