const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_EquipePedagogique extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, estAffichageNom) {
    super(aDonnees);
    this.estAffichageNom = estAffichageNom;
    this.setOptions({
      avecSelection: false,
      avecEdition: false,
      avecSuppression: false,
      avecEllipsis: false,
      avecBoutonActionLigne: false,
    });
  }
  getTitreZonePrincipale(aParams) {
    let H = [];
    if (this.estAffichageNom === true) {
      H.push(
        `<div ie-ellipsis class="ie-titre" >${aParams.article.getLibelle()}</div>`,
      );
    } else if (
      this.estAffichageNom === false &&
      aParams.article.getLibelle() !==
        GTraductions.getValeur("EquipePedagogique.sansMatiere")
    ) {
      if (aParams.article.volumeHoraire) {
        H.push(
          `<div class="ie-titre ellipsis-multilignes">${aParams.article.getLibelle()} (${aParams.article.volumeHoraire})</div>`,
        );
      } else {
        H.push(
          `<div class="ie-titre ellipsis-multilignes" >${aParams.article.getLibelle()}</div>`,
        );
      }
    }
    return H.join("");
  }
  getInfosSuppZonePrincipale(aParams) {
    let H = [];
    if (this.estAffichageNom === true) {
      if (aParams.article.estProfesseurPrincipal) {
        H.push(
          `<div class="ie-sous-titre capitalize" ><i class="icon_star" aria-hidden="true"></i> `,
          GTraductions.getValeur("EquipePedagogique.professeurPrincipal"),
          `</div>`,
        );
      }
      if (aParams.article.estTuteur) {
        H.push(
          `<div class="ie-sous-titre capitalize" ><i class="icon_star" aria-hidden="true"></i> `,
          GTraductions.getValeur("EquipePedagogique.tuteur"),
          `</div>`,
        );
      }
      if (aParams.article.matieres) {
        aParams.article.matieres.parcourir((aMatiere) => {
          if (aMatiere.volumeHoraire) {
            H.push(
              `<p class="ie-sous-titre capitalize">${aMatiere.getLibelle()} (${aMatiere.volumeHoraire})</p>`,
            );
          } else {
            H.push(
              `<p class="ie-sous-titre capitalize">${aMatiere.getLibelle()}</p>`,
            );
          }
        });
      }
      if (aParams.article.email) {
        H.push(
          `<div><a href="mailto:${aParams.article.email}">${aParams.article.email}</a></div>`,
        );
      }
      if (aParams.article.fonction) {
        H.push(
          `<div class="ie-sous-titre capitalize">${aParams.article.fonction}</div>`,
        );
      }
    } else if (this.estAffichageNom === false) {
      if (aParams.article.listeProfesseursParMatiere) {
        aParams.article.listeProfesseursParMatiere.parcourir((aProf) => {
          if (aProf.matieres) {
            aProf.matieres.parcourir((aProf2) => {
              if (aProf2.estUneSousMatiere === true) {
                H.push(
                  `<div class="ie-sous-titre capitalize">${aProf2.getLibelle()}</div>`,
                );
              }
            });
          }
          H.push(
            `<div class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
          );
          if (aProf.estProfesseurPrincipal) {
            H.push(
              `<div class="ie-sous-titre capitalize"><i class="icon_star" aria-hidden="true"></i> `,
              GTraductions.getValeur("EquipePedagogique.professeurPrincipal"),
              `</div>`,
            );
          }
          if (aProf.estTuteur) {
            H.push(
              `<div class="ie-sous-titre capitalize"><i class="icon_star" aria-hidden="true"></i> `,
              GTraductions.getValeur("EquipePedagogique.tuteur"),
              `</div>`,
            );
          }
          if (aProf.email) {
            H.push(
              `<div><a href="mailto:${aProf.email}">${aProf.email}</a></div>`,
            );
          }
        });
      }
      if (aParams.article.listePersonnels) {
        aParams.article.listePersonnels.parcourir((aPerso) => {
          if (aPerso.getLibelle()) {
            H.push(
              `<div class="ie-sous-titre capitalize">${aPerso.getLibelle()}</div>`,
            );
          }
          if (aPerso.email) {
            H.push(
              `<div><a href="mailto:${aPerso.email}">${aPerso.email}</a></div>`,
            );
          }
        });
      }
    }
    return H.join("");
  }
  getTotal(aEstHeader) {
    if (aEstHeader) {
      const H = [];
      if (this.estAffichageNom === true) {
        this.getInfosSuppZonePrincipale;
        const profPrinc = this.Donnees.getListeElements(
          (aElem) => aElem.estProfesseurPrincipal,
        );
        const lListeTuteurs = this.Donnees.getListeElements(
          (aElem) => aElem.estTuteur,
        );
        profPrinc.parcourir((aPP) => {
          H.push(`<div ie-ellipsis class="ie-titre">${aPP.Libelle}</div>`);
          H.push(
            `<div class="ie-sous-titre capitalize PetitEspaceBas"> `,
            GTraductions.getValeur("EquipePedagogique.professeurPrincipal"),
            `</div>`,
          );
        });
        lListeTuteurs.parcourir((aTuteur) => {
          H.push(`<div ie-ellipsis class="ie-titre">${aTuteur.Libelle}</div>`);
          H.push(
            `<div class="ie-sous-titre capitalize PetitEspaceBas"> `,
            GTraductions.getValeur("EquipePedagogique.tuteur"),
            `</div>`,
          );
        });
      }
      if (this.estAffichageNom === false) {
        const profPrinc = this.Donnees.getListeElements(
          (aElem) => aElem.estProfesseurPrincipal,
        );
        const lListeTuteurs = this.Donnees.getListeElements(
          (aElem) => aElem.estTuteur,
        );
        let uniqueNomProfPrincipal = [];
        profPrinc.parcourir((aProf) => {
          if (aProf.listeProfesseursParMatiere) {
            aProf.listeProfesseursParMatiere.parcourir((aProf2) => {
              if (
                uniqueNomProfPrincipal.includes(aProf2.getLibelle()) === false
              ) {
                uniqueNomProfPrincipal.push(aProf2.getLibelle());
              }
            });
          }
        });
        for (let i = 0; i < uniqueNomProfPrincipal.length; i++) {
          H.push(
            `<div ie-ellipsis class="ie-titre">${uniqueNomProfPrincipal[i]}</div>`,
          );
          H.push(
            `<div class="ie-sous-titre capitalize PetitEspaceBas"> `,
            GTraductions.getValeur("EquipePedagogique.professeurPrincipal"),
            `</div>`,
          );
        }
        let uniqueNomTuteur = [];
        lListeTuteurs.parcourir((aProf) => {
          if (aProf.listeProfesseursParMatiere) {
            aProf.listeProfesseursParMatiere.parcourir((aProf2) => {
              if (uniqueNomTuteur.includes(aProf2.getLibelle()) === false) {
                uniqueNomTuteur.push(aProf2.getLibelle());
              }
            });
          }
        });
        for (let j = 0; j < uniqueNomTuteur.length; j++) {
          H.push(
            `<div ie-ellipsis class="ie-titre">${uniqueNomTuteur[j]}</div>`,
          );
          H.push(
            `<div class="ie-sous-titre capitalize PetitEspaceBas"> `,
            GTraductions.getValeur("EquipePedagogique.tuteur"),
            `</div>`,
          );
        }
      }
      return { html: H.join("") };
    }
  }
}
module.exports = { DonneesListe_EquipePedagogique };
