exports.UtilitairePrefsGrilleStructure = UtilitairePrefsGrilleStructure;
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
function UtilitairePrefsGrilleStructure() {}
UtilitairePrefsGrilleStructure.modeles = { defaut: -1, perso: -2 };
UtilitairePrefsGrilleStructure.getGenreRessource = function (aRessources) {
  let lGenreRessource = null;
  if (aRessources && aRessources.count() > 0) {
    aRessources.parcourir((aRessource) => {
      let lGenreRessourceCourante = aRessource.getGenre();
      if (
        GApplication.getEtatUtilisateur().pourPrimaire() &&
        (lGenreRessourceCourante ===
          Enumere_Ressource_1.EGenreRessource.Groupe ||
          lGenreRessourceCourante === Enumere_Ressource_1.EGenreRessource.Eleve)
      ) {
        lGenreRessourceCourante = Enumere_Ressource_1.EGenreRessource.Classe;
      }
      if (lGenreRessource === null) {
        lGenreRessource = lGenreRessourceCourante;
      } else if (lGenreRessource !== lGenreRessourceCourante) {
        lGenreRessource = null;
        return false;
      }
    });
  }
  return lGenreRessource;
};
UtilitairePrefsGrilleStructure.getPrefsGrille = function (
  aGenreRessource,
  aEstPlanning,
  aNumeroEtablisssement,
) {
  let lPrefs;
  let lNumeroModele = UtilitairePrefsGrilleStructure.modeles.defaut;
  const lGenreRessource =
    aGenreRessource instanceof ObjetListeElements_1.ObjetListeElements
      ? UtilitairePrefsGrilleStructure.getGenreRessource(aGenreRessource)
      : aGenreRessource;
  if (
    lGenreRessource !== null &&
    lGenreRessource !== Enumere_Ressource_1.EGenreRessource.Aucune
  ) {
    lPrefs = GApplication.parametresUtilisateur.get(
      UtilitairePrefsGrilleStructure.getCleModelePrefsGrille(
        lGenreRessource,
        aEstPlanning,
      ),
    );
    if (lPrefs && lPrefs.joursOuvres) {
      lNumeroModele = lPrefs.modele;
    }
  }
  if (lNumeroModele === UtilitairePrefsGrilleStructure.modeles.perso) {
    const lNbJours = IE.Cycles.indicesJoursOuvres().length;
    lPrefs.joursOuvres.items().forEach((aIndice) => {
      if (aIndice >= lNbJours) {
        lPrefs.joursOuvres.remove(aIndice);
      }
    });
    return lPrefs;
  } else {
    lPrefs = null;
    let lNumeroEtablissement = null;
    if (lNumeroModele === UtilitairePrefsGrilleStructure.modeles.defaut) {
      lNumeroEtablissement = aNumeroEtablisssement;
    } else {
      lNumeroEtablissement = lNumeroModele;
    }
    if (GApplication.getEtatUtilisateur().tabEtablissementsModeleGrille) {
      GApplication.getEtatUtilisateur().tabEtablissementsModeleGrille.forEach(
        (aModeleEtab) => {
          if (aModeleEtab.numero === lNumeroEtablissement) {
            lPrefs = aModeleEtab;
            return false;
          }
        },
      );
    }
    if (lPrefs) {
      return lPrefs;
    }
  }
  return UtilitairePrefsGrilleStructure.getPrefsGrilleDefaut();
};
UtilitairePrefsGrilleStructure.getPrefsGrilleDefaut = function () {
  const lJoursOuvres = new TypeEnsembleNombre_1.TypeEnsembleNombre();
  IE.Cycles.indicesJoursOuvres().forEach((aJour, aIndice) => {
    lJoursOuvres.add(aIndice);
  });
  return {
    placeDebut: 0,
    placeFin: GParametres.PlacesParJour - 1,
    nbPas: 1,
    joursOuvres: lJoursOuvres,
  };
};
UtilitairePrefsGrilleStructure.getCleModelePrefsGrille = function (
  aGenreRessource,
  aEstPlanning,
) {
  return (
    "EDT.Prefs." +
    (aEstPlanning ? 1 : 0) +
    "." +
    (aGenreRessource || Enumere_Ressource_1.EGenreRessource.Enseignant)
  );
};
UtilitairePrefsGrilleStructure.getDomaineJoursOuvresDePrefsGrille = function (
  aPrefGrille,
) {
  const lJoursOuvres = MethodesObjet_1.MethodesObjet.dupliquer(
    GParametres.JoursOuvres,
  );
  if (!aPrefGrille) {
    return lJoursOuvres;
  }
  lJoursOuvres.getSemaines().forEach((aJour, aIndex) => {
    if (aPrefGrille.joursOuvres.items().indexOf(aIndex) < 0) {
      lJoursOuvres.setValeur(false, aJour);
    }
  });
  return lJoursOuvres;
};
UtilitairePrefsGrilleStructure.getProchaineDateOuvreeDePrefsGrille = function (
  aDate,
  aPrefGrille,
) {
  const lResult = { date: aDate, trouve: false, dateChangee: false };
  if (!aPrefGrille) {
    return lResult;
  }
  while (
    !lResult.trouve &&
    ObjetDate_1.GDate.estDateDansAnneeScolaire(lResult.date)
  ) {
    const lJourCycle = IE.Cycles.dateEnJourCycle(lResult.date);
    if (aPrefGrille.joursOuvres.indexOf(lJourCycle) < 0) {
      lResult.date = ObjetDate_1.GDate.getJourSuivant(lResult.date);
      lResult.dateChangee = true;
    } else {
      lResult.trouve = true;
    }
  }
  return lResult;
};
(function (UtilitairePrefsGrilleStructure) {
  let modeles;
  (function (modeles) {
    modeles[(modeles["defaut"] = -1)] = "defaut";
    modeles[(modeles["perso"] = -2)] = "perso";
  })(modeles || (modeles = {}));
})(
  UtilitairePrefsGrilleStructure ||
    (exports.UtilitairePrefsGrilleStructure = UtilitairePrefsGrilleStructure =
      {}),
);
