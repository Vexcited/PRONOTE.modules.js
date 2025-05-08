const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const UtilitaireFicheEleve = {};
UtilitaireFicheEleve.addSurZone = function (aInstance) {
  if (this.avecFicheEleve()) {
    aInstance.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnAfficherFicheEleve(
        "btnAfficherFicheEleve",
      ),
    });
  }
};
UtilitaireFicheEleve.construireInstances = function (aInstance) {
  if (this.avecFicheEleve()) {
    aInstance.identFenetreFicheEleve = aInstance.add(
      ObjetFenetre_FicheEleve,
      null,
      initialiserFenetreFicheEleve.bind(aInstance),
    );
  }
};
function initialiserFenetreFicheEleve(aInstance) {
  aInstance.setOptionsFenetre({
    modale: false,
    titre: "",
    largeur: 850,
    hauteur: 750,
    listeBoutons: [GTraductions.getValeur("Fermer")],
  });
  aInstance.setOngletsVisibles({ projets: false, attestations: false });
}
UtilitaireFicheEleve.ajoutControleur = function (aInstance, aControleur) {
  if (!aControleur.btnAfficherFicheEleve && this.avecFicheEleve()) {
    aControleur.btnAfficherFicheEleve = {
      event() {
        _afficherFicheEleve.call(this.instance);
      },
      getSelection() {
        const lFenetre = aInstance.getInstance(
          aInstance.identFenetreFicheEleve,
        );
        return lFenetre && lFenetre.estAffiche();
      },
      getTitle() {
        return GTraductions.getValeur("FicheRenseignement");
      },
      getDisabled() {
        return !aInstance.estBoutonsFicheEleveActif;
      },
    };
  }
};
function _afficherFicheEleve() {
  const lFenetre = this.getInstance(this.identFenetreFicheEleve);
  if (lFenetre) {
    lFenetre.setDonnees();
  }
}
UtilitaireFicheEleve.avecFicheEleve = function () {
  return (
    ObjetFenetre_FicheEleve &&
    (GApplication.droits.get(TypeDroits.eleves.consulterIdentiteEleve) ||
      GApplication.droits.get(TypeDroits.eleves.consulterFichesResponsables))
  );
};
const UtilitairePhotoEleve = {};
UtilitairePhotoEleve.addSurZone = function (aInstance) {
  if (this.avecPhotoEleve()) {
    aInstance.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnAfficherPhotoEleve(
        "btnAfficherPhotoEleve",
      ),
    });
  }
};
UtilitairePhotoEleve.construireInstances = function (aInstance) {
  if (this.avecPhotoEleve()) {
    const ObjetFichePhotos = require("ObjetFichePhotos.js");
    if (ObjetFichePhotos) {
      aInstance.identFichePhoto = aInstance.add(ObjetFichePhotos);
    }
  }
};
UtilitairePhotoEleve.ajoutControleur = function (aInstance, aControleur) {
  if (!aControleur.btnAfficherPhotoEleve && this.avecPhotoEleve()) {
    aControleur.btnAfficherPhotoEleve = {
      event() {
        UtilitairePhotoEleve._afficherPhotoEleve.call(this.instance, false);
      },
      getSelection() {
        const lFenetre = aInstance.getInstance(aInstance.identFichePhoto);
        return lFenetre && lFenetre.estAffiche();
      },
      getTitle() {
        return GTraductions.getValeur("VoirPhotoEleve");
      },
      getDisabled() {
        return !aInstance.estBoutonsFicheEleveActif;
      },
    };
  }
};
UtilitairePhotoEleve.estPhotoEleveAffiche = function () {
  const lFenetrePhoto = this.getInstance(this.identFichePhoto);
  return lFenetrePhoto && lFenetrePhoto.estAffiche();
};
UtilitairePhotoEleve.fermerPhotoEleve = function () {
  const lFenetrePhoto = this.getInstance(this.identFichePhoto);
  if (lFenetrePhoto) {
    lFenetrePhoto.fermer();
  }
};
UtilitairePhotoEleve._afficherPhotoEleve = function (aBloquerFocus) {
  const lFenetrePhoto = this.getInstance(this.identFichePhoto);
  if (lFenetrePhoto) {
    const lRessource = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    if (!!lRessource && lRessource.existeNumero()) {
      const lUrl = GChaine.creerUrlBruteLienExterne(lRessource, {
        libelle: "photo.jpg",
      });
      lFenetrePhoto.setDonnees(
        null,
        lUrl,
        null,
        aBloquerFocus,
        null,
        GTraductions.getValeur("PhotoDe_S", lRessource.getLibelle()),
      );
    } else {
      lFenetrePhoto.setDonnees(null, "", null, aBloquerFocus);
    }
  }
};
UtilitairePhotoEleve.avecPhotoEleve = function () {
  return (
    UtilitaireFicheEleve.avecFicheEleve() &&
    GApplication.droits.get(TypeDroits.eleves.consulterPhotosEleves)
  );
};
module.exports = { UtilitaireFicheEleve, UtilitairePhotoEleve };
