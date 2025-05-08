exports.ObjetHistogramme = void 0;
const ObjetRequeteGraphique_1 = require("ObjetRequeteGraphique");
const Invocateur_1 = require("Invocateur");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
class ObjetHistogramme extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
    this.etatUtilisateurSco = GApplication.getEtatUtilisateur();
    this.ajouterEvenementGlobal(
      Enumere_Event_1.EEvent.SurPreResize,
      this.surPreResize,
    );
    this.ajouterEvenementGlobal(
      Enumere_Event_1.EEvent.SurPostResize,
      this.surPostResize,
    );
  }
  setDonneesImage(aEleve, aPeriode) {
    this.donneesRecues = true;
    this._eleve = aEleve;
    this._periode = aPeriode;
    this._actualiser();
  }
  vider(aMessage) {
    this.donneesRecues = false;
    this.afficher(this.composeMessage(aMessage));
  }
  surPreResize() {
    if (!this.donneesRecues) {
      return;
    }
    this.afficher("&nbsp;");
  }
  surPostResize() {
    if (!this.donneesRecues) {
      return;
    }
    clearTimeout(this.timerResize);
    this.timerResize = setTimeout(this._actualiser.bind(this), 300);
  }
  _actualiser() {
    if (!this.donneesRecues) {
      return;
    }
    this._requeteGraphique();
  }
  async _requeteGraphique() {
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      Enumere_GenreImpression_1.EGenreImpression.Aucune,
    );
    let lHauteur = ObjetPosition_1.GPosition.getHeight(this.Nom);
    let lLargeur = ObjetPosition_1.GPosition.getWidth(this.Nom);
    lHauteur -=
      this.etatUtilisateurSco.getGenreOnglet() ===
      Enumere_Onglet_1.EGenreOnglet.Graphique_Profil
        ? 10
        : 20;
    lLargeur -= 5;
    const lEstOnToujoursSurBonOnglet = [
      Enumere_Onglet_1.EGenreOnglet.Graphique_Profil,
      Enumere_Onglet_1.EGenreOnglet.Graphique_Evolution,
    ].includes(this.etatUtilisateurSco.getGenreOnglet());
    if (!lEstOnToujoursSurBonOnglet) {
      IE.log.addLog("Requete ne part pas : on n'est plus sur le bon onglet");
    }
    if (lEstOnToujoursSurBonOnglet && lHauteur > 50 && lLargeur > 50) {
      const lReponse = await new ObjetRequeteGraphique_1.ObjetRequeteGraphique(
        this,
      ).lancerRequete({
        eleve: this._eleve,
        periode: this._periode,
        largeur: lLargeur,
        hauteur: lHauteur,
      });
      this._reponseRequete(lLargeur, lHauteur, lReponse);
    }
  }
  _reponseRequete(aLargeur, aHauteur, aParam) {
    if (aParam.imageBase64) {
      const lOnglet = this.etatUtilisateurSco.getOngletSelectionne();
      $("#" + this.Nom.escapeJQ()).html(
        IE.jsx.str(
          "div",
          {
            style:
              "overflow:auto; " +
              ObjetStyle_1.GStyle.composeWidth(aLargeur) +
              ObjetStyle_1.GStyle.composeHeight(aHauteur),
          },
          IE.jsx.str("img", {
            class: "AvecMenuContextuel",
            src: "data:image/png;base64," + aParam.imageBase64,
            alt: lOnglet.libelleLong || lOnglet.getLibelle(),
          }),
        ),
      );
      Invocateur_1.Invocateur.evenement(
        Invocateur_1.ObjetInvocateur.events.activationImpression,
        Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
        this.Pere,
        () => {
          return {
            genreGenerationPDF:
              TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
                .GraphiqueProfil,
            eleve: this._eleve,
            periode: this._periode,
          };
        },
      );
    } else if (aParam.Message) {
      this.vider(aParam.Message);
    } else {
      this.vider(ObjetTraduction_1.GTraductions.getValeur("NonPublie"));
    }
  }
}
exports.ObjetHistogramme = ObjetHistogramme;
