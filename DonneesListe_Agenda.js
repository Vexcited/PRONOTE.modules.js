const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { UtilitaireVisios } = require("UtilitaireVisiosSco.js");
const { TypeGenreEvenementAgenda } = require("TypeGenreEvenementAgenda.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
class DonneesListe_Agenda extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParametres) {
    super(aDonnees);
    if (!!aParametres) {
      this.parametres = aParametres;
    }
    this.avecPublicationPageEtablissement = GApplication.droits.get(
      TypeDroits.communication.avecPublicationPageEtablissement,
    );
    this.avecDroitSaisie = GApplication.droits.get(
      TypeDroits.agenda.avecSaisieAgenda,
    );
    this.setOptions({
      avecBoutonActionLigne: true,
      avecSelection: !!IE.estMobile,
      avecEvnt_SelectionClick: !!IE.estMobile,
      avecEllipsis: !IE.estMobile,
      avecEvnt_Creation: true,
      avecEvnt_Suppression: true,
    });
  }
  getZoneGauche(aParams) {
    const lArticle = aParams.article;
    const lDate = GDate.formatDate(lArticle.DateDebut, "%J %MMM");
    const H = [];
    H.push(
      tag(
        "time",
        {
          class: ["date-contain", "ie-line-color", "bottom"],
          style: `--color-line :${lArticle.CouleurCellule}`,
          datetime: GDate.formatDate(lArticle.DateDebut, "%MM-%JJ"),
        },
        lDate,
      ),
    );
    return H.join("");
  }
  getTitreZonePrincipale(aParams) {
    return `<div ${!IE.estMobile ? `ie-ellipsis` : ""} class="ie-titre" >${aParams.article.getLibelle()}</div>`;
  }
  getInfosSuppZonePrincipale(aParams) {
    const lArticle = aParams.article;
    const lGenreEspaceProf = [
      EGenreEspace.Professeur,
      EGenreEspace.Mobile_Professeur,
      EGenreEspace.PrimProfesseur,
      EGenreEspace.Mobile_PrimProfesseur,
    ].includes(GEtatUtilisateur.GenreEspace);
    let H = [];
    if (!!lArticle.DateDebut) {
      let lChaine = GDate.strDates(lArticle.DateDebut, lArticle.DateFin, {
        sansHoraire: lArticle.sansHoraire,
      }).trim();
      H.push(`<div class="ie-sous-titre capitalize">`);
      if (lArticle.estPeriodique && !IE.estMobile) {
        if (lArticle.periodicite.estEvtPerso) {
          H.push(
            `${lChaine} - ${tag("i", { class: "icons icon icon_refresh", "ie-hint": `<div>${GTraductions.getValeur("Agenda.EvenementModifie")}</div>` })} ${GTraductions.getValeur("Agenda.EvenementModifie")}`,
          );
        } else {
          H.push(
            tag("i", {
              class: "icons icon icon_refresh",
              "ie-hint": `<div>${GTraductions.getValeur("Agenda.AgendaHintEvtPEriodique")}</div><div>${lArticle.periodicite.libelleDescription}</div>`,
            }),
            lArticle.periodicite.libelleDescription,
          );
        }
      } else {
        H.push(lChaine);
      }
      H.push(`</div>`);
    }
    if (
      !IE.estMobile &&
      this.avecPublicationPageEtablissement &&
      lArticle.publie &&
      lArticle.publicationPageEtablissement &&
      lGenreEspaceProf &&
      (lArticle.getGenre() === TypeGenreEvenementAgenda.tgea_Standard ||
        lArticle.getGenre() ===
          TypeGenreEvenementAgenda.tgea_StandardPeriodique)
    ) {
      H.push(`<div class="ie-sous-titre capitalize">`);
      H.push(
        tag("i", {
          class: "icons icon icon_ecole",
          "ie-hint": `${GTraductions.getValeur("Fenetre_SaisieAgenda.partageSurPageEtablissement")}`,
        }),
      );
      H.push(
        GTraductions.getValeur(
          "Fenetre_SaisieAgenda.partageSurPageEtablissement",
        ),
      );
      H.push(`</div>`);
    }
    if (!!lArticle.listeEleves) {
      H.push(`<div class="ie-sous-titre">`);
      lArticle.listeEleves.map((eleve) => {
        const lIndex = lArticle.listeEleves.indexOf(eleve);
        H.push(
          `${eleve}${lIndex === lArticle.listeEleves.length - 1 ? "" : ", "} `,
        );
      });
      H.push(`</div>`);
    }
    const lAuteur =
      !IE.estMobile && !!lArticle.strAuteur
        ? `<div class="ie-sous-titre">${lArticle.strAuteur}</div>`
        : "";
    H.push(lAuteur);
    return H.join("");
  }
  getZoneMessage(aParams) {
    const lArticle = aParams.article;
    const lAvecCommentaire =
      !!lArticle.Commentaire && lArticle.Commentaire.length > 0;
    const lAvecPJ =
      (!!lArticle.listeDocJoints && lArticle.listeDocJoints.count()) ||
      (!!lArticle.listeFichiers && lArticle.listeFichiers.count());
    let H = [];
    if (!IE.estMobile) {
      if (lArticle.estConseilClasse) {
        H.push(_composeConseilClasse.call(this, lArticle));
      } else {
        let lDescription = !!lAvecCommentaire ? lArticle.Commentaire : "";
        if (GChaine.contientAuMoinsUneURL(lDescription)) {
          lDescription = GChaine.ajouterLiensURL(lDescription);
        }
        H.push(
          `<div class="m-top-xl ctn-message">${GChaine.replaceRCToHTML(lDescription)}</div>`,
        );
      }
      if (lAvecPJ) {
        H.push('<section class="ctnListeDocJoints m-top-xl">');
        lArticle.listeDocJoints.parcourir((aDocumentJoint) => {
          H.push(
            GChaine.composerUrlLienExterne({
              documentJoint: aDocumentJoint,
              genreRessource: EGenreRessource.DocJointEtablissement,
            }),
          );
        });
        if (lArticle.listeFichiers) {
          H.push(UtilitaireUrl.construireListeUrls(lArticle.listeFichiers));
        }
        H.push("</section>");
      }
    }
    return H.join("");
  }
  avecBoutonActionLigne(aParams) {
    return !!this.avecDroitSaisie && !!aParams.article.proprietaire;
  }
  getZoneComplementaire(aParams) {
    const lDecalageGauche = !IE.estMobile ? 12 : "calc(1.6rem + 16px)";
    const lEstPeriodique = aParams.article.estPeriodique;
    const lEstPublie = aParams.article.publie;
    const lListeDocJoints = aParams.article.listeDocJoints;
    const lNbrDocJoints = aParams.article.listeDocJoints
      ? aParams.article.listeDocJoints.count()
      : 0;
    const lEstProprietaire =
      !!this.avecDroitSaisie && !!aParams.article.proprietaire;
    const lHIcones = [];
    if (
      this.avecPublicationPageEtablissement &&
      aParams.article.publicationPageEtablissement &&
      lEstPublie &&
      IE.estMobile &&
      this.avecDroitSaisie
    ) {
      lHIcones.push(
        tag("i", {
          class: "icon icon_ecole",
          title: GTraductions.getValeur(
            "Fenetre_SaisieAgenda.partageSurPageEtablissement",
          ),
        }),
      );
    }
    if (lEstPeriodique && IE.estMobile) {
      lHIcones.push(
        tag("i", {
          class: "icon icon_refresh",
          title: GTraductions.getValeur("Agenda.AgendaHintEvtPEriodique"),
        }),
      );
    }
    if (lNbrDocJoints > 0 && lListeDocJoints && IE.estMobile) {
      lHIcones.push(
        tag("i", {
          class: "icon icon_piece_jointe",
          title: GTraductions.getValeur("Agenda.AgendaHintPieceJointes"),
        }),
      );
    }
    if (lEstPublie && IE.estMobile && this.avecDroitSaisie) {
      lHIcones.push(
        tag("i", {
          class: "icon icon_fiche_cours_partage",
          title: GTraductions.getValeur("Agenda.EvenementPartage"),
        }),
      );
    }
    if (IE.estMobile) {
      return lHIcones.length > 0
        ? tag(
            "div",
            {
              class: "ctn-icon",
              style: `margin-right : ${!lEstProprietaire ? lDecalageGauche : ""}`,
            },
            lHIcones.join(""),
          )
        : "";
    } else {
      if (aParams.article.publie && this.avecDroitSaisie) {
        return tag(
          "ie-chips",
          {
            tabindex: "0",
            class:
              "tag-style iconic icon_fiche_cours_partage etiquette m-right",
            "ie-hint": GTraductions.getValeur("Agenda.EvenementPartage"),
            style: !lEstProprietaire
              ? `margin-right:${lDecalageGauche}px;`
              : "",
          },
          GTraductions.getValeur("Agenda.Partage"),
        );
      }
    }
  }
  avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
    const lDate = GDate.formatDate(
      aParamsCellule.article.DateDebut,
      "[" + "%J %MMM" + "]",
    );
    const lDatePrec = GDate.formatDate(
      aParamsCellulePrec.article.DateDebut,
      "[" + "%J %MMM" + "]",
    );
    if (lDate === lDatePrec) {
      return false;
    }
    return true;
  }
  initialisationObjetContextuel(aParams) {
    if (!aParams.menuContextuel) {
      return;
    }
    if (!!this.avecDroitSaisie && !!aParams.article.proprietaire) {
      aParams.menuContextuel.add(
        GTraductions.getValeur("Modifier"),
        true,
        function () {
          this.callback.appel({
            article: aParams.article,
            genreEvenement: EGenreEvenementListe.Edition,
          });
        },
        { icon: "icon_pencil" },
      );
      aParams.menuContextuel.add(
        GTraductions.getValeur("Dupliquer"),
        !aParams.article.estPeriodique,
        function () {
          this.Donnees.parametres.eventDupliquer(aParams.article);
        },
        { icon: "icon_dupliquer" },
      );
      aParams.menuContextuel.add(
        GTraductions.getValeur("Supprimer"),
        true,
        function () {
          this.callback.appel({
            article: aParams.article,
            genreEvenement: EGenreEvenementListe.Suppression,
          });
        },
        { icon: "icon_trash" },
      );
    }
    aParams.menuContextuel.setDonnees();
  }
}
function _composeConseilClasse(aEvenement) {
  const H = [];
  const lPresidentCC = !!aEvenement.presidentCC
    ? GTraductions.getValeur("Agenda.President") +
      " : " +
      aEvenement.presidentCC
    : "";
  let lProfPrincipaux = "";
  if (
    !!aEvenement.listeProfsPrincipaux &&
    aEvenement.listeProfsPrincipaux.count() > 0
  ) {
    lProfPrincipaux =
      aEvenement.listeProfsPrincipaux.count() > 1
        ? GTraductions.getValeur("Agenda.ProfesseursPrincipaux")
        : GTraductions.getValeur("Agenda.ProfesseurPrincipal");
    lProfPrincipaux +=
      " : " + aEvenement.listeProfsPrincipaux.getTableauLibelles().join(", ");
  }
  let lParentDelegues = "";
  if (
    !!aEvenement.listeDeleguesParents &&
    aEvenement.listeDeleguesParents.count() > 0
  ) {
    lParentDelegues = GTraductions.getValeur("Agenda.ParentsDelegues") + " : ";
    lParentDelegues += aEvenement.listeDeleguesParents
      .getTableauLibelles()
      .join(", ");
  }
  let lElevesDelegues = "";
  if (
    !!aEvenement.listeDeleguesEleves &&
    aEvenement.listeDeleguesEleves.count() > 0
  ) {
    lElevesDelegues = GTraductions.getValeur("Agenda.ElevesDelegues") + " : ";
    lElevesDelegues += aEvenement.listeDeleguesEleves
      .getTableauLibelles()
      .join(", ");
  }
  H.push(
    '<div class="Espace">',
    '<ul role="list" class="list-as-menu">',
    lPresidentCC ? "<li> " + lPresidentCC + "</li>" : "",
    lProfPrincipaux ? "<li> " + lProfPrincipaux + "</li>" : "",
    lParentDelegues ? "<li> " + lParentDelegues + "</li>" : "",
    lElevesDelegues ? "<li> " + lElevesDelegues + "</li>" : "",
    "</ul>",
    "</div>",
  );
  if (aEvenement.visio && aEvenement.visio.url) {
    H.push(
      tag(
        "div",
        { class: "agenda-cc-visio" },
        tag(
          "ie-chips",
          {
            class: ["iconic", UtilitaireVisios.getNomIconePresenceVisios()],
            href: GChaine.verifierURLHttp(aEvenement.visio.url),
          },
          aEvenement.visio.libelleLien ||
            GTraductions.getValeur(
              "FenetreSaisieVisiosCours.AccederAuCoursVirtuel",
            ),
        ),
        aEvenement.visio.commentaire
          ? tag("label", GChaine.replaceRCToHTML(aEvenement.visio.commentaire))
          : "",
      ),
    );
  }
  return H.join("");
}
module.exports = { DonneesListe_Agenda };
