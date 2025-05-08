const { InterfaceParcoursPeda } = require("InterfaceParcoursPeda.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { TypeGenreMaquetteBulletin } = require("TypeGenreMaquetteBulletin.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const {
  TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const {
  TypeModuleFonctionnelPiedBulletin,
  TypeModuleFonctionnelPiedBulletinUtil,
} = require("TypeModuleFonctionnelPiedBulletin.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class PiedBulletin_ParcoursEducatif extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets,
      avecContenuVide: false,
      avecTitreModule: false,
      periodeCloture: false,
      droits: { avecSaisie: false },
    };
  }
  construireInstances() {
    this.identParcoursEducatif = this.add(
      InterfaceParcoursPeda,
      null,
      (aInstance) => {
        aInstance.avecEventResizeNavigateur = function () {
          return false;
        };
      },
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identParcoursEducatif;
    this.avecBandeau = this.params.avecTitreModule;
    this.AvecCadre = false;
  }
  construireStructureAffichageBandeau() {
    const T = [];
    T.push('<div class="EspaceBas EspaceHaut Gras">');
    T.push(
      TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
        TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
      ),
    );
    T.push("</div>");
    return T.join("");
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
    this.params.tabGenreParcours = this._getTabGenreParcours();
  }
  setParametres(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    const lPeriode = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Periode,
    );
    let lEstPeriodeValable = true;
    if (!lPeriode || !lPeriode.existeNumero()) {
      lEstPeriodeValable = false;
    }
    return (
      lEstPeriodeValable &&
      this.params.tabGenreParcours.length > 0 &&
      (this.params.droits.avecSaisie ||
        this.params.listeEvntsParcoursPeda.count() > 0 ||
        this.params.avecContenuVide)
    );
  }
  _getTabGenreParcours() {
    const lTabGenreParcours = [];
    const lListe = this.params.listeGenreParcours;
    if (lListe && lListe.count() > 0) {
      for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
        const lElt = lListe.get(i);
        if (lElt.autorise) {
          lTabGenreParcours.push(lElt.getGenre());
        }
      }
    }
    return lTabGenreParcours;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        if (this.params.tabGenreParcours.length > 0) {
          const lTabGenreParcours = this._getTabGenreParcours();
          const lEstContexteProfs = [
            EGenreEspace.Professeur,
            EGenreEspace.PrimProfesseur,
            EGenreEspace.Etablissement,
            EGenreEspace.PrimDirection,
          ].includes(GEtatUtilisateur.GenreEspace);
          Promise.resolve()
            .then(() => {
              return this.getInstance(
                this.identParcoursEducatif,
              ).recupererDonnees({
                classeGroupe: GEtatUtilisateur.Navigation.getRessource(
                  EGenreRessource.Classe,
                ),
                periode: GEtatUtilisateur.Navigation.getRessource(
                  EGenreRessource.Periode,
                ),
                listeEleves:
                  this.params.contexte === TypeContexteBulletin.CB_Eleve
                    ? GEtatUtilisateur.Navigation.getRessources(
                        EGenreRessource.Eleve,
                      )
                    : GEtatUtilisateur.Navigation.getRessources(
                        EGenreRessource.Classe,
                      ),
                pourClasseGroupeEntier:
                  this.params.contexte !== TypeContexteBulletin.CB_Eleve,
                genreMaquette: [
                  EGenreOnglet.Bulletins,
                  EGenreOnglet.ConseilDeClasse,
                ].includes(GEtatUtilisateur.getGenreOnglet())
                  ? TypeGenreMaquetteBulletin.tGMB_Notes
                  : TypeGenreMaquetteBulletin.tGMB_Competences,
              });
            })
            .then(() => {
              this.getInstance(this.identParcoursEducatif).setDonnees({
                droits: { avecSaisie: this.params.droits.avecSaisie },
                filtres: {
                  avecCumulParEleves: false,
                  avecCumulParGenreParcours: true,
                  genreParcours: lTabGenreParcours,
                },
                ressources:
                  this.params.contexte === TypeContexteBulletin.CB_Eleve
                    ? GEtatUtilisateur.Navigation.getRessources(
                        EGenreRessource.Eleve,
                      )
                    : GEtatUtilisateur.Navigation.getRessources(
                        EGenreRessource.Classe,
                      ),
                genreMaquette: [
                  EGenreOnglet.Bulletins,
                  EGenreOnglet.ConseilDeClasse,
                ].includes(GEtatUtilisateur.getGenreOnglet())
                  ? TypeGenreMaquetteBulletin.tGMB_Notes
                  : TypeGenreMaquetteBulletin.tGMB_Competences,
                avecTitres: lEstContexteProfs,
                avecCompteurSurCumul: lEstContexteProfs,
              });
            });
        }
        break;
    }
  }
  getDonneesSaisie() {
    if (
      [
        TypeModeAffichagePiedBulletin.MAPB_Onglets,
        TypeModeAffichagePiedBulletin.MAPB_Lineaire,
      ].includes(this.params.modeAffichage)
    ) {
      return this.getInstance(this.identParcoursEducatif)._getDonneesSaisie();
    }
  }
  actualiserSurChangementTabOnglet() {
    if (this.getInstance(this.identParcoursEducatif)) {
      this.getInstance(
        this.identParcoursEducatif,
      ).actualiserSurChangementTabOnglet();
    }
  }
}
module.exports = { PiedBulletin_ParcoursEducatif };
