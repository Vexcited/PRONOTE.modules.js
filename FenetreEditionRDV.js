exports.FenetreEditionRDV = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const MoteurRDV_1 = require("MoteurRDV");
const TypesRDV_1 = require("TypesRDV");
const TypesRDV_2 = require("TypesRDV");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Etat_1 = require("Enumere_Etat");
const GUID_1 = require("GUID");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetListeElements_1 = require("ObjetListeElements");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_SelectionPublic_PN_1 = require("ObjetFenetre_SelectionPublic_PN");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetElement_1 = require("ObjetElement");
const jsx_1 = require("jsx");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireListePublics_1 = require("UtilitaireListePublics");
class FenetreEditionRDV extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.moteurRDV = new MoteurRDV_1.MoteurRDV();
    this.utilitaires = {
      genreEspace: new GestionnaireBlocPN_1.UtilitaireGenreEspace(),
    };
    this.moteurDestinataires =
      new MoteurDestinatairesPN_1.MoteurDestinatairesPN(this.utilitaires);
    this.ids = {
      labelRespRdv: GUID_1.GUID.getId(),
      inputObjet: GUID_1.GUID.getId(),
      inputDescription: GUID_1.GUID.getId(),
      inputDuree: GUID_1.GUID.getId(),
      labelAjoutCreneau: GUID_1.GUID.getId(),
      labelResponsables: GUID_1.GUID.getId(),
      labelPublicCibleEleve: GUID_1.GUID.getId(),
    };
    this.listeModalites = this.moteurRDV.getListeModalites();
    this.estCtxRespRdv = this.moteurRDV.estCtxResponsableDeRDV();
    this.listePJs = new ObjetListeElements_1.ObjetListeElements();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getHtmlDemanderPresenceEleveConcerne: function () {
        let lRdv = aInstance.donnees.rdv;
        let lStrEleveConcerne = lRdv.eleveConcerne
          ? ObjetTraduction_1.GTraductions.getValeur(
              "RDV.demanderPresenceStrEleve",
              [lRdv.eleveConcerne.getLibelle()],
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "RDV.demanderPresenceEleve",
            );
        return lStrEleveConcerne;
      },
      cbPresenceEleve: {
        getValue: function () {
          let lRdv = aInstance.donnees.rdv;
          return lRdv.session.avecPresenceEleve;
        },
        setValue: function (aValue) {
          let lRdv = aInstance.donnees.rdv;
          lRdv.session.avecPresenceEleve = aValue;
          lRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        },
        getDisabled: function () {
          return false;
        },
      },
      getHtmlLegende: function () {
        return aInstance._composeLegende();
      },
      getHtmlnbCreneauxSurNbParticipants: function () {
        let lRdv = aInstance.donnees.rdv;
        let lNbCreneaux = 0;
        let lNbParticipants = 0;
        let lAvecDecompteCreneauxSurParticipants =
          aInstance.moteurRDV.estUnRdvEnSerie(lRdv) && lRdv.estRdvSessionSerie;
        if (lAvecDecompteCreneauxSurParticipants) {
          lNbCreneaux = lRdv.session.listeCreneauxProposes
            .getListeElements((aCreneau) => {
              return aCreneau.existe();
            })
            .count();
          lNbParticipants =
            aInstance.optionsRDV.natureRDV ===
            TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie
              ? aInstance.moteurRDV.getNbFamillesParticipantSessionSerie(lRdv)
              : aInstance.moteurRDV.getNbElevesParticipantSessionSerie(lRdv);
        }
        return ObjetChaine_1.GChaine.insecable(
          ObjetTraduction_1.GTraductions.getValeur(
            "RDV.xCreneauxSurXParticipants",
            [lNbCreneaux, lNbParticipants],
          ),
        );
      },
      getHtmlCreneauxProposes: function () {
        return aInstance.moteurRDV.composeCreneauxProposes(
          aInstance,
          aInstance.donnees.rdv,
          aInstance.donnees.rdv.session.listeCreneauxProposes,
          { avecChoixCreneau: false, avecSuppressionCreneau: true },
        );
      },
      ajoutCreneau: {
        getIcone() {
          return IE.jsx.str("i", { class: "icon_plus", "aria-hidden": "true" });
        },
        getLibelle: function () {
          return ObjetTraduction_1.GTraductions.getValeur(
            "RDV.ajouterDesCreneaux",
          );
        },
        event() {
          ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
            pere: aInstance,
            evenement: () => {},
            initCommandes: (aInstanceMenuCtx) => {
              let lParPlagePrio = aInstance.moteurRDV.estUnRdvEnSerie(
                aInstance.donnees.rdv,
              );
              if (lParPlagePrio) {
                aInstanceMenuCtx.add(
                  ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.plageDeCreneaux",
                  ),
                  true,
                  () => {
                    aInstance.moteurRDV.ouvrirFenetreSelectionCreneauxParPlageHoraire(
                      aInstance,
                      aInstance.donnees.rdv,
                      aInstance.listeModalites,
                      aInstance.listeSallesLieux,
                    );
                  },
                );
              }
              aInstanceMenuCtx.add(
                ObjetTraduction_1.GTraductions.getValeur("RDV.nouveauCreneau"),
                true,
                () => {
                  aInstance.moteurRDV.ouvrirFenetreSelectionCreneau(
                    aInstance,
                    aInstance.donnees.rdv,
                    aInstance.listeModalites,
                    aInstance.listeSallesLieux,
                  );
                },
              );
              if (!lParPlagePrio) {
                aInstanceMenuCtx.add(
                  ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.plageDeCreneaux",
                  ),
                  true,
                  () => {
                    aInstance.moteurRDV.ouvrirFenetreSelectionCreneauxParPlageHoraire(
                      aInstance,
                      aInstance.donnees.rdv,
                      aInstance.listeModalites,
                      aInstance.listeSallesLieux,
                    );
                  },
                );
              }
            },
          });
        },
        getDisabled() {
          return false;
        },
      },
      respRDV: {
        getIcone(aGenreRessource) {
          let lIcon =
            aGenreRessource === Enumere_Ressource_1.EGenreRessource.Enseignant
              ? "icon_enseignant_prof"
              : "icon_user";
          return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
        },
        getLibelle: function (aGenreRessource) {
          if (aInstance.donnees) {
            let lRDV = aInstance.donnees.rdv;
            if (
              lRDV &&
              lRDV.session &&
              lRDV.session.responsableRDV &&
              lRDV.session.responsableRDV.getGenre() === aGenreRessource
            ) {
              return lRDV.session.responsableRDV.getLibelle();
            } else {
              return aGenreRessource ===
                Enumere_Ressource_1.EGenreRessource.Enseignant
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.choisirProfesseur",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.choisirPersonnel",
                  );
            }
          }
        },
        event(aGenreRessource) {
          let lListePublicDonnee =
            new ObjetListeElements_1.ObjetListeElements();
          if (
            aInstance.donnees.rdv &&
            aInstance.donnees.rdv.session &&
            aInstance.donnees.rdv.session.responsableRDV
          ) {
            lListePublicDonnee.add(
              aInstance.donnees.rdv.session.responsableRDV,
            );
          }
          aInstance.moteurDestinataires.ouvrirModaleSelectionPublic({
            genreRessource: aGenreRessource,
            listePublicDonnee: lListePublicDonnee,
            avecCoche: false,
            clbck: (aParam) => {
              let lNbSelection = aParam.listePublicDonnee.count();
              if (lNbSelection > 0 && lNbSelection !== 1) {
                GApplication.getMessage().afficher({
                  type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
                  message:
                    ObjetTraduction_1.GTraductions.getValeur(
                      "RDV.unSeulRespRDV",
                    ),
                });
              } else {
                aInstance.donnees.rdv.session.responsableRDV =
                  aParam.listePublicDonnee && lNbSelection > 0
                    ? aParam.listePublicDonnee.get(0)
                    : null;
              }
            },
            eleve: GEtatUtilisateur.getMembre(),
            avecFiltreSelonAcceptRdv: aInstance.moteurRDV.estCtxDemandeDeRDV(),
            avecDirEnseignant:
              aGenreRessource ===
                Enumere_Ressource_1.EGenreRessource.Personnel &&
              aInstance.moteurRDV.estCtxForcerDirEnseignant(),
          });
        },
      },
      btnVoirDetailPublic: {
        event: function () {
          let lRDV = aInstance.donnees.rdv;
          const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_1.ObjetFenetre,
            {
              pere: this,
              initialiser: (aInstance) => {
                aInstance.setOptionsFenetre({
                  largeurMin: 350,
                  hauteurMaxContenu: 400,
                  avecScroll: true,
                });
              },
            },
            {
              titre:
                ObjetTraduction_1.GTraductions.getValeur("RDV.Participants"),
            },
          );
          return lFenetre.afficher(
            aInstance.moteurRDV.composeDetailPublicSerie(lFenetre, lRDV),
          );
        },
        getTitle: function () {
          return ObjetTraduction_1.GTraductions.getValeur(
            "RDV.voirDetailParticipantsSerie",
          );
        },
        getDisabled: function () {
          let lRDV = aInstance.donnees.rdv;
          let lNbFamillesParticipants = aInstance.moteurRDV.estRdvImpose(lRDV)
            ? aInstance.moteurRDV.getNbElevesParticipantSessionSerie(lRDV)
            : aInstance.moteurRDV.getNbFamillesParticipantSessionSerie(lRDV);
          return lNbFamillesParticipants < 1;
        },
      },
      publicCibleListeFamillesEleves: {
        getLibelle: function () {
          const lHtml = [];
          if (aInstance.donnees) {
            let lRDV = aInstance.donnees.rdv;
            let lNbFamillesParticipants =
              aInstance.moteurRDV.getNbFamillesParticipantSessionSerie(lRDV);
            if (lNbFamillesParticipants > 0) {
              return ObjetTraduction_1.GTraductions.getValeur(
                "RDV.xFamillesParticipants",
                [lNbFamillesParticipants],
              );
            } else {
              return ObjetTraduction_1.GTraductions.getValeur(
                "RDV.choisirParentsMultiFamilles",
              );
            }
          }
          return lHtml.join("");
        },
        event() {
          let lRDV = aInstance.donnees.rdv;
          if (lRDV.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
            return;
          }
          aInstance.ouvrirFenetreSelectionFamilleEleve(
            false,
            (aListeRessourcesSelectionnees) => {
              aInstance.donnees.rdv.tabFamillesParticipantRDV = [];
              aListeRessourcesSelectionnees.parcourir((aFamille) => {
                if (aFamille.responsables && aFamille.eleveConcerne) {
                  let lEleve = aFamille.eleveConcerne;
                  if (lEleve.avecRencontresSepareesDesResponsables === true) {
                    aFamille.responsables.parcourir((aResp) => {
                      aInstance.donnees.rdv.tabFamillesParticipantRDV.push({
                        listeParticipantRDV:
                          new ObjetListeElements_1.ObjetListeElements().add(
                            MethodesObjet_1.MethodesObjet.dupliquer(aResp),
                          ),
                        eleveConcerne: lEleve,
                      });
                    });
                  } else {
                    aInstance.donnees.rdv.tabFamillesParticipantRDV.push({
                      listeParticipantRDV:
                        MethodesObjet_1.MethodesObjet.dupliquer(
                          aFamille.responsables,
                        ),
                      eleveConcerne: lEleve,
                    });
                  }
                }
              });
            },
          );
        },
        getDisabled() {
          return aInstance._estModeEdition();
        },
      },
      publicCibleFamilleEleve: {
        getIcone() {
          let lIcon = "icon_user";
          return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
        },
        getLibelle: function () {
          const lHtml = [];
          if (aInstance.donnees) {
            let lRDV = aInstance.donnees.rdv;
            if (lRDV && lRDV.listeParticipantRDV) {
              let lStrParticipants = aInstance.moteurRDV.strParticipantsRdv(
                lRDV,
                ", ",
              );
              let lNbParticipants = lRDV.listeParticipantRDV.count();
              if (lNbParticipants === 1) {
                return lStrParticipants;
              } else if (lNbParticipants > 0) {
                return lStrParticipants;
              } else {
                return ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.choisirParents",
                );
              }
            }
          }
          return lHtml.join("");
        },
        event() {
          let lRDV = aInstance.donnees.rdv;
          if (lRDV.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
            return;
          }
          aInstance.ouvrirFenetreSelectionFamilleEleve(
            true,
            (aListeRessourcesSelectionnees) => {
              if (aListeRessourcesSelectionnees.count() > 0) {
                const lFamille = aListeRessourcesSelectionnees.get(0);
                if (lFamille.responsables && lFamille.eleveConcerne) {
                  let lEleve = lFamille.eleveConcerne;
                  if (lEleve.avecRencontresSepareesDesResponsables === true) {
                    if (lFamille.responsables.count() === 1) {
                      aInstance.donnees.rdv.listeParticipantRDV =
                        MethodesObjet_1.MethodesObjet.dupliquer(
                          lFamille.responsables,
                        );
                      aInstance.donnees.rdv.eleveConcerne = lEleve;
                    } else {
                      aInstance.donnees.rdv.listeParticipantRDV =
                        new ObjetListeElements_1.ObjetListeElements().add(
                          MethodesObjet_1.MethodesObjet.dupliquer(
                            lFamille.responsables.get(0),
                          ),
                        );
                      aInstance.donnees.rdv.eleveConcerne = lEleve;
                    }
                  } else {
                    aInstance.donnees.rdv.listeParticipantRDV =
                      MethodesObjet_1.MethodesObjet.dupliquer(
                        lFamille.responsables,
                      );
                    aInstance.donnees.rdv.eleveConcerne = lEleve;
                  }
                }
              }
            },
          );
        },
        getDisabled() {
          return aInstance._estModeEdition();
        },
      },
      publicCibleListeEleves: {
        getIcone() {
          let lIcon = "icon_eleve";
          return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
        },
        getLibelle: function () {
          const lHtml = [];
          if (aInstance.donnees) {
            let lRDV = aInstance.donnees.rdv;
            let lNbParticipants =
              aInstance.moteurRDV.getNbElevesParticipantSessionSerie(lRDV);
            let lEstCtxCreation =
              lRDV &&
              lRDV.listeParticipantsSerie !== null &&
              lRDV.listeParticipantsSerie !== undefined;
            if (lNbParticipants === 1) {
              return lEstCtxCreation
                ? lRDV.listeParticipantsSerie.getLibelle(0)
                : ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.xParticipants",
                    [lNbParticipants],
                  );
            } else if (lNbParticipants > 0) {
              return ObjetTraduction_1.GTraductions.getValeur(
                "RDV.xParticipants",
                [lNbParticipants],
              );
            } else {
              return ObjetTraduction_1.GTraductions.getValeur(
                "RDV.choisirEleves",
              );
            }
          }
          return lHtml.join("");
        },
        event() {
          aInstance.moteurDestinataires.ouvrirModaleSelectionPublic({
            genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
            listePublicDonnee: aInstance.donnees.rdv.listeParticipantsSerie,
            avecCoche: true,
            clbck: (aParam) => {
              aInstance.donnees.rdv.listeParticipantsSerie =
                aParam.listePublicDonnee;
            },
          });
        },
        getDisabled() {
          return aInstance._estModeEdition();
        },
      },
      publicCibleEleve: {
        getIcone() {
          let lIcon =
            aInstance.optionsRDV.natureRDV ===
            TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose
              ? "icon_eleve"
              : "icon_user";
          return IE.jsx.str("i", { class: lIcon, "aria-hidden": "true" });
        },
        getLibelle: function () {
          const lHtml = [];
          if (aInstance.donnees) {
            let lRDV = aInstance.donnees.rdv;
            if (lRDV && lRDV.listeParticipantRDV) {
              let lNbParticipants = lRDV.listeParticipantRDV.count();
              if (lNbParticipants === 1) {
                return lRDV.listeParticipantRDV.getLibelle(0);
              } else if (lNbParticipants > 0) {
                return ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.xParticipants",
                  [lNbParticipants],
                );
              } else {
                return ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.choisirEleve",
                );
              }
            }
          }
          return lHtml.join("");
        },
        event() {
          aInstance.moteurDestinataires.ouvrirModaleSelectionPublic({
            genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
            listePublicDonnee: aInstance.donnees.rdv.listeParticipantRDV,
            avecCoche: false,
            clbck: (aParam) => {
              aInstance.donnees.rdv.listeParticipantRDV =
                aParam.listePublicDonnee;
            },
          });
        },
        getDisabled() {
          return aInstance._estModeEdition();
        },
      },
      inputSujet: {
        getValue: function () {
          if (aInstance.donnees) {
            let lRdv = aInstance.donnees.rdv;
            return lRdv && lRdv.session ? lRdv.session.sujet : "";
          }
        },
        setValue: function (aValue) {
          let lRdv = aInstance.donnees.rdv;
          if (lRdv && lRdv.session) {
            lRdv.session.sujet = aValue;
            lRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          }
        },
        getDisabled() {
          let lRdv = aInstance.donnees.rdv;
          return (
            aInstance.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
            aInstance.estCtxRespRdv &&
            (lRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVDemande ||
              lRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours)
          );
        },
      },
      description: {
        getValue: function () {
          if (aInstance.donnees) {
            let lRdv = aInstance.donnees.rdv;
            return lRdv && lRdv.session ? lRdv.session.description : "";
          }
        },
        setValue: function (aValue) {
          let lRdv = aInstance.donnees.rdv;
          if (lRdv && lRdv.session && lRdv.session.description !== aValue) {
            lRdv.session.description = aValue;
            lRdv.session.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          }
        },
        getDisabled() {
          let lRdv = aInstance.donnees.rdv;
          return (
            aInstance.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
            aInstance.estCtxRespRdv &&
            (lRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVDemande ||
              lRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours)
          );
        },
      },
      inputDuree: {
        getValue: () => {
          if (!aInstance.donnees) {
            return MoteurRDV_1.MoteurRDV.C_DefaultDureeRDV;
          }
          let lRdv = aInstance.donnees.rdv;
          return this.moteurRDV.getDureeRdvEnMinutes(lRdv);
        },
        setValue: (aValue) => {
          let lRdv = aInstance.donnees.rdv;
          lRdv.session.duree = UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
            Math.max(
              MoteurRDV_1.MoteurRDV.C_MinDureeRDV,
              Math.min(
                MoteurRDV_1.MoteurRDV.C_MaxDureeRDV,
                parseInt(aValue, 10),
              ),
            ),
          );
        },
        exitChange: function () {
          let lRdv = aInstance.donnees.rdv;
          if (
            lRdv.session.listeCreneauxProposes &&
            lRdv.session.listeCreneauxProposes.count() > 0 &&
            lRdv.session.duree !== lRdv.session.dureeCreneauxEnEdition
          ) {
            GApplication.getMessage()
              .afficher({
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.strConfirmSurModifDuree",
                ),
              })
              .then((aGenreBouton) => {
                if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
                  lRdv.session.listeCreneauxProposes =
                    new ObjetListeElements_1.ObjetListeElements();
                } else {
                  lRdv.session.duree = lRdv.session.dureeCreneauxEnEdition;
                }
              });
          }
        },
        getDisabled() {
          let lRdv = aInstance.donnees.rdv;
          return (
            (lRdv.estRdvSessionSerie && aInstance._estModeEdition()) ||
            (aInstance.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose &&
              !aInstance._estCreneauEditable()) ||
            (aInstance.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV &&
              aInstance._estModeEdition()) ||
            (aInstance.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
              lRdv.etat !== TypesRDV_1.TypeEtatRDV.terdv_RDVDemande)
          );
        },
      },
      btnPJ: {
        getOptionsSelecFile: (aPourSession) => {
          return {
            genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
            genreRessourcePJ:
              Enumere_Ressource_1.EGenreRessource.DocJointPriseDeRDV,
            maxFiles: 0,
            maxSize: GApplication.droits.get(
              ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
            ),
          };
        },
        addFiles: (aPourSession, aParamsAddFiles) => {
          let lRdv = aPourSession
            ? aInstance.donnees.rdv.session
            : aInstance.donnees.rdv;
          if (lRdv.listePJ === null || lRdv.listePJ === undefined) {
            lRdv.listePJ = new ObjetListeElements_1.ObjetListeElements();
          }
          let lFichier = aParamsAddFiles.eltFichier;
          if (lFichier) {
            lRdv.listePJ.addElement(lFichier);
            lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            this.listePJs.addElement(lFichier);
          }
        },
        getLibelle() {
          return ObjetTraduction_1.GTraductions.getValeur("RDV.ajouterPJ");
        },
        getIcone() {
          return IE.jsx.str("i", {
            class: "icon_piece_jointe",
            "aria-hidden": "true",
          });
        },
        getDisabled: () => {
          return false;
        },
      },
      avecListePJ: (aPourSession) => {
        let lRdv = aPourSession
          ? aInstance.donnees.rdv.session
          : aInstance.donnees.rdv;
        return lRdv.listePJ && lRdv.listePJ.count() > 0;
      },
      getHtmlPJ: (aPourSession) => {
        var _a;
        let lRdv = aPourSession
          ? aInstance.donnees.rdv.session
          : aInstance.donnees.rdv;
        if (
          ((_a = lRdv === null || lRdv === void 0 ? void 0 : lRdv.listePJ) ===
            null || _a === void 0
            ? void 0
            : _a.getNbrElementsExistes()) > 0
        ) {
          return IE.jsx.str(
            "div",
            { class: ["section"] },
            UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(lRdv.listePJ, {
              IEModelChips: "chipsPJ",
              argsIEModelChips: [aPourSession],
              maxWidth: MoteurRDV_1.MoteurRDV.C_WidthMaxChipsPJ,
            }),
          );
        } else {
          return "";
        }
      },
      chipsPJ: {
        eventBtn: (aIndice, aPourSession) => {
          let lRdv = aPourSession
            ? aInstance.donnees.rdv.session
            : aInstance.donnees.rdv;
          if (lRdv === null || lRdv === void 0 ? void 0 : lRdv.listePJ) {
            const lPieceJointeASupp = lRdv.listePJ.get(aIndice);
            if (!!lPieceJointeASupp) {
              lPieceJointeASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
              lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            }
          }
        },
      },
    });
  }
  construireInstances() {}
  composeContenu() {
    if (this.donnees && this.donnees.rdv !== null) {
      if (this._estCtxEditParNonResp()) {
        return IE.jsx.str(
          "div",
          { class: "FenetreEditionRDV" },
          this.composeEditRDVCtxNonResp(),
        );
      } else {
        let lLegende = IE.jsx.str("div", { "ie-html": "getHtmlLegende" });
        switch (this.optionsRDV.natureRDV) {
          case TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose:
            return IE.jsx.str(
              "div",
              { class: "FenetreEditionRDV" },
              this.composeRDVFixeAvecEleve(),
              lLegende,
            );
          case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic:
            return IE.jsx.str(
              "div",
              { class: "FenetreEditionRDV" },
              !this.estCtxRespRdv
                ? this.composeDemandeRDV()
                : this.donnees.rdv.etat ===
                    TypesRDV_1.TypeEtatRDV.terdv_RDVDemande
                  ? this.composeAccepterDemandeRDV()
                  : this.donnees.rdv.etat ===
                        TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours ||
                      this.donnees.rdv.etat ===
                        TypesRDV_1.TypeEtatRDV.terdv_RDVValide
                    ? this.composeEditPropositionRdvIssueDeDemande()
                    : "",
              lLegende,
            );
          case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
            return IE.jsx.str(
              "div",
              { class: "FenetreEditionRDV" },
              this.composePropositionRDV(),
              lLegende,
            );
          case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie:
            return IE.jsx.str(
              "div",
              { class: "FenetreEditionRDV" },
              this.donnees.rdv.estRdvSessionSerie
                ? this.composeRDVEnSerie()
                : this.composeRDVDeSerie(),
              lLegende,
            );
          case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
            return IE.jsx.str(
              "div",
              { class: "FenetreEditionRDV" },
              this.donnees.rdv.estRdvSessionSerie
                ? this.composeRDVEnSerieImpose()
                : this.composeRDVDeSerie(),
              lLegende,
            );
        }
      }
    }
    return "";
  }
  _composeLegende() {
    let lAvecLegObl = false;
    let lAvecLegTel = false;
    let lAvecLegOcc = false;
    let lEstSansLegCreneaux = false;
    switch (this.optionsRDV.natureRDV) {
      case TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose:
        lAvecLegObl = true;
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
        lEstSansLegCreneaux = this.moteurRDV.existeCreneauPourRdv(
          this.donnees.rdv,
        );
        lAvecLegObl = true;
        lAvecLegTel = !lEstSansLegCreneaux;
        lAvecLegOcc = !lEstSansLegCreneaux;
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie:
        lEstSansLegCreneaux = this._estCasSerieSansAffPropositionCreneaux();
        lAvecLegObl = true;
        lAvecLegTel = !lEstSansLegCreneaux;
        lAvecLegOcc = !lEstSansLegCreneaux;
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
        lEstSansLegCreneaux = this._estCasSerieSansAffPropositionCreneaux();
        lAvecLegObl = true;
        lAvecLegTel = !lEstSansLegCreneaux;
        lAvecLegOcc = !lEstSansLegCreneaux;
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic:
        lEstSansLegCreneaux = this.moteurRDV.existeCreneauPourRdv(
          this.donnees.rdv,
        );
        lAvecLegObl =
          !this.estCtxRespRdv ||
          this.donnees.rdv.etat ===
            TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours ||
          this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide;
        lAvecLegTel =
          (this.estCtxRespRdv ||
            this.donnees.rdv.etat ===
              TypesRDV_1.TypeEtatRDV.terdv_PropositionEnCours ||
            this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide) &&
          !lEstSansLegCreneaux;
        lAvecLegOcc = this.estCtxRespRdv && !lEstSansLegCreneaux;
        break;
    }
    if (lAvecLegTel) {
      lAvecLegTel = this.moteurRDV.existeCreneauTelephonique(
        this.donnees.rdv.session.listeCreneauxProposes,
      );
    }
    if (lAvecLegOcc) {
      lAvecLegOcc = this.moteurRDV.existeCreneauOccupeOuPasse(
        this.donnees.rdv.session.listeCreneauxProposes,
      );
    }
    return this.moteurRDV.composeLegendeRdv({
      avecCreneauxOccupes: lAvecLegOcc,
      avecCreneauTel: lAvecLegTel,
      avecChampsObl: lAvecLegObl,
    });
  }
  _estCasSerieSansAffPropositionCreneaux() {
    if (
      this.optionsRDV.natureRDV !== TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie &&
      this.optionsRDV.natureRDV !==
        TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes
    ) {
      return false;
    }
    let lCasSessionSerieSansAffCreneaux =
      this.donnees.rdv.estRdvSessionSerie &&
      this._estModeEdition() &&
      this._tousRdvDeLaSerieOntUnCreneau();
    let lCasRdvSerieAvecCreneau =
      this.donnees.rdv.estRdvDeSerie &&
      this.moteurRDV.existeCreneauPourRdv(this.donnees.rdv);
    return lCasSessionSerieSansAffCreneaux || lCasRdvSerieAvecCreneau;
  }
  _estCreneauEditable() {
    let lRdv = this.donnees.rdv;
    return (
      lRdv.etat !== TypesRDV_1.TypeEtatRDV.terdv_RDVValide ||
      !this._estModeEdition()
    );
  }
  _estModeEdition() {
    return this.optionsRDV.modeEdition === "edit";
  }
  _composeContenuDeRDV(aParam) {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up no-line" },
        IE.jsx.str(
          "label",
          {
            for: this.ids.inputObjet,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("RDV.MotifRdv"),
        ),
        IE.jsx.str("input", {
          type: "text",
          "ie-model": "inputSujet",
          id: this.ids.inputObjet,
          maxlength: MoteurRDV_1.MoteurRDV.C_TailleSujetRdv,
          placeholder: ObjetTraduction_1.GTraductions.getValeur(
            "RDV.placeHolderSujet",
          ),
          class: "round-style full-width",
          required: true,
        }),
      ),
    );
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up contenuRDV no-line" },
        IE.jsx.str(
          "label",
          {
            for: this.ids.inputDescription,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("RDV.Contenu"),
        ),
        IE.jsx.str("ie-textareamax", {
          required: true,
          "ie-model": "description",
          id: this.ids.inputDescription,
          "ie-compteurmax": MoteurRDV_1.MoteurRDV.C_TailleDescriptionRdv,
          maxlength: MoteurRDV_1.MoteurRDV.C_TailleDescriptionRdv,
          placeholder: ObjetTraduction_1.GTraductions.getValeur(
            "RDV.placeHolderContenu",
          ),
          class: "full-size",
        }),
      ),
    );
    if (aParam.avecPJ) {
      H.push(this._composePJ(false));
    }
    return H.join("");
  }
  _composePJ(aPourSession) {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up p-bottom-l" },
        IE.jsx.str("ie-btnselecteur", {
          class: "pj",
          "ie-selecfile": true,
          "ie-model": (0, jsx_1.jsxFuncAttr)("btnPJ", aPourSession),
          title: ObjetTraduction_1.GTraductions.getValeur("RDV.ajouterPJ"),
          role: "button",
        }),
        IE.jsx.str("div", {
          class: ["pj-liste-conteneur"],
          "ie-if": (0, jsx_1.jsxFuncAttr)("avecListePJ", aPourSession),
          "ie-html": (0, jsx_1.jsxFuncAttr)("getHtmlPJ", aPourSession),
        }),
      ),
    );
    return H.join("");
  }
  _composePropositionCreneaux() {
    if (
      this.donnees.rdv.session.listeCreneauxProposes === null ||
      this.donnees.rdv.session.listeCreneauxProposes === undefined
    ) {
      this.donnees.rdv.session.listeCreneauxProposes =
        new ObjetListeElements_1.ObjetListeElements();
    }
    let lAvecDecompteCreneauxSurParticipants =
      this.moteurRDV.estUnRdvEnSerie(this.donnees.rdv) &&
      this.donnees.rdv.estRdvSessionSerie;
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str(
        "label",
        {
          id: this.ids.labelAjoutCreneau,
          class: "ie-titre-petit m-top-xl champ-requis",
        },
        ObjetTraduction_1.GTraductions.getValeur("RDV.propositionCreneaux"),
      ),
      IE.jsx.str(
        "div",
        { class: ["flex-contain", "flex-center", "flex-gap-xl", "flex-wrap"] },
        lAvecDecompteCreneauxSurParticipants
          ? IE.jsx.str("span", {
              "ie-html": "getHtmlnbCreneauxSurNbParticipants",
            })
          : "",
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": "ajoutCreneau",
          "aria-labelledby": this.ids.labelAjoutCreneau,
          "aria-required": "true",
          class: "pj",
          role: "button",
        }),
      ),
      IE.jsx.str("div", {
        "ie-html": "getHtmlCreneauxProposes",
        class: "creneauxProposes",
      }),
    );
  }
  _composeSelectionCreneau() {
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up p-y-l" },
      IE.jsx.str(
        "h2",
        { class: "ie-titre-couleur-petit m-bottom-l " },
        ObjetTraduction_1.GTraductions.getValeur("RDV.Creneau"),
      ),
      IE.jsx.str(
        "div",
        { class: "p-left-l" },
        this.moteurRDV.composeSelectionCreneau(
          this,
          this.donnees.rdv,
          this.donnees.rdv.creneau,
          this._estCreneauEditable(),
          this.listeModalites,
          this.listeSallesLieux,
          false,
        ),
      ),
    );
  }
  _composeDuree() {
    return IE.jsx.str(
      "div",
      { class: ["field-contain in-row"] },
      IE.jsx.str(
        "label",
        { for: this.ids.inputDuree, class: "ie-titre-petit champ-requis" },
        ObjetTraduction_1.GTraductions.getValeur("RDV.DureeRDV"),
      ),
      IE.jsx.str("input", {
        type: "number",
        "ie-selecttextfocus": true,
        id: this.ids.inputDuree,
        max: MoteurRDV_1.MoteurRDV.C_MaxDureeRDV.toString(),
        min: MoteurRDV_1.MoteurRDV.C_MinDureeRDV.toString(),
        "ie-model": "inputDuree",
        class: "round-style real-size",
        size: "3",
        required: true,
      }),
    );
  }
  composePropositionRDV() {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "label",
          {
            id: this.ids.labelResponsables,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("RDV.responsables"),
        ),
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": "publicCibleFamilleEleve",
          "aria-labelledby": this.ids.labelResponsables,
          "aria-required": "true",
        }),
      ),
    );
    let lRdv = this.donnees.rdv;
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str("ie-checkbox", {
          "ie-model": "cbPresenceEleve",
          "ie-html": "getHtmlDemanderPresenceEleveConcerne",
        }),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: true }));
    H.push(this._composeDuree());
    H.push(
      lRdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
        ? this._composeSelectionCreneau()
        : this._composePropositionCreneaux(),
    );
    return H.join("");
  }
  composeRDVDeSerie() {
    const H = [];
    H.push(
      this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
        ? this._composePJ(false)
        : "",
    );
    H.push(
      this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
        ? this._composeSelectionCreneau()
        : "",
    );
    return H.join("");
  }
  composeRDVEnSerieImpose() {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "label",
          {
            id: this.ids.labelPublicCibleEleve,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("Eleves"),
          IE.jsx.str("ie-btnicon", {
            "ie-model": "btnVoirDetailPublic",
            class: "icon_eye_open bt-activable bt-small m-left",
          }),
        ),
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": "publicCibleListeEleves",
          "aria-labelledby": this.ids.labelPublicCibleEleve,
          "aria-required": "true",
        }),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: false }));
    H.push(this._composePJ(true));
    H.push(this._composeDuree());
    let lAvecEditionCreneaux =
      !this._estModeEdition() || !this._tousRdvDeLaSerieOntUnCreneau();
    if (lAvecEditionCreneaux) {
      H.push(this._composePropositionCreneaux());
    }
    return H.join("");
  }
  _tousRdvDeLaSerieOntUnCreneau() {
    let lRDV = this.donnees.rdv;
    return this._estModeEdition()
      ? this.moteurRDV.tousRdvDeLaSerieOntUnCreneau(lRDV)
      : false;
  }
  composeRDVEnSerie() {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "label",
          {
            id: this.ids.labelResponsables,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("RDV.responsables"),
          IE.jsx.str("ie-btnicon", {
            "ie-model": "btnVoirDetailPublic",
            class: "icon_eye_open bt-activable bt-small m-left",
          }),
        ),
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": "publicCibleListeFamillesEleves",
          "aria-labelledby": this.ids.labelResponsables,
          "aria-required": "true",
        }),
      ),
    );
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "ie-checkbox",
          { "ie-model": "cbPresenceEleve" },
          ObjetTraduction_1.GTraductions.getValeur("RDV.demanderPresenceEleve"),
        ),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: false }));
    H.push(this._composePJ(true));
    H.push(this._composeDuree());
    let lAvecEditionCreneaux =
      !this._estModeEdition() || !this._tousRdvDeLaSerieOntUnCreneau();
    if (lAvecEditionCreneaux) {
      H.push(this._composePropositionCreneaux());
    }
    return H.join("");
  }
  composeAccepterDemandeRDV() {
    let lRdv = this.donnees.rdv;
    if (!lRdv) {
      return "";
    }
    let lStrEleveConcerne = this.moteurRDV.getStrEleveConcerneRdv(lRdv);
    const H = [];
    H.push(this._composeSectionInitiateurDemande(lRdv));
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "ie-checkbox",
          { "ie-model": "cbPresenceEleve" },
          ObjetTraduction_1.GTraductions.getValeur(
            "RDV.demanderPresenceStrEleve",
            [lStrEleveConcerne],
          ),
        ),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: true }));
    H.push(this._composeDuree());
    H.push(this._composePropositionCreneaux());
    return H.join("");
  }
  composeEditPropositionRdvIssueDeDemande() {
    let lRdv = this.donnees.rdv;
    if (!lRdv) {
      return "";
    }
    let lStrEleveConcerne = this.moteurRDV.getStrEleveConcerneRdv(lRdv);
    const H = [];
    H.push(this._composeSectionInitiateurDemande(lRdv));
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "ie-checkbox",
          { "ie-model": "cbPresenceEleve" },
          ObjetTraduction_1.GTraductions.getValeur(
            "RDV.demanderPresenceStrEleve",
            [lStrEleveConcerne],
          ),
        ),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: true }));
    H.push(this._composeDuree());
    H.push(
      this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
        ? this._composeSelectionCreneau()
        : this._composePropositionCreneaux(),
    );
    return H.join("");
  }
  _composeSectionInitiateurDemande(aRdv) {
    let lStrEleveConcerne = this.moteurRDV.getStrEleveConcerneRdv(aRdv);
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str(
        "label",
        { class: "ie-titre-petit m-top-xl" },
        ObjetTraduction_1.GTraductions.getValeur("RDV.responsables"),
      ),
      IE.jsx.str(
        "div",
        null,
        this.moteurRDV.getStrInterlocuteurRdv(aRdv, false) +
          " - " +
          ObjetTraduction_1.GTraductions.getValeur("RDV.concernantX", [
            lStrEleveConcerne,
          ]),
      ),
    );
  }
  _composeSectionEleveConcerne(aStrEleveConcerne) {
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str(
        "label",
        { class: "ie-titre-petit m-top-xl" },
        ObjetTraduction_1.GTraductions.getValeur("Eleve"),
      ),
      IE.jsx.str("div", null, aStrEleveConcerne),
    );
  }
  composeEditRDVCtxNonResp() {
    const H = [];
    H.push(
      this.moteurRDV.composeSectionTelephone(
        this.controleur,
        this.donnees.rdv,
        false,
        "",
        ["field-contain", "label-up"],
        ["ie-titre-petit", "m-top-xl"],
      ),
    );
    return H.join("");
  }
  composeDemandeRDV() {
    let lStrEleveConcerne = GEtatUtilisateur.getMembre().getLibelle();
    const H = [];
    H.push(this._composeSectionEleveConcerne(lStrEleveConcerne));
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "ie-checkbox",
          { "ie-model": "cbPresenceEleve" },
          ObjetTraduction_1.GTraductions.getValeur(
            "RDV.demanderPresenceStrEleve",
            [lStrEleveConcerne],
          ),
        ),
      ),
    );
    let lStrRespRdv = "";
    let lStrModelRespRdv = (0, jsx_1.jsxFuncAttr)(
      "respRDV",
      this.donnees.genreRessourceRespRdv,
    );
    switch (this.donnees.genreRessourceRespRdv) {
      case Enumere_Ressource_1.EGenreRessource.Enseignant:
        lStrRespRdv = ObjetTraduction_1.GTraductions.getValeur("Professeur");
        break;
      case Enumere_Ressource_1.EGenreRessource.Personnel:
        lStrRespRdv = ObjetTraduction_1.GTraductions.getValeur("Personnel");
        break;
      default:
        break;
    }
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "label",
          {
            id: this.ids.labelRespRdv,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          lStrRespRdv,
        ),
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": lStrModelRespRdv,
          "aria-labelledby": this.ids.labelRespRdv,
          "aria-required": "true",
        }),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: false }));
    return H.join("");
  }
  composeRDVFixeAvecEleve() {
    const H = [];
    H.push(
      IE.jsx.str(
        "div",
        { class: "field-contain label-up" },
        IE.jsx.str(
          "label",
          {
            id: this.ids.labelPublicCibleEleve,
            class: "ie-titre-petit m-top-xl champ-requis",
          },
          ObjetTraduction_1.GTraductions.getValeur("Eleve"),
        ),
        IE.jsx.str("ie-btnselecteur", {
          "ie-model": "publicCibleEleve",
          "aria-labelledby": this.ids.labelPublicCibleEleve,
          "aria-required": "true",
        }),
      ),
    );
    H.push(this._composeContenuDeRDV({ avecPJ: true }));
    H.push(
      IE.jsx.str(
        "div",
        { class: ["field-contain", "in-row"] },
        IE.jsx.str(
          "label",
          { for: this.ids.inputDuree, class: "ie-titre-petit champ-requis" },
          ObjetTraduction_1.GTraductions.getValeur("RDV.DureeRDV"),
        ),
        IE.jsx.str("input", {
          type: "number",
          "ie-selecttextfocus": true,
          id: this.ids.inputDuree,
          max: MoteurRDV_1.MoteurRDV.C_MaxDureeRDV.toString(),
          min: MoteurRDV_1.MoteurRDV.C_MinDureeRDV.toString(),
          "ie-model": "inputDuree",
          class: "round-style real-size",
          size: "3",
          required: true,
        }),
      ),
    );
    H.push(this._composeSelectionCreneau());
    {
    }
    return H.join("");
  }
  aucunCreneauExistant(aListeCreneaux) {
    return (
      aListeCreneaux
        .getListeElements((aCreneau) => {
          return aCreneau.existe();
        })
        .count() < 1
    );
  }
  async confirmAvantSaisie(aRdv) {
    let lNbCreneauxProposes = aRdv.session.listeCreneauxProposes.count();
    let lNbParticipants = aRdv.tabFamillesParticipantRDV.length;
    return GApplication.getMessage().afficher({
      type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
      message: ObjetTraduction_1.GTraductions.getValeur(
        "RDV.confirmMoinsDeCreneauxProposesQueDeParticipants",
        [lNbCreneauxProposes, lNbParticipants],
      ),
    });
  }
  async controlerSurValidation() {
    let lRdv = this.donnees.rdv;
    if (!lRdv.session) {
      return;
    }
    const lResult = { estOk: true, msgEchec: "" };
    switch (this.optionsRDV.natureRDV) {
      case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
      case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie:
        if (this.donnees.rdv.estRdvSessionSerie) {
          if (!this._estModeEdition()) {
            if (
              this.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie
            ) {
              if (
                !lRdv.tabFamillesParticipantRDV ||
                lRdv.tabFamillesParticipantRDV.length < 1
              ) {
                lResult.estOk = false;
                lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.participantsNonRenseignes",
                );
                return lResult;
              }
            } else {
              if (
                !lRdv.listeParticipantsSerie ||
                lRdv.listeParticipantsSerie.count() < 1
              ) {
                lResult.estOk = false;
                lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.participantsNonRenseignes",
                );
                return lResult;
              }
            }
          }
          if (lRdv.session.sujet === "" || lRdv.session.description === "") {
            lResult.estOk = false;
            lResult.msgEchec =
              lRdv.session.sujet === ""
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.sujetObligatoire",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.descriptionOblig",
                  );
            return lResult;
          }
          if (!this._estModeEdition()) {
            if (!lRdv.session.duree) {
              lResult.estOk = false;
              lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
                "RDV.dureeObligatoire",
              );
              return lResult;
            }
          }
          if (
            !lRdv.session ||
            !lRdv.session.listeCreneauxProposes ||
            this.aucunCreneauExistant(lRdv.session.listeCreneauxProposes)
          ) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.auMoinsUnCreneauPropose",
            );
            return lResult;
          }
          if (!this._estModeEdition()) {
            if (
              this.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes
            ) {
              if (
                lRdv.session.listeCreneauxProposes.count() <
                lRdv.listeParticipantsSerie.count()
              ) {
                lResult.estOk = false;
                lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.autantDeCreneauxProposesQueDeParticipants",
                );
                return lResult;
              }
            } else if (
              this.optionsRDV.natureRDV ===
              TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie
            ) {
              let lNbCreneauxProposes =
                lRdv.session.listeCreneauxProposes.count();
              let lNbParticipants = lRdv.tabFamillesParticipantRDV.length;
              if (lNbCreneauxProposes < lNbParticipants) {
                const lGenreAction = await this.confirmAvantSaisie(lRdv);
                if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
                  return lResult;
                } else {
                  lResult.estOk = false;
                }
              } else {
                return lResult;
              }
            }
          }
        }
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose:
        if (
          !lRdv.listeParticipantRDV ||
          lRdv.listeParticipantRDV.count() !== 1
        ) {
          lResult.estOk = false;
          lResult.msgEchec =
            lRdv.listeParticipantRDV.count() === 0
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.eleveObligatoire")
              : ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.unSeulElevePourRDV",
                );
          return lResult;
        }
        if (lRdv.session.sujet === "" || lRdv.session.description === "") {
          lResult.estOk = false;
          lResult.msgEchec =
            lRdv.session.sujet === ""
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.sujetObligatoire")
              : ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.descriptionOblig",
                );
          return lResult;
        }
        if (!lRdv.session.duree) {
          lResult.estOk = false;
          lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
            "RDV.dureeObligatoire",
          );
          return lResult;
        }
        if (!lRdv.creneau || !lRdv.creneau.debut) {
          lResult.estOk = false;
          lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
            "RDV.creneauObligatoire",
          );
          return lResult;
        }
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic:
        if (this.estCtxRespRdv) {
          if (lRdv.etat !== TypesRDV_1.TypeEtatRDV.terdv_RDVValide) {
            if (
              !lRdv.session ||
              !lRdv.session.listeCreneauxProposes ||
              this.aucunCreneauExistant(lRdv.session.listeCreneauxProposes)
            ) {
              lResult.estOk = false;
              lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
                "RDV.auMoinsUnCreneauPropose",
              );
              return lResult;
            }
          }
        } else {
          if (!lRdv.session || !lRdv.session.responsableRDV) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.respRdvObligatoire",
            );
            return lResult;
          }
        }
        if (lRdv.session.sujet === "" || lRdv.session.description === "") {
          lResult.estOk = false;
          lResult.msgEchec =
            lRdv.session.sujet === ""
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.sujetObligatoire")
              : ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.descriptionOblig",
                );
          return lResult;
        }
        break;
      case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
        if (lRdv.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
          if (
            !lRdv.listeParticipantRDV ||
            lRdv.listeParticipantRDV.count() === 0
          ) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.choisirParticipant",
            );
            return lResult;
          }
          if (lRdv.eleveConcerne === null || lRdv.eleveConcerne === undefined) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.eleveObligatoire",
            );
            return lResult;
          }
          if (!lRdv.session.duree) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.dureeObligatoire",
            );
            return lResult;
          }
        }
        if (lRdv.session.sujet === "" || lRdv.session.description === "") {
          lResult.estOk = false;
          lResult.msgEchec =
            lRdv.session.sujet === ""
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.sujetObligatoire")
              : ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.descriptionOblig",
                );
          return lResult;
        }
        if (lRdv.etat !== TypesRDV_1.TypeEtatRDV.terdv_RDVValide) {
          if (
            !lRdv.session ||
            !lRdv.session.listeCreneauxProposes ||
            this.aucunCreneauExistant(lRdv.session.listeCreneauxProposes)
          ) {
            lResult.estOk = false;
            lResult.msgEchec = ObjetTraduction_1.GTraductions.getValeur(
              "RDV.auMoinsUnCreneauPropose",
            );
            return lResult;
          }
        }
        break;
    }
    return lResult;
  }
  getParametresValidation(aNumeroBouton) {
    let lParametres = super.getParametresValidation(aNumeroBouton);
    return $.extend(lParametres, {
      rdv: this.donnees.rdv,
      listePJs: this.listePJs,
    });
  }
  async surValidation(aNumeroBouton) {
    let lRdv = this.donnees.rdv;
    if (aNumeroBouton !== 1) {
      if (lRdv.estRdvSessionSerie && this._estModeEdition()) {
        lRdv.session.avecPresenceEleve = this.rdvInit.session.avecPresenceEleve;
        lRdv.session.sujet = this.rdvInit.session.sujet;
        lRdv.session.description = this.rdvInit.session.description;
        lRdv.session.listePJ = this.rdvInit.session.listePJ;
        lRdv.session.listeCreneauxProposes =
          this.rdvInit.session.listeCreneauxProposes;
      } else if (lRdv.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
        if (this.moteurRDV.estDemande(lRdv)) {
          lRdv.session.duree = this.rdvInit.session.duree;
          lRdv.session.listeCreneauxProposes =
            this.rdvInit.session.listeCreneauxProposes;
          lRdv.session.avecPresenceEleve =
            this.rdvInit.session.avecPresenceEleve;
          lRdv.session.listePJ = this.rdvInit.session.listePJ;
          lRdv.listePJ = this.rdvInit.listePJ;
        } else if (this.moteurRDV.estRdvValide(lRdv)) {
          lRdv.session.sujet = this.rdvInit.session.sujet;
          lRdv.session.description = this.rdvInit.session.description;
          lRdv.session.listePJ = this.rdvInit.session.listePJ;
          lRdv.session.avecPresenceEleve =
            this.rdvInit.session.avecPresenceEleve;
          lRdv.listePJ = this.rdvInit.listePJ;
          lRdv.creneau.lieu = this.rdvInit.creneau.lieu;
        } else if (this.moteurRDV.estProposition(lRdv)) {
          lRdv.session.avecPresenceEleve =
            this.rdvInit.session.avecPresenceEleve;
          lRdv.session.sujet = this.rdvInit.session.sujet;
          lRdv.session.description = this.rdvInit.session.description;
          lRdv.session.listeCreneauxProposes =
            this.rdvInit.session.listeCreneauxProposes;
          lRdv.session.listePJ = this.rdvInit.session.listePJ;
          lRdv.listePJ = this.rdvInit.listePJ;
        }
      }
      this.fermer();
      return;
    }
    const lControle = await this.controlerSurValidation();
    if (lControle && lControle.estOk) {
      if (this.moteurRDV.avecVerifCreneaux(lRdv)) {
        let lParamVerif = this.moteurRDV.getParamVerifCreneaux(lRdv);
        let lEstCasRdvImpose = this.moteurRDV.estRdvImpose(lRdv);
        let lNbCreneauxAControler = lParamVerif.listeCreneaux.count();
        let lEstRdvImposeEleve =
          lRdv.session.natureRDV ===
          TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose;
        if (lNbCreneauxAControler > 0) {
          this.moteurRDV
            .requeteVerifCreneaux(lParamVerif)
            .then((aReponseRdv) => {
              let lReponse = aReponseRdv;
              if (lReponse && lReponse.listeCreneauxValides) {
                let lNbCreneauxValides = lReponse.listeCreneauxValides.count();
                if (lNbCreneauxValides < lNbCreneauxAControler) {
                  if (lNbCreneauxValides < 1) {
                    GApplication.getMessage()
                      .afficher({
                        type: Enumere_BoiteMessage_1.EGenreBoiteMessage
                          .Information,
                        message:
                          lNbCreneauxAControler === 1
                            ? ObjetTraduction_1.GTraductions.getValeur(
                                "RDV.msgCreneauOccupe",
                              )
                            : ObjetTraduction_1.GTraductions.getValeur(
                                "RDV.tousCreneauxProposesOccupes",
                              ),
                      })
                      .then(() => {
                        if (lEstRdvImposeEleve) {
                          return;
                        }
                        lParamVerif.listeCreneaux.parcourir((aCreneau) => {
                          aCreneau.setEtat(
                            Enumere_Etat_1.EGenreEtat.Suppression,
                          );
                        });
                      });
                  } else {
                    let lMsg = lEstCasRdvImpose
                      ? ObjetTraduction_1.GTraductions.getValeur(
                          "RDV.msgCreneauOccPartielARemplacer",
                          [lNbCreneauxAControler - lNbCreneauxValides],
                        )
                      : ObjetTraduction_1.GTraductions.getValeur(
                          "RDV.msgCertainsCreneauOccupes",
                        );
                    GApplication.getMessage()
                      .afficher({
                        type: Enumere_BoiteMessage_1.EGenreBoiteMessage
                          .Information,
                        message: lMsg,
                      })
                      .then(() => {
                        if (!lEstCasRdvImpose) {
                          super.surValidation(aNumeroBouton);
                        } else {
                          lParamVerif.listeCreneaux.parcourir((aCreneau) => {
                            let lTrouve = false;
                            lReponse.listeCreneauxValides.parcourir(
                              (aCreneauValide) => {
                                if (lTrouve) {
                                  return;
                                }
                                if (
                                  ObjetDate_1.GDate.estDateEgale(
                                    aCreneau.debut,
                                    aCreneauValide.debut,
                                  )
                                ) {
                                  lTrouve = true;
                                }
                              },
                            );
                            if (!lTrouve) {
                              aCreneau.setEtat(
                                Enumere_Etat_1.EGenreEtat.Suppression,
                              );
                            }
                          });
                        }
                      });
                  }
                } else {
                  super.surValidation(aNumeroBouton);
                }
              }
            });
        } else {
          super.surValidation(aNumeroBouton);
        }
      } else {
        super.surValidation(aNumeroBouton);
      }
    } else {
      if (lControle.msgEchec !== "") {
        GApplication.getMessage().afficher({
          type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
          message: lControle.msgEchec,
        });
      }
    }
  }
  setOptionsRDV(aOptions) {
    this.optionsRDV = $.extend({}, aOptions);
    this.setOptionsFenetre({ titre: this._getStrTitreFenetre() });
  }
  initFenetre() {
    this.setOptionsFenetre({
      titre: this._getStrTitreFenetre(),
      largeur: 700,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
          estValider: true,
        },
      ],
    });
  }
  _estCtxEditParNonResp() {
    return (
      !this.estCtxRespRdv &&
      this.donnees &&
      this.donnees.rdv &&
      this.donnees.rdv.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide
    );
  }
  _getHauteurFenetre() {
    if (this._estCtxEditParNonResp()) {
      return 200;
    } else {
      return 500;
    }
  }
  _getStrTitreFenetre() {
    if (!this.optionsRDV || !this.donnees || !this.donnees.rdv) {
      return "";
    }
    if (this.estCtxRespRdv) {
      let lRdv = this.donnees.rdv;
      switch (this.optionsRDV.natureRDV) {
        case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerie:
          return this._estModeEdition()
            ? lRdv.estRdvSessionSerie
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdvSerie")
              : ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdv")
            : ObjetTraduction_1.GTraductions.getValeur("RDV.rdvSerieAvecResp");
        case TypesRDV_2.TypeNatureRDV.tNRDV_EnSerieCreneauxImposes:
          return this._estModeEdition()
            ? lRdv.estRdvSessionSerie
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdvSerie")
              : ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdv")
            : ObjetTraduction_1.GTraductions.getValeur(
                "RDV.rdvSerieAvecEleves",
              );
        case TypesRDV_2.TypeNatureRDV.tNRDV_CreneauImpose:
          return this._estModeEdition()
            ? ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdv")
            : ObjetTraduction_1.GTraductions.getValeur("RDV.fixerRDVEleve");
        case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic:
          return this.estCtxRespRdv
            ? this.moteurRDV.estProposition(lRdv)
              ? ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdv")
              : ObjetTraduction_1.GTraductions.getValeur(
                  "RDV.accepterDemandeRdv",
                )
            : ObjetTraduction_1.GTraductions.getValeur("RDV.demanderRDV");
        case TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativeRespRDV:
          return this._estModeEdition()
            ? ObjetTraduction_1.GTraductions.getValeur("RDV.modifierRdv")
            : ObjetTraduction_1.GTraductions.getValeur("RDV.proposerRDVParent");
        default:
          return "";
      }
    } else {
      if (this._estCtxEditParNonResp()) {
        return ObjetTraduction_1.GTraductions.getValeur(
          "RDV.modifierNumeroRdv",
        );
      } else if (
        this.optionsRDV.natureRDV ===
        TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic
      ) {
        return ObjetTraduction_1.GTraductions.getValeur("RDV.demanderRDV");
      }
    }
  }
  setDonnees(aDonneesRDV) {
    this.donnees = aDonneesRDV;
    if (this.donnees.rdv === null) {
      this.donnees.rdv = this.moteurRDV.initRDV(this.optionsRDV.natureRDV);
      if (
        this.optionsRDV.natureRDV ===
          TypesRDV_2.TypeNatureRDV.tNRDV_UniqueInitiativePublic &&
        this.donnees.rdv.getEtat() === Enumere_Etat_1.EGenreEtat.Creation &&
        !this.estCtxRespRdv
      ) {
        this.donnees.rdv.telephone = this.donnees.telDemandeur;
        this.donnees.rdv.indTelephone = this.donnees.indTelDemandeur;
      }
    } else {
      this.rdvInit = this.moteurRDV.copierRdv(this.donnees.rdv);
    }
    this.listeSallesLieux = this.donnees.listeSallesLieux;
    this.setOptionsFenetre({
      titre: this._getStrTitreFenetre(),
      hauteur: this._getHauteurFenetre(),
    });
    this.afficher(this.composeContenu());
  }
  async ouvrirFenetreSelectionFamilleEleve(aMonoSelectionDeFamille, aCallback) {
    const lGenreRessource = Enumere_Ressource_1.EGenreRessource.Responsable;
    const lTitre = this.moteurDestinataires.getTitreSelectRessource({
      genreRessource: lGenreRessource,
    });
    const lDonnees = await this.moteurDestinataires.getDonneesPublic({
      genreRessource: lGenreRessource,
      avecInfoRencontresSepareesDesResponsables: true,
      avecInfoResponsablePreferentiel: true,
    });
    const lModaleSelect = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionPublic_PN_1.ObjetFenetre_SelectionPublic_PN,
      {
        pere: this,
        evenement: (
          aGenreRessource,
          aListeRessourcesSelect,
          aNumeroBouton,
          aListeRessourcesSelectionneesAvecInfoEleve,
        ) => {
          if (aNumeroBouton === 1) {
            aCallback(aListeRessourcesSelectionneesAvecInfoEleve);
          }
        },
      },
      { titre: lTitre },
    );
    const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
    lListeCumuls.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur(
          "destinataires.Cumul.NomDesEleves",
        ),
        0,
        ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.nomEleves,
      ),
    );
    lListeCumuls.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur(
          "destinataires.Cumul.ClasseNomDesEleves",
        ),
        0,
        ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.nomElevesClasse,
      ),
    );
    lListeCumuls.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur(
          "destinataires.Cumul.GroupeNomDesEleves",
        ),
        0,
        ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.nomElevesGroupe,
      ),
    );
    lModaleSelect.setListeCumuls(lListeCumuls);
    lModaleSelect.setGenreCumulActif(
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
        .nomElevesClasse,
    );
    lModaleSelect.setOptionsFenetreSelectionRessource({
      avecInformationEleveDansListeResponsable: true,
      avecMonoSelectionDeFamille: aMonoSelectionDeFamille,
      avecMonoSelectionSurResponsablesAvecRencontreSeparee:
        aMonoSelectionDeFamille,
      forcerDeploiementSurElementSelectionne: aMonoSelectionDeFamille,
      avecCocheRessources: false,
      getInfosSuppZonePrincipale(aParams) {
        return UtilitaireListePublics_1.UtilitaireListePublics.getLibelleSuppListePublics(
          aParams.article,
        );
      },
      getZoneMessage: (aParams) => {
        return aParams.article.avecRencontresSepareesDesResponsables
          ? ObjetTraduction_1.GTraductions.getValeur(
              "RDV.responsablesAVoirSeparement",
            )
          : "";
      },
    });
    let lListeRessourcesSelectionnees;
    if (aMonoSelectionDeFamille) {
      lListeRessourcesSelectionnees = MethodesObjet_1.MethodesObjet.dupliquer(
        this.donnees.rdv.listeParticipantRDV,
      ).parcourir((aResponsable) => {
        if (this.donnees.rdv.eleveConcerne) {
          aResponsable.eleveConcerne = this.donnees.rdv.eleveConcerne;
        }
      });
    } else {
      lListeRessourcesSelectionnees =
        new ObjetListeElements_1.ObjetListeElements();
      this.donnees.rdv.tabFamillesParticipantRDV.forEach((aFamille) => {
        if (aFamille.listeParticipantRDV) {
          lListeRessourcesSelectionnees.add(
            MethodesObjet_1.MethodesObjet.dupliquer(
              aFamille.listeParticipantRDV,
            ).parcourir((aResponsable) => {
              if (aFamille.eleveConcerne) {
                aResponsable.eleveConcerne = aFamille.eleveConcerne;
              }
            }),
          );
        }
      });
    }
    lModaleSelect.setDonnees({
      listeRessources: lDonnees.listePublic,
      listeRessourcesSelectionnees: lListeRessourcesSelectionnees,
      genreRessource: lGenreRessource,
      titre: lTitre,
      listeNiveauxResponsabilite: lDonnees.listeNiveauxResponsabilite,
      avecFiltresVisibles: false,
    });
  }
}
exports.FenetreEditionRDV = FenetreEditionRDV;
