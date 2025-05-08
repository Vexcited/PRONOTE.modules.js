exports.DonneesListe_Forum_ListeSujets = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const tag_1 = require("tag");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_Forum_ListeSujets extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aFiltres) {
    super(aDonnees);
    this.filtres = aFiltres;
    this.setOptions({
      avecEvnt_Selection: true,
      avecEvnt_ModificationSelection: true,
    });
  }
  getControleurFiltres(aDonneesListe) {
    const lOptionsCombo = {
      longueur: "100%",
      getContenuCellule(aElement) {
        return aElement.getLibelle();
      },
      getContenuElement(aParams) {
        return aParams.element.getLibelle();
      },
    };
    const lSetElement = (aParametres) => {
      return aParametres.element &&
        aParametres.element.getNumero() !==
          aDonneesListe.filtres.c_ident_filtre_tous
        ? aParametres.element
        : null;
    };
    return {
      comboMatiere: {
        init(aCombo) {
          aCombo.setDonneesObjetSaisie({
            liste: aDonneesListe.filtres.listeMatieresDisponibles,
            options: Object.assign(
              {
                libelleHaut:
                  ObjetTraduction_1.GTraductions.getValeur("Matiere"),
              },
              lOptionsCombo,
            ),
          });
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (aDonneesListe.filtres.matiereSelec) {
            lIndice =
              aDonneesListe.filtres.listeMatieresDisponibles.getIndiceParNumeroEtGenre(
                aDonneesListe.filtres.matiereSelec.getNumero(),
              ) || 0;
          }
          return lIndice;
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle) {
            aDonneesListe.filtres.matiereSelec = lSetElement(aParametres);
            aDonneesListe.paramsListe.actualiserListe();
          }
        },
      },
      comboTheme: {
        init(aCombo) {
          aCombo.setDonneesObjetSaisie({
            liste: aDonneesListe.filtres.listeThemesDisponibles,
            options: Object.assign(
              {
                libelleHaut:
                  ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Theme"),
              },
              lOptionsCombo,
            ),
          });
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (aDonneesListe.filtres.themeSelec) {
            lIndice =
              aDonneesListe.filtres.listeThemesDisponibles.getIndiceParNumeroEtGenre(
                aDonneesListe.filtres.themeSelec.getNumero(),
              ) || 0;
          }
          return lIndice;
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle) {
            aDonneesListe.filtres.themeSelec = lSetElement(aParametres);
            aDonneesListe.paramsListe.actualiserListe();
          }
        },
      },
      comboModeration: {
        init(aCombo) {
          aCombo.setDonneesObjetSaisie({
            liste: aDonneesListe.filtres.listeModerationsDisponibles,
            options: Object.assign(
              {
                libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.TitreListeSujet",
                ),
              },
              lOptionsCombo,
            ),
          });
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (aDonneesListe.filtres.moderationSelec) {
            lIndice =
              aDonneesListe.filtres.listeModerationsDisponibles.getIndiceParNumeroEtGenre(
                aDonneesListe.filtres.moderationSelec.getNumero(),
              ) || 0;
          }
          return lIndice;
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle) {
            aDonneesListe.filtres.moderationSelec = lSetElement(aParametres);
            aDonneesListe.paramsListe.actualiserListe();
          }
        },
      },
    };
  }
  construireFiltres() {
    const H = [];
    if (
      this.filtres.listeMatieresDisponibles &&
      this.filtres.listeMatieresDisponibles.count() > 0
    ) {
      H.push(
        (0, tag_1.tag)(
          "div",
          { class: "field-contain" },
          (0, tag_1.tag)("ie-combo", {
            "ie-model": "comboMatiere",
            class: "combo-mobile on-mobile full-width",
          }),
        ),
      );
    }
    if (
      this.filtres.listeThemesDisponibles &&
      this.filtres.listeThemesDisponibles.count() > 0
    ) {
      H.push(
        (0, tag_1.tag)(
          "div",
          { class: "field-contain" },
          (0, tag_1.tag)("ie-combo", {
            "ie-model": "comboTheme",
            class: "combo-mobile on-mobile full-width",
          }),
        ),
      );
    }
    if (
      this.filtres.listeModerationsDisponibles &&
      this.filtres.listeModerationsDisponibles.count() > 0
    ) {
      H.push(
        (0, tag_1.tag)(
          "div",
          { class: "field-contain" },
          (0, tag_1.tag)("ie-combo", {
            "ie-model": "comboModeration",
            class: "combo-mobile on-mobile full-width",
          }),
        ),
      );
    }
    return H.join("");
  }
  reinitFiltres() {
    if (this.filtres.listeMatieresDisponibles) {
      this.filtres.matiereSelec = null;
    }
    if (this.filtres.listeThemesDisponibles) {
      this.filtres.themeSelec = null;
    }
    if (this.filtres.listeModerationsDisponibles) {
      this.filtres.moderationSelec = null;
    }
    this.paramsListe.actualiserListe();
  }
  estFiltresParDefaut() {
    return (
      (!this.filtres.listeMatieresDisponibles || !this.filtres.matiereSelec) &&
      (!this.filtres.listeThemesDisponibles || !this.filtres.themeSelec) &&
      (!this.filtres.listeModerationsDisponibles ||
        !this.filtres.moderationSelec)
    );
  }
  getVisible(aArticle) {
    if (this.filtres.matiereSelec) {
      const lNumeroMatiereFiltre = this.filtres.matiereSelec.getNumero();
      if (
        (aArticle.matiere &&
          lNumeroMatiereFiltre === this.filtres.c_ident_filter_aucun) ||
        (!aArticle.matiere &&
          lNumeroMatiereFiltre !== this.filtres.c_ident_filter_aucun)
      ) {
        return false;
      }
      if (
        aArticle.matiere &&
        aArticle.matiere.getNumero() !== lNumeroMatiereFiltre
      ) {
        return false;
      }
    }
    if (
      this.filtres.themeSelec &&
      aArticle.listeThemes &&
      !aArticle.listeThemes.getElementParElement(this.filtres.themeSelec)
    ) {
      return false;
    }
    if (this.filtres.moderationSelec) {
      const lFiltreRole = (aSujet, aRole) => {
        switch (aRole) {
          case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur:
            return aSujet.roles.contains(aRole);
          case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur:
            return (
              aSujet.roles.contains(
                TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
              ) &&
              !aSujet.roles.contains(
                TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
              )
            );
          case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Membre:
            return (
              aSujet.roles.contains(
                TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Membre,
              ) &&
              !aSujet.roles.contains(
                TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
              ) &&
              !aSujet.roles.contains(
                TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
              )
            );
          case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur:
            return aSujet.roles.count() === 1 && aSujet.roles.contains(aRole);
        }
      };
      if (!lFiltreRole(aArticle, this.filtres.moderationSelec.getNumero())) {
        return false;
      }
    }
    return true;
  }
  getZoneGauche(aParams) {
    return (0, tag_1.tag)("div", {
      class: "couleur-matiere ie-line-color static only-color",
      style: aParams.article.matiere
        ? `--color-line :${aParams.article.matiere.couleur};`
        : false,
    });
  }
  getTitreZonePrincipale(aParams) {
    return (
      aParams.article.titre ||
      ObjetTraduction_1.GTraductions.getValeur("ForumPeda.SansTitre")
    );
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (
      aZone ===
      ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
        .ZoneCelluleFlatDesign.infosSuppZonePrincipale
    ) {
      return `${aParams.article.strAuteur} - ${this.options.moteurForum.getStrNbParticipantsSujet(aParams.article)}`;
    }
  }
  getZoneComplementaire(aParams) {
    const H = [];
    const lHIcones = [];
    if (aParams.article.nbNonLu > 0) {
      lHIcones.push(
        (0, tag_1.tag)(
          "span",
          {
            class: "compteur-nlu",
            title: ObjetTraduction_1.GTraductions.getValeur(
              "ForumPeda.HintNouveauxPosts",
            ),
          },
          aParams.article.nbNonLu,
        ),
      );
    }
    if (aParams.article.nbAModerer > 0) {
      lHIcones.push(
        (0, tag_1.tag)("i", {
          class: "icon icon_warning_sign",
          title: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.AModerer"),
        }),
      );
    }
    if (aParams.article.nbExclus > 0) {
      lHIcones.push(
        (0, tag_1.tag)("i", {
          class: "icon icon_user mix-icon_ne_pas_deranger",
          title: ObjetTraduction_1.GTraductions.getValeur(
            "ForumPeda.HintBloque_D",
            [aParams.article.nbExclus],
          ),
        }),
      );
    }
    if (
      aParams.article.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Ferme
    ) {
      lHIcones.push(
        (0, tag_1.tag)("i", {
          class: "icon icon_time",
          title: this.options.moteurForum.getStrMessageParticipationFermee(
            aParams.article,
          ),
        }),
      );
    }
    if (
      aParams.article.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Verrou
    ) {
      lHIcones.push(
        (0, tag_1.tag)("i", {
          class: "icon icon_lock",
          title: ObjetTraduction_1.GTraductions.getValeur(
            "ForumPeda.ForumVerrouille",
          ),
        }),
      );
    }
    if (lHIcones.length > 0) {
      H.push(
        (0, tag_1.tag)("div", { class: "icones-conteneur" }, lHIcones.join("")),
      );
    }
    return H.join("");
  }
  getZoneMessage(aParams) {
    const H = [];
    if (
      aParams.article.etatPub ===
      TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu
    ) {
      H.push(
        (0, tag_1.tag)(
          "p",
          ObjetTraduction_1.GTraductions.getValeur("ForumPeda.SujetSuspendu"),
        ),
      );
    }
    if (
      aParams.article.roles.contains(
        TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
      )
    ) {
      H.push(
        (0, tag_1.tag)(
          "p",
          { class: "color-theme-foncee" },
          aParams.article.genreModeration ===
            TypesForumPedagogique_1.TypeGenreModerationForum.GMF_APriori
            ? ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.ModerationAvantPub",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.ModerationApresPub",
              ),
        ),
      );
    }
    if (aParams.article.estExclu) {
      H.push(
        (0, tag_1.tag)(
          "p",
          ObjetTraduction_1.GTraductions.getValeur(
            "ForumPeda.ParticipationBloque",
          ),
        ),
      );
    }
    return H.join("");
  }
  avecBoutonActionLigne(aParams) {
    return (
      this.options.moteurForum.getCommandesMenuContextuelSujet(aParams.article)
        .length > 0
    );
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    this.options.moteurForum.addCommandesMenuContextuelSujet(aParametres);
    aParametres.menuContextuel.setDonnees(aParametres.id);
  }
  estLigneOff(aParams) {
    return (
      aParams.article.etatPub !==
        TypesForumPedagogique_1.TypeEtatPub.EP_Ouvert ||
      aParams.article.estExclu ||
      (aParams.article.roles.count() === 1 &&
        aParams.article.roles.contains(
          TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur,
        ))
    );
  }
  getTri() {
    return [
      ObjetTri_1.ObjetTri.init(
        "dateTri",
        ObjetTri_1.ObjetTri.genreTri.Decroissant,
      ),
      ObjetTri_1.ObjetTri.init("Libelle"),
    ];
  }
}
exports.DonneesListe_Forum_ListeSujets = DonneesListe_Forum_ListeSujets;
