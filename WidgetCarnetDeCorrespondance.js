exports.WidgetCarnetDeCorrespondance = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetCarnetDeCorrespondance extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
  }
  construire(aParams) {
    var _a;
    this.donnees = aParams.donnees;
    this.creerObjetsCarnetDeCorrespondance();
    const lWidget = {
      html: this.composeWidgetCarnetDeCorrespondance(),
      nbrElements:
        (_a = this.donnees.listeObservations) === null || _a === void 0
          ? void 0
          : _a.count(),
      afficherMessage: false,
      listeElementsGraphiques: [
        { id: this.classeCarnetDeCorrespondance.getNom() },
      ],
    };
    $.extend(true, aParams.donnees, lWidget);
    aParams.construireWidget(aParams.donnees);
    this.initialiserObjetsCarnetDeCorrespondance();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodeObservation(aNumeroObservation) {
        $(this.node).eventValidation(() => {
          aInstance._surObservation(aNumeroObservation);
        });
      },
    });
  }
  creerObjetsCarnetDeCorrespondance() {
    this.classeCarnetDeCorrespondance = ObjetIdentite_1.Identite.creerInstance(
      ObjetSaisie_1.ObjetSaisie,
      { pere: this, evenement: this._evenementClasseCarnetDeCorrespondance },
    );
    this._initialiserClasseCarnetDeCorrespondance(
      this.classeCarnetDeCorrespondance,
    );
  }
  initialiserObjetsCarnetDeCorrespondance() {
    this.classeCarnetDeCorrespondance.initialiser();
    const lParams = {
      avecClasse: true,
      avecGroupe: true,
      uniquementClasseEnseignee: true,
      avecToutes: true,
    };
    let lListeClasses =
      this.donnees.listeClassesGroupes ||
      this.etatUtilisateurSco.getListeClasses(lParams);
    if (!!lListeClasses) {
      let lCumulClasse = false;
      let lCumulGroupe = false;
      lListeClasses.parcourir((aElement) => {
        if (!lCumulClasse) {
          lCumulClasse =
            aElement.getGenre() ===
              Enumere_Ressource_1.EGenreRessource.Classe ||
            (aElement.getGenre() ===
              Enumere_Ressource_1.EGenreRessource.Groupe &&
              aElement.estClasseMN);
        }
        if (!lCumulGroupe) {
          lCumulGroupe =
            aElement.getGenre() ===
              Enumere_Ressource_1.EGenreRessource.Groupe &&
            !aElement.estClasseMN;
        }
        return !lCumulClasse || !lCumulGroupe;
      });
      if (lCumulClasse && lCumulGroupe) {
        const lClasse = ObjetElement_1.ObjetElement.create({
          Libelle: ObjetTraduction_1.GTraductions.getValeur("Classes"),
          Numero: 0,
          Genre: Enumere_Ressource_1.EGenreRessource.Classe,
        });
        lClasse.estCumul = true;
        lClasse.AvecSelection = false;
        lClasse.ClassAffichage = "Gras";
        lListeClasses.add(lClasse);
        const lGroupe = ObjetElement_1.ObjetElement.create({
          Libelle: ObjetTraduction_1.GTraductions.getValeur("Groupes"),
          Numero: 0,
          Genre: Enumere_Ressource_1.EGenreRessource.Groupe,
        });
        lGroupe.estCumul = true;
        lGroupe.ClassAffichage = "Gras";
        lGroupe.AvecSelection = false;
        lListeClasses.add(lGroupe);
      }
      lListeClasses.setTri([
        ObjetTri_1.ObjetTri.init("Genre"),
        ObjetTri_1.ObjetTri.init((D) => {
          return D.estCumul ? 0 : 1;
        }),
        ObjetTri_1.ObjetTri.init("Libelle"),
      ]);
      lListeClasses.trier();
      lListeClasses.insererElement(
        new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur("toutes"),
          0,
        ),
        0,
      );
    }
    this.classeCarnetDeCorrespondance.setDonnees(lListeClasses, 0);
  }
  actualiserWidgetCarnetDeCorrespondance(aRessource) {
    const lWidget = {
      html: this.composeWidgetCarnetDeCorrespondance(aRessource),
      nbrElements: this._nbrElevesDeRessource(aRessource),
      afficherMessage: this._nbrElevesDeRessource(aRessource) === 0,
    };
    $.extend(true, this.donnees, lWidget);
    UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
  }
  composeWidgetCarnetDeCorrespondance(aRessource) {
    const H = [];
    H.push('<ul class="liste-clickable">');
    if (this.donnees.listeObservations) {
      for (let i = 0; i < this.donnees.listeObservations.count(); i++) {
        const lObservation = this.donnees.listeObservations.get(i);
        if (this._estEleveDeRessource(lObservation, aRessource)) {
          const lClassIcon =
            Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
              Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve,
              { genreObservation: lObservation.genreObservation },
            );
          H.push(
            "<li>",
            '<a tabindex="0" title="',
            lObservation.commentaire,
            '" ie-node="nodeObservation(\'',
            lObservation.getNumero(),
            "')\"",
            ' class="wrapper-link icon ',
            lClassIcon,
            lObservation.estObservation ? " est-observation" : "",
            '">',
            '<div class="wrap">',
            "<h3>",
            lObservation.eleve.getLibelle(),
            " ",
            lObservation.classe
              ? '<span class="nom-classe">' +
                  " - " +
                  lObservation.classe.getLibelle() +
                  "</span>"
              : "",
            "</h3>",
            '<span class="date">',
            ObjetTraduction_1.GTraductions.getValeur(
              "Dates.LeDate",
              lObservation.strDate,
            ),
            "</span>",
            " - ",
            lObservation.strObservation
              ? '<span class="observation">' +
                  lObservation.strObservation +
                  "</span>"
              : "",
            "</div>",
            lObservation.strDateLue
              ? '<div class="as-read icon icon_eye_open" title="' +
                  ObjetTraduction_1.GTraductions.getValeur(
                    "accueil.carnetDeCorrespondance.vueLe",
                    [lObservation.strDateLue],
                  ) +
                  '"></div>'
              : "",
            "</a>",
            "</li>",
          );
        }
      }
    }
    H.push("</ul>");
    return H.join("");
  }
  _nbrElevesDeRessource(aRessource) {
    var _a;
    let n = 0;
    for (
      let i = 0;
      i <
      ((_a = this.donnees.listeObservations) === null || _a === void 0
        ? void 0
        : _a.count());
      i++
    ) {
      const lObservation = this.donnees.listeObservations.get(i);
      if (this._estEleveDeRessource(lObservation, aRessource)) {
        n++;
      }
    }
    return n;
  }
  _estEleveDeRessource(aObservation, aRessource) {
    if (!aRessource) {
      return true;
    }
    if (!aRessource.existeNumero()) {
      return true;
    }
    if (aRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe) {
      return aRessource.getNumero() === aObservation.classe.getNumero();
    }
    if (aRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe) {
      for (let i = 0; i < aObservation.listeGroupes.count(); i++) {
        if (aRessource.getNumero() === aObservation.listeGroupes.getNumero(i)) {
          return true;
        }
      }
    }
    return false;
  }
  _surObservation(aNumeroObservation) {
    const lObservation = this.donnees.listeObservations
      ? this.donnees.listeObservations.getElementParNumero(aNumeroObservation)
      : null;
    if (lObservation) {
      this.etatUtilisateurSco.Navigation.setRessource(
        Enumere_Ressource_1.EGenreRessource.Classe,
        lObservation.classe,
      );
      this.etatUtilisateurSco.Navigation.setRessource(
        Enumere_Ressource_1.EGenreRessource.Eleve,
        lObservation.eleve,
      );
      let lPageDestination;
      if (this.etatUtilisateurSco.estEspaceMobile()) {
        lPageDestination = { genreOngletDest: this.donnees.page.Onglet };
      } else {
        lPageDestination = this.donnees.page;
      }
      this.callback.appel(
        this.donnees.genre,
        Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
        lPageDestination,
      );
    }
  }
  _initialiserClasseCarnetDeCorrespondance(aObjet) {
    aObjet.setOptionsObjetSaisie({
      longueur: 100,
      avecBoutonsPrecSuiv: true,
      avecBoutonsPrecSuivVisiblesInactifs: false,
      labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
        "WAI.ListeSelectionClasse",
      ),
    });
  }
  _evenementClasseCarnetDeCorrespondance(aParams) {
    if (
      aParams.element &&
      aParams.genreEvenement ===
        Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
    ) {
      this.actualiserWidgetCarnetDeCorrespondance(aParams.element);
    }
  }
}
exports.WidgetCarnetDeCorrespondance = WidgetCarnetDeCorrespondance;
