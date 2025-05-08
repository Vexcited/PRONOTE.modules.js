const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetCalculCoursMultiple } = require("ObjetCalculCoursMultiple.js");
const { ObjetTri } = require("ObjetTri.js");
const { GDate } = require("ObjetDate.js");
const {
  UtilitaireEDTSortiePedagogique,
} = require("UtilitaireEDTSortiePedagogique.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
function UtilitaireListeCoursAccessible() {}
UtilitaireListeCoursAccessible.remplir = function (aParams) {
  const lParams = Object.assign(
    {
      listeArborescente: null,
      nodeParent: null,
      listeCours: new ObjetListeElements(),
      avecCoursAnnule: false,
      avecCoursAnnulesSuperposes: false,
      avecCoursPrevus: true,
      estEDTAnnuel: false,
      jourDeploye: false,
      getTitreJour: function (aJour, aParams) {
        return GDate.formatDate(
          aJour,
          aParams.estEDTAnnuel ? "%JJJJ" : "%JJJJ %JJ %MMMM",
        );
      },
    },
    aParams,
  );
  let lJour = null;
  let lNoeudJours;
  if (lParams.listeCours) {
    new ObjetCalculCoursMultiple().calculer({
      listeCours: lParams.listeCours,
      avecCoursAnnules: lParams.avecCoursAnnule,
      avecCoursAnnulesSuperposes: lParams.avecCoursAnnulesSuperposes,
      avecCoursPrevus: lParams.avecCoursPrevus,
      getPlaceDebutCours: function (aCours) {
        return aCours.Debut;
      },
      getPlaceFinCours: function (aCours) {
        return aCours.Fin;
      },
      estCoursDansGrille: function (aCours) {
        return !!aCours;
      },
      estEDTAnnuel: lParams.estEDTAnnuel,
    });
    const lListe = new ObjetListeElements();
    lParams.listeCours.parcourir((aCours) => {
      if (aCours.Visible !== false) {
        if (aCours.coursMultiple) {
          lListe.add(aCours.listeCours);
        } else {
          lListe.addElement(aCours);
        }
      }
    });
    lListe
      .setTri([ObjetTri.init("DateDuCours"), ObjetTri.init("estAnnule")])
      .trier();
    for (let I = 0; I < lListe.count(); I++) {
      const lCours = lListe.get(I);
      const lJourCours = lCours.DateDuCours
        ? lCours.DateDuCours
        : GDate.placeEnDateHeure(lCours.Debut);
      if (!lJour || !GDate.estJourEgal(lJour, lJourCours)) {
        lJour = GDate.getJour(lJourCours);
        lNoeudJours = lParams.listeArborescente.ajouterUnNoeudAuNoeud(
          lParams.nodeParent,
          "",
          lParams.getTitreJour(lJour, lParams),
          "Gras",
          lParams.jourDeploye,
        );
      }
      let lLibelleCours = "";
      let lNoeudCours = null;
      if (lCours.estRetenue) {
        lLibelleCours = lCours.ListeContenus.getLibelle(0);
        lParams.listeArborescente.ajouterUnNoeudAuNoeud(
          lNoeudJours,
          "",
          lLibelleCours,
          "Gras",
        );
      } else if (lCours.estSortiePedagogique) {
        lLibelleCours =
          lCours.ListeContenus.getLibelle(0) +
          " - " +
          UtilitaireEDTSortiePedagogique.strDate(lCours);
        lNoeudCours = lParams.listeArborescente.ajouterUnNoeudAuNoeud(
          lNoeudJours,
          "",
          lLibelleCours,
          "Gras",
        );
        lParams.listeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudCours,
          "",
          lCours.motif,
        );
      } else {
        const lMatiere = lCours.ListeContenus.getElementParGenre(
          EGenreRessource.Matiere,
        );
        if (lMatiere) {
          lLibelleCours =
            lMatiere.getLibelle() +
            " " +
            GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [
              GDate.formatDate(lJourCours, "%hh%sh%mm"),
              GDate.formatDate(
                GDate.placeEnDate(lCours.numeroSemaine, lCours.Fin, true),
                "%hh%sh%mm",
              ),
            ]);
          if (lCours.Statut) {
            lLibelleCours += " " + "(" + lCours.Statut + ")";
          }
          lNoeudCours = lParams.listeArborescente.ajouterUnNoeudAuNoeud(
            lNoeudJours,
            "",
            lLibelleCours,
            "Gras",
          );
          const lHtml = [];
          for (let J = 0; J < lCours.ListeContenus.count(); J++) {
            const lContenu = lCours.ListeContenus.get(J);
            if (
              lContenu.getLibelle().length &&
              lContenu.Visible !== false &&
              lContenu.getGenre() !== EGenreRessource.Matiere &&
              !lContenu.nePasImprimer
            ) {
              lHtml.push("<div>", lContenu.getLibelle(), "</div>");
            }
          }
          lParams.listeArborescente.ajouterUneFeuilleAuNoeud(
            lNoeudCours,
            "",
            lHtml.join(""),
          );
        }
      }
    }
  }
};
module.exports = { UtilitaireListeCoursAccessible };
