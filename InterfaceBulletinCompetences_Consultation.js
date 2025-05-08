const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { GHtml } = require("ObjetHtml.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  _InterfaceBulletinCompetences,
} = require("_InterfaceBulletinCompetences.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const MultipleObjetDocumentsATelecharger = require("ObjetDocumentsATelecharger.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreMessage } = require("Enumere_Message.js");
class InterfaceBulletinCompetences_Consultation extends _InterfaceBulletinCompetences {
  constructor(...aParams) {
    super(...aParams);
    this.avecGestionAccuseReception =
      [EGenreEspace.PrimParent, EGenreEspace.Parent].includes(
        GEtatUtilisateur.GenreEspace,
      ) &&
      (GEtatUtilisateur.pourPrimaire() ||
        GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins));
  }
  construireInstances() {
    super.construireInstances();
    this.identPiedPage = this.add(InterfacePiedBulletin);
    this.identCombo = this.add(
      ObjetSaisiePN,
      this.evenementSurCombo,
      this.initialiserCombo,
    );
    this.genreMessage = EGenreMessage.AucunBulletinDeCompetencesPourEleve;
    if (
      [
        EGenreEspace.Eleve,
        EGenreEspace.PrimEleve,
        EGenreEspace.PrimParent,
        EGenreEspace.Parent,
        EGenreEspace.Accompagnant,
        EGenreEspace.Tuteur,
      ].includes(GEtatUtilisateur.GenreEspace) &&
      MultipleObjetDocumentsATelecharger
    ) {
      this.identDocumentsATelecharger = this.add(
        MultipleObjetDocumentsATelecharger.ObjetDocumentsATelecharger,
      );
    }
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.AddSurZone = [this.identCombo, { separateur: true }];
    this.AddSurZone.push({ blocGauche: true });
    if (this.avecGestionAccuseReception && !this.estPourClasse()) {
      this.AddSurZone.push({
        html:
          '<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">' +
          GTraductions.getValeur(
            "BulletinEtReleve.JAiPrisConnaissanceDuBilanPeriodique",
          ) +
          "</ie-checkbox>",
      });
    }
    this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
    this.AddSurZone.push({ blocDroit: true });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(super.construireStructureAffichageAutre());
    if (this.getInstance(this.identDocumentsATelecharger)) {
      H.push(
        '<div class="Table BorderBox" id="' +
          this.getInstance(this.identDocumentsATelecharger).getNom() +
          '" style="display:none;max-width: 70rem;"></div>',
      );
    }
    return H.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      visibiliteAR: function () {
        const lResponsableAR = aInstance._getResponsableAccuseReception();
        return (
          !aInstance.avecMessage &&
          aInstance.avecGestionAccuseReception &&
          !!lResponsableAR
        );
      }.bind(aInstance),
      cbAccuseReception: {
        getValue: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
        },
        setValue: function (aValue) {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          if (!!lResponsableAR) {
            lResponsableAR.aPrisConnaissance = aValue;
            new ObjetRequeteSaisieAccuseReceptionDocument(
              aInstance,
            ).lancerRequete({
              periode: GEtatUtilisateur.Navigation.getRessource(
                EGenreRessource.Periode,
              ),
              aPrisConnaissance: aValue,
            });
          }
        },
        getDisabled: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
        },
      },
    });
  }
  recupererDonnees() {
    if (this.getInstance(this.identCombo)) {
      this.IdPremierElement = this.getInstance(
        this.identCombo,
      ).getPremierElement();
      this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
      if (this.listePeriodes && this.listePeriodes.count()) {
        this.getInstance(this.identCombo).setVisible(true);
        this.getInstance(this.identCombo).setDonnees(this.listePeriodes);
        this.getInstance(this.identCombo).setSelectionParElement(
          GEtatUtilisateur.getPeriode(),
          0,
        );
      } else {
        this.getInstance(this.identCombo).setVisible(false);
        this.evenementAfficherMessage(this.genreMessage);
        this.getInstance(this.identCombo).IdPremierElement =
          this.idMessageActionRequise;
      }
    }
  }
  _getResponsableAccuseReception() {
    let lReponsableAccuseReception = null;
    if (
      !!this.donnees.listeAccusesReception &&
      this.donnees.listeAccusesReception.count() > 0
    ) {
      lReponsableAccuseReception =
        this.donnees.listeAccusesReception.getPremierElement();
      if (!!lReponsableAccuseReception) {
      }
    }
    return lReponsableAccuseReception;
  }
  estPourClasse() {
    return (
      GEtatUtilisateur.getGenreOnglet() ===
      EGenreOnglet.BulletinCompetencesClasse
    );
  }
  estJaugeCliquable() {
    return (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.BulletinCompetences ||
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ReleveDeCompetences
    );
  }
  _getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.BulletinDeCompetences,
      periode: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ),
      avecChoixGraphe:
        GEtatUtilisateur.getGenreOnglet() ===
          EGenreOnglet.BulletinCompetences ||
        GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ReleveDeCompetences,
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
  }
  getParametresPiedPageEleve() {
    return {
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
      typeContexteBulletin: TypeContexteBulletin.CB_Eleve,
      avecSaisie: false,
    };
  }
  getParametresPiedPageClasse() {
    return {
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
      typeContexteBulletin: TypeContexteBulletin.CB_Classe,
      avecSaisie: false,
    };
  }
  avecLegendeBulletin() {
    return true;
  }
  initialiserCombo(aInstance) {
    aInstance.setOptionsObjetSaisie({
      labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
    });
  }
  evenementSurCombo(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Periode,
        aParams.element,
      );
      if (
        aParams.element &&
        aParams.element.estAnneesPrecedentes &&
        this.getInstance(this.identDocumentsATelecharger)
      ) {
        GHtml.setDisplay(
          this.getInstance(this.identDocumentsATelecharger).getNom(),
          true,
        );
        GHtml.setDisplay(this.idBulletin, false);
        this.getInstance(this.identDocumentsATelecharger).setDonnees({
          avecCompetences: true,
        });
        Invocateur.evenement(
          ObjetInvocateur.events.activationImpression,
          EGenreImpression.Aucune,
        );
      } else {
        if (this.getInstance(this.identDocumentsATelecharger)) {
          GHtml.setDisplay(
            this.getInstance(this.identDocumentsATelecharger).getNom(),
            false,
          );
        }
        GHtml.setDisplay(this.idBulletin, true);
        this._evenementDernierMenuDeroulant();
      }
    }
  }
  _evenementDernierMenuDeroulant() {
    super._evenementDernierMenuDeroulant();
  }
}
module.exports = InterfaceBulletinCompetences_Consultation;
