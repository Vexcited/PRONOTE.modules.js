const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreDemiJours } = require("Enumere_DemiJours.js");
const {
  TypeOptionPublicationDefautPassageInf,
} = require("TypeOptionPublicationDefautPassageInf.js");
class ObjetRequetePageSaisieAbsences extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    this.JSON = {
      Professeur: aParametres.professeur,
      Ressource: new ObjetElement("", aParametres.numeroRessource),
      Date: aParametres.date,
    };
    if (aParametres.dateDecompte) {
      this.JSON.DateDecompte = aParametres.dateDecompte;
    }
    if (aParametres.genreDecompte) {
      this.JSON.GenreDecompte = aParametres.genreDecompte;
    }
    if (aParametres.placeDebut) {
      this.JSON.PlaceDebut = aParametres.placeDebut;
    }
    if (aParametres.placeFin) {
      this.JSON.PlaceFin = aParametres.placeFin;
    }
    if (aParametres.coursSortiePeda) {
      Object.assign(this.JSON, {
        sortiePeda: true,
        absencesLiees: aParametres.coursSortiePeda.absencesLiees
          ? aParametres.coursSortiePeda.absencesLiees.setSerialisateurJSON({
              ignorerEtatsElements: true,
            })
          : null,
        place: aParametres.coursSortiePeda.place,
        duree: aParametres.coursSortiePeda.duree,
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListeEleves = new ObjetListeElements();
    if (!this.JSONReponse.Message) {
      const LItemAucun = new ObjetElement(
        "&lt;" + GTraductions.getValeur("Aucun") + "&gt;",
        0,
      );
      LItemAucun.Visible = false;
      lListeEleves.addElement(LItemAucun);
    }
    const lPlaceGrilleDebut = this.JSONReponse.PlaceGrilleDebut;
    if (!!this.JSONReponse.ListeEleves) {
      this.JSONReponse.ListeEleves.parcourir((aEleve) => {
        aEleve.Visible = true;
        if (!!aEleve.ListeAbsences) {
          aEleve.ListeAbsences.parcourir((aAbsenceEleve) => {
            if (!aAbsenceEleve.PlaceDebut) {
              if (!!aAbsenceEleve.DateDebut) {
                aAbsenceEleve.PlaceDebut = GDate.dateEnPlaceAnnuelle(
                  aAbsenceEleve.DateDebut,
                );
              }
            }
            if (!aAbsenceEleve.PlaceFin) {
              if (!!aAbsenceEleve.DateFin) {
                aAbsenceEleve.PlaceFin = GDate.dateEnPlaceAnnuelle(
                  aAbsenceEleve.DateFin,
                  true,
                );
              }
            }
            if (!aAbsenceEleve.listeMotifs) {
              aAbsenceEleve.listeMotifs = new ObjetListeElements();
            }
          });
        }
        if (!!aEleve.ListeDispenses) {
          aEleve.ListeDispenses.parcourir((aDispenseEleve) => {
            if (!aDispenseEleve.Professeur) {
              aDispenseEleve.Professeur = new ObjetElement();
            }
          });
        }
        if (!aEleve.devoirARendre) {
          aEleve.devoirARendre = new ObjetElement();
        }
        if (!aEleve.devoirARendre.demandeur) {
          aEleve.devoirARendre.demandeur = new ObjetElement();
        }
        if (!aEleve.devoirARendre.programmation) {
          aEleve.devoirARendre.programmation = new ObjetElement();
        }
        aEleve.ListeExclusionsTemporaires = new ObjetListeElements();
        let LEltExclusionTemporaire = null;
        if (!!aEleve.estExcluDefinitivement) {
          LEltExclusionTemporaire = new ObjetElement();
          LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
          LEltExclusionTemporaire.PlaceFin =
            lPlaceGrilleDebut + GParametres.PlacesParJour;
          aEleve.ListeExclusionsTemporaires.addElement(LEltExclusionTemporaire);
        }
        const lListeSanctions = aEleve.listeSanctions;
        if (!!lListeSanctions && lListeSanctions.count() > 0) {
          LEltExclusionTemporaire = new ObjetElement();
          if (lListeSanctions.count() === 2) {
            LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
            LEltExclusionTemporaire.PlaceFin =
              lPlaceGrilleDebut + GParametres.PlacesParJour;
          } else {
            if (lListeSanctions.get(0).getGenre() === EGenreDemiJours.Matin) {
              LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
              LEltExclusionTemporaire.PlaceFin =
                lPlaceGrilleDebut + GParametres.PlaceDemiJournee - 1;
            } else if (
              lListeSanctions.get(0).getGenre() === EGenreDemiJours.ApresMidi
            ) {
              LEltExclusionTemporaire.PlaceDebut =
                lPlaceGrilleDebut + GParametres.PlaceDemiJournee;
              LEltExclusionTemporaire.PlaceFin =
                lPlaceGrilleDebut + GParametres.PlacesParJour;
            }
          }
          aEleve.ListeExclusionsTemporaires.addElement(LEltExclusionTemporaire);
        }
      });
      lListeEleves.add(this.JSONReponse.ListeEleves);
    }
    lListeEleves.setTri([
      ObjetTri.init((D) => {
        return D.getNumero() !== 0;
      }),
      ObjetTri.init("Position"),
    ]);
    lListeEleves.trier();
    const lListeElevesEnStage = this.JSONReponse.ListeElevesEnStage;
    if (lListeElevesEnStage) {
      lListeElevesEnStage.trier();
    }
    const lListeDates = new ObjetListeElements();
    lListeDates.dateDecompte = new ObjetElement();
    lListeDates.dateDecompte.Genre = this.JSONReponse.GenreDecompte;
    lListeDates.dateDecompte.valeur = this.JSONReponse.DateDecompte;
    lListeDates.add(this.JSONReponse.ListeDates);
    if (this.JSONReponse.listeDemandesDispense) {
      this.JSONReponse.listeDemandesDispense.setTri([
        ObjetTri.init((D) => {
          if (D.eleve) {
            return D.eleve.getLibelle();
          }
        }),
      ]);
      this.JSONReponse.listeDemandesDispense.trier();
    }
    const lData = {
      listeEleves: lListeEleves,
      listeClasses: this.JSONReponse.listeClasses,
      listeDates: lListeDates,
      listeTitreColonnes: this.JSONReponse.ListeColonnes,
      dureeRetard: this.JSONReponse.DureeRetard,
      calculAutoDureeRetard: this.JSONReponse.calculAutoDureeRetard,
      genreRepas: this.JSONReponse.GenreRepas,
      placeGrilleDebut: lPlaceGrilleDebut,
      avecSupprAutreAbs: this.JSONReponse.AvecSuppressionAutreAbsence,
      avecModifRetardVS: this.JSONReponse.avecModifRetardVS,
      placeDeb: this.JSONReponse.PlaceSaisieDebut,
      placeFin: this.JSONReponse.PlaceSaisieFin,
      listeElevesEnStage: lListeElevesEnStage,
      message: this.JSONReponse.Message,
      publierParDefautPassageInf:
        this.JSONReponse.publierParDefautPassageInf ===
        TypeOptionPublicationDefautPassageInf.OPDPI_Publie,
      jsonReponse: this.JSONReponse,
    };
    this.callbackReussite.appel(lData);
  }
}
Requetes.inscrire("PageSaisieAbsences", ObjetRequetePageSaisieAbsences);
module.exports = { ObjetRequetePageSaisieAbsences };
