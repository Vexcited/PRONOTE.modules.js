const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  ObjetRequeteRessourcePedagogique,
} = require("ObjetRequeteRessourcePedagogique.js");
const {
  ObjetRequeteSaisieRessourcePedagogique,
} = require("ObjetRequeteSaisieRessourcePedagogique.js");
const {
  _InterfaceRessourcePedagogique,
} = require("_InterfaceRessourcePedagogique.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_SelectionMatiere,
} = require("ObjetFenetre_SelectionMatiere.js");
const {
  ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const {
  DonneesListe_RessourcesPedagogiquesProfesseur,
} = require("DonneesListe_RessourcesPedagogiquesProfesseur.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  EGenreRessourcePedagogique,
  EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
  ObjetFenetre_SelectionImportRessourcePedagogique,
} = require("ObjetFenetre_SelectionImportRessourcePedagogique.js");
const {
  ObjetFenetre_SelectionRessourcePedagogique,
} = require("ObjetFenetre_SelectionRessourcePedagogique.js");
const { ObjetFenetre_ListeTAFFaits } = require("ObjetFenetre_ListeTAFFaits.js");
const { TypeBoutonFenetreTAFFaits } = require("ObjetFenetre_ListeTAFFaits.js");
const { ObjetFenetre_EditionUrl } = require("ObjetFenetre_EditionUrl.js");
const {
  ObjetRequeteListeTousLesThemes,
} = require("ObjetRequeteListeTousLesThemes.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre_ListeThemes } = require("ObjetFenetre_ListeThemes.js");
const {
  ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
class InterfaceRessourcePedagogique_Professeur extends _InterfaceRessourcePedagogique {
  constructor(...aParams) {
    super(...aParams);
    this.idTout = this.Nom + "_tout";
    this.idMessage = this.Nom + "_mess";
    this.pourPartage =
      GEtatUtilisateur.getGenreOnglet() ===
      EGenreOnglet.RessourcePedagogique_Partage;
    if (
      GEtatUtilisateur.getOnglet().uniquementMatieresEnseignees === undefined
    ) {
      GEtatUtilisateur.getOnglet().uniquementMatieresEnseignees = true;
    }
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evenementSurDernierMenuDeroulant,
      _initialiserTripleCombo,
    );
    this.identListe = this.add(
      ObjetListe,
      _evenementSurListe.bind(this),
      _initialiserListe,
    );
  }
  _actualiserAffichage() {
    const lListe = this.getInstance(this.identListe);
    const lListePublics = _getListePublicsSelectionnes.call(this);
    if (!GEtatUtilisateur.Navigation.avecGenresRessourcePedagogique) {
      GEtatUtilisateur.Navigation.avecGenresRessourcePedagogique =
        new TypeEnsembleNombre()
          .add(EGenreRessourcePedagogique.documentJoint)
          .add(EGenreRessourcePedagogique.site)
          .add(EGenreRessourcePedagogique.QCM)
          .add(EGenreRessourcePedagogique.sujet)
          .add(EGenreRessourcePedagogique.corrige)
          .add(EGenreRessourcePedagogique.travailRendu)
          .add(EGenreRessourcePedagogique.kiosque)
          .add(EGenreRessourcePedagogique.documentCloud);
    }
    this.parametres = {
      avecGenres: GEtatUtilisateur.Navigation.avecGenresRessourcePedagogique,
    };
    lListe.setOptionsListe({
      avecLigneCreation:
        GApplication.droits.get(
          TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
        ) &&
        (!this.pourPartage || lListePublics.count() === 1),
      titreCreation: this.pourPartage
        ? GTraductions.getValeur("RessourcePedagogique.AjouterUneRscePartagee")
        : GTraductions.getValeur("RessourcePedagogique.AjouterUneRessource"),
    });
    lListe.setDonnees(
      new DonneesListe_RessourcesPedagogiquesProfesseur({
        donnees: this.listeRessources,
        pourPartage: this.pourPartage,
        afficherCumul: this.afficherCumul,
        publics: lListePublics,
        genreAffiches: this.parametres.avecGenres,
        listeMatieresParRessource: this.listeMatieresParRessource,
        evenementMenuContextuel: _evenementSurMenuContextuel.bind(this),
        getParamMenuContextuelSelecFile:
          _getParamMenuContextuelSelecFile.bind(this),
        callbackSurAjout: () => {
          this.ouvrirFenetreCreation();
        },
      }),
    );
  }
  ouvrirFenetreCreation() {
    const lThis = this;
    const lTabActions = [];
    if (!lThis.pourPartage) {
      lTabActions.push({
        libelle: GTraductions.getValeur(
          "RessourcePedagogique.AjoutParmiDocumentsAutreClasse",
        ),
        icon: "icon_file_alt",
        event() {
          ouvrirFenetreAjoutDocumentDepuisAutreClasse.call(lThis);
        },
        class: "bg-util-vert-claire",
      });
    }
    lTabActions.push({
      libelle: IE.estMobile
        ? GTraductions.getValeur("RessourcePedagogique.AjoutDepuisMesDocuments")
        : GTraductions.getValeur("RessourcePedagogique.AjoutDepuisMonPoste"),
      icon: "icon_folder_open",
      selecFile: true,
      optionsSelecFile: _getOptionsSelecFile(false),
      event(aParamsInput) {
        if (aParamsInput) {
          const lParametres = {
            type: DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
              .ajoutDoc,
            element: null,
          };
          _evenementInputFile.call(lThis, aParamsInput, lParametres);
        }
      },
      class: "bg-util-marron-claire",
    });
    lTabActions.push({
      libelle: GTraductions.getValeur(
        "RessourcePedagogique.AjoutDepuisMesSauvegardes",
      ),
      icon: "icon_upload_alt",
      selecFile: true,
      optionsSelecFile: _getOptionsSelecFile(true),
      event(aParamsInput) {
        if (aParamsInput) {
          const lParametres = {
            type: DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
              .ajoutSauvegarde,
            element: null,
          };
          _evenementInputFile.call(lThis, aParamsInput, lParametres);
        }
      },
      class: "bg-util-marron-claire",
    });
    lTabActions.push({
      libelle: GTraductions.getValeur("RessourcePedagogique.AjoutNouveauLien"),
      icon: "icon_globe mix-icon_plus",
      event() {
        ouvrirFenetreEditionSite.call(lThis);
      },
      class: "bg-util-bleu-claire",
    });
    ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, { pere: this });
  }
  afficherPage() {
    _envoieRequete.call(this, true);
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
  }
  getPrioriteAffichageBandeauLargeur() {
    return [];
  }
  evenementAfficherMessage(aGenreMessage) {
    GHtml.setDisplay(this.idTout, false);
    GHtml.setDisplay(this.idMessage, true);
    GHtml.setHtml(
      this.idMessage,
      this.composeMessage(GTraductions.getValeur("Message")[aGenreMessage]),
      { controleur: this.controleur },
    );
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      `<section id="${this.idTout}" style="display:none;" class="ly-cols-1">`,
    );
    H.push(
      `<header>${this.composerCBs(true, true, !this.pourPartage, true)}</header>`,
    );
    H.push(
      `<div class="content-bloc fluid-bloc p-all-l" id="${this.getNomInstance(this.identListe)}"></div>`,
    );
    H.push(`</section>`);
    H.push(
      '<div id="',
      this.idMessage,
      '" class="GrandEspace" style="display:none;"></div>',
    );
    return H.join("");
  }
  valider() {
    _saisie.call(this);
  }
}
function _evenementSurDernierMenuDeroulant() {
  _envoieRequete.call(this);
}
function _initialiserListe(aInstance) {
  const lColonnesCachees = [];
  if (this.pourPartage) {
    lColonnesCachees.push(
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public,
    );
  } else {
    lColonnesCachees.push(
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.proprietaire,
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif,
    );
  }
  if (!GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
    lColonnesCachees.push(
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes,
    );
  }
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
        taille: 21,
        titre: "",
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
        taille: ObjetListe.initColonne(100, 300, 500),
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.document"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes,
        taille: 80,
        titre: GTraductions.getValeur("Themes"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
        taille: ObjetListe.initColonne(100, 200, 400),
        titre: GTraductions.getValeur(
          "RessourcePedagogique.colonne.commentaire",
        ),
        hint: GTraductions.getValeur(
          "RessourcePedagogique.hintColonne.commentaire",
        ),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public,
        taille: 80,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.public"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.proprietaire,
        taille: 200,
        titre: GTraductions.getValeur(
          "RessourcePedagogique.colonne.proprietaire",
        ),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date,
        taille: 70,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.deposeLe"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif,
        taille: 60,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.modif"),
        hint: GTraductions.getValeur("RessourcePedagogique.hintColonne.modif"),
      },
    ],
    colonnesCachees: lColonnesCachees,
  });
  GEtatUtilisateur.setTriListe({
    liste: aInstance,
    tri: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
  });
}
function _getGenrePublicSelection() {
  return this.pourPartage ? EGenreRessource.Matiere : EGenreRessource.Classe;
}
function _initialiserTripleCombo(aInstance) {
  aInstance.setParametres([_getGenrePublicSelection.call(this)], true);
  aInstance.setControleNavigation(false);
}
function _surModification_AjouterDestinatairesDansRessource(
  aRessource,
  aListeNiveaux,
) {
  const lPourPartage = this.pourPartage;
  const lDestinataires = lPourPartage
    ? aListeNiveaux
    : _getListePublicsSelectionnes.call(this);
  this.setEtatSaisie(true);
  aRessource.setEtat(EGenreEtat.Modification);
  let lAvecAjout = false;
  lDestinataires.parcourir((aDestinataire) => {
    const lListe = lPourPartage
      ? aRessource.listeNiveaux
      : aRessource.listePublics;
    const lTrouve = lListe.getElementParElement(aDestinataire);
    if (!lTrouve || !lTrouve.existe()) {
      lAvecAjout = true;
      const lDestinataireAjoute = new ObjetElement(
        aDestinataire.getLibelle(),
        aDestinataire.getNumero(),
        aDestinataire.getGenre(),
      );
      lDestinataireAjoute.setEtat(EGenreEtat.Creation);
      lListe.addElement(lDestinataireAjoute);
    }
  });
  this._actualiserAffichage();
  return lAvecAjout;
}
function _getUrlElement(aElement) {
  let lUrl = null;
  switch (aElement.getGenre()) {
    case EGenreRessourcePedagogique.documentJoint:
      if (aElement.ressource.url) {
        lUrl = aElement.ressource.url;
      } else {
        lUrl = GChaine.creerUrlBruteLienExterne(aElement.ressource, {
          libelle: aElement.ressource.getLibelle(),
        });
      }
      break;
    case EGenreRessourcePedagogique.documentCloud:
      lUrl = aElement.ressource.url;
      break;
    case EGenreRessourcePedagogique.site:
      lUrl = GChaine.encoderUrl(GChaine.verifierURLHttp(aElement.url));
      break;
    case EGenreRessourcePedagogique.sujet:
    case EGenreRessourcePedagogique.corrige:
      lUrl = EGenreRessourcePedagogiqueUtil.composerURL(
        aElement.getGenre(),
        aElement.ressource,
        aElement.ressource.getLibelle(),
        true,
      );
      break;
    case EGenreRessourcePedagogique.travailRendu:
      lUrl = GChaine.creerUrlBruteLienExterne(aElement.ressource, {
        libelle: aElement.ressource.getLibelle(),
      });
      break;
  }
  return lUrl;
}
function _evenementSurMenuContextuel(aLigne, aElementMenu, aElement) {
  switch (aLigne.getNumero()) {
    case DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.consulter:
      if (aElement && aElement.donnee) {
        if (
          aElement.donnee.getGenre() === EGenreRessourcePedagogique.travailRendu
        ) {
          if (!!aElement.donnee.ressource) {
            ObjetFenetre_ListeTAFFaits.ouvrir(
              { pere: this, evenement: _evenementFenetreTAFARendre.bind(this) },
              aElement.donnee.ressource,
            );
          }
        } else {
          const lURLDocument = _getUrlElement(aElement.donnee);
          if (!!lURLDocument) {
            window.open(lURLDocument);
          }
        }
      }
      break;
    case DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.verrouiller:
    case DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.deverrouiller:
      if (
        aLigne.data &&
        aLigne.data.listeEditables &&
        aLigne.data.listeEditables.count() > 0
      ) {
        aLigne.data.listeEditables.parcourir((D) => {
          D.donnee.estModifiableParAutrui =
            aLigne.getNumero() ===
            DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
              .deverrouiller;
          D.donnee.setEtat(EGenreEtat.Modification);
        });
        this.setEtatSaisie(true);
      }
      break;
    default:
      return true;
  }
}
function ouvrirFenetreEditionSite() {
  const lThis = this;
  const lFenetre = ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl({
    pere: this,
    evenement: function (aValider, aParams) {
      if (
        !!aParams &&
        !!aParams.bouton &&
        aParams.bouton.valider &&
        !!aParams.donnee
      ) {
        const lDonnee = aParams.donnee;
        if (lThis.pourPartage) {
          const lElmTrouve = _getElementParLibelleRessourceEtGenre.call(
            lThis,
            lDonnee.libelle,
            EGenreRessourcePedagogique.site,
          );
          _ouvrirFenetreSelectionNiveaux.call(lThis, {
            elementDoublon: lElmTrouve,
            callback: function (aReussite, aListeNiveaux) {
              if (!aReussite) {
                return;
              }
              if (lElmTrouve) {
                _surModification_AjouterDestinatairesDansRessource.call(
                  lThis,
                  lElmTrouve,
                  aListeNiveaux,
                );
              } else {
                lThis.listeRessources.addElement(
                  DonneesListe_RessourcesPedagogiquesProfesseur.creerElement({
                    libelle: lDonnee.libelle ? lDonnee.libelle : lDonnee.url,
                    url: lDonnee.url,
                    commentaire: lDonnee.commentaire,
                    listeNiveaux: aListeNiveaux,
                    matiere: _getListePublicsSelectionnes.call(lThis).get(0),
                    genreCreation: EGenreRessourcePedagogique.site,
                    listePublics: new ObjetListeElements(),
                  }),
                );
              }
              lThis.setEtatSaisie(true);
              lThis._actualiserAffichage();
            },
          });
        } else {
          _ouvrirFenetreSelectionMatiere.call(lThis, (aReussite, aMatiere) => {
            if (aReussite) {
              lThis.listeRessources.addElement(
                DonneesListe_RessourcesPedagogiquesProfesseur.creerElement({
                  libelle: lDonnee.libelle,
                  url: lDonnee.url,
                  commentaire: lDonnee.commentaire,
                  matiere: aMatiere,
                  genreCreation: EGenreRessourcePedagogique.site,
                  listePublics: _getListePublicsSelectionnes.call(lThis),
                }),
              );
              lThis.setEtatSaisie(true);
              lThis._actualiserAffichage();
            }
          });
        }
      }
    },
  });
  lFenetre.setDonnees({ libelle: "", url: "http://", commentaire: "" });
}
function ouvrirFenetreAjoutDocumentDepuisAutreClasse() {
  const lThis = this;
  const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SelectionRessourcePedagogique,
    {
      pere: this,
      evenement: function (aValider, aRessourceSelectionne) {
        if (aValider) {
          _surModification_AjouterDestinatairesDansRessource.call(
            lThis,
            aRessourceSelectionne,
          );
        }
      },
    },
  );
  lInstanceFenetre.setDonnees({
    donnees: this.listeRessources,
    publics: _getListePublicsSelectionnes.call(this),
    afficherCumul: this.afficherCumul,
    listeMatieresParRessource: this.listeMatieresParRessource,
  });
}
function _ouvrirFenetreSelectionNiveaux(aParam) {
  const lParam = $.extend(
    { elementDoublon: null, callback: null, avecValidationAuto: false },
    aParam,
  );
  const lListe = new ObjetListeElements();
  this.listeNiveaux.parcourir((aNiveau) => {
    if (
      !lParam.elementDoublon ||
      !lParam.elementDoublon.listeNiveaux.getElementParElement(aNiveau) ||
      !lParam.elementDoublon.listeNiveaux.getElementParElement(aNiveau).existe()
    ) {
      lListe.addElement(aNiveau);
    }
  });
  if (lListe.count() === 0) {
    GApplication.getMessage().afficher({
      message: GTraductions.getValeur("RessourcePedagogique.CeNomExisteDeja"),
    });
    return false;
  }
  const lThis = this,
    lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionRessource,
      {
        pere: this,
        evenement: function (
          aGenreRessource,
          aListeRessourcesSelectionnees,
          aNumeroBouton,
        ) {
          const lListe = new ObjetListeElements();
          if (aNumeroBouton === 0) {
            aListeRessourcesSelectionnees.parcourir((D) => {
              const lElement = new ObjetElement(
                D.getLibelle(),
                D.getNumero(),
                D.getGenre(),
              );
              lElement.setEtat(EGenreEtat.Creation);
              lListe.addElement(lElement);
            });
          }
          lParam.callback.call(this, aNumeroBouton === 0, lListe);
          lThis._actualiserAffichage();
        },
      },
      { titre: GTraductions.getValeur("RessourcePedagogique.Destinataire") },
    );
  lFenetre.setOptionsFenetreSelectionRessource({ selectionObligatoire: true });
  lFenetre.setDonnees({
    listeRessources: lListe,
    listeRessourcesSelectionnees: new ObjetListeElements(),
    genreRessource: EGenreRessource.Niveau,
  });
  return true;
}
function _getElementParLibelleRessourceEtGenre(
  aLibelle,
  aGenre,
  aElementaExclure,
) {
  let lResult = null;
  let lMatieresFiltre = null;
  const lProprietaire = GEtatUtilisateur.getUtilisateur();
  if (this.pourPartage) {
    lMatieresFiltre = _getListePublicsSelectionnes.call(this);
  }
  this.listeRessources.parcourir((aElement) => {
    if (
      aElement.ressource &&
      (!aElementaExclure ||
        aElement.ressource.getNumero() !== aElementaExclure.getNumero()) &&
      aElement.editable &&
      aElement.existe() &&
      aGenre === aElement.getGenre() &&
      aElement.proprietaire &&
      lProprietaire.getGenre() === aElement.proprietaire.getGenre() &&
      lProprietaire.getNumero() === aElement.proprietaire.getNumero() &&
      aLibelle.toLowerCase() ===
        aElement.ressource.getLibelle().toLowerCase() &&
      (!lMatieresFiltre ||
        lMatieresFiltre.getElementParElement(aElement.matiere))
    ) {
      lResult = aElement;
      return false;
    }
  });
  return lResult;
}
function _getOptionsSelecFile(aEstAjoutDepuisSauvegarde) {
  return {
    maxSize: aEstAjoutDepuisSauvegarde
      ? GApplication.droits.get(TypeDroits.tailleMaxUpload)
      : GApplication.droits.get(TypeDroits.cahierDeTexte.tailleMaxPieceJointe),
    extensions: aEstAjoutDepuisSauvegarde ? ["zip"] : null,
    accept: aEstAjoutDepuisSauvegarde ? "application/zip" : "",
    avecTransformationFlux: !aEstAjoutDepuisSauvegarde,
  };
}
function _getParamMenuContextuelSelecFile(aParams) {
  const lParametres = $.extend({ element: null, type: null }, aParams);
  const lAjoutSauvegarde =
    lParametres.type ===
    DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.ajoutSauvegarde;
  const lThis = this;
  return {
    getOptionsSelecFile: _getOptionsSelecFile.bind(this, lAjoutSauvegarde),
    addFiles: function (aParamsUpload) {
      _evenementInputFile.call(lThis, aParamsUpload, lParametres);
    },
  };
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      if (aParametres.article && aParametres.article.donnee) {
        const D = aParametres.article.donnee;
        if (D.getGenre() === EGenreRessourcePedagogique.travailRendu) {
          if (!!D.ressource) {
            ObjetFenetre_ListeTAFFaits.ouvrir(
              { pere: this, evenement: _evenementFenetreTAFARendre.bind(this) },
              D.ressource,
            );
          }
        }
      }
      break;
    case EGenreEvenementListe.Edition:
      if (!!aParametres.article.donnee) {
        if (
          aParametres.idColonne ===
          DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes
        ) {
          const lListeThemeOriginaux = new ObjetListeElements();
          if (
            !!aParametres.article.donnee.ListeThemes &&
            aParametres.article.donnee.ListeThemes.count()
          ) {
            aParametres.article.donnee.ListeThemes.parcourir((aTheme) => {
              aTheme.cmsActif = true;
              lListeThemeOriginaux.add(MethodesObjet.dupliquer(aTheme));
            });
          }
          new ObjetRequeteListeTousLesThemes(
            this,
            _ouvrirFenetreThemes.bind(
              this,
              aParametres.article.donnee,
              lListeThemeOriginaux,
            ),
          ).lancerRequete();
          break;
        } else {
          const lThis = this;
          const lFenetre =
            ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl({
              pere: this,
              evenement: function (aValider, aParams) {
                if (
                  !!aParams &&
                  !!aParams.bouton &&
                  aParams.bouton.valider &&
                  !!aParams.donnee
                ) {
                  const lDonnee = aParams.donnee;
                  const lElmTrouve = _getElementParLibelleRessourceEtGenre.call(
                    lThis,
                    lDonnee.libelle,
                    EGenreRessourcePedagogique.site,
                    aParams.donnee.ressourceOrigine,
                  );
                  if (!!lElmTrouve) {
                    GApplication.getMessage().afficher({
                      titre: GTraductions.getValeur("liste.editionImpossible"),
                      message: GTraductions.getValeur(
                        "RessourcePedagogique.CeNomExisteDeja",
                      ),
                    });
                  } else {
                    aParametres.article.donnee.ressource.setLibelle(
                      lDonnee.libelle ? lDonnee.libelle : lDonnee.url,
                    );
                    aParametres.article.donnee.url = lDonnee.url;
                    aParametres.article.donnee.commentaire =
                      lDonnee.commentaire;
                    aParametres.article.donnee.setEtat(EGenreEtat.Modification);
                    lThis.setEtatSaisie(true);
                    lThis._actualiserAffichage();
                  }
                }
              },
            });
          lFenetre.setDonnees({
            ressourceOrigine: aParametres.article.donnee.ressource,
            libelle:
              aParametres.article.donnee.ressource.getLibelle() !==
              aParametres.article.donnee.url
                ? aParametres.article.donnee.ressource.getLibelle()
                : "",
            url: aParametres.article.donnee.url,
            commentaire: aParametres.article.donnee.commentaire,
          });
        }
      }
      break;
    case EGenreEvenementListe.ApresCreation:
    case EGenreEvenementListe.ApresSuppression:
      this._actualiserAffichage();
      break;
    case EGenreEvenementListe.Creation: {
      const lMessageCreationImpossible =
        getMessageCreationImpossible.call(this);
      if (lMessageCreationImpossible) {
        GApplication.getMessage().afficher({
          message: lMessageCreationImpossible,
        });
        return EGenreEvenementListe.Creation;
      } else {
        this.ouvrirFenetreCreation();
      }
      break;
    }
  }
}
function _evenementFenetreTAFARendre(aGenreBouton) {
  if (this.getEtatSaisie() !== true) {
    if (aGenreBouton === TypeBoutonFenetreTAFFaits.Fermer) {
      _envoieRequete.call(this, true);
    }
  }
}
function _getListePublicsSelectionnes() {
  const lListe = GEtatUtilisateur.Navigation.getRessources(
    _getGenrePublicSelection.call(this),
  );
  if (!lListe) {
    return new ObjetListeElements();
  }
  return lListe;
}
function _getListeMatieresSelonSelection() {
  let lListeMatieres = new ObjetListeElements();
  const lThis = this;
  const lPublicSelectionne = GEtatUtilisateur.Navigation.getRessources(
    _getGenrePublicSelection.call(this),
  );
  if (lPublicSelectionne && lPublicSelectionne.count() > 0) {
    let lPublic = this.listeMatieresParRessource.getElementParElement(
      lPublicSelectionne.get(0),
    );
    if (lPublic) {
      lListeMatieres = lPublic.listeMatieres;
      lPublicSelectionne.parcourir((D) => {
        lPublic = lThis.listeMatieresParRessource.getElementParElement(D);
        if (lPublic) {
          lListeMatieres = lPublic.listeMatieres.getListeElements((D) => {
            return !!lListeMatieres.getElementParElement(D);
          });
        }
      });
    }
  }
  return lListeMatieres;
}
function _ouvrirFenetreSelectionMatiere(aEvenement) {
  const lListeMatieres = _getListeMatieresSelonSelection.call(this);
  if (lListeMatieres.count() > 1) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionMatiere,
      {
        pere: this,
        evenement: function (aNumeroBouton, aIndice, aNumeroMatiere) {
          if (aNumeroBouton === 1) {
            aEvenement(
              true,
              lListeMatieres.getElementParNumero(aNumeroMatiere),
            );
          } else {
            aEvenement(false);
          }
        },
      },
      {
        titre: GTraductions.getValeur("Matieres"),
        largeur: 250,
        hauteur: 250,
        listeBoutons: [GTraductions.getValeur("Fermer")],
      },
    );
    lFenetre.setDonnees(lListeMatieres, false, false);
  } else if (lListeMatieres.count() === 1) {
    aEvenement(true, lListeMatieres.get(0), true);
  } else {
    GApplication.getMessage().afficher({
      message: getMessageCreationImpossible.call(this),
      callback: function () {
        aEvenement(false);
      },
    });
  }
}
function _ouvrirFenetreThemes(aRessource, aListeSelection, aJSON) {
  let lListeThemes = MethodesObjet.dupliquer(aJSON.listeTousLesThemes);
  if (lListeThemes) {
    for (let i = 0; i < aListeSelection.count(); i++) {
      const lElm = lListeThemes.getElementParNumero(
        aListeSelection.getNumero(i),
      );
      if (lElm) {
        lElm.cmsActif = true;
        lElm.estMixte = aListeSelection.get(i).estMixte;
      }
    }
  } else {
    lListeThemes = new ObjetListeElements();
  }
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ListeThemes, {
    pere: this,
    evenement: function (aGenreBouton, aChangementListe) {
      lFenetre.fermer();
      if (aGenreBouton === 1) {
        const lListeActif = aChangementListe.getListeElements((aElement) => {
          return aElement.cmsActif;
        });
        aRessource.ListeThemes = lListeActif;
        aRessource.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
        this.getInstance(this.identListe).actualiser(true);
      }
    },
  });
  lFenetre.setDonnees({
    listeThemes: lListeThemes,
    matiereContexte: aRessource.matiere || aJSON.matiereNonDesignee,
    listeMatieres: aJSON.listeMatieres,
    tailleLibelleTheme: aJSON.tailleLibelleTheme,
    libelleCB: aRessource.libelleCBTheme,
    matiereNonDesignee: aJSON.matiereNonDesignee,
  });
}
function getMessageCreationImpossible() {
  let lMessageCreationImpossible = "";
  if (
    !this.pourPartage &&
    _getListeMatieresSelonSelection.call(this).count() === 0
  ) {
    const lListePublics = _getListePublicsSelectionnes.call(this);
    lMessageCreationImpossible =
      lListePublics.count() === 1
        ? lListePublics.get(0).getGenre() === EGenreRessource.Classe
          ? GTraductions.getValeur(
              "RessourcePedagogique.AucuneMatierePourLaClasse",
            )
          : GTraductions.getValeur(
              "RessourcePedagogique.AucuneMatierePourLeGroupe",
            )
        : _getEnsembleGenrePublicDeListePublic
              .call(this, lListePublics)
              .contains(EGenreRessource.Classe)
          ? GTraductions.getValeur("RessourcePedagogique.AucuneMatiereClasse")
          : GTraductions.getValeur("RessourcePedagogique.AucuneMatiereGroupe");
  }
  return lMessageCreationImpossible;
}
function _reponseRequeteRessourcePedagogique(
  aAvecDonnees,
  aListeMatieres,
  aListeRessources,
  aListeMatieresParRessource,
  aAfficherCumul,
  aJSON,
) {
  if (aAvecDonnees) {
    this._avecDonnees = true;
    this.listeRessources = aListeRessources;
    if (this.pourPartage) {
      const lListeRessources = (this.listeRessources =
        new ObjetListeElements());
      aListeRessources.parcourir((aRessource) => {
        let lRessourceTrouve = null;
        if (
          aRessource.editable &&
          aRessource.ressource &&
          aRessource.matiere &&
          aRessource.proprietaire
        ) {
          lListeRessources.parcourir((aElementCherche) => {
            if (
              aRessource.editable === aElementCherche.editable &&
              aElementCherche.ressource &&
              aRessource.ressource.getNumero() ===
                aElementCherche.ressource.getNumero() &&
              aRessource.ressource.getGenre() ===
                aElementCherche.ressource.getGenre() &&
              aRessource.getGenre() === aElementCherche.getGenre() &&
              aElementCherche.proprietaire &&
              aRessource.proprietaire.getGenre() ===
                aElementCherche.proprietaire.getGenre() &&
              aRessource.proprietaire.getNumero() ===
                aElementCherche.proprietaire.getNumero() &&
              aRessource.matiere &&
              aRessource.matiere.getNumero() ===
                aElementCherche.matiere.getNumero()
            ) {
              lRessourceTrouve = aElementCherche;
              return false;
            }
          });
        }
        if (lRessourceTrouve) {
          aRessource.listeNiveaux.parcourir((aNiveau) => {
            if (!lRessourceTrouve.listeNiveaux.getElementParElement(aNiveau)) {
              lRessourceTrouve.listeNiveaux.addElement(aNiveau);
            }
          });
        } else {
          lListeRessources.addElement(aRessource);
        }
      }, this);
    }
    this.afficherCumul = aAfficherCumul;
    this.listeDocumentsUpload = new ObjetListeElements();
    this.listeMatieresParRessource = aListeMatieresParRessource;
    this.listeNiveaux = aJSON.listeNiveaux;
  } else {
    if (aListeMatieresParRessource) {
      aListeMatieresParRessource.parcourir((aPublic) => {
        const lPublic =
          this.listeMatieresParRessource.getElementParElement(aPublic);
        if (lPublic && aPublic.listeMatieres) {
          lPublic.listeMatieres = aPublic.listeMatieres;
        }
      });
    }
  }
  GHtml.setDisplay(this.idTout, true);
  GHtml.setDisplay(this.idMessage, false);
  this._actualiserAffichage();
}
function _envoieRequete(aViderDonnees) {
  if (aViderDonnees) {
    this._avecDonnees = false;
  }
  const lListePublic = _getListePublicsSelectionnes.call(this);
  if (lListePublic.count() > 0) {
    const lAvecDonnees = !this._avecDonnees;
    new ObjetRequeteRessourcePedagogique(
      this,
      _reponseRequeteRessourcePedagogique.bind(this, lAvecDonnees),
    ).lancerRequete({
      avecRessourcesPronote: true,
      avecRessourcesEditeur: true,
      listePublic: lListePublic,
      avecDonnees: lAvecDonnees,
    });
  }
}
function _confirmationMessageChoixCreation(
  aBouton,
  aRemplacer,
  aFichier,
  aRessource,
) {
  if (aBouton !== 0) {
    return;
  }
  if (aRemplacer) {
    if (this.pourPartage) {
      _ouvrirFenetreSelectionNiveaux.call(this, {
        elementDoublon: aRessource,
        callback: function (aReussite, aListeNiveaux) {
          if (aReussite) {
            aRessource.fichier = aFichier;
            this.listeDocumentsUpload.addElement(aFichier);
            _surModification_AjouterDestinatairesDansRessource.call(
              this,
              aRessource,
              aListeNiveaux,
            );
          }
        },
      });
      return;
    } else {
      aRessource.fichier = aFichier;
      this.listeDocumentsUpload.addElement(aFichier);
      _surModification_AjouterDestinatairesDansRessource.call(this, aRessource);
    }
  } else {
    let lCompteur = 1;
    const lNomFichier = GChaine.extraireNomFichier(aFichier.Libelle);
    const lExtension = GChaine.extraireExtensionFichier(aFichier.Libelle);
    let lLibelle = aFichier.Libelle;
    while (
      _getElementParLibelleRessourceEtGenre.call(
        this,
        lLibelle,
        EGenreRessourcePedagogique.documentJoint,
      )
    ) {
      lLibelle = lNomFichier + "_" + lCompteur + "." + lExtension;
      lCompteur += 1;
    }
    _confirmerCreationRessourcePJ.call(this, aFichier, lLibelle);
  }
}
function _getEnsembleGenrePublicDeListePublic(aListePublics) {
  const lEnsemble = new TypeEnsembleNombre();
  if (aListePublics) {
    aListePublics.parcourir((D) => {
      lEnsemble.add(D.getGenre());
    });
  }
  return lEnsemble;
}
function _gererMessageDoublonFichier(aFichier, aRessource) {
  let lRemplacer = false;
  const lControleur = {
    rbChoix: {
      getValue: function (aChoix) {
        return lRemplacer === aChoix;
      },
      setValue: function (aChoix) {
        lRemplacer = aChoix;
      },
    },
  };
  const H = [];
  const lThis = this;
  let lGenresRessource;
  let lTraduction = "";
  let lDestinataires = "";
  if (this.pourPartage) {
    lTraduction = GChaine.format(
      GTraductions.getValeur("RessourcePedagogique.DocumentIdentique_Niveau_S"),
      [
        "",
        "",
        aRessource.listeNiveaux
          .getTableauLibelles(null, true, true)
          .sort()
          .join(", "),
      ],
    );
  } else {
    lGenresRessource = _getEnsembleGenrePublicDeListePublic.call(
      this,
      aRessource.listePublics,
    );
    lDestinataires = aRessource.listePublics
      .getTableauLibelles(null, true, true)
      .sort()
      .join(", ");
    if (lGenresRessource.contains(EGenreRessource.Classe)) {
      lTraduction = GChaine.format(
        GTraductions.getValeur(
          "RessourcePedagogique.DocumentIdentique_Classe_S",
        ),
        [lDestinataires],
      );
    } else {
      lTraduction = GChaine.format(
        GTraductions.getValeur(
          "RessourcePedagogique.DocumentIdentique_Groupe_S",
        ),
        ["", lDestinataires],
      );
    }
  }
  H.push(lTraduction, "<br /><br />");
  H.push(
    '<ie-radio ie-model="rbChoix(true)" class="NoWrap PetitEspaceHaut">',
    GTraductions.getValeur("RessourcePedagogique.RemplacerDocExistant"),
    "</ie-radio>" + "<br />",
  );
  H.push(
    '<ie-radio ie-model="rbChoix(false)" class="NoWrap EspaceHaut">',
    GTraductions.getValeur("RessourcePedagogique.ConserverDocExistant"),
    "</ie-radio>" + "<br />",
  );
  GApplication.getMessage().afficher({
    type: EGenreBoiteMessage.Confirmation,
    message: H.join(""),
    controleur: lControleur,
    callback: function (aBouton) {
      _confirmationMessageChoixCreation.call(
        lThis,
        aBouton,
        lRemplacer,
        aFichier,
        aRessource,
      );
    },
  });
}
function _confirmerCreationRessourcePJ(aFichier, aLibelle) {
  const lThis = this;
  if (this.pourPartage) {
    _ouvrirFenetreSelectionNiveaux.call(this, {
      elementDoublon: _getElementParLibelleRessourceEtGenre.call(
        lThis,
        aLibelle,
        EGenreRessourcePedagogique.documentJoint,
      ),
      callback: function (aReussite, aListeNiveaux) {
        if (!aReussite) {
          return;
        }
        lThis.listeDocumentsUpload.addElement(aFichier);
        lThis.listeRessources.addElement(
          DonneesListe_RessourcesPedagogiquesProfesseur.creerElement({
            libelle: aLibelle,
            fichier: aFichier,
            matiere: _getListePublicsSelectionnes.call(lThis).get(0),
            listeNiveaux: aListeNiveaux,
            genreCreation: EGenreRessourcePedagogique.documentJoint,
            listePublics: _getListePublicsSelectionnes.call(lThis),
          }),
        );
        lThis.setEtatSaisie(true);
      },
    });
  } else {
    _ouvrirFenetreSelectionMatiere.call(this, (aReussite, aMatiere) => {
      if (aReussite) {
        lThis.listeDocumentsUpload.addElement(aFichier);
        lThis.listeRessources.addElement(
          DonneesListe_RessourcesPedagogiquesProfesseur.creerElement({
            libelle: aLibelle,
            fichier: aFichier,
            matiere: aMatiere,
            genreCreation: EGenreRessourcePedagogique.documentJoint,
            listePublics: _getListePublicsSelectionnes.call(lThis),
          }),
        );
        lThis.setEtatSaisie(true);
        lThis._actualiserAffichage();
      }
    });
  }
}
function _saisieImport(
  aListeIdents,
  aListeDestinataires,
  aLibelleFichier,
  aMatiere,
  aParametresImport,
) {
  const lImport = {
    idents: aListeIdents,
    pourPartage: this.pourPartage,
    libelleFichier: aLibelleFichier,
    idFichier: aParametresImport.nomFichier,
    listePublics: aListeDestinataires.setSerialisateurJSON({
      ignorerEtatsElements: true,
    }),
    matiere: aMatiere,
  };
  _saisie.call(this, lImport);
}
function _saisieAnnulerImport(aParametresImport) {
  if (aParametresImport.import) {
    new ObjetRequeteSaisieRessourcePedagogique(this, () => {}).lancerRequete({
      annulerImport: true,
    });
  }
}
function _reponseUploadFichier(
  aLibelleFichier,
  aSuccesSaisie,
  aJSONRapport,
  aJSONReponse,
) {
  if (!aSuccesSaisie) {
    return;
  }
  ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SelectionImportRessourcePedagogique,
    {
      pere: this,
      evenement: function (aValider, aParametres, aListeIdents) {
        if (!aValider || !aListeIdents || aListeIdents.length === 0) {
          _saisieAnnulerImport.call(this, aParametres);
          return;
        }
        if (this.pourPartage) {
          _ouvrirFenetreSelectionNiveaux.call(this, {
            elementDoublon: null,
            callback: function (aReussite, aListeNiveaux) {
              if (!aReussite) {
                _saisieAnnulerImport.call(this, aParametres);
                return;
              }
              _saisieImport.call(
                this,
                aListeIdents,
                aListeNiveaux,
                aLibelleFichier,
                _getListePublicsSelectionnes.call(this).get(0),
                aParametres,
              );
            },
          });
        } else {
          _saisieImport.call(
            this,
            aListeIdents,
            _getListePublicsSelectionnes.call(this),
            aLibelleFichier,
            null,
            aParametres,
          );
        }
      },
    },
  ).setDonnees(aJSONReponse);
}
function _evenementInputFile(aParamUpload, aParametres) {
  if (aParamUpload.eltFichier.getEtat() === EGenreEtat.Creation) {
    if (
      aParametres.type ===
      DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.ajoutSauvegarde
    ) {
      const lListe = new ObjetListeElements();
      lListe.addElement(aParamUpload.eltFichier);
      new ObjetRequeteSaisieRessourcePedagogique(
        this,
        _reponseUploadFichier.bind(this, aParamUpload.eltFichier.Libelle),
      )
        .addUpload({ listeFichiers: lListe })
        .lancerRequete({ choixImport: true, pourPartage: this.pourPartage });
      return;
    }
    const lDoublon = _getElementParLibelleRessourceEtGenre.call(
      this,
      aParamUpload.eltFichier.Libelle,
      EGenreRessourcePedagogique.documentJoint,
    );
    if (
      aParametres.type ===
        DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.remplacerDoc &&
      aParametres.element
    ) {
      if (lDoublon) {
        GApplication.getMessage().afficher({
          titre: GTraductions.getValeur("liste.editionImpossible"),
          message: GTraductions.getValeur(
            "RessourcePedagogique.CeNomExisteDeja",
          ),
        });
        return;
      }
      this.listeDocumentsUpload.addElement(aParamUpload.eltFichier);
      aParametres.element.setLibelle(aParamUpload.eltFichier.Libelle);
      aParametres.element.ressource.setLibelle(aParamUpload.eltFichier.Libelle);
      aParametres.element.fichier = aParamUpload.eltFichier;
      aParametres.element.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      this._actualiserAffichage();
      return;
    }
    if (lDoublon) {
      _gererMessageDoublonFichier.call(this, aParamUpload.eltFichier, lDoublon);
    } else {
      _confirmerCreationRessourcePJ.call(
        this,
        aParamUpload.eltFichier,
        aParamUpload.eltFichier.Libelle,
      );
    }
  }
}
function _saisie(aImport) {
  this.setEtatSaisie(false);
  new ObjetRequeteSaisieRessourcePedagogique(this, this.actionSurValidation)
    .addUpload({ listeFichiers: this.listeDocumentsUpload })
    .lancerRequete({ depot: this.listeRessources, import: aImport });
}
module.exports = { InterfaceRessourcePedagogique_Professeur };
