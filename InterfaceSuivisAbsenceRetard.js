const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Media } = require("DonneesListe_Media.js");
const {
  DonneesListe_SelectionPersonnel,
} = require("DonneesListe_SelectionPersonnel.js");
const {
  DonneesListe_SuivisAbsenceRetard,
} = require("DonneesListe_SuivisAbsenceRetard.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetFenetre_SaisieSuivisAbsenceRetard,
} = require("ObjetFenetre_SaisieSuivisAbsenceRetard.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  ObjetFenetre_SelectionMotif,
} = require("ObjetFenetre_SelectionMotif.js");
const ObjetRequetePageSuivisAbsenceRetard = require("ObjetRequetePageSuivisAbsenceRetard.js");
const ObjetRequeteSaisieSuivisAbsenceRetard = require("ObjetRequeteSaisieSuivisAbsenceRetard.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class InterfaceSuivisAbsenceRetard extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.listeDocuments = new ObjetListeElements();
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      this.evenementSurListe,
      _initialiserListe,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListe;
  }
  effacer(aMessage) {
    if (this.getInstance(this.identListe)) {
      this.getInstance(this.identListe).effacer(aMessage);
    }
  }
  setDonnees(aEleve, aDateDebut, aDateFin, aAbsence) {
    this.setEtatSaisie(false);
    this.eleve = aEleve;
    this.dateDebut = aDateDebut;
    this.dateFin = aDateFin;
    this.absence = aAbsence;
    if (!this.eleve) {
      GHtml.setDisplay(this.getInstance(this.identListe).getNom(), false);
    } else {
      GHtml.setDisplay(this.getInstance(this.identListe).getNom(), true);
      _requetePage.call(this);
    }
  }
  evenementSurListe(aParametres, aGenreEvenement, I, J) {
    switch (aGenreEvenement) {
      case EGenreEvenementListe.Edition: {
        this._saisieEnCours = {
          idColonne: aParametres.idColonne,
          ligne: J,
          donnee: aParametres.article,
        };
        switch (aParametres.idColonne) {
          case DonneesListe_SuivisAbsenceRetard.colonnes.RA: {
            aParametres.article.regle = !aParametres.article.regle;
            this._actualiserApresSaisie(aParametres.article);
            break;
          }
          case DonneesListe_SuivisAbsenceRetard.colonnes.certificat: {
            this._actualiserApresSaisie(aParametres.article);
            break;
          }
          case DonneesListe_SuivisAbsenceRetard.colonnes.admin:
          case DonneesListe_SuivisAbsenceRetard.colonnes.RespEl: {
            const lListePersonnes =
              aParametres.idColonne ===
              DonneesListe_SuivisAbsenceRetard.colonnes.RespEl
                ? this.listeInterlocuteurs
                : this.listePersonnels;
            ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
              pere: this,
              evenement: _evenementFenetre_Liste.bind(this, false),
              initialiser: function (aInstance) {
                const lColonnes = [];
                lColonnes.push({
                  id: DonneesListe_SelectionPersonnel.colonnes.libelle,
                  taille: "100%",
                });
                const lParamsListe = {};
                lParamsListe.optionsListe = {
                  colonnes: lColonnes,
                  hauteurAdapteContenu: true,
                  hauteurMaxAdapteContenu: 500,
                };
                aInstance.setOptionsFenetre({
                  titre: GTraductions.getValeur("SuivisAR.Selectionner"),
                  largeur: 300,
                  hauteur: null,
                  listeBoutons: [
                    GTraductions.getValeur("Annuler"),
                    GTraductions.getValeur("Valider"),
                  ],
                });
                aInstance.paramsListe = lParamsListe;
              },
            }).setDonnees(new DonneesListe_SelectionPersonnel(lListePersonnes));
            break;
          }
          case DonneesListe_SuivisAbsenceRetard.colonnes.nature: {
            const lObjFenetreListe = ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_Liste,
              {
                pere: this,
                evenement: _evenementFenetre_Liste.bind(this, false),
                initialiser: function (aInstance) {
                  const lColonnes = [];
                  lColonnes.push({
                    id: DonneesListe_Media.colonnes.code,
                    titre: GTraductions.getValeur("Code"),
                    taille: 40,
                  });
                  lColonnes.push({
                    id: DonneesListe_Media.colonnes.libelle,
                    titre: GTraductions.getValeur("SuivisAR.Intitule"),
                    taille: "100%",
                  });
                  const lParamsListe = {};
                  lParamsListe.optionsListe = {
                    colonnes: lColonnes,
                    hauteurAdapteContenu: true,
                    hauteurMaxAdapteContenu: 500,
                    listeCreations: [0, 1],
                    avecLigneCreation: true,
                  };
                  const lTitreFenetre = aParametres.article.media.envoi
                    ? GTraductions.getValeur("SuivisAR.EditionEnvois")
                    : GTraductions.getValeur("SuivisAR.EditionReceptions");
                  aInstance.setOptionsFenetre({
                    titre: lTitreFenetre,
                    largeur: 300,
                    hauteur: null,
                    listeBoutons: [
                      GTraductions.getValeur("Annuler"),
                      GTraductions.getValeur("Valider"),
                    ],
                  });
                  aInstance.paramsListe = lParamsListe;
                },
              },
            );
            lObjFenetreListe.setDonnees(
              new DonneesListe_Media(
                this.listeMedias,
                !aParametres.article.media.envoi,
                this.listeSuivisAbsenceRetard,
              ),
            );
            break;
          }
        }
      }
    }
  }
  _evenementSurMenuContextuelListe(aIdColonne, D, aLigne) {
    this._saisieEnCours = { idColonne: aIdColonne, ligne: aLigne, donnee: D };
    if (aLigne) {
      switch (aLigne.getNumero()) {
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
          .RemplacerCertificat:
          this._actualiserApresSaisie(D);
          break;
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
          .SupprimerCertificat: {
          D.avecCertificat = false;
          const lElement = D.certificat;
          if (lElement) {
            if (lElement.getEtat() === EGenreEtat.Creation) {
              this.listeDocuments.remove(
                this.listeDocuments.getIndiceParNumeroEtGenre(
                  lElement.getNumero(),
                ),
              );
            } else {
              lElement.suivi = new ObjetElement("", D.getNumero());
              this.listeDocuments.addElement(lElement);
            }
            lElement.setEtat(EGenreEtat.Suppression);
          }
          this._actualiserApresSaisie(D);
          break;
        }
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu
          .ConsulterCertificat:
          window.open(
            GChaine.creerUrlBruteLienExterne(D.certificat, {
              genreRessource: EGenreRessource.DocJointEleve,
            }),
          );
          break;
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ReglerDossier:
          D.regle = !D.regle;
          this._actualiserApresSaisie(D);
          break;
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.CreerSuivi:
          this._ouvrirFenetreSaisie(D, true);
          return;
        case DonneesListe_SuivisAbsenceRetard.GenreCommandeMenu.ModifierMotif:
          ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SelectionMotif, {
            pere: this,
            evenement: function (aGenreBouton, aMotif) {
              _evenementFenetre_Liste.call(
                this,
                true,
                aGenreBouton,
                aMotif,
                true,
              );
            },
          }).setDonnees(
            D.getGenre() !== EGenreRessource.Retard
              ? this.listeMotifsAbsenceEleve
              : this.listeMotifsRetard,
            false,
          );
          break;
      }
    }
  }
  _evenementSurCreationSuivi(D) {
    this._ouvrirFenetreSaisie(D, true);
  }
  _actualiserApresSaisie(aDonnee) {
    aDonnee.setEtat(EGenreEtat.Modification);
    this.setEtatSaisie(true);
    this.getInstance(this.identListe).actualiser();
  }
  _ouvrirFenetreSaisie(aDonnee, aEnvoiParDefaut) {
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SaisieSuivisAbsenceRetard, {
      pere: this,
      evenement: _evenementSurFenetreSaisie.bind(this, aDonnee),
    }).setDonnees(
      aEnvoiParDefaut,
      this.listeMedias,
      this.listeSuivisAbsenceRetard,
    );
  }
  valider(aCallback) {
    this.setEtatSaisie(false);
    const lRequete = new ObjetRequeteSaisieSuivisAbsenceRetard(
      this,
      aCallback ? aCallback : _requetePage,
    );
    lRequete.addUpload({ listeFichiers: this.listeDocuments });
    lRequete.lancerRequete(
      this.eleve,
      this.listeSuivisAbsenceRetard,
      this.listeMedias,
      this.listeDocuments,
    );
  }
}
function _initialiserListe(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.date,
    titre: GTraductions.getValeur("SuivisAR.Date"),
    taille: 49,
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.nature,
    titre: GTraductions.getValeur("SuivisAR.Nature"),
    taille: 50,
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.heure,
    titre: GTraductions.getValeur("SuivisAR.Heure"),
    taille: 50,
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.lettre,
    titre: GTraductions.getValeur("SuivisAR.Lettre"),
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.admin,
    titre: GTraductions.getValeur("SuivisAR.Admin"),
    taille: ObjetListe.initColonne(100, 100, 150),
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.RespEl,
    titre: GTraductions.getValeur("SuivisAR.ResponsableEleve"),
    taille: ObjetListe.initColonne(100, 100, 150),
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.commentaire,
    titre: GTraductions.getValeur("SuivisAR.Commentaire"),
    taille: ObjetListe.initColonne(100, 40),
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.certificat,
    titre: { classeCssImage: "Image_Trombone" },
    taille: 25,
  });
  lColonnes.push({
    id: DonneesListe_SuivisAbsenceRetard.colonnes.RA,
    titre: GTraductions.getValeur("SuivisAR.RA"),
    taille: 25,
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    scrollHorizontal: true,
    nonEditable: !GApplication.droits.get(
      TypeDroits.absences.avecSuiviAbsenceRetard,
    ),
  });
}
function _reponseRequetePageSuivisAbsenceRetard(
  aListeSuivisAbsenceRetard,
  aListePersonnels,
  aListeInterlocuteurs,
  aListeMedias,
  aListeMotifsAbsenceEleve,
  aListeMotifsRetard,
  aMessage,
) {
  this.listeSuivisAbsenceRetard = aListeSuivisAbsenceRetard;
  this.listePersonnels = aListePersonnels;
  this.listeInterlocuteurs = aListeInterlocuteurs;
  this.listeMedias = aListeMedias;
  this.listeMotifsAbsenceEleve = aListeMotifsAbsenceEleve;
  this.listeMotifsRetard = aListeMotifsRetard;
  if (aMessage) {
    this.effacer(aMessage);
  } else {
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SuivisAbsenceRetard(
        this.listeSuivisAbsenceRetard,
        this._evenementSurMenuContextuelListe.bind(this),
        this._evenementSurCreationSuivi.bind(this),
      ).setOptions({ saisie: saisieDocument.bind(this) }),
    );
  }
}
function saisieDocument(aDonnees, aListeFichiersUpload) {
  if (
    aDonnees.genreSaisie ===
    DonneesListe_SuivisAbsenceRetard.genreAction.ModifierDocument
  ) {
    const lElement = aDonnees.article.certificat;
    lElement.setEtat(EGenreEtat.Suppression);
    lElement.suivi = new ObjetElement("", aDonnees.article.getNumero());
    this.listeDocuments.addElement(aDonnees.article.certificat);
  }
  this.listeDocuments.add(aListeFichiersUpload);
  aDonnees.article.avecCertificat = true;
  aDonnees.article.certificat = aListeFichiersUpload.get(0);
  this._actualiserApresSaisie(aDonnees.article);
  this.setEtatSaisie(true);
}
function _requetePage() {
  this.listeDocuments = new ObjetListeElements();
  new ObjetRequetePageSuivisAbsenceRetard(
    this,
    _reponseRequetePageSuivisAbsenceRetard,
  ).lancerRequete(this.eleve, this.dateDebut, this.dateFin, this.absence);
}
function _evenementFenetre_Liste(
  aSurSaisieMotif,
  aGenreBouton,
  aSelection,
  aAvecChangementListe,
) {
  if (aGenreBouton === 1) {
    if (this._saisieEnCours) {
      const lDonnee = this._saisieEnCours.donnee;
      if (aSurSaisieMotif) {
        if (aSelection && aSelection.getNumero()) {
          lDonnee.motif = MethodesObjet.dupliquer(aSelection);
          lDonnee.regle = !!aSelection.reglementAuto;
        } else {
          delete lDonnee.motif;
        }
      } else {
        switch (this._saisieEnCours.idColonne) {
          case DonneesListe_SuivisAbsenceRetard.colonnes.admin: {
            const lAdmin = this.listePersonnels.get(aSelection);
            lDonnee.personnel = null;
            if (lAdmin.existeNumero()) {
              lDonnee.personnel = lAdmin;
            }
            break;
          }
          case DonneesListe_SuivisAbsenceRetard.colonnes.RespEl: {
            const lResponsable = this.listeInterlocuteurs.get(aSelection);
            if (!lResponsable.existeNumero()) {
              lDonnee.__surEditionAutre = true;
              const lInstanceListe = this.getInstance(this.identListe);
              const lNumeroColonne = lInstanceListe
                .getDonneesListe()
                .getNumeroColonneDId(this._saisieEnCours.idColonne);
              lInstanceListe.demarrerEditionSurCellule(
                this._saisieEnCours.ligne,
                lNumeroColonne,
              );
              delete this._saisieEnCours;
              return;
            }
            lDonnee.respEleve = lResponsable.getLibelle();
            break;
          }
          case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
            lDonnee.media = this.listeMedias.get(aSelection);
            break;
        }
      }
      this._actualiserApresSaisie(lDonnee);
      delete this._saisieEnCours;
    }
  } else {
    if (aAvecChangementListe) {
      switch (this._saisieEnCours.idColonne) {
        case DonneesListe_SuivisAbsenceRetard.colonnes.nature:
          this.getInstance(this.identListe).actualiser();
          break;
      }
    }
  }
}
function _evenementSurFenetreSaisie(aSuiviPere, aSurValidation, aMedia) {
  if (aSurValidation && aMedia) {
    const lSuivi = new ObjetElement();
    lSuivi.setEtat(EGenreEtat.Creation);
    const lDate = new Date();
    lSuivi.date = GDate.getDateBornee(lDate);
    lSuivi.date.setHours(lDate.getHours(), lDate.getMinutes(), 0, 0);
    lSuivi.pere = aSuiviPere;
    lSuivi.media = aMedia;
    lSuivi.libelleLettre = "";
    lSuivi.commentaire = "";
    lSuivi.personnel = null;
    lSuivi.respEleve = "";
    this.listeInterlocuteurs.parcourir((aInterlocuteur) => {
      if (aInterlocuteur.responsableLegal) {
        lSuivi.respEleve = aInterlocuteur.getLibelle();
        return false;
      }
    });
    lSuivi.regle = false;
    this.listeSuivisAbsenceRetard.addElement(lSuivi);
    aSuiviPere.estDeploye = true;
    aSuiviPere.estUnDeploiement = true;
    this._actualiserApresSaisie(lSuivi);
  } else {
    this.getInstance(this.identListe).actualiser();
  }
}
module.exports = { InterfaceSuivisAbsenceRetard };
