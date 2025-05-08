const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_AbsencesEtRetards,
} = require("DonneesListe_AbsencesEtRetards.js");
const {
  ObjetRequetePageAbsencesEtRetards,
} = require("ObjetRequetePageAbsencesEtRetards.js");
const {
  ObjetRequeteSaisieListeAbsenceRetard,
} = require("ObjetRequeteSaisieListeAbsenceRetard.js");
const { InterfacePageEtablissement } = require("InterfacePageEtablissement.js");
class InterfacePageAbsencesEtRetards extends InterfacePageEtablissement {
  initialiserListe(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.type,
      titre: "",
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.eleve,
      titre: GTraductions.getValeur("Eleve"),
      taille: 150,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.classe,
      titre: GTraductions.getValeur("Classe"),
      taille: 100,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.regime,
      titre: GTraductions.getValeur("SuivisAR.Regime"),
      taille: 150,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.date,
      titre: GTraductions.getValeur("Date"),
      taille: 180,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.motifs,
      titre: GTraductions.getValeur("SuivisAR.Motif"),
      taille: ObjetListe.initColonne(60, 130, 200),
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.matieres,
      titre: GTraductions.getValeur("Matieres"),
      taille: ObjetListe.initColonne(40, 90, 180),
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.ouverte,
      titre: GTraductions.getValeur("SuivisAR.OuverteAbr"),
      taille: 40,
    });
    lColonnes.push({
      id: DonneesListe_AbsencesEtRetards.colonnes.regleeAdm,
      titre: GTraductions.getValeur("RegleAdminAbr"),
      taille: 30,
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      scrollHorizontal: true,
      largeurImage: 17,
    });
    GEtatUtilisateur.setTriListe({
      liste: aInstance,
      tri: [
        DonneesListe_AbsencesEtRetards.colonnes.eleve,
        DonneesListe_AbsencesEtRetards.colonnes.classe,
      ],
    });
  }
  requetePage(aNavigation) {
    new ObjetRequetePageAbsencesEtRetards(
      this,
      this._reponseRequeteAbsencesEtRetards,
    ).lancerRequete(aNavigation.dateDebut, aNavigation.dateFin);
  }
  _reponseRequeteAbsencesEtRetards(aListeAbsencesEtRetards, aAvecSaisieRA) {
    this.listeAbsencesEtRetards = aListeAbsencesEtRetards;
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_AbsencesEtRetards(
        aListeAbsencesEtRetards,
        aAvecSaisieRA,
      ),
    );
  }
  valider() {
    new ObjetRequeteSaisieListeAbsenceRetard(
      this,
      this.actionSurValidation,
    ).lancerRequete(this.listeAbsencesEtRetards);
  }
}
module.exports = { InterfacePageAbsencesEtRetards };
