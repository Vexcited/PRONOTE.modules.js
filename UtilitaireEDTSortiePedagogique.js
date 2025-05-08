exports.UtilitaireEDTSortiePedagogique = UtilitaireEDTSortiePedagogique;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetChaine_1 = require("ObjetChaine");
const DetailSortiePedagogique_tsxModele_1 = require("DetailSortiePedagogique.tsxModele");
function UtilitaireEDTSortiePedagogique() {}
UtilitaireEDTSortiePedagogique.strDate = function (aAbs) {
  if (!aAbs) {
    return "";
  }
  if (aAbs.strDateFin) {
    return aAbs.strDateDebut + " " + aAbs.strDateFin;
  }
  return (
    ObjetTraduction_1.GTraductions.getValeur("Le") +
    " " +
    ObjetDate_1.GDate.formatDate(aAbs.DateDuCours, "%JJ/%MM") +
    " " +
    aAbs.strDateDebut
  );
};
UtilitaireEDTSortiePedagogique.afficherFenetreSortiePeda = function (aParams) {
  const lParams = Object.assign(
    { pere: null, cours: null, idCours: "", surFermerFenetre: null },
    aParams,
  );
  const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_1.ObjetFenetre,
    { pere: lParams.pere },
    {
      titre: ObjetChaine_1.GChaine.insecable(
        ObjetTraduction_1.GTraductions.getValeur(
          "EDT.AbsRess.SortiePedagogique",
        ) +
          " " +
          UtilitaireEDTSortiePedagogique.strDate(lParams.cours),
      ),
      modale: false,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
      idPositionnement: lParams.idCours,
      callbackApresFermer: function () {
        if (lParams.surFermerFenetre) {
          lParams.surFermerFenetre(lFenetre);
        }
        this.fenetre_SortiePedagogique = null;
      },
    },
  );
  lFenetre.afficher(
    DetailSortiePedagogique_tsxModele_1.ModeleDetailSortiePedagogique.getHtml({
      strGenreRess: lParams.cours.strGenreRess,
      strRess: lParams.cours.strRess,
      motif: lParams.cours.motif,
      strDate: UtilitaireEDTSortiePedagogique.strDate(lParams.cours),
      duree: ObjetDate_1.GDate.formatDureeEnPlaces(lParams.cours.dureeReelle),
      accompagnateurs: lParams.cours.accompagnateurs.join(", "),
      avecMemoVisible: lParams.cours.memo !== undefined,
      getMemo: function () {
        return lParams.cours.memo
          ? '<div class="dsp_texteMemo" ie-scroll><div>' +
              ObjetChaine_1.GChaine.replaceRCToHTML(lParams.cours.memo) +
              "</div></div>"
          : "";
      },
    }),
  );
  return lFenetre;
};
