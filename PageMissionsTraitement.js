exports.PageMissionsTraitement = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_js_1 = require("GUID.js");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurTravaux_js_1 = require("ObjetMoteurTravaux.js");
const TypeGenreTravauxIntendance_1 = require("TypeGenreTravauxIntendance");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetHtml_1 = require("ObjetHtml");
const TypeDestinationDemandeTravaux_1 = require("TypeDestinationDemandeTravaux");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Onglet_js_1 = require("Enumere_Onglet.js");
const tag_1 = require("tag");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SelectionPublic_js_1 = require("ObjetFenetre_SelectionPublic.js");
const ObjetRequeteListePublics_js_1 = require("ObjetRequeteListePublics.js");
const TypeGenreFonctionPersonnel_1 = require("TypeGenreFonctionPersonnel");
const UtilitaireDuree_js_1 = require("UtilitaireDuree.js");
const TypeColonneTravauxIntendance_1 = require("TypeColonneTravauxIntendance");
class PageMissionsTraitement extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.idBtnTrash = GUID_js_1.GUID.getId();
    this.idZoneDuree = GUID_js_1.GUID.getId();
    this.construireInstancesDateRealisation();
  }
  construireInstancesDateRealisation() {
    this.identDateRealisation = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      { pere: this, evenement: this.evenementSurDateRealisation },
    );
    this.identDateRealisation.setOptionsObjetCelluleDate({
      formatDate: "%JJJ %JJ/%MM/%AAAA",
      largeurComposant: 140,
      avecAucuneDate: true,
      avecInitDateSiVide: false,
    });
    this.identDateRealisation.setOptions({
      placeHolder: ObjetTraduction_1.GTraductions.getValeur("Date"),
    });
    return;
  }
  evenementSurDateRealisation(aDateRealisation, aGenreBouton) {
    if (aGenreBouton === -1) {
      return;
    } else if (aGenreBouton === 1) {
      this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      this.demandeCourante.dateRealisation = aDateRealisation;
    } else if (aGenreBouton === 0) {
      this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      this.demandeCourante.dateRealisation = "";
      this.identDateRealisation.setDonnees(null);
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboAttribueA: {
        event() {
          aInstance.lFenetreselectionExecutants =
            ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_SelectionPublic_js_1.ObjetFenetre_SelectionPublic,
              {
                pere: aInstance,
                evenement: function (
                  aGenreRessource,
                  aListeRessourcesSelectionnees,
                ) {
                  aInstance._getListeExecutantModifies(
                    aListeRessourcesSelectionnees,
                  );
                },
                initialiser: (aInstance) => {
                  const lTitre = ObjetTraduction_1.GTraductions.getValeur(
                    "TvxIntendance.fenetre.attribuerA",
                  );
                  aInstance.setOptionsFenetre({
                    titre: lTitre,
                    largeur: 450,
                    hauteur: 450,
                    hauteurMaxContenu: 720,
                    avecScroll: true,
                    listeBoutons: [
                      ObjetTraduction_1.GTraductions.getValeur("Fermer"),
                      ObjetTraduction_1.GTraductions.getValeur("Valider"),
                    ],
                  });
                  aInstance.setOptionsFenetreSelectionRessource({
                    avecCocheRessources: true,
                  });
                  aInstance.setSelectionObligatoire(false);
                },
              },
            );
          let lGenreIndividus = [
            Enumere_Ressource_1.EGenreRessource.Enseignant,
            Enumere_Ressource_1.EGenreRessource.Personnel,
          ];
          if (
            aInstance.genreTravaux ===
            TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
              .GTI_Secretariat
          ) {
            lGenreIndividus = [Enumere_Ressource_1.EGenreRessource.Personnel];
          }
          new ObjetRequeteListePublics_js_1.ObjetRequeteListePublics(
            aInstance,
            aInstance._evntListePublicsApresRequete.bind(aInstance, {
              genres: lGenreIndividus,
            }),
          ).lancerRequete({
            genres: lGenreIndividus,
            avecFonctionPersonnel: true,
          });
        },
        getLibelle() {
          return aInstance._getHtmlAttributionApresSelection(
            aInstance.demandeCourante.listeExecutants,
          );
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_Executant,
          );
        },
      },
      chipsAttribution: {
        event: function () {
          return true;
        },
        eventBtn: function (aNumero) {
          if (aInstance.droits.avecGestionTravaux) {
            aInstance._evntSupprAttribution(aNumero);
          }
          return false;
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_Executant,
          );
        },
      },
      inputCommentaire: {
        getValue: function () {
          return !!aInstance.demandeCourante &&
            !!aInstance.demandeCourante.commentaire
            ? aInstance.demandeCourante.commentaire
            : "";
        },
        setValue: function (aValue) {
          aInstance.demandeCourante.commentaire = aValue;
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_Commentaire,
          );
        },
      },
      comboJours: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({ longueur: 30 });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.listeJours;
          }
        },
        getIndiceSelection: function () {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          return lDuree ? lDuree.jours : 0;
        },
        event: function (aParametres) {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            !!aParametres.element
          ) {
            lDuree.jours = MethodesObjet_1.MethodesObjet.isNumeric(
              aParametres.element.getLibelle(),
            )
              ? parseInt(aParametres.element.getLibelle())
              : 0;
            aInstance.demandeCourante.duree =
              lDuree.jours +
              UtilitaireDuree_js_1.TUtilitaireDuree.heuresEnDuree(
                lDuree.heures,
              ) +
              UtilitaireDuree_js_1.TUtilitaireDuree.minEnDuree(lDuree.minutes);
          }
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_DureeDIntervention,
          );
        },
      },
      comboHeures: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({ longueur: 30 });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.listeHeures;
          }
        },
        getIndiceSelection: function () {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          return lDuree ? lDuree.heures : 0;
        },
        event: function (aParametres) {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            !!aParametres.element
          ) {
            lDuree.heures = MethodesObjet_1.MethodesObjet.isNumeric(
              aParametres.element.getLibelle(),
            )
              ? parseInt(aParametres.element.getLibelle())
              : 0;
            aInstance.demandeCourante.duree =
              lDuree.jours +
              UtilitaireDuree_js_1.TUtilitaireDuree.heuresEnDuree(
                lDuree.heures,
              ) +
              UtilitaireDuree_js_1.TUtilitaireDuree.minEnDuree(lDuree.minutes);
          }
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_DureeDIntervention,
          );
        },
      },
      comboMinutes: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({ longueur: 30 });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.listeMinutes;
          }
        },
        getIndiceSelection: function () {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          return lDuree ? lDuree.minutes : 0;
        },
        event: function (aParametres) {
          let lDuree =
            UtilitaireDuree_js_1.TUtilitaireDuree.dureeEnJoursHeuresMinutes(
              aInstance.demandeCourante.duree,
            );
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            !!aParametres.element
          ) {
            lDuree.minutes = MethodesObjet_1.MethodesObjet.isNumeric(
              aParametres.element.getLibelle(),
            )
              ? parseInt(aParametres.element.getLibelle())
              : 0;
            aInstance.demandeCourante.duree =
              lDuree.jours +
              UtilitaireDuree_js_1.TUtilitaireDuree.heuresEnDuree(
                lDuree.heures,
              ) +
              UtilitaireDuree_js_1.TUtilitaireDuree.minEnDuree(lDuree.minutes);
          }
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_DureeDIntervention,
          );
        },
      },
      inputRemarque: {
        getValue: function () {
          return !!aInstance.demandeCourante &&
            !!aInstance.demandeCourante.remarque
            ? aInstance.demandeCourante.remarque
            : "";
        },
        setValue: function (aValue) {
          aInstance.demandeCourante.remarque = aValue;
        },
        getDisabled: function () {
          return !aInstance._estEditable(
            TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
              .tcti_Remarque,
          );
        },
      },
    });
  }
  setDonnees(aParam) {
    this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
    this.demandeCourante = aParam.demandeCourante;
    this.droits = aParam.droits;
    this.listeDestination =
      TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.toListe(
        GEtatUtilisateur.GenreEspace ===
          Enumere_Espace_1.EGenreEspace.PrimMairie,
      );
    this.genreTravaux = aParam.genreTravaux;
    this.dateRealisation = aParam.dateRealisation;
    this.estEnCreation = aParam.estEnCreation;
    this.enModification = aParam.enModification;
    this.listeExecutantsAvantSelection = !!aParam.demandeCourante
      .listeExecutants
      ? MethodesObjet_1.MethodesObjet.dupliquer(
          aParam.demandeCourante.listeExecutants,
        )
      : new ObjetListeElements_1.ObjetListeElements();
    if (!!this.param.demandeCourante) {
      this.demandeCourante = this.param.demandeCourante;
      this.enModification = true;
    } else {
      this.demandeCourante = this.creerNouvelleDemande();
      this.estEnCreation = true;
      this.enModification = false;
    }
    this.moteur = new ObjetMoteurTravaux_js_1.ObjetMoteurTravaux(this.param);
    this.afficher(this.composeContenu());
    this.identDateRealisation.initialiser();
    this.identDateRealisation.setParametresFenetre(
      GParametres.PremierLundi,
      this.demandeCourante.dateCreation,
      GParametres.DerniereDate,
      null,
      null,
      null,
      false,
    );
    if (
      !this._estEditable(
        TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
          .tcti_DateRealisation,
      )
    ) {
      this.identDateRealisation.setActif(false);
    } else {
      this.identDateRealisation.setActif(true);
    }
    if (!!this.param.demandeCourante.dateRealisation) {
      this.identDateRealisation.setDonnees(
        this.demandeCourante.dateRealisation,
      );
    }
    if (this.param.estEnCreation) {
      ObjetHtml_1.GHtml.setDisplay(this.idBtnTrash, false);
    }
    this.listeJours =
      ObjetMoteurTravaux_js_1.ObjetMoteurTravaux.getListeJours();
    this.listeHeures =
      ObjetMoteurTravaux_js_1.ObjetMoteurTravaux.getListeHeures();
    this.listeMinutes =
      ObjetMoteurTravaux_js_1.ObjetMoteurTravaux.getListeMinutes();
  }
  _estEditable(aChamps) {
    if (!this.enModification) {
      return true;
    }
    return this.moteur.estEditable(this.demandeCourante, aChamps);
  }
  creerNouvelleDemande() {
    const lDemande = ObjetElement_1.ObjetElement.create();
    const lUserConnecte = GEtatUtilisateur.getUtilisateur();
    lDemande.genreTravaux = this.genreTravaux;
    lDemande.demandeur = new ObjetElement_1.ObjetElement(
      lUserConnecte.getLibelle(),
      lUserConnecte.getNumero(),
      lUserConnecte.getGenre(),
    );
    lDemande.dateRealisation = this.dateRealisation;
    lDemande.listeExecutants = this.listeExecutants;
    lDemande.commentaire = this.commentaire;
    lDemande.remarque = this.remarque;
    lDemande.duree = this.duree;
    lDemande.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    return lDemande;
  }
  composeContenu() {
    const idLabelExecutant = GUID_js_1.GUID.getId();
    const lEstCommande =
      this.genreTravaux ===
      TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande;
    const lDestinataire = IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str(
        "label",
        { class: "ie-titre-petit", id: idLabelExecutant },
        ObjetTraduction_1.GTraductions.getValeur(
          "TvxIntendance.colonne.executants",
        ),
      ),
      IE.jsx.str("ie-btnselecteur", {
        "ie-model": "comboAttribueA",
        class: "flex-wrap chips-inside",
        "aria-labelledby": idLabelExecutant,
      }),
    );
    const lDuree = IE.jsx.str(
      "div",
      { class: "field-contain label-up flex-gap-l p-bottom-l" },
      IE.jsx.str(
        "label",
        { class: "active ie-titre-petit" },
        ObjetTraduction_1.GTraductions.getValeur(
          "TvxIntendance.colonne.dureeInterventionLong",
        ),
      ),
      IE.jsx.str(
        "div",
        { class: "flex-contain flex-center flex-gap-l", id: this.idZoneDuree },
        this._getHtmlDuree(),
      ),
    );
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        { class: "flex-contain cols justify-between m-bottom-xl full-width" },
        !lEstCommande ? lDestinataire : "",
        IE.jsx.str(
          "div",
          { class: "field-contain label-up no-line" },
          IE.jsx.str(
            "label",
            { class: "ie-titre-petit" },
            GEtatUtilisateur.getGenreOnglet() ===
              Enumere_Onglet_js_1.EGenreOnglet.Intendance_SaisieCommandes
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.colonne.commentaire",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.colonne.commentaire",
                ),
          ),
          IE.jsx.str("ie-textareamax", {
            "ie-model": "inputCommentaire",
            maxlength: "1000",
            class: "ie-autoresize m-bottom-xl",
            placeholder: ObjetTraduction_1.GTraductions.getValeur(
              "TvxIntendance.TraitementAttributionCommentaire",
            ),
          }),
        ),
        IE.jsx.str(
          "div",
          { class: "field-contain in-row" },
          IE.jsx.str(
            "label",
            { class: ["ie-titre-petit"] },
            GEtatUtilisateur.getGenreOnglet() ===
              Enumere_Onglet_js_1.EGenreOnglet.Intendance_SaisieCommandes
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.fenetre.dateReception",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.colonne.realisationLe",
                ),
          ),
          IE.jsx.str("div", {
            class: "flex-contain flex-center flex-gap",
            id: this.identDateRealisation.getNom(),
          }),
        ),
        !lEstCommande ? lDuree : "",
        IE.jsx.str(
          "div",
          { class: "field-contain label-up" },
          IE.jsx.str(
            "label",
            { class: "ie-titre-petit" },
            GEtatUtilisateur.getGenreOnglet() ===
              Enumere_Onglet_js_1.EGenreOnglet.Intendance_SaisieCommandes
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.colonne.remarque",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "TvxIntendance.colonne.remarque",
                ),
          ),
          IE.jsx.str("ie-textareamax", {
            "ie-model": "inputRemarque",
            class: "ie-autoresize m-bottom-xl",
            placeholder: ObjetTraduction_1.GTraductions.getValeur(
              "TvxIntendance.TraitementRealisationRemarque",
            ),
          }),
        ),
      ),
    );
  }
  _evntListePublicsApresRequete(aListeSelectionne, aParam) {
    this.listeExecutants = aParam;
    const lListe = aParam.listePublic;
    let lListeMiseEnForme = new ObjetListeElements_1.ObjetListeElements();
    const lListeProfs = new ObjetListeElements_1.ObjetListeElements();
    const lListePersonnel = new ObjetListeElements_1.ObjetListeElements();
    const lCumulProfesseurs = ObjetElement_1.ObjetElement.create({
      Libelle: ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
      Numero: -1,
      Genre: Enumere_Ressource_1.EGenreRessource.Enseignant,
      estDeploye: false,
      estUnDeploiement: true,
    });
    const lCumulPersonnels = ObjetElement_1.ObjetElement.create({
      Libelle: ObjetTraduction_1.GTraductions.getValeur("Personnel"),
      Numero: -2,
      Genre: Enumere_Ressource_1.EGenreRessource.Personnel,
      estDeploye: false,
      estUnDeploiement: true,
    });
    lCumulPersonnels.setActif(true);
    if (
      aParam === null || aParam === void 0
        ? void 0
        : aParam.genres.includes(Enumere_Ressource_1.EGenreRessource.Enseignant)
    ) {
      lListeProfs.addElement(lCumulProfesseurs);
    }
    if (
      aParam === null || aParam === void 0
        ? void 0
        : aParam.genres.includes(Enumere_Ressource_1.EGenreRessource.Personnel)
    ) {
      lListePersonnel.addElement(lCumulPersonnels);
    }
    const lEstUneDemandeInterne =
      this.demandeCourante.destination ===
      TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux.DDT_Interne;
    lListe.parcourir((aElt) => {
      switch (aElt.getGenre()) {
        case Enumere_Ressource_1.EGenreRessource.Enseignant:
          aElt.pere = lCumulProfesseurs;
          lListeProfs.addElement(aElt);
          break;
        case Enumere_Ressource_1.EGenreRessource.Personnel:
          if (
            lEstUneDemandeInterne &&
            TypeGenreFonctionPersonnel_1.TypeGenreFonctionPersonnelUtil.estFonctionMairie(
              aElt.genreFonction,
            )
          ) {
            return;
          }
          aElt.pere = lCumulPersonnels;
          lListePersonnel.addElement(aElt);
          break;
      }
    });
    lListeMiseEnForme = lListeProfs.add(lListePersonnel);
    this.lFenetreselectionExecutants.setDonnees({
      listeRessources: lListeMiseEnForme,
      listeRessourcesSelectionnees: !!this.demandeCourante.listeExecutants
        ? this.demandeCourante.listeExecutants
        : new ObjetListeElements_1.ObjetListeElements(),
      genreRessource: Enumere_Ressource_1.EGenreRessource.Enseignant,
    });
  }
  _getHtmlAttributionApresSelection(lListeSelection) {
    const T = [];
    this.listeExecutantsSelectionnes =
      new ObjetListeElements_1.ObjetListeElements();
    this.listeExecutantsSelectionnes = lListeSelection;
    if (lListeSelection) {
      if (lListeSelection.count() === 0) {
        return ObjetTraduction_1.GTraductions.getValeur(
          "TvxIntendance.TraitementSelectionExecutant",
        );
      }
      lListeSelection.parcourir((aExecutant) => {
        if (aExecutant.existe()) {
          if (this.droits.avecGestionTravaux) {
            T.push(
              (0, tag_1.tag)(
                "ie-chips",
                {
                  "ie-model": tag_1.tag.funcAttr("chipsAttribution", [
                    aExecutant.getNumero(),
                  ]),
                  class: "m-all",
                },
                aExecutant.getLibelle(),
              ),
            );
          } else {
            T.push((0, tag_1.tag)("ie-chips", aExecutant.getLibelle()));
          }
        }
      });
    }
    return T.join("");
  }
  _evntSupprAttribution(aNumero) {
    const lListePourSaisie = this.demandeCourante.listeExecutants;
    lListePourSaisie.parcourir((aExecutant) => {
      if (aNumero === aExecutant.getNumero()) {
        aExecutant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
      }
    });
    this.demandeCourante.listePourSaisie = lListePourSaisie;
    this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
  }
  _getListeExecutantModifies(aNouveauExecutants) {
    const lListeSaisie = new ObjetListeElements_1.ObjetListeElements();
    if (this.listeExecutantsAvantSelection) {
      this.listeExecutantsAvantSelection.parcourir((aExecutant) => {
        if (aNouveauExecutants) {
          const lIndice = aNouveauExecutants.getIndiceExisteParNumeroEtGenre(
            aExecutant.getNumero(),
            aExecutant.getGenre(),
          );
          if (lIndice === undefined || lIndice < 0) {
            aExecutant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
            lListeSaisie.add(aExecutant);
          }
        } else {
          aExecutant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
          lListeSaisie.add(aExecutant);
        }
      });
    }
    if (aNouveauExecutants) {
      aNouveauExecutants.parcourir((aExecutant) => {
        if (this.listeExecutantsAvantSelection) {
          const lIndice =
            this.listeExecutantsAvantSelection.getIndiceExisteParNumeroEtGenre(
              aExecutant.getNumero(),
              aExecutant.getGenre(),
            );
          if (lIndice === undefined || lIndice < 0) {
            aExecutant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
            lListeSaisie.add(aExecutant);
          }
        } else {
          aExecutant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
          lListeSaisie.add(aExecutant);
        }
      });
    }
    this.demandeCourante.listePourSaisie = lListeSaisie;
  }
  _getHtmlDuree() {
    const idDureeJour = GUID_js_1.GUID.getId();
    const idDureeHeure = GUID_js_1.GUID.getId();
    const idDureeMinute = GUID_js_1.GUID.getId();
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        { class: "flex-inline-contain flex-center" },
        IE.jsx.str(
          "label",
          { class: "marge", id: idDureeJour },
          ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.Jours"),
        ),
        IE.jsx.str("ie-combo", {
          "ie-model": "comboJours",
          class: "combo-classic",
          "aria-labelledby": idDureeJour,
        }),
      ),
      IE.jsx.str(
        "div",
        { class: "flex-inline-contain flex-center" },
        IE.jsx.str(
          "label",
          { class: "marge", id: idDureeHeure },
          ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.Heures"),
        ),
        IE.jsx.str("ie-combo", {
          "ie-model": "comboHeures",
          class: "combo-classic",
          "aria-labelledby": idDureeHeure,
        }),
      ),
      IE.jsx.str(
        "div",
        { class: "flex-inline-contain flex-center" },
        IE.jsx.str(
          "label",
          { class: "marge", id: idDureeMinute },
          ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.Minutes"),
        ),
        IE.jsx.str("ie-combo", {
          "ie-model": "comboMinutes",
          class: "combo-classic",
          "aria-labelledby": idDureeMinute,
        }),
      ),
    );
  }
  getDonnees() {
    if (!!this.demandeCourante) {
      return this.demandeCourante;
    }
  }
}
exports.PageMissionsTraitement = PageMissionsTraitement;
