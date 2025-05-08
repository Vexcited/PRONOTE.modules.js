const { MethodesObjet } = require("MethodesObjet.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeVoeuRencontreUtil } = require("Enumere_VoeuRencontre.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
function TUtilitaireRencontre() {}
TUtilitaireRencontre.chercherIndiceSessionProchaineSession = function (
  aListeSessionsRencontre,
) {
  const lDateCourante = GDate.getDateCourante();
  let lDateLaPlusProche = GDate.derniereDate;
  let lIndiceTrouve = aListeSessionsRencontre.count() - 1;
  for (let lIndice = 0; lIndice < aListeSessionsRencontre.count(); lIndice++) {
    const lSession = aListeSessionsRencontre.get(lIndice);
    if (
      (GDate.estJourEgal(lSession.date, lDateCourante) ||
        lSession.date > lDateCourante) &&
      lSession.date < lDateLaPlusProche
    ) {
      lDateLaPlusProche = lSession.date;
      lIndiceTrouve = lIndice;
    }
  }
  return lIndiceTrouve;
};
TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo = function (
  aListeSessionsRencontre,
  aPourMobile,
) {
  const lResult = new ObjetListeElements();
  if (!!aListeSessionsRencontre) {
    aListeSessionsRencontre.parcourir((D) => {
      const lCopieSession = MethodesObjet.dupliquer(D);
      const lNouveauLibelle = [];
      if (aPourMobile) {
        lCopieSession.sousTitre = D.getLibelle();
        lNouveauLibelle.push(
          GDate.formatDate(
            D.date,
            "[" + GTraductions.getValeur("Le").ucfirst() + " %JJJJ %JJ %MMMM]",
          ),
        );
      } else {
        lNouveauLibelle.push(
          GDate.formatDate(
            D.date,
            "[" + GTraductions.getValeur("Le").ucfirst() + " %JJJJ %JJ %MMMM]",
          ),
          " - ",
          D.getLibelle(),
        );
      }
      lCopieSession.setLibelle(lNouveauLibelle.join(""));
      lResult.addElement(lCopieSession);
    });
  }
  return lResult;
};
TUtilitaireRencontre.existePlusieursMatieresPourLEleve = function (
  aListeRencontres,
  aEleve,
) {
  let result = false;
  if (!!aListeRencontres && !!aEleve) {
    let lNomMatiere;
    aListeRencontres.parcourir((aRencontre) => {
      if (
        !!aRencontre.eleve &&
        aRencontre.eleve.getNumero() === aEleve.getNumero()
      ) {
        if (!lNomMatiere) {
          lNomMatiere = aRencontre.strMatiereFonction || "";
        } else if (aRencontre.strMatiereFonction !== lNomMatiere) {
          result = true;
          return false;
        }
      }
    });
  }
  return result;
};
TUtilitaireRencontre.laRencontreEstUneRencontreDePersonnel = function (
  aRencontre,
) {
  let lEstUneRencontrePersonnel = false;
  if (!!aRencontre.personnels && aRencontre.personnels.count() > 0) {
    lEstUneRencontrePersonnel = true;
    if (!!aRencontre.professeurs && aRencontre.professeurs.count() > 0) {
      lEstUneRencontrePersonnel = !aRencontre.strMatiereFonction;
    }
  }
  return lEstUneRencontrePersonnel;
};
TUtilitaireRencontre.construitListeInterlocuteursTriees = function (
  aRencontre,
) {
  const lListeInterlocuteurs = new ObjetListeElements();
  if (this.laRencontreEstUneRencontreDePersonnel(aRencontre)) {
    lListeInterlocuteurs.add(aRencontre.personnels);
    lListeInterlocuteurs.add(aRencontre.professeurs);
  } else {
    lListeInterlocuteurs.add(aRencontre.professeurs);
    lListeInterlocuteurs.add(aRencontre.personnels);
  }
  return lListeInterlocuteurs;
};
TUtilitaireRencontre.concernentPlusieursElevesDifferents = function (
  aListeRencontres,
) {
  let lPlusieursEleves = false;
  if (!!aListeRencontres) {
    let lNumeroEleve = null;
    aListeRencontres.parcourir((D) => {
      if (!!D && !!D.eleve) {
        if (lNumeroEleve === null) {
          lNumeroEleve = D.eleve.getNumero();
        } else if (D.eleve.getNumero() !== lNumeroEleve) {
          lPlusieursEleves = true;
          return false;
        }
      }
    });
  }
  return lPlusieursEleves;
};
function _leNombreMaxDeVoeuxEstAtteintSelonFiltre(
  aListeRencontres,
  aGenreVoeu,
  aNbMaxSaisissable,
  aFiltreAccepteRencontre,
) {
  let lNbMaxEstAtteint = false;
  if (
    !!aNbMaxSaisissable &&
    !!aListeRencontres &&
    aListeRencontres.count() > 0
  ) {
    let lNbActifsPourLeGenreVoeu = 0;
    aListeRencontres.parcourir((aRencontre) => {
      if (
        aRencontre &&
        aRencontre.validationvoeu &&
        aRencontre.voeu === aGenreVoeu
      ) {
        if (!aFiltreAccepteRencontre || aFiltreAccepteRencontre(aRencontre)) {
          lNbActifsPourLeGenreVoeu++;
          if (lNbActifsPourLeGenreVoeu >= aNbMaxSaisissable) {
            lNbMaxEstAtteint = true;
            return false;
          }
        }
      }
    });
  }
  return lNbMaxEstAtteint;
}
TUtilitaireRencontre.leNombreMaxDeVoeuxEstAtteintPourLaClasse = function (
  aListeRencontres,
  aGenreVoeu,
  aNbMaxSaisissable,
  aClasse,
) {
  const lFunctionFiltre = function (aArticleTeste) {
    let lNumeroClasse = null;
    if (!!aArticleTeste.classe) {
      lNumeroClasse = aArticleTeste.classe.getNumero();
    }
    return aClasse.getNumero() === lNumeroClasse;
  };
  return _leNombreMaxDeVoeuxEstAtteintSelonFiltre(
    aListeRencontres,
    aGenreVoeu,
    aNbMaxSaisissable,
    lFunctionFiltre,
  );
};
TUtilitaireRencontre.leNombreMaxDeVoeuxEstAtteintPourLEnfant = function (
  aListeRencontres,
  aGenreVoeu,
  aNbMaxSaisissable,
  aEnfant,
) {
  const lFunctionFiltre = function (aArticleTeste) {
    let lNumeroEleve = null;
    if (!!aArticleTeste.eleve) {
      lNumeroEleve = aArticleTeste.eleve.getNumero();
    }
    return aEnfant.getNumero() === lNumeroEleve;
  };
  return _leNombreMaxDeVoeuxEstAtteintSelonFiltre(
    aListeRencontres,
    aGenreVoeu,
    aNbMaxSaisissable,
    lFunctionFiltre,
  );
};
TUtilitaireRencontre.getLimiteNbSaisissable = function (
  aListeVoeux,
  aGenreVoeu,
) {
  let lNbMax = 0;
  if (!!aListeVoeux) {
    const lVoeu = aListeVoeux.getElementParGenre(aGenreVoeu);
    if (!!lVoeu && (!!lVoeu.limiteNbSaisies || lVoeu.limiteNbSaisies === 0)) {
      lNbMax = lVoeu.limiteNbSaisies;
    }
  }
  return lNbMax;
};
TUtilitaireRencontre.getPlaceEnHeure = function (aPlace) {
  const lDate = TUtilitaireRencontre.getPlaceEnDate(aPlace);
  return GDate.formatDate(lDate, "%hh%sh%mm");
};
TUtilitaireRencontre.getPlaceEnDate = function (aPlace) {
  const lHeure = Math.floor(aPlace / 60);
  const lMinute = aPlace - lHeure * 60;
  const lDate = new Date();
  lDate.setHours(lHeure);
  lDate.setMinutes(lMinute);
  lDate.setSeconds(0);
  lDate.setMilliseconds(0);
  return lDate;
};
TUtilitaireRencontre.getPlaceHeurePleinePrecedente = function (aPlace, aPas) {
  const lHeureDebutSession = Math.floor(aPlace / 60);
  const lNbPlacesParHeure = Math.floor(60 / aPas);
  return lHeureDebutSession * lNbPlacesParHeure * aPas;
};
TUtilitaireRencontre.calculePlacesDisponibilites = function (
  aPlaceDebutSession,
  aPlaceFinSession,
  aPas,
  aIndisponibilitesPersonnelles,
) {
  const lPlaceDebutHeurePleine =
    TUtilitaireRencontre.getPlaceHeurePleinePrecedente(
      aPlaceDebutSession,
      aPas,
    );
  const lIndisponibilitesCompletes = new TypeEnsembleNombre();
  lIndisponibilitesCompletes.add(aIndisponibilitesPersonnelles);
  const placesDisponibilites = new ObjetListeElements();
  let lDispoCourante = null;
  let indexZone = 0;
  for (let i = lPlaceDebutHeurePleine; i < aPlaceFinSession; i += aPas) {
    if (i >= aPlaceDebutSession) {
      if (!lIndisponibilitesCompletes.contains(indexZone)) {
        if (lDispoCourante === null) {
          lDispoCourante = new ObjetElement({ placeDebut: i });
        }
      } else {
        if (lDispoCourante !== null) {
          lDispoCourante.placeFin = i;
          placesDisponibilites.add(lDispoCourante);
          lDispoCourante = null;
        }
      }
    }
    indexZone++;
  }
  if (!!lDispoCourante) {
    lDispoCourante.placeFin = aPlaceFinSession;
    placesDisponibilites.add(lDispoCourante);
  }
  return placesDisponibilites;
};
TUtilitaireRencontre.getListePlagesHoraireContinues = function (
  aTypeEnsembleNombre,
) {
  const result = [];
  if (!!aTypeEnsembleNombre) {
    let lTempPlage;
    for (let i = 0; i < aTypeEnsembleNombre.items().length; i++) {
      const elem = aTypeEnsembleNombre.get(i);
      if (!lTempPlage) {
        lTempPlage = { placeDebut: elem, placeFin: elem + 1 };
        result.push(lTempPlage);
      } else {
        if (lTempPlage.placeFin === elem) {
          lTempPlage.placeFin = elem + 1;
        } else {
          lTempPlage = { placeDebut: elem, placeFin: elem + 1 };
          result.push(lTempPlage);
        }
      }
    }
  }
  return result;
};
TUtilitaireRencontre.concernePlusieursGenreInterlocuteurs = function (
  aListeRencontres,
) {
  let lConcernePlusieursGenresInterlocuteurs = false;
  if (!!aListeRencontres) {
    const lListeGenreInterlocuteurs = [];
    aListeRencontres.parcourir((D) => {
      if (!!D.professeurs && D.professeurs.count() > 0) {
        if (lListeGenreInterlocuteurs.indexOf(EGenreEspace.Professeur) === -1) {
          lListeGenreInterlocuteurs.push(EGenreEspace.Professeur);
        }
      }
      if (!!D.personnels && D.personnels.count() > 0) {
        if (
          lListeGenreInterlocuteurs.indexOf(EGenreEspace.Etablissement) === -1
        ) {
          lListeGenreInterlocuteurs.push(EGenreEspace.Etablissement);
        }
      }
      if (lListeGenreInterlocuteurs.length > 1) {
        lConcernePlusieursGenresInterlocuteurs = true;
        return false;
      }
    });
  }
  return lConcernePlusieursGenresInterlocuteurs;
};
TUtilitaireRencontre.formaterListeRencontresAvecProfesseurs = function (
  aListeRencontres,
) {
  const result = new ObjetListeElements();
  const lAvecLignesCumul =
    TUtilitaireRencontre.concernePlusieursGenreInterlocuteurs(aListeRencontres);
  aListeRencontres.parcourir((D) => {
    result.addElement(D);
    D.listeInterlocuteursTriees =
      TUtilitaireRencontre.construitListeInterlocuteursTriees(D);
    D.eleve = GEtatUtilisateur.getMembre();
    if (lAvecLignesCumul) {
      const lAjoutSousDeploiementProfesseur =
        !TUtilitaireRencontre.laRencontreEstUneRencontreDePersonnel(D);
      if (lAjoutSousDeploiementProfesseur) {
        let lPereProfesseur = result.getElementParNumero(
          EGenreEspace.Professeur,
        );
        if (!lPereProfesseur) {
          lPereProfesseur = new ObjetElement(
            GTraductions.getValeur("Rencontres.professeurs"),
            EGenreEspace.Professeur,
          );
          lPereProfesseur.estUnDeploiement = true;
          lPereProfesseur.estDeploye = true;
          lPereProfesseur.Genre = EGenreRessource.Enseignant;
          result.addElement(lPereProfesseur);
        }
        D.pere = lPereProfesseur;
      } else {
        let lPerePersonnel = result.getElementParNumero(
          EGenreEspace.Etablissement,
        );
        if (!lPerePersonnel) {
          lPerePersonnel = new ObjetElement(
            GTraductions.getValeur("Rencontres.personnels"),
            EGenreEspace.Etablissement,
          );
          lPerePersonnel.estUnDeploiement = true;
          lPerePersonnel.estDeploye = true;
          lPerePersonnel.Genre = EGenreRessource.Personnel;
          result.addElement(lPerePersonnel);
        }
        D.pere = lPerePersonnel;
      }
    }
  });
  result.setTri([
    ObjetTri.init((D) => {
      return !!D.pere
        ? D.pere.getNumero() !== EGenreEspace.Professeur
        : D.getNumero() !== EGenreEspace.Professeur;
    }),
    ObjetTri.init((D) => {
      return !D.estUnDeploiement;
    }),
    ObjetTri.init((D) => {
      if (
        !!D.pere &&
        !!D.listeInterlocuteursTriees &&
        D.listeInterlocuteursTriees.count() > 0
      ) {
        return D.listeInterlocuteursTriees.getPremierElement().getPosition();
      } else {
        return 0;
      }
    }),
  ]);
  result.trier();
  return result;
};
TUtilitaireRencontre.formaterListeRencontresAvecParents = function (
  aListeDonnees,
) {
  function _getListeEleveEtMatiere(aNumeroEleve, aLibelleMatiere, aRencontre) {
    return (
      aRencontre.eleve.getNumero() === aNumeroEleve &&
      aRencontre.strMatiereFonction === aLibelleMatiere
    );
  }
  const lListeDesiderata = new ObjetListeElements();
  let lPere;
  let lNrElevePrecedent;
  let lEleve;
  let lAvecAffichageMatiere = false;
  let lStrMatiereFonctionPrecedente;
  for (let i = 0; i < aListeDonnees.count(); i++) {
    const lElement = aListeDonnees.get(i);
    if (!lPere || lPere.classe.getNumero() !== lElement.classe.getNumero()) {
      lPere = new ObjetElement("", null, 1);
      lPere.classe = MethodesObjet.dupliquer(lElement.classe);
      lPere.titre = lPere.classe.getLibelle();
      lPere.estUneClasse = true;
      lPere.estUnDeploiement = true;
      lPere.estDeploye = true;
      lListeDesiderata.addElement(lPere);
    }
    if (lElement.estMultiIntervenants) {
      lPere.estMultiIntervenants = true;
    }
    const lNrEleve = lElement.eleve.getNumero();
    const lStrMatiereFonction = lElement.strMatiereFonction || "";
    const lListeRencontresDEleveEtMatiere = aListeDonnees.getListeElements(
      _getListeEleveEtMatiere.bind(null, lNrEleve, lStrMatiereFonction),
    );
    lAvecAffichageMatiere =
      TUtilitaireRencontre.existePlusieursMatieresPourLEleve(
        aListeDonnees,
        lElement.eleve,
      );
    if (lListeRencontresDEleveEtMatiere.count() > 1) {
      if (
        lNrEleve !== lNrElevePrecedent ||
        lStrMatiereFonction !== lStrMatiereFonctionPrecedente
      ) {
        lEleve = new ObjetElement("", null, 2);
        lEleve.classe = MethodesObjet.dupliquer(lElement.classe);
        lEleve.eleve = MethodesObjet.dupliquer(lElement.eleve);
        lEleve.pere = lPere;
        lEleve.titre =
          lElement.eleve.getLibelle() +
          (lAvecAffichageMatiere ? " (" + lStrMatiereFonction + ")" : "");
        lEleve.strMatiereFonction = lElement.strMatiereFonction;
        lEleve.estUnDeploiement = false;
        lEleve.estDeploye = true;
        lEleve.estUnEleve = true;
        lListeDesiderata.addElement(lEleve);
      }
      lElement.estCumulDEleve = true;
    } else {
      lEleve = null;
    }
    lNrElevePrecedent = lNrEleve;
    lStrMatiereFonctionPrecedente = lStrMatiereFonction;
    if (lEleve) {
      lElement.pere = lEleve;
      lElement.titre = lElement.strResponsables || "";
    } else {
      lElement.pere = lPere;
      lElement.titre =
        lElement.eleve.getLibelle() +
        (lAvecAffichageMatiere ? " (" + lStrMatiereFonction + ")" : "");
    }
    lListeDesiderata.addElement(lElement);
  }
  return lListeDesiderata;
};
TUtilitaireRencontre.ouvrirFenetreLegende = function (aListeVoeux) {
  if (aListeVoeux) {
    const H = ['<ul class="legende-rencontres">'];
    aListeVoeux.parcourir((aVoeu) => {
      const lLabel = TypeVoeuRencontreUtil.getLibelle(aVoeu.getGenre());
      H.push(
        `<li>\n        <ie-radio tabindex="-1" aria-hidden="true" checked class="as-chips ${TypeVoeuRencontreUtil.getClass(aVoeu.getGenre())}">${lLabel}</ie-radio>\n        <p><span class="sr-only">${lLabel}&nbsp;</span>${aVoeu.legende}</p>`,
      );
    });
    const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
      pere: this,
      initialiser: function (aInstance) {
        aInstance.duree = this.duree;
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("Legende"),
          largeur: 525,
          hauteur: 250,
          listeBoutons: [GTraductions.getValeur("Fermer")],
        });
      },
    });
    lFenetre.afficher(H.join(""));
  } else {
  }
  return;
};
module.exports = { TUtilitaireRencontre };
