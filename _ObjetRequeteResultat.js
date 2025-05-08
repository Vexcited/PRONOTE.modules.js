const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeNote } = require("TypeNote.js");
class _ObjetRequeteResultat extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  creerListeServices(aJSON) {
    function getCoefficient(T) {
      let R = 0;
      for (const I in T) {
        if (T[I].Coefficient) {
          const V = T[I].Coefficient.getValeur();
          if (!isNaN(V)) {
            R += V;
          }
        }
      }
      return new TypeNote(R);
    }
    function getMoyenne(T, aNom, aArrondi) {
      let R = 0,
        N = 0;
      for (const I in T) {
        const lExiste = T[I][aNom];
        if (lExiste) {
          const V = T[I][aNom].getValeur();
          if (!isNaN(V)) {
            R += T[I].Coefficient.getValeur() * V;
            N += T[I].Coefficient.getValeur();
          }
        } else if (T[I].ListeElements && T[I].ListeElements.count() > 0) {
          T[I].ListeElements.parcourir((aEle) => {
            const lExiste = aEle[aNom];
            if (lExiste) {
              const V = aEle[aNom].getValeur();
              if (!isNaN(V)) {
                R += aEle.Coefficient.getValeur() * V;
                N += aEle.Coefficient.getValeur();
              }
            }
          });
        }
      }
      const lNote = N > 0 ? new TypeNote(R / N) : new TypeNote("");
      return aArrondi
        ? new TypeNote(aArrondi.arrondir(lNote.getValeur()))
        : lNote;
    }
    function getNombreDevoirs(T) {
      let R1 = 0,
        R2 = 0,
        N = 0;
      for (const I in T) {
        if (T[I] && T[I].NombreDevoirs) {
          R1 += parseInt(T[I].NombreDevoirs.split("/")[0]);
          R2 += parseInt(T[I].NombreDevoirs.split("/")[1]);
          N++;
        }
      }
      return N > 0 ? R1 + (isNaN(R2) ? "" : "/" + R2) : "";
    }
    function getNombrePointsEleve(T) {
      let R = 0;
      for (const I in T) {
        if (T[I] && T[I].NombrePointsEleve) {
          R += T[I].NombrePointsEleve.getValeur();
        }
      }
      return new TypeNote(R > 0 ? R : "");
    }
    function calculerEstDebutRegroupement(
      aListeElements,
      aTableauDebutRegroupement,
    ) {
      for (let I = 0; I < aListeElements.count(); I++) {
        const lElement = aListeElements.get(I);
        if (!!lElement.SurMatiere) {
          const lNumeroSurMatiere = lElement.SurMatiere.getNumero();
          const lCleSurMatiere =
            lNumeroSurMatiere + "_" + lElement.OrdreRegroupement;
          if (
            lElement.SurMatiere.existeNumero() &&
            lElement.OrdreDansRegroupement ===
              aTableauDebutRegroupement[lCleSurMatiere]
          ) {
            lElement.estDebutRegroupement = true;
          }
        }
        if (lElement.ListeElements) {
          calculerEstDebutRegroupement(
            lElement.ListeElements,
            aTableauDebutRegroupement,
          );
        }
      }
    }
    this.ServiceEditable = aJSON.Editable;
    this.ExisteDevoir = false;
    this.ExisteService = false;
    this.NbrMaxServices = 0;
    this.NbrMaxDevoirs = 0;
    this.tableauSurMatieres = [];
    this.tableauDebutRegroupement = [];
    const lThis = this;
    this.ListeElements = aJSON.ListeServices;
    if (!!this.ListeElements) {
      this.ListeElements.parcourir((aService) => {
        _composeDonneesService.call(lThis, aJSON, aService);
      });
      _trierListeServices(this.ListeElements);
    }
    this.listeSurMatieres = aJSON.ListeSurMatieres;
    if (!!this.listeSurMatieres) {
      this.listeSurMatieres.parcourir((aMatiere) => {
        const lNumeroSurMatiere = aMatiere.getNumero();
        if (lThis.tableauSurMatieres[lNumeroSurMatiere]) {
          lThis.tableauSurMatieres[lNumeroSurMatiere].Arrondi =
            aMatiere.Arrondi;
          lThis.tableauSurMatieres[lNumeroSurMatiere].MoyenneClasse =
            aMatiere.MoyenneClasse;
          lThis.tableauSurMatieres[lNumeroSurMatiere].MoyenneInf =
            aMatiere.MoyenneInf;
          lThis.tableauSurMatieres[lNumeroSurMatiere].MoyenneSup =
            aMatiere.MoyenneSup;
          lThis.tableauSurMatieres[lNumeroSurMatiere].MoyenneMediane =
            aMatiere.MoyenneMediane;
        }
      });
    }
    calculerEstDebutRegroupement(
      this.ListeElements,
      this.tableauDebutRegroupement,
    );
    for (const lNumero in this.tableauSurMatieres) {
      this.tableauSurMatieres[lNumero].Coefficient = getCoefficient(
        this.tableauSurMatieres[lNumero].tableauServices,
      );
      this.tableauSurMatieres[lNumero].NombreDevoirs = getNombreDevoirs(
        this.tableauSurMatieres[lNumero].tableauServices,
      );
      this.tableauSurMatieres[lNumero].NombrePointsEleve = getNombrePointsEleve(
        this.tableauSurMatieres[lNumero].tableauServices,
      );
      this.tableauSurMatieres[lNumero].MoyenneAnnuelle = null;
      this.tableauSurMatieres[lNumero].MoyenneEleve = getMoyenne(
        this.tableauSurMatieres[lNumero].tableauServices,
        "MoyenneEleve",
        this.tableauSurMatieres[lNumero].Arrondi,
      );
      this.tableauSurMatieres[lNumero].ListeMoyennesPeriodes = [];
      for (
        let I = 0;
        I < aJSON.ParametresAffichages.NombreMoyennesPeriodes;
        I++
      ) {
        this.tableauSurMatieres[lNumero].ListeMoyennesPeriodes[I] = null;
      }
    }
    const lNouvelleListeMoyennePeriodes = [];
    const lGeneral = this.JSONReponse.General;
    if (!!lGeneral) {
      if (!!lGeneral.ListeMoyennesPeriodes) {
        lGeneral.ListeMoyennesPeriodes.forEach((aMoyennePeriode) => {
          lNouvelleListeMoyennePeriodes.push(new TypeNote(aMoyennePeriode));
        });
      }
      lGeneral.ListeMoyennesPeriodes = lNouvelleListeMoyennePeriodes;
    }
  }
}
function _trierListeServices(aListe) {
  if (!aListe) {
    return;
  }
  aListe
    .setTri([
      ObjetTri.init("OrdreRegroupement"),
      ObjetTri.init("OrdreDansRegroupement"),
      ObjetTri.init("Matiere.Libelle"),
      ObjetTri.init((D) => {
        return D.ListeProfesseurs && D.ListeProfesseurs.count()
          ? D.ListeProfesseurs.getLibelle(0)
          : "";
      }),
    ])
    .trier();
}
function _composeDonneesService(aJSON, aService, aEstSousService) {
  this.ExisteService = true;
  if (!aService.ListeNiveauDAcquisitionPeriodes) {
    aService.ListeNiveauDAcquisitionPeriodes = new ObjetListeElements();
  }
  if (!aService.SurMatiere) {
    aService.SurMatiere = new ObjetElement("", 0);
  }
  const lNouvelleListeMoyennePeriodes = [];
  if (!!aService.ListeMoyennesPeriodes) {
    aService.ListeMoyennesPeriodes.forEach((aMoyennePeriode) => {
      lNouvelleListeMoyennePeriodes.push(new TypeNote(aMoyennePeriode));
    });
  }
  aService.ListeMoyennesPeriodes = lNouvelleListeMoyennePeriodes;
  if (!!aService.SurMatiere && aService.SurMatiere.existeNumero()) {
    const lCleSurMatiere =
      aService.SurMatiere.getNumero() + "_" + aService.OrdreRegroupement;
    if (
      this.tableauDebutRegroupement[lCleSurMatiere] === null ||
      this.tableauDebutRegroupement[lCleSurMatiere] === undefined ||
      aService.OrdreDansRegroupement <
        this.tableauDebutRegroupement[lCleSurMatiere]
    ) {
      this.tableauDebutRegroupement[lCleSurMatiere] =
        aService.OrdreDansRegroupement;
    }
    if (aService.AvecMoyenneRegroupement && !aEstSousService) {
      const lNumeroSurMatiere = aService.SurMatiere.getNumero();
      if (
        this.tableauSurMatieres[lNumeroSurMatiere] === null ||
        this.tableauSurMatieres[lNumeroSurMatiere] === undefined
      ) {
        this.tableauSurMatieres[lNumeroSurMatiere] = {};
        this.tableauSurMatieres[lNumeroSurMatiere].tableauServices = [];
      }
      this.tableauSurMatieres[lNumeroSurMatiere].tableauServices.push(aService);
    }
  }
  if (!!aService.ListeElements && aService.ListeElements.count() > 0) {
    aJSON.ParametresAffichages.AvecSousService = true;
    const lThis = this;
    aService.ListeElements.parcourir((aSousService) => {
      _composeDonneesService.call(lThis, aJSON, aSousService, true);
    });
    _trierListeServices(aService.ListeElements);
  } else {
    this.NbrMaxServices++;
  }
  if (!!aService.ListeDevoirs && aService.ListeDevoirs.count() > 0) {
    this.ExisteDevoir = true;
    aService.ListeDevoirs.parcourir((aDevoir) => {
      if (!!aDevoir.ExcecutionQCM) {
        aDevoir.executionQCM = aDevoir.ExcecutionQCM;
      }
      if (!!aDevoir.ExecKiosque) {
        aDevoir.execKiosque = aDevoir.ExecKiosque;
      }
    });
    aService.ListeDevoirs.setTri([
      ObjetTri.init("Date", true),
      ObjetTri.init("Position"),
    ]);
    aService.ListeDevoirs.trier();
    if (!aService.ListeElements || aService.ListeElements.count() === 0) {
      this.NbrMaxDevoirs = Math.max(
        this.NbrMaxDevoirs,
        aService.ListeDevoirs.count(),
      );
    }
  }
}
module.exports = { _ObjetRequeteResultat };
