const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const UtilitaireFormaterListeParMatiereEtFonction = {
  formaterListeParMatiere(aListeEquipePedagogique) {
    let newListe = new ObjetListeElements();
    const lListeEquipePedagogique = MethodesObjet.dupliquer(
      aListeEquipePedagogique,
    );
    newListe.addElement(lListeEquipePedagogique);
    let parMatiere = new ObjetListeElements();
    newListe.addElement(parMatiere);
    newListe.setLibelle(1, "parMatiere");
    const lListeDeploiement = lListeEquipePedagogique.getListeElements(
      (aElem) => aElem.estUnDeploiement,
    );
    lListeEquipePedagogique.parcourir((aProf) => {
      if (aProf.estUnDeploiement) {
        parMatiere.addElement(aProf);
      }
      if (aProf.matieres) {
        if (aProf.matieres.ListeElements.length === 0) {
          let nouvelleMatiere = new ObjetElement(
            GTraductions.getValeur("EquipePedagogique.sansMatiere"),
            "",
            EGenreRessource.Enseignant,
          );
          nouvelleMatiere.libelleTri = nouvelleMatiere.getLibelle();
          if (aProf.estTuteur) {
            nouvelleMatiere.estTuteur = true;
          }
          if (aProf.estProfesseurPrincipal) {
            nouvelleMatiere.estProfesseurPrincipal = true;
          }
          parMatiere.addElement(nouvelleMatiere);
          if (aProf.pere && !aProf.estEnleve) {
            nouvelleMatiere.pere = lListeDeploiement
              .getListeElements(
                (aElemDeploiement) =>
                  aElemDeploiement.getGenre() === EGenreRessource.Enseignant &&
                  !aElemDeploiement.estEnleve,
              )
              .get(0);
          }
          if (aProf.pere && aProf.estEnleve) {
            nouvelleMatiere.estEnleve = true;
            nouvelleMatiere.pere = lListeDeploiement
              .getListeElements(
                (aElemDeploiement) =>
                  aElemDeploiement.getGenre() === EGenreRessource.Enseignant &&
                  aElemDeploiement.estEnleve,
              )
              .get(0);
          }
          nouvelleMatiere.listeProfesseursParMatiere = new ObjetListeElements();
          nouvelleMatiere.listeProfesseursParMatiere.addElement(aProf);
        }
        aProf.matieres.parcourir((aMatiere) => {
          if (!aMatiere.estUneSousMatiere) {
            let nouvelleMatiere = new ObjetElement(
              aMatiere.Libelle,
              "",
              EGenreRessource.Enseignant,
            );
            parMatiere.addElement(nouvelleMatiere);
            nouvelleMatiere.libelleTri = nouvelleMatiere.getLibelle();
            if (aProf.estTuteur) {
              nouvelleMatiere.estTuteur = true;
            }
            if (aProf.estProfesseurPrincipal) {
              nouvelleMatiere.estProfesseurPrincipal = true;
            }
            if (aProf.pere && !aProf.estEnleve) {
              nouvelleMatiere.pere = lListeDeploiement
                .getListeElements(
                  (aElemDeploiement) =>
                    aElemDeploiement.getGenre() ===
                      EGenreRessource.Enseignant && !aElemDeploiement.estEnleve,
                )
                .get(0);
            }
            if (aProf.pere && aProf.estEnleve) {
              nouvelleMatiere.estEnleve = true;
              nouvelleMatiere.pere = lListeDeploiement
                .getListeElements(
                  (aElemDeploiement) =>
                    aElemDeploiement.getGenre() ===
                      EGenreRessource.Enseignant && aElemDeploiement.estEnleve,
                )
                .get(0);
            }
            if (aMatiere.volumeHoraire) {
              nouvelleMatiere.volumeHoraire = aMatiere.volumeHoraire;
            }
            nouvelleMatiere.listeProfesseursParMatiere =
              new ObjetListeElements();
            nouvelleMatiere.listeProfesseursParMatiere.addElement(aProf);
          } else if (
            parMatiere.getElementParLibelle(aMatiere.Libelle) !== undefined
          ) {
            parMatiere
              .getElementParLibelle(aMatiere.Libelle)
              .listeProfesseursParMatiere.addElement(aProf);
            parMatiere.getElementParLibelle(aMatiere.Libelle).volumeHoraire =
              "";
          }
        });
      } else if (aProf.fonction) {
        let nouvelleFonction = new ObjetElement(
          aProf.fonction,
          "",
          EGenreRessource.Personnel,
        );
        parMatiere.addElement(nouvelleFonction);
        nouvelleFonction.pere = lListeDeploiement
          .getListeElements(
            (aElemDeploiement) =>
              aElemDeploiement.getGenre() === EGenreRessource.Personnel,
          )
          .get(0);
        nouvelleFonction.libelleTri = nouvelleFonction.getLibelle();
        nouvelleFonction.listePersonnels = new ObjetListeElements();
        nouvelleFonction.listePersonnels.addElement(aProf);
      }
    });
    parMatiere.setTri([
      ObjetTri.init((D) => {
        return D.getGenre() !== EGenreRessource.Enseignant;
      }),
      ObjetTri.init((D) => {
        return !!D.estEnleve;
      }),
      ObjetTri.init((D) => {
        if (
          D.Libelle === GTraductions.getValeur("EquipePedagogique.sansMatiere")
        ) {
          return D.libelleTri;
        }
      }),
      ObjetTri.init((D) => {
        if (
          D.Libelle !== GTraductions.getValeur("EquipePedagogique.sansMatiere")
        ) {
          return D.libelleTri;
        }
      }),
    ]);
    parMatiere.trier();
    return parMatiere;
  },
};
module.exports = { UtilitaireFormaterListeParMatiereEtFonction };
