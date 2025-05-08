const { ObjetReleveDeNotes } = require("PageReleveDeNotes.js");
const { ObjetRequetePageReleve } = require("ObjetRequetePageReleve.js");
const { GHtml } = require("ObjetHtml.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
class ObjetAffichagePageReleveDeNotes extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.listePeriodes = new ObjetListeElements();
    this.periodeCourant = new ObjetElement();
    this.indiceParDefaut = 0;
    this.moteur = new ObjetMoteurReleveBulletin();
    this.avecGestionAccuseReception =
      [EGenreEspace.Mobile_Parent].includes(GEtatUtilisateur.GenreEspace) &&
      GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins);
  }
  construireInstances() {
    this.identSelection = this.add(
      ObjetSelection,
      this.evenementSelection,
      _initSelecteur.bind(this),
    );
    this.identPage = this.add(ObjetReleveDeNotes);
    this.AddSurZone = [this.identSelection];
    if (this.avecGestionAccuseReception) {
      this.AddSurZone.push({ html: _getHtmlCBAccuseReception.call(this) });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      visibiliteAR: function () {
        const lResponsableAR = aInstance._getResponsableAccuseReception();
        return aInstance.avecGestionAccuseReception && !!lResponsableAR;
      },
      cbAccuseReception: {
        getValue: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
        },
        setValue: function (aValue) {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          if (!!lResponsableAR) {
            lResponsableAR.aPrisConnaissance = aValue;
            aInstance.moteur.saisieAR({ periode: aInstance.periodeCourant });
          }
        },
        getDisabled: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
        },
      },
    });
  }
  _getResponsableAccuseReception() {
    let lReponsableAccuseReception = null;
    if (
      !!this.listeAccusesReception &&
      this.listeAccusesReception.count() > 0
    ) {
      lReponsableAccuseReception =
        this.listeAccusesReception.getPremierElement();
      if (!!lReponsableAccuseReception) {
      }
    }
    return lReponsableAccuseReception;
  }
  detruireInstances() {}
  evenementSwipe(event) {
    if (event.type === "swiperight") {
      this.getInstance(this.identSelection).surPrecedent();
    } else {
      this.getInstance(this.identSelection).surSuivant();
    }
  }
  recupererDonnees() {
    const lOngletInfosPeriodes = GEtatUtilisateur.getOngletInfosPeriodes();
    let lNrPeriodeParDefaut;
    if (
      !(
        lOngletInfosPeriodes.listePeriodes &&
        lOngletInfosPeriodes.listePeriodes.count()
      )
    ) {
      const lGenreMessage = EGenreMessage.AucunRelevePourEleve;
      const lMessage =
        typeof lGenreMessage === "number"
          ? GTraductions.getValeur("Message")[lGenreMessage]
          : lGenreMessage;
      GHtml.setHtml(this.Nom, this.composeAucuneDonnee(lMessage));
    } else {
      this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
      if (GEtatUtilisateur.getPeriodePourReleve()) {
        lNrPeriodeParDefaut = GEtatUtilisateur.getPeriodePourReleve();
      } else {
        lNrPeriodeParDefaut =
          GEtatUtilisateur.getPage() && GEtatUtilisateur.getPage().periode
            ? GEtatUtilisateur.getPage().periode.getNumero()
            : lOngletInfosPeriodes.periodeParDefaut.getNumero();
      }
      this.indiceParDefaut =
        this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
      if (!this.indiceParDefaut) {
        this.indiceParDefaut = 0;
      }
      this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
      this.getInstance(this.identSelection).setDonnees(
        this.listePeriodes,
        this.indiceParDefaut,
        this.getInstance(this.identPage).getNom(),
        "",
      );
      $("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
        "min-height",
        (parseInt($("#" + this.Nom.escapeJQ()).css("min-height")) -
          $(
            "#" + this.getInstance(this.identSelection).getNom().escapeJQ(),
          ).height()) *
          0.9 +
          "px",
      );
    }
    if (GEtatUtilisateur.getPeriodePourReleve()) {
      GEtatUtilisateur.setPeriodePourReleve(null);
    }
  }
  recupererDonneesReleve() {
    new ObjetRequetePageReleve(
      this,
      this.actionSurRecupererReleve,
    ).lancerRequete({
      numeroEleve: GEtatUtilisateur.getMembre().getNumero(),
      genrePeriode: this.periodeCourant.getGenre(),
      numeroPeriode: this.periodeCourant.getNumero(),
    });
  }
  actionSurRecupererReleve(aParam) {
    $.extend(this, aParam.aCopier);
    this.donneesAbsences = aParam.absences;
    this.listeAccusesReception = aParam.listeAccusesReception;
    if (!!aParam.Message) {
      this.getInstance(this.identPage).setMessage(aParam.Message);
    } else if (!this.ExisteDevoir) {
      this.getInstance(this.identPage).setMessage(
        GTraductions.getValeur("Message")[9],
      );
    } else {
      this.getInstance(this.identPage).setDonnees(
        this.ListeElements,
        this.MoyenneGenerale,
        this.donneesAbsences,
        this.PiedDePage,
        this.Affichage,
        this.positionPeriodeCourant,
        this.listePeriodes.count() - 1,
        this.periodeCourant,
      );
    }
  }
  evenementSelection(aParam) {
    this.periodeCourant = aParam.element;
    this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
      this.periodeCourant,
    );
    this.recupererDonneesReleve();
  }
}
function _getHtmlCBAccuseReception() {
  const lHtml = [];
  lHtml.push(
    '<div class="p-all">',
    '<ie-checkbox ie-textright class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">',
    GTraductions.getValeur("BulletinEtReleve.JAiPrisConnaissanceDuReleve"),
    "</ie-checkbox>",
    "</div>",
  );
  return lHtml.join("");
}
function _initSelecteur(aInstance) {
  aInstance.setParametres({
    labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
  });
}
module.exports = ObjetAffichagePageReleveDeNotes;
