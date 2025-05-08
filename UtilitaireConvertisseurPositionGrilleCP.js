exports.TUtilitaireConvertisseurPosition_GrilleCP = void 0;
const MethodesObjet_1 = require("MethodesObjet");
class TUtilitaireConvertisseurPosition_GrilleCP {
  constructor(aOptions) {
    this.options = { grille: null, optionsGrille: null };
    if (aOptions) {
      this.setOptions(aOptions);
    }
  }
  setOptions(aOptions) {
    $.extend(this.options, aOptions);
    return this;
  }
  getDureeCours(aCours) {
    return 0;
  }
  getPlaceDebutCours(aCours, aAvecPlaceNonVisible) {
    return -1;
  }
  getPlaceFinCours(aCours, aAvecPlaceNonVisible) {
    if (!aCours || aCours.horsHoraire) {
      return -1;
    }
    let lPlaceDebut = this.getPlaceDebutCours(aCours, aAvecPlaceNonVisible);
    if (lPlaceDebut < 0) {
      return -1;
    }
    const lDureeCours = this.getDureeCours(aCours);
    let lPlaceFin =
      (aAvecPlaceNonVisible
        ? lPlaceDebut
        : this.getPlaceDebutCours(aCours, true)) +
      lDureeCours -
      1;
    if (aAvecPlaceNonVisible) {
      return lPlaceFin;
    }
    const lTrancheHoraire = this.options.grille.getTrancheHoraireDePlace(
      lPlaceFin,
      true,
    );
    const lTrancheHoraireDebut = this.options.grille.getTrancheHoraireDePlace(
      lPlaceDebut,
      true,
    );
    const lHoraireDebut =
      this.options.optionsGrille.blocHoraires.rechercheHoraire(
        lTrancheHoraireDebut.horaire,
        true,
      );
    if (lTrancheHoraire.tranche !== lTrancheHoraireDebut.tranche) {
      return lPlaceDebut + lHoraireDebut.fin - lTrancheHoraireDebut.horaire;
    }
    const lHoraire = this.options.optionsGrille.blocHoraires.rechercheHoraire(
      lTrancheHoraire.horaire,
      true,
    );
    if (lHoraireDebut.indiceBloc < lHoraire.indiceBloc) {
      return lPlaceDebut + lHoraireDebut.fin - lTrancheHoraireDebut.horaire;
    }
    if (
      (lHoraire.trouve || lHoraire.trouveNonVisible) &&
      lTrancheHoraire.horaire > lHoraire.fin
    ) {
      const lDifference = lTrancheHoraire.horaire - lHoraire.fin;
      if (lDureeCours - lDifference > 0) {
        lPlaceFin = lPlaceFin - lDifference;
      } else {
        lPlaceFin = -1;
      }
    }
    return lPlaceFin;
  }
  _recherchePlaceDeCours(
    aPlace,
    aDuree,
    aTrancheHoraire,
    aEstDebut,
    aNonVisible,
  ) {
    const lResult = { trouve: false, place: aPlace };
    if (aTrancheHoraire.erreur) {
      lResult.place = -1;
    }
    const lBlocHoraire = this.options.grille
      .getOptionsBlocHoraires()
      .rechercheHoraire(aTrancheHoraire.horaire, true);
    if (
      lBlocHoraire &&
      (lBlocHoraire.trouve || lBlocHoraire.trouveNonVisible)
    ) {
      if (!aNonVisible || lBlocHoraire.trouve) {
        let lDifference;
        if (
          (aEstDebut && aTrancheHoraire.horaire < lBlocHoraire.debut) ||
          (!aEstDebut && aTrancheHoraire.horaire > lBlocHoraire.fin)
        ) {
          lDifference = aEstDebut
            ? lBlocHoraire.debut - aTrancheHoraire.horaire
            : aTrancheHoraire.horaire - lBlocHoraire.fin;
          if (aDuree - lDifference > 0) {
            lResult.place = aPlace + (aEstDebut ? lDifference : -lDifference);
          } else {
            lResult.place = -1;
          }
        }
      } else {
        lResult.place = aPlace;
      }
      lResult.trouve = true;
    } else {
      lResult.place = -1;
    }
    return lResult;
  }
  _getPlaceGrilleDePlaceCours(
    aPlaceCours,
    aDureeCours,
    aEstDebut,
    aNonVisible,
  ) {
    let lPlace = -1;
    const lNbHoraires = this.options.optionsGrille.blocHoraires.nbHoraires();
    this.options.optionsGrille.tranches.parcourir(
      (aNumeroTranche, aTranche) => {
        const lAvecIndiceJour = MethodesObjet_1.MethodesObjet.isNumber(
          aTranche.indiceJour,
        );
        if (!lAvecIndiceJour) {
          lPlace = aPlaceCours;
        } else {
          lPlace =
            aPlaceCours - (aTranche.indiceJour - aNumeroTranche) * lNbHoraires;
        }
        const lPlaceJour = lPlace - aNumeroTranche * lNbHoraires;
        const lTrancheHoraire = this.options.grille.getTrancheHoraireDePlace(
          lPlaceJour,
          true,
        );
        const lTranche = this.options.optionsGrille.tranches.get(
          lTrancheHoraire.tranche + aNumeroTranche,
        );
        if (
          !lTranche ||
          (lAvecIndiceJour && lTranche.indiceJour !== aTranche.indiceJour)
        ) {
          lPlace = -1;
        } else {
          const lResult = this._recherchePlaceDeCours(
            lPlace,
            aDureeCours,
            lTrancheHoraire,
            aEstDebut,
            aNonVisible,
          );
          lPlace = lResult.place;
          if (lResult.trouve) {
            return false;
          }
        }
      },
    );
    return lPlace;
  }
  _recherchePlaceGrillePlanning(aParams) {
    const lResult = { place: -1, modifie: false };
    this.options.grille
      .getOptionsBlocHoraires()
      .parcourirBlocs((aBlocHoraire) => {
        let lNumeroHoraire;
        if (MethodesObjet_1.MethodesObjet.isNumber(aBlocHoraire.indiceJour)) {
          if (aParams.indiceJourCours !== aBlocHoraire.indiceJour) {
            return;
          }
          lNumeroHoraire =
            aParams.placeCours -
            (aBlocHoraire.indiceJour - aBlocHoraire.indiceBloc) *
              GParametres.PlacesParJour;
        } else {
          lNumeroHoraire = aParams.placeCours;
        }
        lResult.place = this.options.grille.getPlaceDeTrancheHoraire({
          tranche: aParams.numeroTranche,
          horaire: lNumeroHoraire,
        });
        lResult.modifie = true;
        if (aParams.nonVisible) {
          return false;
        }
        const lTrancheHoraire = this.options.grille.getTrancheHoraireDePlace(
          lNumeroHoraire,
          true,
        );
        const lResultRecherche = this._recherchePlaceDeCours(
          lResult.place,
          aParams.dureeCours,
          lTrancheHoraire,
          aParams.debut,
        );
        lResult.place = lResultRecherche.place;
        if (lResultRecherche.trouve) {
          return false;
        }
      });
    return lResult;
  }
  _getPlaceGrilleDePlacePlanningSemaine(
    aPlaceCours,
    aDureeCours,
    aSemaineCours,
    aDebut,
    aNonVisible,
  ) {
    let lPlace = -1;
    const lIndiceJourCours = Math.floor(
      aPlaceCours / GParametres.PlacesParJour,
    );
    this.options.optionsGrille.tranches.parcourir(
      (aNumeroTranche, aTranche) => {
        if (aSemaineCours === aTranche.numeroSemaine) {
          const lRecherche = this._recherchePlaceGrillePlanning({
            placeCours: aPlaceCours,
            dureeCours: aDureeCours,
            debut: aDebut,
            nonVisible: aNonVisible,
            numeroTranche: aNumeroTranche,
            indiceJourCours: lIndiceJourCours,
          });
          if (lRecherche.modifie) {
            lPlace = lRecherche.place;
          }
        }
      },
    );
    return lPlace;
  }
  _getPlaceGrilleDePlacePlanningGeneral(
    aPlaceCours,
    aDureeCours,
    aRessourceCours,
    aDebut,
    aNonVisible,
  ) {
    let lPlace = -1;
    const lIndiceJourCours = Math.floor(
      aPlaceCours / GParametres.PlacesParJour,
    );
    this.options.optionsGrille.tranches.parcourir(
      (aNumeroTranche, aTranche) => {
        if (
          aRessourceCours &&
          aTranche.ressource &&
          aTranche.ressource.getNumero() === aRessourceCours.getNumero()
        ) {
          const lRecherche = this._recherchePlaceGrillePlanning({
            placeCours: aPlaceCours,
            dureeCours: aDureeCours,
            debut: aDebut,
            nonVisible: aNonVisible,
            numeroTranche: aNumeroTranche,
            indiceJourCours: lIndiceJourCours,
          });
          if (lRecherche.modifie) {
            lPlace = lRecherche.place;
          }
        }
      },
    );
    return lPlace;
  }
}
exports.TUtilitaireConvertisseurPosition_GrilleCP =
  TUtilitaireConvertisseurPosition_GrilleCP;
