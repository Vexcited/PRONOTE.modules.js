const { TypeDroits } = require("ObjetDroitsPN.js");
const { InterfaceParcoursPeda } = require("InterfaceParcoursPeda.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeGenreMaquetteBulletin } = require("TypeGenreMaquetteBulletin.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
class InterfaceSaisieParcoursEducatif extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      droits: {
        avecSaisie: GApplication.droits.get(
          TypeDroits.eleves.avecSaisieParcoursPedagogique,
        ),
      },
      filtres: {
        avecCumulParEleves: true,
        avecCumulParGenreParcours: false,
        genreParcours: null,
      },
      genreMaquette:
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.ParcoursEducatif_Bulletin
          ? TypeGenreMaquetteBulletin.tGMB_Notes
          : TypeGenreMaquetteBulletin.tGMB_Competences,
    };
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.evntSurDernierMenuDeroulant,
      _initialiserTripleCombo,
    );
    this.identComboGenreParcours = this.add(
      ObjetSaisiePN,
      this.evntGenreParcours,
      _initialiserComboGenreParcours,
    );
    this.identParcours = this.add(InterfaceParcoursPeda);
    this.IdPremierElement = this.getInstance(
      this.identTripleCombo,
    ).getPremierElement();
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identParcours;
    this.AddSurZone = [this.identTripleCombo, this.identComboGenreParcours];
  }
  evntSurDernierMenuDeroulant() {
    this.afficherPage();
  }
  evntGenreParcours(aParams) {
    let lGenre;
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      if (aParams.element) {
        lGenre = aParams.element.getGenre();
        GEtatUtilisateur.Navigation.genreParcoursEducatif = lGenre;
      }
      if (aParams.element.autorise) {
        this.params.filtres.genreParcours = [];
        this.params.filtres.genreParcours.push(lGenre);
        this.params.filtres.avecCumulParGenreParcours =
          this.params.filtres.genreParcours.length > 1;
        _afficher.call(this);
      } else {
        this.evenementAfficherMessage(
          GTraductions.getValeur("ParcoursPeda.NonAutoriseDansMaquette"),
        );
      }
    }
  }
  afficherPage() {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    const lListeEleves = GEtatUtilisateur.Navigation.getRessources(
      EGenreRessource.Eleve,
    );
    if (!lListeEleves || lListeEleves.count() === 0) {
      return;
    }
    let lPourClasse = false;
    if (lListeEleves.count() === 1 && !lListeEleves.existeNumero(0)) {
      lPourClasse = true;
      this.params.ressources = GEtatUtilisateur.Navigation.getRessources(
        EGenreRessource.Classe,
      );
      this.params.filtres.avecCumulParEleves = false;
    } else {
      this.params.ressources = lListeEleves;
      this.params.filtres.avecCumulParEleves = lListeEleves.count() > 1;
    }
    Promise.resolve()
      .then(() => {
        return this.getInstance(this.identParcours).recupererDonnees({
          classeGroupe: GEtatUtilisateur.Navigation.getRessource(
            EGenreRessource.Classe,
          ),
          periode: GEtatUtilisateur.Navigation.getRessource(
            EGenreRessource.Periode,
          ),
          listeEleves: lListeEleves,
          pourClasseGroupeEntier: lPourClasse,
          genreMaquette: this.params.genreMaquette,
        });
      })
      .then((aListeGenreParcours) => {
        _setListeGenreParcours.call(this, aListeGenreParcours);
      })
      .then(() => {
        Invocateur.evenement(
          ObjetInvocateur.events.activationImpression,
          EGenreImpression.GenerationPDF,
          this,
          () => {
            return {
              genreGenerationPDF:
                TypeHttpGenerationPDFSco.ParcoursEducatifCompetences,
              classeGroupe: GEtatUtilisateur.Navigation.getRessource(
                EGenreRessource.Classe,
              ),
              periode: GEtatUtilisateur.Navigation.getRessource(
                EGenreRessource.Periode,
              ),
              listeEleves: lListeEleves,
              pourClasseGroupeEntier: lPourClasse,
              genreMaquette: this.params.genreMaquette,
              genreParcours: GEtatUtilisateur.Navigation.genreParcoursEducatif,
            };
          },
        );
      });
  }
}
function _initialiserTripleCombo(aInstance) {
  aInstance.setParametres(
    [EGenreRessource.Classe, EGenreRessource.Periode, EGenreRessource.Eleve],
    true,
  );
}
function _initialiserComboGenreParcours(aInstance) {
  aInstance.setOptionsObjetSaisie({
    longueur: 220,
    labelWAICellule: GTraductions.getValeur("ParcoursPeda.ComboGenreParcours"),
  });
  aInstance.setVisible(false);
}
function _setListeGenreParcours(aListeGenreParcours) {
  if (aListeGenreParcours.count() > 0) {
    aListeGenreParcours.setTri([ObjetTri.init("Genre")]).trier();
    let lIndice = -1;
    if (!!GEtatUtilisateur.Navigation.genreParcoursEducatif) {
      lIndice = aListeGenreParcours.getIndiceElementParFiltre((D) => {
        return (
          D.getGenre() === GEtatUtilisateur.Navigation.genreParcoursEducatif
        );
      });
    }
    if (lIndice === -1) {
      lIndice = 0;
    }
    this.getInstance(this.identComboGenreParcours).setDonnees(
      aListeGenreParcours,
      lIndice,
    );
  }
  this.getInstance(this.identComboGenreParcours).setVisible(true);
}
function _afficher() {
  const lEstContexteProfs = [
    EGenreEspace.Professeur,
    EGenreEspace.Etablissement,
  ].includes(GEtatUtilisateur.GenreEspace);
  this.getInstance(this.identParcours).setDonnees({
    droits: this.params.droits,
    filtres: this.params.filtres,
    ressources: this.params.ressources,
    genreMaquette: this.params.genreMaquette,
    avecTitres: true,
    avecCompteurSurCumul: lEstContexteProfs,
  });
}
module.exports = { InterfaceSaisieParcoursEducatif };
