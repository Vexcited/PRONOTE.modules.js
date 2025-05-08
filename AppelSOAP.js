exports.AppelSOAP = void 0;
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const MethodesObjet_1 = require("MethodesObjet");
const AppelSOAP = {
  lancerAppel(aParametres) {
    const lParametres = Object.assign(
      {
        instance: null,
        port: "",
        methode: "",
        serialisation: null,
        gererExceptionParDefaut: true,
      },
      aParametres,
    );
    const lObjetApplicationConsoles = GApplication;
    let lResult = new Promise((aResolve, aReject) => {
      if (!lParametres.instance || !lParametres.port || !lParametres.methode) {
        aReject();
      }
      const lParamSOAP = {
        webService: lObjetApplicationConsoles.WS_adminServeur,
        port: lParametres.port,
        methode: lParametres.methode,
      };
      const lCommunication = lObjetApplicationConsoles.getCommunicationSOAP();
      const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
        lCommunication.webServices,
        lParamSOAP,
      );
      if (MethodesObjet_1.MethodesObjet.isFunction(lParametres.serialisation)) {
        lParametres.serialisation.call(
          lParametres.instance,
          lAppelDistant.getParametres(),
        );
      }
      const lCallback = lObjetApplicationConsoles.creerCallbackSOAP(
        lParametres.instance,
        (aDonnees) => {
          aResolve(aDonnees);
          lParametres.instance.$refresh();
        },
      );
      const lGererException = lCallback.gererExceptionParDefaut;
      if (lParametres.gererExceptionParDefaut) {
        lCallback.gererExceptionParDefaut = function (aRetour) {
          const lResult = lGererException.call(this, aRetour);
          aReject({ erreur: aRetour });
          return lResult;
        };
      } else {
        lCallback.gererExceptionParDefaut = function (aRetour) {
          return aReject({
            erreur: aRetour,
            gererExceptionDefaut: () => {
              return lGererException.call(this, aRetour);
            },
          });
        };
      }
      lCommunication.appelSOAP(lAppelDistant, lCallback);
    });
    return lResult;
  },
};
exports.AppelSOAP = AppelSOAP;
