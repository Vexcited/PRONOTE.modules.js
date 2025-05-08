const { TypeDroits } = require("ObjetDroitsPN.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_ChoixDatePublicationPunition,
} = require("ObjetFenetre_ChoixDatePublicationPunition.js");
class ObjetMoteurPunitions {
  constructor(aParent) {
    const lSelf = this;
    $.extend(aParent.controleur, this.getControleur());
    aParent.getMoteur = function () {
      return lSelf;
    };
    this.enCreation = false;
    this.eleve = new ObjetElement();
    this.listeEleves = new ObjetListeElements();
    this.listeMotifsOrigin = new ObjetListeElements();
    this.genreRessource = null;
    this.indiceAccompagnateur = 0;
    this.listeBoutons = [];
    this.listeDurees = new ObjetListeElements();
    for (let i = 0; i <= 10; i++) {
      const lElement = new ObjetElement();
      lElement.Libelle =
        i === 0
          ? "&nbsp;"
          : GDate.formatDureeEnMillisecondes(30 * i * 60 * 1000, "%xh%sh%mm");
      lElement.duree = i * 30;
      this.listeDurees.addElement(lElement);
    }
  }
  init(aParam) {
    this.eleve = aParam.eleve;
    this.listeEleves = aParam.listeEleves;
    this.listeMotifsOrigin = aParam.listeMotifs;
    this.listeSousCategorieDossier = aParam.listeSousCategorieDossier;
    if (this.listeMotifsOrigin) {
      this.listeMotifsOrigin.trier();
    }
    this.listeNature = aParam.listeNature;
    if (this.listeNature) {
      this.listeNature.trier();
    }
    this.genreRessource =
      aParam.genreRessource === null || aParam.genreRessource === undefined
        ? EGenreRessource.Punition
        : aParam.genreRessource;
    this.indiceAccompagnateur = 0;
    if (this.listeEleves && this.listeEleves.count() > 1) {
      let lEleve = this.listeEleves.getElementParNumero(0);
      if (lEleve) {
        lEleve.Visible = true;
      }
      lEleve = this.eleve
        ? this.listeEleves.getElementParNumero(this.eleve.getNumero())
        : null;
      if (lEleve) {
        lEleve.Visible = false;
      }
      this.listeEleves.trier();
    }
    this.enCreation = false;
    if (this.eleve) {
      this.enCreation =
        aParam.punition === null || aParam.punition === undefined;
      if (!this.enCreation) {
        this.listeBoutons = [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Supprimer"),
          GTraductions.getValeur("Valider"),
        ];
        this.punition = MethodesObjet.dupliquer(aParam.punition);
        this.punition.setEtat(EGenreEtat.Modification);
        if (
          this.punition.Accompagnateur &&
          this.punition.Accompagnateur.getNumero()
        ) {
          this.indiceAccompagnateur =
            this.listeEleves.getIndiceExisteParNumeroEtGenre(
              this.punition.Accompagnateur.getNumero(),
            );
        }
      } else {
        this.listeBoutons = [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Valider"),
        ];
        this.punition = new ObjetElement();
        this.punition.setEtat(EGenreEtat.Creation);
        this.punition.duree = 0;
        this.punition.Genre = parseInt(this.genreRessource);
        this.punition.documents = new ObjetListeElements();
        this.punition.documentsTAF = new ObjetListeElements();
        if (this.genreRessource === EGenreRessource.Exclusion) {
          this.punition.PlaceDebut = aParam.placeSaisieDebut;
          this.punition.PlaceFin = aParam.placeSaisieFin;
        }
        this.punition.listeMotifs = new ObjetListeElements();
        if (this.listeNature && this.listeNature.count() > 0) {
          const lPremiereNature = this.listeNature.get(0);
          this.punition.naturePunition = new ObjetElement(
            lPremiereNature.getLibelle(),
            lPremiereNature.getNumero(),
            lPremiereNature.getGenre(),
          );
          this.punition.naturePunition.nbJoursDecalagePublicationParDefaut =
            lPremiereNature.nbJoursDecalagePublicationParDefaut;
        }
        if (this.genreRessource === EGenreRessource.Exclusion) {
          this.punition.Accompagnateur = new ObjetElement();
        }
      }
    }
  }
  getTitre() {
    if (this.genreRessource === EGenreRessource.Punition) {
      return (
        this.eleve.getLibelle() +
        " - " +
        (!this.enCreation
          ? GTraductions.getValeur("fenetreSaisiePunition.modifierPunition")
          : GTraductions.getValeur("fenetreSaisiePunition.creerPunition"))
      );
    } else {
      return (
        this.eleve.getLibelle() +
        " - " +
        (!this.enCreation
          ? GTraductions.getValeur("fenetreSaisiePunition.modifierExclusion")
          : GTraductions.getValeur("fenetreSaisiePunition.creerExclusion"))
      );
    }
  }
  avecModifType() {
    return this.genreRessource === EGenreRessource.Punition && this.enCreation;
  }
  setDatePublication(aDate) {
    ObjetMoteurPunitions.setDatePublicationDePunition(this.punition, aDate);
  }
  static setDatePublicationDePunition(aPunition, aDate) {
    if (aPunition) {
      aPunition.datePublication = aDate;
    }
  }
  avecDroitPublie() {
    return GApplication.droits.get(
      TypeDroits.punition.avecPublicationPunitions,
    );
  }
  avecModifDuree() {
    return this.enCreation || this.punition.DureeModifiable;
  }
  getListeDuree() {
    if (this.estPunitionEnDevoir()) {
      const lListe = new ObjetListeElements();
      const lElement = new ObjetElement();
      lElement.Date = this.punition.dateProgrammation
        ? this.punition.dateProgrammation
        : this.punition.date;
      lElement.Libelle = !!lElement.Date
        ? GDate.formatDate(lElement.Date, "%JJ/%MM/%AAAA")
        : "";
      lListe.addElement(lElement);
      return lListe;
    } else {
      return this.listeDurees;
    }
  }
  estPunitionEnDevoir() {
    return this.genreRessource === EGenreRessource.Punition &&
      this.punition.naturePunition
      ? this.punition.naturePunition.getGenre() === TypeGenrePunition.GP_Devoir
      : false;
  }
  getControleur() {
    return {
      circonstance: {
        getValue: function () {
          return this.instance.getMoteur().punition &&
            this.instance.getMoteur().punition.circonstance
            ? this.instance.getMoteur().punition.circonstance
            : "";
        },
        setValue: function (aValue) {
          this.instance.getMoteur().punition.circonstance = aValue;
        },
      },
      commentaire: {
        getValue: function () {
          return this.instance.getMoteur().punition &&
            this.instance.getMoteur().punition.commentaire
            ? this.instance.getMoteur().punition.commentaire
            : "";
        },
        setValue: function (aValue) {
          this.instance.getMoteur().punition.commentaire = aValue;
        },
      },
      getClasseCssImagePublicationPunition() {
        const lPunition = this.instance.getMoteur().punition;
        return ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
          lPunition ? lPunition.datePublication : null,
        );
      },
      getHintImagePublicationPunition() {
        const lPunition = this.instance.getMoteur().punition;
        return ObjetUtilitaireAbsence.getHintPublicationPunition(
          lPunition ? lPunition.datePublication : null,
        );
      },
      checkPublierPunition: {
        getValue() {
          return this.instance.getMoteur().punition
            ? !!this.instance.getMoteur().punition.datePublication
            : false;
        },
        setValue(aValue) {
          let lNouvelleDatePublication = null;
          if (aValue) {
            const lPunition = this.instance.getMoteur().punition;
            if (lPunition) {
              lNouvelleDatePublication =
                ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
                  lPunition.naturePunition,
                );
            }
          }
          this.instance
            .getMoteur()
            .setDatePublication(lNouvelleDatePublication);
        },
      },
      modelSelecteurDatePublication: {
        getLibelle() {
          const lStrLibelle = [];
          const lPunition = this.instance.getMoteur().punition;
          if (lPunition && lPunition.datePublication) {
            lStrLibelle.push(
              GDate.formatDate(lPunition.datePublication, "%JJ/%MM/%AAAA"),
            );
          }
          return lStrLibelle.join("");
        },
        getIcone() {
          return '<i class="icon_calendar_empty"></i>';
        },
        event() {
          const lPunition = this.instance.getMoteur().punition;
          if (lPunition) {
            const lFenetre = ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_ChoixDatePublicationPunition,
              {
                pere: this.instance,
                evenement(aNumeroBouton, aDateChoisie) {
                  if (aNumeroBouton) {
                    let lNouvelleDatePublication = null;
                    if (aDateChoisie) {
                      lNouvelleDatePublication = aDateChoisie;
                    }
                    lPunition.datePublication = lNouvelleDatePublication;
                  }
                },
              },
            );
            lFenetre.setDonnees(lPunition.datePublication);
          }
        },
        getDisabled() {
          const lPunition = this.instance.getMoteur().punition;
          return !lPunition || !lPunition.datePublication;
        },
      },
      libelleCombo: function () {
        return this.instance.getMoteur().genreRessource ===
          EGenreRessource.Punition
          ? GTraductions.getValeur("fenetreSaisiePunition.type")
          : GTraductions.getValeur("fenetreSaisiePunition.accompagnateur");
      },
      visibiliteComboType: function () {
        return this.instance.getMoteur().genreRessource ===
          EGenreRessource.Punition
          ? { display: "" }
          : { display: "none" };
      },
      visibiliteComboAccomp: function () {
        return this.instance.getMoteur().genreRessource ===
          EGenreRessource.Punition
          ? { display: "none" }
          : { display: "" };
      },
      visibiliteChoixDuree: function () {
        if (
          this.instance.getMoteur().genreRessource !== EGenreRessource.Punition
        ) {
          return { display: "none" };
        } else if (this.instance.getMoteur().estPunitionEnDevoir()) {
          return { display: "none" };
        } else {
          return { display: "" };
        }
      },
      visibiliteChoixDate: function () {
        if (
          this.instance.getMoteur().genreRessource !== EGenreRessource.Punition
        ) {
          return { display: "none" };
        } else if (this.instance.getMoteur().estPunitionEnDevoir()) {
          return { display: "" };
        } else {
          return { display: "none" };
        }
      },
    };
  }
  surValidation(aNumeroBouton) {
    let lResult = false;
    if (aNumeroBouton > 0) {
      lResult = true;
      if (!this.enCreation && aNumeroBouton === 1) {
        this.punition.setEtat(EGenreEtat.Suppression);
      }
      let lAttribut = "listePunitions";
      if (this.genreRessource === EGenreRessource.Exclusion) {
        lAttribut = "ListeAbsences";
      }
      if (this.enCreation) {
        this.eleve[lAttribut].addElement(this.punition);
      } else {
        const lIndice = this.eleve[lAttribut].getIndiceParNumeroEtGenre(
          this.punition.getNumero(),
        );
        this.eleve[lAttribut].addElement(this.punition, lIndice);
      }
    }
    if (this.listeEleves && this.listeEleves.count() > 1) {
      let lEleve = this.listeEleves.getElementParNumero(0);
      if (lEleve) {
        lEleve.Visible = false;
      }
      lEleve = this.eleve
        ? this.listeEleves.getElementParNumero(this.eleve.getNumero())
        : null;
      if (lEleve) {
        lEleve.Visible = true;
      }
      this.listeEleves.trier();
    }
    return lResult;
  }
}
module.exports = { ObjetMoteurPunitions };
