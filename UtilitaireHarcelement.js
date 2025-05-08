exports.UtilitaireHarcelement = void 0;
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireHarcelement = {
  avecBoutonHarcelement() {
    if (!GEtatUtilisateur) {
      return false;
    }
    const lEstEspaceParent = [
      Enumere_Espace_1.EGenreEspace.Mobile_Parent,
      Enumere_Espace_1.EGenreEspace.Parent,
    ].includes(GEtatUtilisateur.GenreEspace);
    const lEstEspaceEleve = [
      Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
      Enumere_Espace_1.EGenreEspace.Eleve,
    ].includes(GEtatUtilisateur.GenreEspace);
    if (lEstEspaceParent || lEstEspaceEleve) {
      const lEtatUtilisateurSco = GEtatUtilisateur;
      let lListeEtab = new ObjetListeElements_1.ObjetListeElements();
      if (lEstEspaceParent) {
        lListeEtab = lEtatUtilisateurSco.listeInformationsEtablissements;
      }
      if (lEstEspaceEleve) {
        const lEtablissement =
          lEtatUtilisateurSco.getUtilisateur() &&
          lEtatUtilisateurSco.getUtilisateur().Etablissement;
        if (lEtablissement) {
          const lEtablissementAvecToutesLesInfos =
            lEtatUtilisateurSco.listeInformationsEtablissements &&
            lEtatUtilisateurSco.listeInformationsEtablissements.getElementParNumero(
              lEtablissement.getNumero(),
            );
          if (lEtablissementAvecToutesLesInfos) {
            lListeEtab.add(lEtablissementAvecToutesLesInfos);
          }
        }
      }
      let lAvecReferents = false;
      for (const lEtablissement of lListeEtab) {
        if (lEtablissement && lEtablissement.avecReferentsHarcelementPublie) {
          if (
            lEtablissement.listeReferentsHarcelement &&
            lEtablissement.listeReferentsHarcelement.count()
          ) {
            lAvecReferents = true;
            break;
          }
        }
      }
      const lAvecNumerosUtiles = !!(
        lEtatUtilisateurSco.listeNumerosUtiles &&
        lEtatUtilisateurSco.listeNumerosUtiles.count()
      );
      return lAvecReferents || lAvecNumerosUtiles;
    }
    return false;
  },
};
exports.UtilitaireHarcelement = UtilitaireHarcelement;
