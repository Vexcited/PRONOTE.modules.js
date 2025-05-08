exports.InterfaceCompetences_GrillesParMatiere = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_SelectionElementPilier_1 = require("DonneesListe_SelectionElementPilier");
const DonneesListe_SelectionMetaMatiere_1 = require("DonneesListe_SelectionMetaMatiere");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfaceCompetences_Grilles_1 = require("InterfaceCompetences_Grilles");
const ObjetFenetre_SelectionDomaineCompetence_1 = require("ObjetFenetre_SelectionDomaineCompetence");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
const TypeCategorieCompetence_1 = require("TypeCategorieCompetence");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequeteSaisieCompetencesGrilles_1 = require("ObjetRequeteSaisieCompetencesGrilles");
class InterfaceCompetences_GrillesParMatiere extends InterfaceCompetences_Grilles_1.InterfaceCompetences_Grilles {
  constructor(...aParams) {
    super(...aParams);
    this.idPage = this.Nom + "_page_matiere";
    this.categorieCompetence =
      TypeCategorieCompetence_1.TypeCategorieCompetence.Socle;
    if (
      this.etatUtilisateurSco.pourPrimaire() &&
      GEtatUtilisateur.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.ListeApprentissages
    ) {
      this.categorieCompetence =
        TypeCategorieCompetence_1.TypeCategorieCompetence.Apprentissage;
    }
  }
  getGenreReferentiel() {
    let lGenreReferentiel =
      TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere;
    if (
      this.etatUtilisateurSco.pourPrimaire() &&
      GEtatUtilisateur.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.ListeApprentissages
    ) {
      lGenreReferentiel =
        TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
          .GR_PilierDeCompetence;
    }
    return lGenreReferentiel;
  }
  construireInstances() {
    super.construireInstances();
    this.identFenetreSelectionMetaMatiere = this.addFenetre(
      ObjetFenetre_SelectionMetaMatiere,
      this._evenementFenetreSelectionMetaMatiere,
      this._initFenetreSelectionMetaMatiere,
    );
    this.identFenetreSelectionDomaineSocle = this.addFenetre(
      ObjetFenetre_SelectionDomaineCompetence_1.ObjetFenetre_SelectionDomaineCompetence,
      this._evenementFenetreSelectionDomaine,
      this._initFenetreSelectionDomaine,
    );
    this.identFenetreSelectionElementSignifiant = this.addFenetre(
      ObjetFenetre_SelectionElmtSignifiant,
      this._evenementFenetreSelectionElementSignifiant,
      this._initFenetreSelectionElementSignifiant,
    );
  }
  _surCreationReferentiel() {
    this.getInstance(this.identFenetreSelectionMetaMatiere).setDonnees({
      listeRessources: this._getListeReferentielsPossibles(),
      listeRessourcesSelectionnees:
        new ObjetListeElements_1.ObjetListeElements(),
      genreRessource: this.getGenreReferentiel(),
    });
  }
  _surEditionDomainesAssocies(aElementCompetence) {
    let lListeDomainesProposees = this.donnees.listeTousLesDomaines;
    const lReferentielSelectionne = this._getReferentielSelectionne();
    if (lReferentielSelectionne.estLVE !== true) {
      lListeDomainesProposees =
        this.donnees.listeTousLesDomaines.getListeElements((D) => {
          return D.estLVE !== true;
        });
    }
    const lFenetre = this.getInstance(this.identFenetreSelectionDomaineSocle);
    lFenetre.setOptionsFenetreSelectionRessource({
      avecColonneLVE: lReferentielSelectionne.estLVE,
    });
    lFenetre.setDonnees({
      listeRessources: lListeDomainesProposees,
      listeRessourcesSelectionnees: !!aElementCompetence.listeDomaines
        ? aElementCompetence.listeDomaines
        : new ObjetListeElements_1.ObjetListeElements(),
      genreRessource: Enumere_Ressource_1.EGenreRessource.Pilier,
    });
  }
  _surEditionElmtSignifiant(aElementCompetence) {
    let lListeRestrictionDomaines = null;
    if (
      !!aElementCompetence.listeDomaines &&
      aElementCompetence.listeDomaines.count() > 0
    ) {
      lListeRestrictionDomaines = aElementCompetence.listeDomaines;
    } else if (
      !!aElementCompetence.pere &&
      !!aElementCompetence.pere.listeDomaines &&
      aElementCompetence.pere.listeDomaines.count() > 0
    ) {
      lListeRestrictionDomaines = aElementCompetence.pere.listeDomaines;
    }
    const lReferentielSelectionne = this._getReferentielSelectionne();
    const lListeElementsPilier = new ObjetListeElements_1.ObjetListeElements();
    const lElementAucun = new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur("Aucun"),
    );
    lElementAucun.accepteRestrictionDomaine = true;
    lListeElementsPilier.addElement(lElementAucun);
    if (!!this.donnees.listeTousLesDomaines) {
      this.donnees.listeTousLesDomaines.parcourir((aPilier, aIndexPilier) => {
        if (
          !!aPilier.listeElementsPilier &&
          aPilier.listeElementsPilier.count() > 0
        ) {
          let lOnAjoutePilier = true;
          if (
            aPilier.estLVE === true &&
            lReferentielSelectionne.estLVE !== true
          ) {
            lOnAjoutePilier = false;
          }
          if (lOnAjoutePilier) {
            const lCopyPilier =
              MethodesObjet_1.MethodesObjet.dupliquer(aPilier);
            lCopyPilier.Position = aIndexPilier;
            lCopyPilier.estUnDeploiement = true;
            lCopyPilier.estDeploye = true;
            lCopyPilier.accepteRestrictionDomaine = false;
            if (!!lListeRestrictionDomaines) {
              const lIndice =
                lListeRestrictionDomaines.getIndiceParElement(lCopyPilier);
              if (lIndice !== null && lIndice !== undefined) {
                lCopyPilier.accepteRestrictionDomaine = true;
              }
            }
            lListeElementsPilier.addElement(lCopyPilier);
            aPilier.listeElementsPilier.parcourir(
              (aElementPilier, aIndexElmtPilier) => {
                const lCopyElmtPilier =
                  MethodesObjet_1.MethodesObjet.dupliquer(aElementPilier);
                lCopyElmtPilier.Position = aIndexElmtPilier;
                lCopyElmtPilier.pere = lCopyPilier;
                lCopyElmtPilier.accepteRestrictionDomaine =
                  lCopyPilier.accepteRestrictionDomaine;
                lListeElementsPilier.addElement(lCopyElmtPilier);
              },
            );
          }
        }
      });
    }
    this.getInstance(this.identFenetreSelectionElementSignifiant).setDonnees({
      listeRessources: lListeElementsPilier,
      listeRessourcesSelectionnees:
        new ObjetListeElements_1.ObjetListeElements(),
    });
  }
  _initFenetreSelectionMetaMatiere(aInstance) {
    aInstance.setOptionsFenetreSelectionRessource({
      filtres: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.GrilleCompetences.AjoutMetamatiere.UniquementCeuxPresentServiceDeNotation",
          ),
          filtre: function (aElement, aChecked) {
            return aChecked ? aElement.utiliseParServiceNotation : true;
          },
          checked: true,
        },
      ],
    });
    const lLibellePalier = this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Palier,
    ).getLibelle();
    aInstance.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.GrilleCompetences.AjoutMetamatiere.Titre",
        [lLibellePalier],
      ),
      largeur: 600,
      hauteur: 613,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  }
  _evenementFenetreSelectionMetaMatiere(
    aNumeroBouton,
    aListeElementsSelectionnes,
  ) {
    if (aNumeroBouton === 1) {
      this._saisie(
        ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
          .creationRelationReferentiel,
        { referentiels: aListeElementsSelectionnes },
      );
    }
  }
  _initFenetreSelectionElementSignifiant(aInstance) {
    aInstance.setOptionsFenetreSelectionRessource({
      filtres: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.GrilleCompetences.FenetreElmtSignifiant.FiltreSocleAssocie",
          ),
          filtre: function (aElement, aChecked) {
            return aChecked ? aElement.accepteRestrictionDomaine : true;
          },
          checked: true,
        },
      ],
      autoriseEltAucun: true,
    });
    aInstance.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.GrilleCompetences.FenetreElmtSignifiant.Titre",
      ),
      largeur: 600,
      hauteur: 613,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  }
  _evenementFenetreSelectionElementSignifiant(
    aNumeroBouton,
    aElementPilierSelectionne,
  ) {
    if (aNumeroBouton === 1) {
      const lReferentielSelectionne = this._getReferentielSelectionne();
      const lElementCompetenceSelectionne =
        this._getElementCompetenceSelectionne();
      if (lReferentielSelectionne && lElementCompetenceSelectionne) {
        this._saisie(
          ObjetRequeteSaisieCompetencesGrilles_1
            .CommandeSaisieCompetencesGrilles.saisieElementSignifiant,
          {
            referentiel: lReferentielSelectionne,
            elementCompetence: lElementCompetenceSelectionne,
            elementSignifiant: aElementPilierSelectionne,
          },
          {
            referentielSelectionne: lReferentielSelectionne,
            competenceSelectionnee: lElementCompetenceSelectionne,
          },
        );
      } else {
      }
    }
  }
  _initFenetreSelectionDomaine(aInstance) {
    aInstance.setOptionsFenetreSelectionRessource({
      avecCocheRessources: true,
    });
    aInstance.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.ListeCompetences.FenetreDomaineAssocie.Titre",
      ),
      largeur: 600,
      hauteur: 613,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  }
  _evenementFenetreSelectionDomaine(aNumeroBouton, aListeElementsSelectionnes) {
    if (aNumeroBouton === 1) {
      const lReferentielSelectionne = this._getReferentielSelectionne();
      const lElementCompetenceSelectionne =
        this._getElementCompetenceSelectionne();
      if (lReferentielSelectionne && lElementCompetenceSelectionne) {
        aListeElementsSelectionnes.setSerialisateurJSON({
          ignorerEtatsElements: true,
        });
        this._saisie(
          ObjetRequeteSaisieCompetencesGrilles_1
            .CommandeSaisieCompetencesGrilles.saisieDomainesDuSocleAssocie,
          {
            referentiel: lReferentielSelectionne,
            elementCompetence: lElementCompetenceSelectionne,
            listeDomainesSocle: aListeElementsSelectionnes,
          },
          {
            referentielSelectionne: lReferentielSelectionne,
            competenceSelectionnee: lElementCompetenceSelectionne,
          },
        );
      } else {
      }
    }
  }
}
exports.InterfaceCompetences_GrillesParMatiere =
  InterfaceCompetences_GrillesParMatiere;
class ObjetFenetre_SelectionMetaMatiere extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
  constructor(...aParams) {
    super(...aParams);
  }
  _creerObjetDonneesListe() {
    return new DonneesListe_SelectionMetaMatiere_1.DonneesListe_SelectionMetaMatiere(
      this.listeRessources,
    );
  }
  _initialiserListe(aInstance) {
    const lOptions = {
      colonnes: [
        {
          id: DonneesListe_SelectionMetaMatiere_1
            .DonneesListe_SelectionMetaMatiere.colonnes.libelle,
          taille: "100%",
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.GrilleCompetences.AjoutMetamatiere.Libelle",
          ),
        },
        {
          id: DonneesListe_SelectionMetaMatiere_1
            .DonneesListe_SelectionMetaMatiere.colonnes.lve,
          taille: 60,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.GrilleCompetences.AjoutMetamatiere.LVE",
          ),
        },
      ],
      avecListeNeutre: true,
      avecRollover: false,
    };
    aInstance.setOptionsListe(lOptions);
  }
  surValidation(ANumeroBouton) {
    const lListeMetaMatieresSelectionnees = this.getInstance(
      this.identListe,
    ).getListeElementsSelection();
    this.fermer();
    this.callback.appel(ANumeroBouton, lListeMetaMatieresSelectionnees);
  }
}
class ObjetFenetre_SelectionElmtSignifiant extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
  constructor(...aParams) {
    super(...aParams);
    this.setBoutonActif(1, false);
  }
  _creerObjetDonneesListe() {
    return new DonneesListe_SelectionElementPilier_1.DonneesListe_SelectionElementPilier(
      this.listeRessources,
    );
  }
  _initialiserListe(aInstance) {
    const lOptions = {
      colonnes: [
        {
          id: DonneesListe_SelectionElementPilier_1
            .DonneesListe_SelectionElementPilier.colonnes.libelle,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.GrilleCompetences.FenetreElmtSignifiant.Titre",
          ),
          taille: "100%",
        },
      ],
      avecListeNeutre: true,
      avecRollover: false,
    };
    aInstance.setOptionsListe(lOptions);
  }
  _evenementSurListe(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
        const lElementSelectionne = this._getPremierElementSelectionne();
        this.setBoutonActif(1, !!lElementSelectionne);
        break;
      }
    }
  }
  _actualiserListe() {
    super._actualiserListe();
    const lElementSelectionne = this._getPremierElementSelectionne();
    this.setBoutonActif(1, !!lElementSelectionne);
  }
  surValidation(ANumeroBouton) {
    const lElementSelectionne = this._getPremierElementSelectionne();
    this.fermer();
    this.callback.appel(ANumeroBouton, lElementSelectionne);
  }
  _getPremierElementSelectionne() {
    let result = null;
    const lListeElementsSignifiantsSelected = this.getInstance(
      this.identListe,
    ).getListeElementsSelection();
    if (
      !!lListeElementsSignifiantsSelected &&
      lListeElementsSignifiantsSelected.count() > 0
    ) {
      result = lListeElementsSignifiantsSelected.get(0);
    }
    return result;
  }
}
