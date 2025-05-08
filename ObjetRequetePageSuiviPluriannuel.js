const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequetePageSuiviPluriannuel extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aNumeroEleve, aParam) {
    this.JSON.eleve = new ObjetElement(null, aNumeroEleve);
    this.param = aParam;
    if (this.param) {
      this.JSON.avecMoyennes = this.param.avecMoyennes;
      this.JSON.annees = this.param.annees;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lParam = { message: this.JSONReponse.message };
    if (!lParam.message) {
      const lAvecMoyennesSaisies = this.JSONReponse.avecMoyennesSaisies;
      const lAnneesSelectionnees = new ObjetListeElements();
      const lListe = new ObjetListeElements();
      const lListeMetas = this.JSONReponse.listeMetas;
      const lListeAnnees = this.JSONReponse.listeAnnees;
      const lListeDonnees = this.JSONReponse.listeDonnees;
      const lListeTotal = new ObjetElement();
      const lInfosGrapheTotal = [];
      const lInstance = this;
      lListeMetas.parcourir((aMeta) => {
        const lLigne = new ObjetElement();
        let lCompteur = 0;
        const lInfosGraphe = [];
        lLigne.matiere = aMeta.getLibelle();
        lListeAnnees.parcourir(() => {
          const lAnnee = new ObjetElement();
          lAnnee.strAnnee = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "strAnnee",
          );
          lAnnee.nbMaxPeriode = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "nbMaxPeriode",
          );
          lAnnee.couleur = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "couleur",
          );
          lAnnee.bareme = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "bareme",
          );
          lAnnee.strClasses = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "strClasses",
          );
          lAnnee.avecBulletins = _getInfo.call(
            lInstance,
            lCompteur,
            lListeDonnees,
            "avecBulletins",
          );
          if (lAnnee.avecBulletins) {
            lAnnee.listeBulletins = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "listeBulletins",
            );
          }
          lAnnee.suivi = _getDonnees.call(
            lInstance,
            lCompteur,
            aMeta.Numero,
            lListeDonnees,
          );
          lLigne["annee" + lCompteur] = lAnnee;
          lInfosGraphe.push({
            moyenne: lAnnee.suivi.moyenne,
            bareme: lAnnee.bareme,
            couleur: lAnnee.couleur,
          });
          if (!lListeTotal["annee" + lCompteur]) {
            const lTotal = new ObjetElement();
            lTotal.moyenne = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "moyenne",
            );
            lTotal.moyenneClasse = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "moyenneClasse",
            );
            lTotal.strEsito = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "strEsito",
            );
            lTotal.strAssiduite = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "strAssiduite",
            );
            lTotal.hintAssiduite = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "hintAssiduite",
            );
            lTotal.credits = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "credits",
            );
            lListeTotal["annee" + lCompteur] = lTotal;
            lInfosGrapheTotal.push({
              moyenne: lTotal.moyenne,
              bareme: lAnnee.bareme,
              couleur: lAnnee.couleur,
            });
            const lAnneeSelectionnee = new ObjetElement(
              lAnnee.strAnnee,
              _getInfo.call(lInstance, lCompteur, lListeDonnees, "identifiant"),
            );
            lAnneeSelectionnee.cmsActif = true;
            lAnneeSelectionnee.strFin = _getInfo.call(
              lInstance,
              lCompteur,
              lListeDonnees,
              "strFinAnnee",
            );
            lAnneesSelectionnees.addElement(lAnneeSelectionnee);
          }
          lCompteur++;
        });
        lLigne.infosGraphe = lInfosGraphe;
        lListe.addElement(lLigne);
      });
      lParam = {
        nombreDAnnees: lListeAnnees.count(),
        listeDonnees: lListe,
        listeTotal: lListeTotal,
        listeAnnees: lAnneesSelectionnees,
        infosGrapheTotal: lInfosGrapheTotal,
        avecMoyennesSaisies: lAvecMoyennesSaisies,
        grapheAvecMoyenne: this.JSONReponse.grapheAvecMoyenne,
        grapheSansMoyenne: this.JSONReponse.grapheSansMoyenne,
        grapheMessage: this.JSONReponse.grapheMessage,
        afficherMoyenneGenerale: this.JSONReponse.afficherMoyenneGenerale,
      };
    }
    this.callbackReussite.appel(lParam);
  }
}
Requetes.inscrire("PageSuiviPluriannuel", ObjetRequetePageSuiviPluriannuel);
function _getInfo(aIdAnnee, aListe, aType) {
  return aListe.get(aIdAnnee)[aType];
}
function _getDonnees(aIdAnnee, aMeta, aListe) {
  const lListeSuivis = aListe.get(aIdAnnee).listeSuivis;
  let result = new ObjetElement();
  lListeSuivis.parcourir((aElement) => {
    if (aElement.meta.Numero === aMeta) {
      result = aElement;
    }
  });
  return result;
}
module.exports = ObjetRequetePageSuiviPluriannuel;
