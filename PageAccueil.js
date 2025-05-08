const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const { EGenreWidget } = require("Enumere_Widget.js");
const { GHtml } = require("ObjetHtml.js");
const { Identite } = require("ObjetIdentite.js");
const { UtilitaireWidget } = require("UtilitaireWidget.js");
const { ObjetMoteurAccueil } = require("ObjetMoteurAccueilPN.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetDiscussion_Mobile } = require("ObjetDiscussion_Mobile.js");
const { EGenreEvenementWidget } = require("Enumere_EvenementWidget.js");
const { tag } = require("tag.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { TypeCollectivite } = require("TypeCollectivite.js");
const { ThemesCouleurs } = require("ThemesCouleurs.js");
class ObjetAccueil extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteur = new ObjetMoteurAccueil();
    this.donneesRecues = false;
    this.autorisationVS = null;
    if (GEtatUtilisateur.pourPrimaire()) {
      this.listeGenreWidgets = getListeWidgetsMobilePourPrimaire(
        GEtatUtilisateur.GenreEspace,
      );
    } else {
      this.listeGenreWidgets = getListeWidgetsMobile(
        GEtatUtilisateur.GenreEspace,
      );
    }
    this.construireDeclarationsWidgets();
    this.utilitaireAbsence = new ObjetUtilitaireAbsence();
    this.premierChargement = true;
    this.instancesWidgets = {};
    this.idEcranPrincipal = this.Nom + "_ecranPrincipal";
    this.idEcranSecondaire = this.Nom + "_ecranSecondaire";
  }
  construireDeclarationsWidgets() {
    this.donnees = {};
    for (let i = 0; i < this.listeGenreWidgets.length; i++) {
      const lObjDeclarationWidget = getDeclarationWidget.call(
        this,
        this.listeGenreWidgets[i],
      );
      if (!!lObjDeclarationWidget) {
        this.donnees[lObjDeclarationWidget.nomDonnees] = lObjDeclarationWidget;
      }
    }
  }
  getDonneesDeWidget(aGenre) {
    const lDeclarationWidget = getDeclarationWidget.call(this, aGenre);
    if (!!lDeclarationWidget && !!lDeclarationWidget.nomDonnees) {
      return this.donnees[lDeclarationWidget.nomDonnees];
    }
    return null;
  }
  surActualiser(aGenreWidget) {
    this.surEvenementWidget(
      aGenreWidget,
      EGenreEvenementWidget.ActualiserWidget,
    );
  }
  detruireInstances() {}
  setDonnees(
    aDonnees,
    aNumeroSemaineParDefaut,
    aDonneesRequete,
    aDateParDefaut,
  ) {
    $.extend(true, this.donnees, aDonnees);
    this.donneesRecues = true;
    this.moteur.setSemaineSelectionnee(aNumeroSemaineParDefaut);
    this.moteur.setDateParDefaut(aDateParDefaut);
    this.donneesRequete = aDonneesRequete;
    const lScroll = $("#div").get(0).scrollTop;
    this.afficher();
    UtilitaireWidget.setParametres({
      avecFermer: false,
      avecToutVoir: true,
      avecCompteur: [
        EGenreEspace.Mobile_Professeur,
        EGenreEspace.Mobile_Etablissement,
        EGenreEspace.Mobile_Administrateur,
        EGenreEspace.Mobile_PrimProfesseur,
        EGenreEspace.Mobile_PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace),
    });
    Object.keys(this.donnees).forEach((aKey) => {
      const lWidget = this.donnees[aKey];
      if (
        lWidget &&
        lWidget.construireInstance &&
        !!lWidget.existeWidget &&
        lWidget.existeWidget.call(this)
      ) {
        lWidget.construireInstance(lWidget);
      }
    });
    GEtatUtilisateur.premierChargement = false;
    $("#div").get(0).scrollTop = lScroll;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnMessagePrimEleve: {
        event() {
          ObjetDiscussion_Mobile.creerDiscussionEnFenetre();
        },
      },
      btnEcrireMairie: {
        getNode: function () {
          $(this.node).eventValidation(() => {
            UtilitaireMessagerie.creerDiscussionAvecMairie(
              ObjetFenetre_Message,
              aInstance,
            );
          });
        },
      },
      styleCollectivite() {
        const lEstDarkMode = ThemesCouleurs.getDarkMode();
        const lUrl =
          lEstDarkMode && GParametres.collectivite.logo.siteMobile.sombre
            ? GParametres.collectivite.logo.siteMobile.sombre
            : GParametres.collectivite.logo.siteMobile.clair;
        return {
          "background-image": `url("./${lUrl}")`,
          "background-position": "center",
          "background-color": "transparent",
          "background-size": "contain",
          "background-repeat": "no-repeat",
          height: "10rem",
        };
      },
      nodeCollectivite: function () {
        if (
          GParametres.collectivite &&
          GParametres.collectivite.urlCollectivite
        ) {
          $(this.node).eventValidation(() => {
            window.open(GParametres.collectivite.urlCollectivite);
          });
        }
      },
    });
  }
  construireAffichage() {
    if (!this.donneesRecues) {
      return "";
    }
    const lHtml = [];
    lHtml.push(
      '<div id="',
      this.idEcranPrincipal,
      '" class="global-mobile-container">',
    );
    switch (GEtatUtilisateur.GenreEspace) {
      case EGenreEspace.Mobile_PrimParent: {
        lHtml.push('<div class="bandeau-boutons">');
        if (
          GApplication.droits.get(TypeDroits.absences.avecDeclarerUneAbsence)
        ) {
          lHtml.push(
            '<ie-bouton  ie-icon="icon_absences_prevue" class="theme-bt-accueil-primaire" onclick="',
            this.Nom,
            '.ajouterAbsence()">',
            GTraductions.getValeur("AbsenceVS.SaisirAbsenceParentPrim"),
            "</ie-bouton>",
          );
        }
        if (
          GEtatUtilisateur.Identification.ListeRessources &&
          GEtatUtilisateur.Identification.ListeRessources.count() > 0 &&
          GApplication.droits.get(TypeDroits.communication.avecDiscussion)
        ) {
          lHtml.push(
            '<ie-bouton ie-icon="icon_carnet_liaison" class="theme-bt-accueil-primaire" onclick="',
            this.Nom,
            '.btnMessageCarnet()">',
            GTraductions.getValeur("fenetreCommunication.ecrireEnseignant"),
            "</ie-bouton>",
          );
          if (
            GEtatUtilisateur.Identification.ressource
              .destinatairePersonnelsMairie &&
            GEtatUtilisateur.Identification.ressource.destinatairePersonnelsMairie.count()
          ) {
            lHtml.push(
              '  <ie-bouton ie-node="btnEcrireMairie.getNode" ie-icon="icon_mairie" class="theme-bt-accueil-primaire" title="',
              GTraductions.getValeur(
                "fenetreCommunication.nouveauMessageMairie",
              ),
              '">',
              GTraductions.getValeur("fenetreCommunication.ecrireMairie"),
              "</ie-bouton>",
            );
          }
        }
        lHtml.push("</div>");
        break;
      }
      case EGenreEspace.Mobile_PrimEleve: {
        const lLibelleRaccourci =
          UtilitaireMessagerie.getLibelleRaccourciMessPrimEleve();
        if (lLibelleRaccourci) {
          lHtml.push(
            tag(
              "div",
              { class: "bandeau-boutons messagerie" },
              tag(
                "ie-bouton",
                {
                  "ie-model": "btnMessagePrimEleve",
                  "ie-icon": "icon_discussion_cours",
                  class: "theme-bt-accueil-primaire",
                  "aria-haspopup": "dialog",
                },
                lLibelleRaccourci,
              ),
            ),
          );
        }
        break;
      }
    }
    const lAvecImageCollectivite =
      !GApplication.estPrimaire &&
      GParametres.collectivite &&
      "genreCollectivite" in GParametres.collectivite &&
      GParametres.collectivite.genreCollectivite !==
        TypeCollectivite.TCL_Aucune &&
      GParametres.collectivite.logo &&
      GParametres.collectivite.logo.siteMobile;
    if (lAvecImageCollectivite) {
      lHtml.push(
        `<div class="p-top-l"><div ie-style="styleCollectivite" ie-node="nodeCollectivite" class="m-bottom-xl m-top-l"></div></div>`,
      );
    }
    for (let i = 0; i < this.listeGenreWidgets.length; i++) {
      const lDonnees = this.getDonneesDeWidget(this.listeGenreWidgets[i]);
      if (lDonnees) {
        lHtml.push(this.composeSection(lDonnees));
      }
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  ajouterAbsence() {
    GEtatUtilisateur.setPage({
      Onglet: EGenreOnglet.VieScolaire_Recapitulatif,
      executerSaisieAbsenceParent: true,
      retourAccueil: true,
    });
    if (GEtatUtilisateur.getGenreOnglet()) {
      const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
      if (
        GEtatUtilisateur.listeOngletsInvisibles.indexOf(lGenreOnglet) === -1
      ) {
        this.surEvenementWidget(
          null,
          EGenreEvenementWidget.NavigationVersPage,
          { genreOngletDest: lGenreOnglet },
        );
      }
    }
  }
  btnMessageCarnet() {
    ObjetDiscussion_Mobile.creerCarnetDeLiaisonPrimParent();
  }
  composeSection(aWidget) {
    const lHtml = [];
    function _composeCorps(aFonction, aAvecDonnees) {
      const liResult = [];
      liResult.push(
        '<article role="region" aria-labelledby="' +
          aWidget.id +
          '_TitreText" class="widget ' +
          aWidget.themeCategorie +
          " " +
          aWidget.nomDonnees.toLowerCase() +
          '">',
      );
      liResult.push(
        '<div id="' + aWidget.id + '_contenu" class="',
        "card-container",
        !aAvecDonnees ? " card-nodata" : "",
        '" tabindex="0">',
        "</div>",
        "</article>",
      );
      return liResult.join("");
    }
    if (
      !!aWidget &&
      !!aWidget.existeWidget &&
      aWidget.existeWidget.call(this)
    ) {
      const lEstAvecDonnees = aWidget.existeDonnees
        ? aWidget.existeDonnees.call(this)
        : true;
      lHtml.push(_composeCorps(aWidget.construire, lEstAvecDonnees));
    }
    return lHtml.join("");
  }
  surToutVoir(aGenreWidget) {
    const lWidget = this.getDonneesDeWidget(aGenreWidget);
    const lPage = lWidget.getPage ? lWidget.getPage() : lWidget.page;
    if (!!lWidget.dateSelectionnee) {
      const lDateSelectionnee = lWidget.dateSelectionnee.call(this);
      if (!!lDateSelectionnee) {
        GEtatUtilisateur.setDerniereDate(lDateSelectionnee);
      }
    }
    if (!!lWidget.jourSelectionne) {
      GEtatUtilisateur.setNavigationDate(lWidget.jourSelectionne);
    }
    if (GEtatUtilisateur.listeOngletsInvisibles.indexOf(lPage.Onglet) === -1) {
      this.surEvenementWidget(
        aGenreWidget,
        EGenreEvenementWidget.NavigationVersPage,
        { genreOngletDest: lPage.Onglet, page: lPage },
      );
    }
  }
  surEvenementWidget(aGenreWidgetSource, aGenreEvenement, aDonnees) {
    switch (aGenreEvenement) {
      case EGenreEvenementWidget.NavigationVersPage:
        this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
        break;
      case EGenreEvenementWidget.SaisieWidget:
        this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
        break;
      case EGenreEvenementWidget.AfficherExecutionQCM:
        this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
        break;
      case EGenreEvenementWidget.ActualiserWidget:
        this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
        break;
    }
  }
  _surAction(aGenreWidget) {
    const lWidget = this.getDonneesDeWidget(aGenreWidget);
    const lPage = lWidget.action;
    if (GEtatUtilisateur.listeOngletsInvisibles.indexOf(lPage.Onglet) === -1) {
      this.surEvenementWidget(
        aGenreWidget,
        EGenreEvenementWidget.NavigationVersPage,
        { genreOngletDest: lPage.Onglet },
      );
    }
  }
  composeAucuneDonnees(aMessage) {
    return '<div class="no-events"><p>' + aMessage + "</p></div>";
  }
}
function getListeWidgetsMobilePourPrimaire(aGenreUtilisateur) {
  const result = [];
  switch (aGenreUtilisateur) {
    case EGenreEspace.Mobile_PrimProfesseur:
      result.push(
        EGenreWidget.penseBete,
        EGenreWidget.RetourEspace,
        EGenreWidget.lienUtile,
      );
      result.push(EGenreWidget.TAFEtActivites);
      if (GParametres.activerBlog) {
        result.push(EGenreWidget.blog_filActu);
      }
      result.push(
        EGenreWidget.actualites,
        EGenreWidget.agenda,
        EGenreWidget.kiosque,
      );
      break;
    case EGenreEspace.Mobile_PrimDirection:
      result.push(
        EGenreWidget.penseBete,
        EGenreWidget.RetourEspace,
        EGenreWidget.lienUtile,
      );
      if (GParametres.activerBlog) {
        result.push(EGenreWidget.blog_filActu);
      }
      result.push(
        EGenreWidget.agenda,
        EGenreWidget.incidents,
        EGenreWidget.donneesVS,
        EGenreWidget.registreAppel,
        EGenreWidget.previsionnelAbsServiceAnnexe,
        EGenreWidget.Intendance_Execute,
        EGenreWidget.tachesSecretariat_Execute,
      );
      break;
    case EGenreEspace.Mobile_PrimParent:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.QCM,
        EGenreWidget.evenementRappel,
        EGenreWidget.TAFPrimaire,
        EGenreWidget.vieScolaire,
        EGenreWidget.competences,
        EGenreWidget.actualites,
      );
      if (GParametres.activerBlog) {
        result.push(EGenreWidget.blog_filActu);
      }
      result.push(
        EGenreWidget.agenda,
        EGenreWidget.activite,
        EGenreWidget.lienUtile,
        EGenreWidget.menuDeLaCantine,
        EGenreWidget.partenaireFAST,
        EGenreWidget.partenaireAgate,
      );
      break;
    case EGenreEspace.Mobile_PrimEleve:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.QCM,
        EGenreWidget.TAFPrimaire,
        EGenreWidget.competences,
      );
      if (GParametres.activerBlog) {
        result.push(EGenreWidget.blog_filActu);
      }
      result.push(
        EGenreWidget.kiosque,
        EGenreWidget.activite,
        EGenreWidget.lienUtile,
        EGenreWidget.menuDeLaCantine,
      );
      break;
    case EGenreEspace.Mobile_PrimAccompagnant:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.lienUtile,
        EGenreWidget.TAFPrimaire,
      );
      if (GParametres.activerBlog) {
        result.push(EGenreWidget.blog_filActu);
      }
      result.push(
        EGenreWidget.competences,
        EGenreWidget.vieScolaire,
        EGenreWidget.EDT,
        EGenreWidget.kiosque,
        EGenreWidget.menuDeLaCantine,
      );
      break;
    case EGenreEspace.Mobile_PrimPeriscolaire:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.lienUtile,
        EGenreWidget.actualites,
        EGenreWidget.agenda,
      );
      break;
    case EGenreEspace.Mobile_PrimMairie:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.lienUtile,
        EGenreWidget.previsionnelAbsServiceAnnexe,
        EGenreWidget.actualites,
        EGenreWidget.agenda,
      );
      break;
    default:
      break;
  }
  return result;
}
function getListeWidgetsMobile(aGenreUtilisateur) {
  const result = [];
  switch (aGenreUtilisateur) {
    case EGenreEspace.Mobile_Eleve:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireCDI,
        EGenreWidget.partenaireARD,
        EGenreWidget.DS,
        EGenreWidget.DSEvaluation,
        EGenreWidget.QCM,
        EGenreWidget.travailAFaire,
        EGenreWidget.enseignementADistance,
        EGenreWidget.EDT,
        EGenreWidget.notes,
        EGenreWidget.competences,
        EGenreWidget.vieScolaire,
        EGenreWidget.agenda,
        EGenreWidget.kiosque,
      );
      break;
    case EGenreEspace.Mobile_Parent:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireCDI,
        EGenreWidget.partenaireARD,
        EGenreWidget.partenaireAgate,
        EGenreWidget.DS,
        EGenreWidget.DSEvaluation,
        EGenreWidget.travailAFaire,
        EGenreWidget.enseignementADistance,
        EGenreWidget.vieScolaire,
        EGenreWidget.EDT,
        EGenreWidget.notes,
        EGenreWidget.competences,
        EGenreWidget.agenda,
        EGenreWidget.kiosque,
      );
      break;
    case EGenreEspace.Mobile_Professeur:
      result.push(
        EGenreWidget.penseBete,
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireCDI,
        EGenreWidget.partenaireARD,
        EGenreWidget.partenaireAgate,
        EGenreWidget.EDT,
        EGenreWidget.RemplacementsEnseignants,
        EGenreWidget.personnelsAbsents,
        EGenreWidget.appelNonFait,
        EGenreWidget.CDTNonSaisi,
        EGenreWidget.Intendance_Execute,
        EGenreWidget.maintenanceInfoExecute,
        EGenreWidget.agenda,
        EGenreWidget.kiosque,
        EGenreWidget.exclusions,
      );
      break;
    case EGenreEspace.Mobile_Administrateur:
      result.push(
        EGenreWidget.penseBete,
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireCDI,
        EGenreWidget.partenaireARD,
        EGenreWidget.partenaireAgate,
        EGenreWidget.agenda,
        EGenreWidget.incidents,
        EGenreWidget.donneesVS,
        EGenreWidget.donneesProfs,
        EGenreWidget.modificationEDT,
        EGenreWidget.coursNonAssures,
        EGenreWidget.personnelsAbsents,
        EGenreWidget.connexionsEnCours,
        EGenreWidget.Intendance_Execute,
        EGenreWidget.tachesSecretariat_Execute,
        EGenreWidget.maintenanceInfoExecute,
        EGenreWidget.exclusions,
      );
      break;
    case EGenreEspace.Mobile_Etablissement:
      result.push(
        EGenreWidget.penseBete,
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.EDT,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireCDI,
        EGenreWidget.partenaireARD,
        EGenreWidget.partenaireAgate,
        EGenreWidget.incidents,
        EGenreWidget.coursNonAssures,
        EGenreWidget.personnelsAbsents,
        EGenreWidget.appelNonFait,
        EGenreWidget.Intendance_Execute,
        EGenreWidget.tachesSecretariat_Execute,
        EGenreWidget.maintenanceInfoExecute,
        EGenreWidget.agenda,
      );
      break;
    case EGenreEspace.Mobile_Accompagnant:
      result.push(
        EGenreWidget.RetourEspace,
        EGenreWidget.elections,
        EGenreWidget.lienUtile,
        EGenreWidget.partenaireARD,
        EGenreWidget.partenaireAgate,
        EGenreWidget.DS,
        EGenreWidget.DSEvaluation,
        EGenreWidget.travailAFaire,
        EGenreWidget.enseignementADistance,
        EGenreWidget.vieScolaire,
        EGenreWidget.EDT,
        EGenreWidget.notes,
        EGenreWidget.competences,
        EGenreWidget.agenda,
        EGenreWidget.kiosque,
      );
      break;
    case EGenreEspace.Mobile_Tuteur:
      break;
    default:
      break;
  }
  return result;
}
function getDeclarationWidget(aGenreWidget) {
  this.moteur.setDonnees(this.donnees);
  let result;
  switch (aGenreWidget) {
    case EGenreWidget.EDT:
    case EGenreWidget.activite:
    case EGenreWidget.actualites:
    case EGenreWidget.aide:
    case EGenreWidget.agenda:
    case EGenreWidget.appelNonFait:
    case EGenreWidget.carnetDeCorrespondance:
    case EGenreWidget.casier:
    case EGenreWidget.CDTNonSaisi:
    case EGenreWidget.conseilDeClasse:
    case EGenreWidget.competences:
    case EGenreWidget.connexionsEnCours:
    case EGenreWidget.coursNonAssures:
    case EGenreWidget.DS:
    case EGenreWidget.DSEvaluation:
    case EGenreWidget.donneesProfs:
    case EGenreWidget.donneesVS:
    case EGenreWidget.registreAppel:
    case EGenreWidget.previsionnelAbsServiceAnnexe:
    case EGenreWidget.elections:
    case EGenreWidget.enseignementADistance:
    case EGenreWidget.exclusions:
    case EGenreWidget.incidents:
    case EGenreWidget.Intendance_Execute:
    case EGenreWidget.maintenanceInfoExecute:
    case EGenreWidget.kiosque:
    case EGenreWidget.lienUtile:
    case EGenreWidget.menuDeLaCantine:
    case EGenreWidget.notes:
    case EGenreWidget.partenaireCDI:
    case EGenreWidget.partenaireAgate:
    case EGenreWidget.partenaireARD:
    case EGenreWidget.partenaireFAST:
    case EGenreWidget.penseBete:
    case EGenreWidget.personnelsAbsents:
    case EGenreWidget.QCM:
    case EGenreWidget.ressources:
    case EGenreWidget.ressourcePedagogique:
    case EGenreWidget.RetourEspace:
    case EGenreWidget.tableauDeBord:
    case EGenreWidget.tachesSecretariat_Execute:
    case EGenreWidget.travailAFaire:
    case EGenreWidget.TAFARendre:
    case EGenreWidget.TAFPrimaire:
    case EGenreWidget.vieScolaire:
    case EGenreWidget.blog_filActu:
    case EGenreWidget.evenementRappel:
    case EGenreWidget.TAFEtActivites:
    case EGenreWidget.modificationEDT:
    case EGenreWidget.RemplacementsEnseignants:
      result = this.moteur.getDeclarationWidget(aGenreWidget);
      break;
    default:
      break;
  }
  if (result) {
    if (!result.construire) {
      result.construire = function () {
        return "";
      };
    }
    if (result.classWidget !== undefined) {
      result.construireInstance = _construireInstanceWidget.bind(this);
      const lFonctionExisteeWidget = result.existeWidget;
      result.existeWidget = function () {
        return (
          !!result.classWidget &&
          (!lFonctionExisteeWidget || lFonctionExisteeWidget.call(this))
        );
      }.bind(this);
    }
  }
  return result;
}
function _construireInstanceWidget(aDonneesWidget) {
  if (this.instancesWidgets[aDonneesWidget.genre]) {
    this.instancesWidgets[aDonneesWidget.genre].free();
  }
  try {
    this.instancesWidgets[aDonneesWidget.genre] = Identite.creerInstance(
      aDonneesWidget.classWidget,
      { pere: this, evenement: this.surEvenementWidget },
    );
  } catch (e) {
    this.instancesWidgets[aDonneesWidget.genre] = null;
    console.error(e);
    return;
  }
  Object.assign(this.instancesWidgets[aDonneesWidget.genre], {
    donneesRequete: this.Pere.donneesRequete,
    numeroSemaineParDefaut: this.Pere.numeroSemaineParDefaut,
  });
  try {
    this.instancesWidgets[aDonneesWidget.genre].construire({
      instance: this,
      donnees: aDonneesWidget,
      construireWidget: _construireWidget.bind(this),
    });
  } catch (e) {
    console.error(e);
  }
}
function _construireWidget(aParams) {
  const lThis = this;
  const lInstanceWidget = this.instancesWidgets[aParams.genre];
  lInstanceWidget.controleur.boutons = {
    surToutVoir(aGenreWidget) {
      $(this.node).eventValidation(() => {
        lThis.surToutVoir(aGenreWidget);
      });
    },
    surActualiser(aGenreWidget) {
      $(this.node).eventValidation(() => {
        lThis.surActualiser(aGenreWidget);
      });
    },
  };
  GHtml.setHtml(
    aParams.id + "_contenu",
    UtilitaireWidget.composeWidget(aParams),
    { instance: lInstanceWidget || this },
  );
  UtilitaireWidget.actualiserFooter(aParams);
  UtilitaireWidget.afficherMasquerListe(aParams);
}
module.exports = ObjetAccueil;
