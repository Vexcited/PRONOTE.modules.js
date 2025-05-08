const { ObjetPageCompte } = require("ObjetPageCompte.js");
const ObjetPageCompte_Parent = require("ObjetPageCompte_Parent.js");
const { ObjetRequetePageInfosPerso } = require("ObjetRequetePageInfosPerso.js");
const ObjetRequeteSaisieInformations = require("ObjetRequeteSaisieInformations.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { InterfacePage } = require("InterfacePage.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_FiltreCompte } = require("DonneesListe_FiltreCompte.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  UtilitairePageDonneesPersonnelles,
} = require("UtilitairePageDonneesPersonnelles.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { GTraductions } = require("ObjetTraduction.js");
const MultipleObjetFenetre_InstallPronote = require("ObjetFenetre_InstallPronote.js");
const { ObjetFicheAppliMobile } = require("ObjetFicheAppliMobile.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GUID } = require("GUID.js");
class ObjetInterfaceCompte extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
    this.contexte = {
      niveauCourant: 0,
      ecran: [
        ObjetInterfaceCompte.genreEcran.principal,
        ObjetInterfaceCompte.genreEcran.detail,
      ],
      selection: [],
      guidRef: GUID.getId(),
    };
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe, _evenementListe, _initListe);
    this.identCompte = this.add(
      GEtatUtilisateur.GenreEspace === EGenreEspace.Parent ||
        GEtatUtilisateur.GenreEspace === EGenreEspace.PrimParent
        ? ObjetPageCompte_Parent
        : ObjetPageCompte,
      function () {
        _actualiserPage.call(this);
      },
    );
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.GenreStructure = EStructureAffichage.Autre;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnAppli: {
        event: function () {
          ObjetFenetre.creerInstanceFenetre(ObjetFicheAppliMobile, {
            pere: aInstance,
            initialiser: function (aInstance) {
              aInstance.setOptionsFenetre({
                positionnerFenetreSurAfficher: true,
              });
            },
          }).afficher(GParametres.URLMobile);
        },
      },
      btnClient: {
        event: function () {
          if (MultipleObjetFenetre_InstallPronote) {
            ObjetFenetre.creerInstanceFenetre(
              MultipleObjetFenetre_InstallPronote.ObjetFenetre_InstallPronote,
              {
                pere: aInstance,
                initialiser: function (aInstance) {
                  aInstance.setOptionsFenetre({
                    titre: GTraductions.getValeur("InstallPronote.titre"),
                    largeur: 400,
                    hauteur: 120,
                    listeBoutons: [GTraductions.getValeur("principal.fermer")],
                  });
                  aInstance.setParametres(
                    GEtatUtilisateur.urlInstallClient,
                    GEtatUtilisateur.urlParamClient,
                    GEtatUtilisateur.designationClient,
                  );
                },
              },
            ).afficher();
          }
        },
      },
      btnRetourEcranPrec: {
        event: function () {
          this.revenirSurEcranPrecedent();
        }.bind(aInstance),
      },
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    let lHeightBtn = GParametres.avecAccesMobile
      ? GEtatUtilisateur.urlInstallClient && MultipleObjetFenetre_InstallPronote
        ? "48px"
        : "24px"
      : 0;
    H.push(
      `<div class="ObjetCompte">\n              <div id="${this.getIdDeNiveau({ niveauEcran: 0 })}" class="menu-contain">\n\n                <div class="liste-contain" id="${this.getInstance(this.identListe).getNom()}" ${lHeightBtn !== 0 ? `style="max-height: calc(100% - calc(${lHeightBtn} + 40px));"` : ""}></div>\n              </div>\n              <div id="${this.getIdDeNiveau({ niveauEcran: 1 })}" class="details-contain" ${IE.estMobile ? `style="display: none;"` : ""}>\n                <div style="display: none;" id="${this.getInstance(this.identCompte).getNom()}" class="compte-contain"></div>\n              </div>\n              <div class="btns-contain">\n                ${_construireBoutons()}\n              </div>\n            </div>`,
    );
    return H.join("");
  }
  afficherPage() {
    _actualiserPage.call(this);
  }
  recupererDonnees() {
    _requete.call(this).then(() => {
      const lListe = this.getInstance(this.identCompte).getListeFiltresAff();
      let lIndiceElementASelectionner = -1;
      const lGenreElementASelectionner =
        GEtatUtilisateur.getGenreAffichageCompteSelectionne();
      if (!!lGenreElementASelectionner) {
        lIndiceElementASelectionner = lListe.getIndiceElementParFiltre((D) => {
          return D.getGenre() === lGenreElementASelectionner;
        });
      }
      if (lIndiceElementASelectionner === -1) {
        lIndiceElementASelectionner = IE.estMobile ? 0 : 1;
      }
      this.getInstance(this.identListe).setDonnees(
        new DonneesListe_FiltreCompte(lListe).setOptions({
          flatDesignMinimal: true,
        }),
        lIndiceElementASelectionner,
      );
    });
  }
  valider() {
    const lStructure = {};
    if (
      this.getInstance(this.identCompte).getStructurePourValidation(lStructure)
    ) {
      this.setEtatSaisie(false);
      new ObjetRequeteSaisieInformations(this, this.actionSurValidation)
        .addUpload({ listeFichiers: lStructure.signature.listeFichiers })
        .lancerRequete(lStructure);
    }
  }
  construireEcran(aEcran) {
    const lElement = this.getCtxSelection({ niveauEcran: 0 });
    switch (aEcran.genreEcran) {
      case ObjetInterfaceCompte.genreEcran.principal:
        if (this.optionsEcrans.avecBascule) {
          this.setHtmlStructureAffichageBandeau("");
        }
        break;
      case ObjetInterfaceCompte.genreEcran.detail:
        this.setHtmlStructureAffichageBandeau(
          this.construireBandeauEcran(lElement),
        );
        _actualiserAffichageDetails.call(this);
        break;
      default:
    }
  }
  construireBandeauEcran() {
    const lHtml = [];
    return super.construireBandeauEcran(lHtml.join(""), true);
  }
}
InterfacePage.genreEcran = { principal: "principal", detail: "detail" };
function _actualiserAffichageDetails() {
  const lSelection = this.getInstance(this.identListe).getElementSelection();
  this.getInstance(this.identCompte).afficher(
    lSelection ? lSelection.getGenre() : null,
  );
}
function _initListe(aInstance) {
  aInstance.setOptionsListe({
    skin: ObjetListe.skin.flatDesign,
    hauteurAdapteContenu: true,
    hauteurMaxAdapteContenu: 800,
  });
}
function _evenementListe(aParametres) {
  if (!!aParametres.article && aParametres.article.nonSelectionnable) {
    return;
  }
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.ModificationSelection: {
      const lArticle = this.getInstance(this.identListe).getElementSelection();
      if (lArticle) {
        GEtatUtilisateur.setGenreAffichageCompteSelectionne(
          lArticle.getGenre(),
        );
      }
      if (this.optionsEcrans.avecBascule) {
        const lEcranSrc = {
          niveauEcran: 0,
          genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
        };
        const lEcranDest = {
          niveauEcran: 1,
          genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
        };
        this.basculerEcran(lEcranSrc, lEcranDest);
      }
      _actualiserAffichageDetails.call(this);
      break;
    }
  }
}
function _callbackIdentifiant() {
  UtilitairePageDonneesPersonnelles.fenetreModificationIdentifiant(
    this,
    _actualiserPage.bind(this),
  );
}
function _callbackMDP() {
  UtilitairePageDonneesPersonnelles.fenetreModificationMDP(this);
}
function _requete() {
  return new ObjetRequetePageInfosPerso(this)
    .lancerRequete()
    .then((aDonnees) => {
      this.getInstance(this.identCompte).setDonneesPageCompte({
        donnees: aDonnees,
        callbackIdentifiant: _callbackIdentifiant.bind(this),
        callbackMDP: _callbackMDP.bind(this),
      });
    });
}
function _actualiserPage() {
  return _requete.call(this).then(() => {
    _actualiserAffichageDetails.call(this);
  });
}
function _construireBoutons() {
  const H = [];
  if (GParametres.avecAccesMobile) {
    H.push(`<ie-bouton ie-icon="icon_qr_code" class="small-bt themeBoutonNeutre" ie-model="btnAppli" title="${GTraductions.getValeur("Commande.QRCode.Actif")}"\n            ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("Commande.QRCode.Actif") })}>\n            ${GTraductions.getValeur("Commande.QRCode.Actif")}
            </ie-bouton>`);
  }
  if (
    GEtatUtilisateur.urlInstallClient &&
    MultipleObjetFenetre_InstallPronote
  ) {
    H.push(`<ie-bouton ie-icon="${GApplication.estEDT ? `icon_connexion_edt` : `icon_connexion_pronote`}" class="small-bt themeBoutonNeutre" ie-model="btnClient" title="${GTraductions.getValeur("Commande.TelechargerClient.Actif")}"\n            ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("Commande.TelechargerClient.Actif") })}>\n            ${GTraductions.getValeur("Commande.TelechargerClient.Actif")}
            </ie-bouton>`);
  }
  return H.join("");
}
module.exports = { ObjetInterfaceCompte };
