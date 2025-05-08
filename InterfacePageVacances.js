const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetCalendrierPeriode } = require("ObjetCalendrierPeriode.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreRole, EGenreAttribut } = require("ObjetWAI.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { InterfacePage } = require("InterfacePage.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
class InterfacePageVacances extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.AvecImpressionListeArborescente = true;
    this.idLegende = this.Nom + "_legende";
  }
  construireInstances() {
    if (!GEtatUtilisateur.estModeAccessible()) {
      this.IdentVacances = this.add(ObjetCalendrierPeriode);
    } else {
      this.IdentVacances = this.add(ObjetListeArborescente, null, null);
    }
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.IdentVacances;
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="CalendrierPeriode">');
    H.push(
      '<div id="' +
        this.idLegende +
        '">' +
        (GEtatUtilisateur.estModeAccessible() ? "" : this.composeLegende()) +
        "</div>",
    );
    H.push(
      '<div id="' + this.Instances[this.IdentVacances].getNom() + '"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  composeLegende() {
    const T = [];
    T.push(
      this.getInstance(this.IdentVacances).composeLegende({
        donnees: GParametres.listeJoursFeries,
      }),
    );
    if (GParametres.listeJoursFeries && GParametres.listeJoursFeries.count()) {
      T.push(
        '<div id="' +
          this.Nom +
          '_WAI" tabindex="0" class="Texte10 Espace" style="position:sticky;top:8.5rem;" ',
        GObjetWAI.composeRole(EGenreRole.List),
        " ",
        GObjetWAI.composeAttribut({
          genre: EGenreAttribut.label,
          valeur:
            GTraductions.getValeur("Onglet.Libelle")[EGenreOnglet.Vacances],
        }),
        ">",
        this.composeListeLibelles(),
        "</div>",
      );
    }
    return T.join("");
  }
  composeListeLibelles() {
    const lHtml = [];
    for (let i = 0; i < GParametres.listeJoursFeries.count(); i++) {
      const lElement = GParametres.listeJoursFeries.get(i);
      if (lElement.getLibelle()) {
        const LPeriode = GDate.estDateEgale(
          lElement.dateDebut,
          lElement.dateFin,
        )
          ? GTraductions.getValeur("Le") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%JJ %MMMM")
          : GTraductions.getValeur("Du") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%JJ %MMMM") +
            " " +
            GTraductions.getValeur("Au") +
            " " +
            GDate.formatDate(lElement.dateFin, "%JJ %MMMM");
        lHtml.push(
          '<div tabindex="0" ',
          GObjetWAI.composeAttribut({
            genre: EGenreAttribut.label,
            valeur: lElement.getLibelle() + ":" + LPeriode,
          }),
          " ",
          GObjetWAI.composeRole(EGenreRole.Listitem),
          ' class="EspaceBas GrasSurFocus">',
          lElement.getLibelle(),
          " : ",
        );
        lHtml.push('<div class="Gras">', LPeriode, "</div></div>");
      }
    }
    return lHtml.join("");
  }
  recupererDonnees() {
    if (!GEtatUtilisateur.estModeAccessible()) {
      this.Instances[this.IdentVacances].setDonnees({
        feries: GParametres.listeJoursFeries,
      });
    }
    this.afficherInterfaceGraphique();
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.GenerationPDF,
      this,
      this._getParametresPDF.bind(this),
    );
    this.surResizeInterface();
  }
  _getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.CalendrierScolaire,
      parametres: this.parametres,
    };
  }
  getRacineListeArborescente() {
    return this.Instances[this.IdentVacances].getListeArborescente();
  }
  afficherInterfaceGraphique() {
    if (GEtatUtilisateur.estModeAccessible()) {
      this.afficherListeAccessible();
    }
  }
  afficherListeAccessible() {
    const lRacine = this.Instances[this.IdentVacances].construireRacine();
    if (
      !$.isEmptyObject(GParametres.listeJoursFeries) &&
      GParametres.listeJoursFeries.count() > 0
    ) {
      this.Instances[this.IdentVacances].setParametres(true);
      const LPremiereDate = GDate.formatDate(
        GParametres.PremiereDate,
        "%JJJJ %J %MMMM %AAAA",
      );
      const LDerniereDate = GDate.formatDate(
        GParametres.DerniereDate,
        "%JJJJ %J %MMMM %AAAA",
      );
      const LNoeudAnnee = this.Instances[
        this.IdentVacances
      ].ajouterUnNoeudAuNoeud(
        lRacine,
        this.Nom + "_Annee",
        GTraductions.getValeur("AnneeScolaire") +
          " " +
          GTraductions.getValeur("Du") +
          " " +
          LPremiereDate +
          " " +
          GTraductions.getValeur("Au") +
          " " +
          LDerniereDate +
          " : Vacances",
        "Gras EspaceGauche MargeHaut MargeBas",
        true,
        true,
      );
      const lDonnees = GParametres.listeJoursFeries;
      for (let i = 0; i < lDonnees.count(); i++) {
        const lElement = lDonnees.get(i);
        let LLibelle = "";
        const LPeriode = GDate.estDateEgale(
          lElement.dateDebut,
          lElement.dateFin,
        )
          ? GTraductions.getValeur("Le_Maj") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%J %MMMM")
          : GTraductions.getValeur("Du") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%J %MMMM") +
            " " +
            GTraductions.getValeur("Au") +
            " " +
            GDate.formatDate(lElement.dateFin, "%J %MMMM");
        LLibelle += '<span class="Gras">' + LPeriode + "</span>";
        if (lElement.Libelle && lElement.Libelle.length) {
          LLibelle += " - " + lElement.Libelle;
        }
        this.Instances[this.IdentVacances].ajouterUneFeuilleAuNoeud(
          LNoeudAnnee,
          this.Nom + "_" + i,
          LLibelle,
          "MargeHaut MargeBas",
        );
      }
    } else {
      this.Instances[this.IdentVacances].ajouterUneFeuilleAuNoeud(
        lRacine,
        this.Nom + "_Message",
        GTraductions.getValeur("Vacances.MessageVacancesNonDefinis"),
        "Gras MargeHaut AlignementMilieu",
      );
    }
    $("#" + this.Instances[this.IdentVacances].Nom.escapeJQ()).replaceWith(
      this.Instances[this.IdentVacances].construireAffichage(),
    );
    this.Instances[this.IdentVacances].setDonnees(lRacine);
  }
}
module.exports = InterfacePageVacances;
