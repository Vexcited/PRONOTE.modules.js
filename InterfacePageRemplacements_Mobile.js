const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListe } = require("ObjetListe.js");
const ObjetRequetePageRemplacements = require("ObjetRequetePageRemplacements.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const DonneesListe_PageRemplacements = require("DonneesListe_PageRemplacements.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
class InterfacePageRemplacements_Mobile extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.IdentRemplacements = this.add(
      ObjetListe,
      null,
      this.initialiserTableauFlatDesign,
    );
    this.identDate = this.add(
      ObjetCelluleDate,
      this._evntCelluleSemaine,
      this.iniDate,
    );
  }
  iniDate(aInstance) {
    aInstance.setOptionsObjetCelluleDate({
      avecBoutonsPrecedentSuivant: true,
      avecSelectionSemaine: true,
    });
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.IdentRemplacements;
    this.AddSurZone = [this.identDate];
  }
  initialiserCalendrier(AObjet) {
    UtilitaireInitCalendrier.init(AObjet, "");
    AObjet.setFrequences(GParametres.frequences, true);
  }
  recupererDonnees() {
    this.getInstance(this.identDate).setDonnees(
      GDate.getDateCourante(true),
      true,
    );
  }
  recupererDonneesCalendrier(aDureeNonAssuree, aDureeRemplacee, aListeCours) {
    this.DureeNonAssuree = aDureeNonAssuree;
    this.DureeRemplacee = aDureeRemplacee;
    this.ListeCours = aListeCours;
    this.afficherEnFlatDesign();
  }
  _evntCelluleSemaine(aDomaine) {
    let numeroSemaine = GDate.getSemaine(aDomaine);
    if (aDomaine) {
      new ObjetRequetePageRemplacements(
        this,
        this.recupererDonneesCalendrier,
      ).lancerRequete(GEtatUtilisateur.getGenreOnglet(), numeroSemaine);
    } else {
      new ObjetRequetePageRemplacements(
        this,
        this.recupererDonneesCalendrier,
      ).lancerRequete(GEtatUtilisateur.getGenreOnglet(), numeroSemaine);
    }
  }
  afficherEnFlatDesign() {
    this.ListeCours.setTri([
      ObjetTri.init((D) => {
        return D.Date;
      }),
      ObjetTri.init((D) => {
        return D.HeureDebut;
      }),
    ]);
    this.ListeCours.trier();
    if (this.ListeCours.count()) {
      this.getInstance(this.IdentRemplacements).setDonnees(
        new DonneesListe_PageRemplacements(
          {
            ListeCours: this.ListeCours,
            DureeNonAssuree: this.DureeNonAssuree,
            DureeRemplacee: this.DureeRemplacee,
          },
          { instance: this.getInstance(this.IdentRemplacements) },
        ),
      );
    } else {
      this.getInstance(this.IdentRemplacements).setDonnees(
        new DonneesListe_PageRemplacements(
          {
            ListeCours: this.ListeCours,
            DureeNonAssuree: this.DureeNonAssuree,
            DureeRemplacee: this.DureeRemplacee,
          },
          { instance: this.getInstance(this.IdentRemplacements) },
        ),
      );
      const H = [];
      H.push(
        `<div class="semi-bold taille-m m-all-xxl p-y-xl">`,
        GTraductions.getValeur("PageRemplacement.Remplacement_AucunCours"),
        `</div>`,
      );
      GHtml.setHtml(this.getInstance(this.IdentRemplacements).Nom, H.join(""));
    }
  }
  initialiserTableauFlatDesign(aInstance) {
    aInstance.setOptionsListe({ skin: ObjetListe.skin.flatDesign });
  }
}
module.exports = InterfacePageRemplacements_Mobile;
