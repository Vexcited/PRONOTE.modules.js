const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
  EGenreRessource,
  EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { tag } = require("tag.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve.js");
const { TTypePreparerRepas } = require("TTypePreparerRepas.js");
const { TypeIconeFeuilleDAppel } = require("TypeIconeFeuilleDAppel.js");
class DonneesListe_FeuilleDAppel_Mobile extends ObjetDonneesListeFlatDesign {
  constructor(aMoteur, aParams) {
    const lParams = Object.assign(
      { avecDeploiement: false, avecEllipsis: false },
      aParams,
    );
    const lDonnees = aMoteur.listeEleves.getListeElements((aElement) => {
      return aElement.existeNumero();
    });
    super(lDonnees);
    this.moteur = aMoteur;
    this.maxMinutes =
      this.moteur && this.moteur.Cours && this.moteur.Cours.duree
        ? GDate.nombrePlacesEnMillisecondes(this.moteur.Cours.duree) /
          (1000 * 60)
        : 120;
    this.enseignant = aParams.enseignant;
    this.avecInfoClasse = aParams.avecInfoClasse;
    this.callback = aParams.evenement;
    this.setOptions({
      avecDeploiement: lParams.avecDeploiement,
      avecTri: false,
      avecSelection: false,
      avecEvnt_Selection: false,
      avecEvnt_SelectionClick: lParams.avecEvnt_Selection,
      avecBoutonActionLigne: false,
      avecEllipsis: lParams.avecEllipsis,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      nodePhotoEleve: function () {
        $(this.node).on("error", function () {
          $(this).attr("src", "FichiersRessource/PortraitSilhouette.png");
        });
      },
      checkAbsence: {
        getValue: function (aNumero, aGenre) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
            lEleve,
            aGenre,
          );
          return !!lAbsence;
        },
        setValue: function (aNumero, aGenre, aValue, aObjet) {
          if (!!aObjet && !!aObjet.event) {
            aObjet.event.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
            lEleve,
            aGenre,
          );
          const lObjet = {
            numeroEleve: lEleve.getNumero(),
            placeDebut: aInstance.moteur.placeSaisieDebut,
            placeFin: aInstance.moteur.placeSaisieFin,
            typeAbsence: aGenre,
            typeObservation: null,
            typeSaisie: !!lAbsence
              ? EGenreEtat.Suppression
              : EGenreEtat.Creation,
            eleve: lEleve,
            absence: !!lAbsence ? lAbsence : undefined,
            genreAbsence: aGenre,
            avecSaisieDuree: aGenre === EGenreRessource.Retard,
            maxDuree: aInstance.maxMinutes,
          };
          if (aInstance.callback) {
            aInstance.callback(
              DonneesListe_FeuilleDAppel_Mobile.genreAction.saisieAbsence,
              lObjet,
            );
          }
        },
        getLibelle: function (aNumero, aGenre) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lColonne =
            aInstance.moteur.listeColonnes.getElementParGenre(aGenre);
          const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
            lEleve,
            aGenre,
          );
          const lLibelle = lColonne.getLibelle();
          return `${lLibelle}${aInstance.moteur.estUnSaisieVS(lAbsence) ? ' <i class="icon_vs"></i>' : ""}${!!lAbsence && aGenre === EGenreRessource.Retard ? ` ${lAbsence.Duree.toString()}'` : ""}`;
        },
        getDisabled: function (aNumero, aGenre) {
          return !aInstance.moteur.genreAbsenceDEleveEstEditable(
            aNumero,
            aGenre,
          );
        },
        node: function (aNumero, aGenre) {
          $(this.node).eventValidation((aEvent) => {
            if (aEvent) {
              aEvent.stopImmediatePropagation();
            }
          });
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lAbsence = aInstance.getAbsenceSurEnsemblePlaces(
            lEleve,
            aGenre,
          );
          const lClass =
            aGenre === EGenreRessource.Absence ? "avec-absence" : "avec-retard";
          const lVS = aInstance.moteur.estUnSaisieVS(lAbsence) ? "VS" : "";
          const lNode = $(this.node).parent();
          if (!!lAbsence) {
            lNode.addClass(lClass);
            if (!!lVS) {
              lNode.addClass(lVS);
            }
          } else {
            lNode.removeClass(lClass);
            lNode.removeClass("VS");
          }
        },
      },
      chipsAbsence: {
        event: function (aNumero, aGenre, aEvent) {
          if (aEvent) {
            aEvent.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lAbsence = aInstance.moteur.getAbsence(
            lEleve,
            aGenre,
            aInstance.moteur.placeSaisieDebut,
          );
          const lObjet = {
            numeroEleve: lEleve.getNumero(),
            placeDebut: aInstance.moteur.placeSaisieDebut,
            placeFin: aInstance.moteur.placeSaisieFin,
            typeAbsence: aGenre,
            typeObservation: null,
            typeSaisie: !!lAbsence
              ? EGenreEtat.Suppression
              : EGenreEtat.Creation,
            eleve: lEleve,
            absence: !!lAbsence ? lAbsence : undefined,
            genreAbsence: aGenre,
          };
          if (aInstance.callback) {
            aInstance.callback(
              DonneesListe_FeuilleDAppel_Mobile.genreAction.saisieAbsence,
              lObjet,
            );
          }
        },
        getLibelle: function (aNumero, aGenre) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lColonne =
            aInstance.moteur.listeColonnes.getElementParGenre(aGenre);
          const lAbsence = aInstance.moteur.getAbsence(
            lEleve,
            aGenre,
            aInstance.moteur.placeSaisieDebut,
          );
          return `${lColonne.getLibelle()}${aInstance.moteur.estUnSaisieVS(lAbsence) ? ' <i class="icon_vs"></i>' : ""}${!!lAbsence && aGenre === EGenreRessource.Retard ? `${lAbsence.Duree.toString()}'` : ""}`;
        },
        getDisabled: function (aNumero, aGenre) {
          return !aInstance.moteur.genreAbsenceDEleveEstEditable(
            aNumero,
            aGenre,
          );
        },
        node: function (aNumero, aGenre) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lAbsence = aInstance.moteur.getAbsence(
            lEleve,
            aGenre,
            aInstance.moteur.placeSaisieDebut,
          );
          const lClass =
            aGenre === EGenreRessource.Absence ? "avec-absence" : "avec-retard";
          const lVS = aInstance.moteur.estUnSaisieVS(lAbsence) ? "VS" : "";
          if (!!lAbsence) {
            $(this.node).addClass(lClass);
            if (!!lVS) {
              $(this.node).addClass(lVS);
            }
          } else {
            $(this.node).removeClass(lClass);
            $(this.node).removeClass("VS");
          }
        },
      },
      retard: {
        getValue: function (aNumero) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lRetard = aInstance.moteur.getAbsence(
            lEleve,
            EGenreRessource.Retard,
            aInstance.moteur.placeSaisieDebut,
          );
          if (!!lRetard && lRetard.strDuree === undefined) {
            lRetard.strDuree = lRetard.Duree.toString();
          }
          return !!lRetard ? lRetard.strDuree : "";
        },
        setValue: function (aNumero, aValue, aObjet) {
          if (!!aObjet && !!aObjet.event) {
            aObjet.event.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lRetard = aInstance.moteur.getAbsence(
            lEleve,
            EGenreRessource.Retard,
            aInstance.moteur.placeSaisieDebut,
          );
          lRetard.strDuree = aValue;
        },
        exitChange: function (aNumero, aValue) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lRetard = aInstance.moteur.getAbsence(
            lEleve,
            EGenreRessource.Retard,
            aInstance.moteur.placeSaisieDebut,
          );
          if (!!lRetard) {
            try {
              let lMinutes = parseInt(aValue);
              if (lMinutes < 1 || lMinutes > aInstance.maxMinutes) {
                GApplication.getMessage().afficher({
                  type: EGenreBoiteMessage.Information,
                  message: GTraductions.getValeur(
                    "FenetreDevoir.ValeurComprise",
                    [1, aInstance.maxMinutes],
                  ),
                  callback: function () {
                    if (lMinutes < 1) {
                      lMinutes = 1;
                    } else if (lMinutes > aInstance.maxMinutes) {
                      lMinutes = aInstance.maxMinutes;
                    }
                    aInstance.actualiserRetard(lRetard, lMinutes, lEleve);
                  },
                });
              } else if (lMinutes !== lRetard.Duree) {
                aInstance.actualiserRetard(lRetard, lMinutes, lEleve);
              }
            } catch (e) {
              lRetard.strDuree = lRetard.Duree
                ? lRetard.Duree.toString()
                : aInstance.moteur.dureeRetard.toString();
            }
          }
        },
        getDisabled: function (aNumero) {
          return !aInstance.moteur.genreAbsenceDEleveEstEditable(
            aNumero,
            EGenreRessource.Retard,
          );
        },
        visible: function (aNumero) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lRetard = aInstance.moteur.getAbsence(
            lEleve,
            EGenreRessource.Retard,
            aInstance.moteur.placeSaisieDebut,
          );
          return !!lRetard;
        },
      },
      btnAutres: {
        event: function (aNumero, aEvent) {
          if (aEvent) {
            aEvent.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          if (aInstance.callback && !!lEleve) {
            const lObjet = { eleve: lEleve, moteur: aInstance.moteur };
            aInstance.callback(
              DonneesListe_FeuilleDAppel_Mobile.genreAction.saisieAutres,
              lObjet,
            );
          }
        },
        getDisabled: function (aNumero) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          return (
            lEleve.estExclu ||
            lEleve.estSorti ||
            lEleve.sortiePeda ||
            aInstance.moteur.autorisations.jourConsultUniquement
          );
        },
        visible: function (aNumero) {
          let lNbrsContenu = aInstance.getNombreDAutresAbsences(aNumero);
          return (
            lNbrsContenu > 0 ||
            !aInstance.moteur.autorisations.jourConsultUniquement
          );
        },
      },
      btnAbsenceAutre: {
        event: function (
          aNumero,
          aGenre,
          aNumeroObservation,
          aGenreObservation,
          aEvent,
        ) {
          if (aEvent) {
            aEvent.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          if (aInstance.callback && !!lEleve) {
            const lObjet = {
              eleve: lEleve,
              moteur: aInstance.moteur,
              genre: aGenre,
              numeroObservation: aNumeroObservation,
              genreObservation: aGenreObservation,
            };
            aInstance.callback(
              DonneesListe_FeuilleDAppel_Mobile.genreAction.editionAutres,
              lObjet,
            );
          }
        },
        getDisabled: function (aNumero, aGenre) {
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          return (
            lEleve.estExclu ||
            lEleve.estSorti ||
            lEleve.sortiePeda ||
            aInstance.moteur.autorisations.jourConsultUniquement ||
            aGenre === EGenreRessource.RepasAPreparer
          );
        },
      },
      getHtmlAutres: function (aNumero) {
        return aInstance.construirePastillesAutresAbsences(aNumero);
      },
      getNodeIconEleve: function (aNumero) {
        $(this.node).eventValidation(function (aEvent) {
          if (aEvent) {
            aEvent.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          if (!!lEleve) {
            const lListeIcones =
              aInstance.moteur.getListeIconesElevePourFeuilleDAppel(lEleve);
            const lHtml = tag(
              "ul",
              { class: ["fa_zone_details_icones"] },
              (aContenu) => {
                lListeIcones.parcourir((aElement) => {
                  if (aElement.actif) {
                    let lLibelle = aElement.getLibelle();
                    if (
                      aElement.getGenre() ===
                      TypeIconeFeuilleDAppel.absentCoursPrecedentDuProf
                    ) {
                      lLibelle = lEleve.hintAbsentAuDernierCours;
                    }
                    aContenu.push(
                      tag(
                        "li",
                        { class: ["fa_ligne_info_ico"] },
                        tag(
                          "div",
                          { class: ["fa_info_icone"] },
                          tag("i", {
                            class: aElement.class,
                            "aria-hidden": "true",
                          }),
                        ),
                        tag(
                          "span",
                          { class: ["fa_info_libelle"] },
                          GChaine.replaceRCToHTML(lLibelle),
                        ),
                      ),
                    );
                  }
                });
              },
            );
            const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
              pere: this,
              initialiser: function (aInstance) {
                aInstance.setOptionsFenetre({
                  titre: `<i class="icon_legende fa_titre_legende_icones" aria-hidden="true"></i>${GTraductions.getValeur("Legende")}`,
                  listeBoutons: [GTraductions.getValeur("Fermer")],
                  avecScroll: true,
                });
              },
            });
            lFenetre.afficher(lHtml);
          }
        });
      },
      getNodeLibelleEleve: function (aNumero) {
        $(this.node).eventValidation(function (aEvent) {
          if (aEvent) {
            aEvent.stopImmediatePropagation();
          }
          const lEleve =
            aInstance.moteur.listeEleves.getElementParNumero(aNumero);
          const lTitleEleve = [];
          let lLibelleEleve =
            lEleve.Libelle +
            (lEleve.complementInfo ? " " + lEleve.complementInfo : "");
          if (lEleve.absentAuDernierCours) {
            lTitleEleve.push(lEleve.hintAbsentAuDernierCours);
          }
          if (!lEleve.estAttendu) {
            lTitleEleve.push(
              GChaine.format(
                GTraductions.getValeur("AbsenceVS.AutoriseSortirEtab"),
                [lLibelleEleve],
              ),
            );
          }
          if (lEleve.sortiePeda) {
            if (lTitleEleve.length === 0) {
              lTitleEleve.push(lLibelleEleve);
            }
            lTitleEleve.push(lEleve.hintSortiePeda);
          }
          if (lTitleEleve.length === 0 && lEleve.strStatut) {
            lTitleEleve.push(lEleve.strStatut);
          }
          if (!!lEleve) {
            ObjetFenetre_FicheEleve.ouvrir({
              instance: this,
              avecRequeteDonnees: true,
              donnees: {
                eleve: lEleve,
                listeEleves: aInstance.moteur.listeEleves,
              },
            });
          }
        });
      },
      getClassInfoSuppl: function (aNumero) {
        const lDemandeDispense = aInstance.moteur.getDemandeDeDispense(aNumero);
        const lDispense = aInstance.moteur.getDispense(aNumero, false);
        const lEstDemandeDispenseRefusee =
          lDemandeDispense &&
          lDemandeDispense.estRefusee &&
          lDemandeDispense.estTraitee;
        if (
          lEstDemandeDispenseRefusee &&
          lDemandeDispense.estRefuseeAnnulable &&
          !lDispense
        ) {
          return "fa_eleve_demande_dispense";
        }
        return "fa_eleve_dispense";
      },
      getHtmlInfoSuppl: function (aNumero) {
        const lDispense = aInstance.moteur.getDispense(aNumero, false);
        const lDemandeDispense = aInstance.moteur.getDemandeDeDispense(aNumero);
        const lHtml = [];
        const lLibelleDispense = GTraductions.getValeur(
          "Absence.DispenseCour",
        ).ucfirst();
        if (!!lDispense && lDispense.existe()) {
          lHtml.push(lLibelleDispense);
        } else if (lDemandeDispense) {
          const lEstDemandeDispenseRefusee =
            lDemandeDispense &&
            lDemandeDispense.estRefusee &&
            lDemandeDispense.estTraitee;
          if (lEstDemandeDispenseRefusee) {
            if (
              !lDemandeDispense.estRefuseeAnnulable &&
              lDemandeDispense.strNomPrenomRefusant
            ) {
              lHtml.push(
                GTraductions.getValeur(
                  "AbsenceVS.demandeDispense.demandeDispenseRefuseePar",
                  [lDemandeDispense.strNomPrenomRefusant],
                ),
              );
            } else {
              lHtml.push(
                GTraductions.getValeur(
                  "AbsenceVS.demandeDispense.dispenseRefusee",
                ),
              );
            }
          } else {
            lHtml.push(
              GTraductions.getValeur(
                "AbsenceVS.demandeDispense.demandeDeDispenseATraiter",
              ),
            );
          }
        }
        return lHtml.join("");
      },
    });
  }
  actualiserRetard(aRetard, aMinutes, aEleve) {
    aRetard.Duree = aMinutes;
    aRetard.strDuree = aRetard.Duree.toString();
    aRetard.setEtat(EGenreEtat.Modification);
    const lObjet = {
      numeroEleve: aEleve.getNumero(),
      placeDebut: this.moteur.placeSaisieDebut,
      placeFin: this.moteur.placeSaisieFin,
      typeAbsence: EGenreRessource.Retard,
      typeObservation: null,
      typeSaisie: EGenreEtat.Modification,
      eleve: aEleve,
      absence: aRetard,
      genreAbsence: EGenreRessource.Retard,
    };
    if (this.callback) {
      this.callback(
        DonneesListe_FeuilleDAppel_Mobile.genreAction.saisieAbsence,
        lObjet,
      );
    }
  }
  aLeDroitDeSupprimer(aNumero, aGenre) {
    const lEleve = this.moteur.listeEleves.getElementParNumero(aNumero);
    const lAbsence = this.moteur.getAbsence(
      lEleve,
      aGenre,
      this.moteur.placeSaisieDebut,
    );
    const lAvecSaisie =
      (aGenre === EGenreRessource.Absence
        ? this.moteur.autorisations.avecSaisieAbsence
        : this.moteur.autorisations.avecSaisieRetard) ||
      this.moteur.autorisations.suppressionAbsenceDeVS;
    return (
      !!lAbsence &&
      !this.moteur.estUnSaisieVS(lAbsence) &&
      lAvecSaisie &&
      !this.moteur.autorisations.jourConsultUniquement
    );
  }
  getNombreDAutresAbsences(aNumero) {
    let lNbrsContenu = 0;
    for (let i = 0; i < this.moteur.listeColonnes.count(); i++) {
      const lColonne = this.moteur.listeColonnes.get(i);
      if (
        ![
          EGenreRessource.RepasAPreparer,
          EGenreRessource.Absence,
          EGenreRessource.Retard,
        ].includes(lColonne.getGenre()) &&
        this.moteur.aUneAbsence(
          aNumero,
          lColonne.getGenre(),
          lColonne.getNumero(),
          true,
        ) > -1
      ) {
        lNbrsContenu++;
      } else if (lColonne.getGenre() === EGenreRessource.RepasAPreparer) {
        const lAbsence = this.moteur.aUneAbsence(aNumero, lColonne.getGenre());
        const lElementAbsence =
          lAbsence > -1
            ? this.moteur.listeEleves
                .getElementParNumero(aNumero)
                .ListeAbsences.get(lAbsence)
            : false;
        if (lElementAbsence.type === TTypePreparerRepas.prOui) {
          lNbrsContenu++;
        }
      }
    }
    return lNbrsContenu;
  }
  getAbsenceSurEnsemblePlaces(aEleve, aGenreAbsence) {
    let lAbsence = this.moteur.getAbsence(
      aEleve,
      aGenreAbsence,
      this.moteur.placeSaisieDebut,
    );
    if (!lAbsence) {
      let lDeb = this.moteur.placeSaisieDebut;
      let lFin = this.moteur.placeSaisieFin;
      if (
        lDeb !== null &&
        lDeb !== undefined &&
        lFin !== null &&
        lFin !== undefined &&
        lFin > lDeb
      ) {
        for (let i = lDeb + 1; i < lFin + 1; i++) {
          if (!lAbsence) {
            lAbsence = this.moteur.getAbsence(aEleve, aGenreAbsence, i);
          }
        }
      }
    }
    return lAbsence;
  }
  composePastilleDeColonne(aColonne, aNumeroEleve) {
    const lIcon = EGenreRessourceUtil.getIconAbsence(aColonne.getGenre(), {
      genreObservation: aColonne.genreObservation,
    });
    const lClass = [lIcon, "avecFond"];
    if (aColonne.getGenre() === EGenreRessource.Dispense) {
      const lEleve = this.moteur.listeEleves.getElementParNumero(aNumeroEleve);
      const lAbsence = this.moteur.getAbsence(
        lEleve,
        aColonne.getGenre(),
        this.moteur.placeSaisieDebut,
      );
      if (
        !!lAbsence &&
        !!lAbsence.documents &&
        lAbsence.documents.count() > 0
      ) {
        lClass.push("iconside-icon_piece_jointe");
      }
    } else if (aColonne.getGenre() === EGenreRessource.RepasAPreparer) {
      const lEleve = this.moteur.listeEleves.getElementParNumero(aNumeroEleve);
      const lAbsence = this.moteur.getAbsence(lEleve, aColonne.getGenre());
      if (!!lAbsence && lAbsence.type === TTypePreparerRepas.prNon) {
        lClass.push("mix-icon_remove");
      }
    }
    return tag(
      "ie-btnicon",
      {
        "ie-model": tag.funcAttr("btnAbsenceAutre", [
          aNumeroEleve,
          aColonne.getGenre(),
          aColonne.getNumero(),
          aColonne.genreObservation,
        ]),
        "aria-label": aColonne.getLibelle(),
        class: lClass,
        onclick: "event.stopPropagation();",
      },
      "",
    );
  }
  construirePastillesAutresAbsences(aNumero) {
    const lHtml = [];
    let lNbrsContenu = 0;
    const lNombreMax = this.getNombreDAutresAbsences(aNumero);
    if (lNombreMax > 0) {
      const lListe = this.moteur.getListeColonnesTriees();
      for (let i = 0; i < lListe.count(); i++) {
        const lColonne = lListe.get(i);
        if (
          ![
            EGenreRessource.RepasAPreparer,
            EGenreRessource.Absence,
            EGenreRessource.Retard,
          ].includes(lColonne.getGenre()) &&
          this.moteur.aUneAbsence(
            aNumero,
            lColonne.getGenre(),
            lColonne.getNumero(),
            true,
          ) > -1
        ) {
          lNbrsContenu++;
          if (lNbrsContenu < 3 || lNombreMax === 3) {
            lHtml.push(this.composePastilleDeColonne(lColonne, aNumero));
          }
          if (lNbrsContenu >= 3) {
            break;
          }
        } else if (lColonne.getGenre() === EGenreRessource.RepasAPreparer) {
          const lAbsence = this.moteur.aUneAbsence(
            aNumero,
            lColonne.getGenre(),
          );
          const lElementAbsence =
            lAbsence > -1
              ? this.moteur.listeEleves
                  .getElementParNumero(aNumero)
                  .ListeAbsences.get(lAbsence)
              : false;
          if (lElementAbsence.type === TTypePreparerRepas.prOui) {
            lNbrsContenu++;
            if (lNbrsContenu < 3 || lNombreMax === 3) {
              lHtml.push(this.composePastilleDeColonne(lColonne, aNumero));
            }
            if (lNbrsContenu >= 3) {
              break;
            }
          }
        }
      }
      if (lNombreMax > 3) {
        lHtml.push(
          tag(
            "ie-btnicon",
            {
              "ie-model": tag.funcAttr("btnAutres", [aNumero]),
              "aria-label": GTraductions.getValeur("Absence.Autres"),
              class: "avecFond fa_btn_plus",
              onclick: "event.stopPropagation();",
            },
            "+" + (lNombreMax - 2),
          ),
        );
      }
    }
    return lHtml.join("");
  }
  desactiverIndentationParente() {
    return !this.options.avecDeploiement;
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article
      ? tag("div", { class: "fa_zone_eleve" }, (aContenu) => {
          const lClass = ["libelle"];
          if (aParams.article.estSorti) {
            lClass.push("Barre");
          }
          if (aParams.article.eleveAjouteAuCours) {
            lClass.push("Italique");
          }
          const lHtml = [];
          lHtml.push('<div class="fa_libelle_eleve">');
          lHtml.push(
            tag(
              "span",
              { class: lClass },
              `${aParams.article.getLibelle()}${this.avecInfoClasse ? ` (${aParams.article.strClasse})` : ""}`,
            ),
          );
          lHtml.push(
            tag("div", {
              "ie-class": tag.funcAttr("getClassInfoSuppl", [
                aParams.article.getNumero(),
              ]),
              "ie-texte": tag.funcAttr("getHtmlInfoSuppl", [
                aParams.article.getNumero(),
              ]),
            }),
          );
          if (aParams.article.estDetache) {
            lHtml.push(
              tag(
                "div",
                { class: ["fa_eleve_detache"] },
                GChaine.replaceRCToHTML(aParams.article.hintDetache, " "),
              ),
            );
          } else {
            if (aParams.article.complementInfo) {
              lHtml.push(
                tag(
                  "div",
                  { class: ["fa_eleve_exclu"] },
                  GChaine.replaceRCToHTML(aParams.article.complementInfo, " "),
                ),
              );
            } else {
              if (aParams.article.sortiePeda) {
                lHtml.push(
                  tag(
                    "div",
                    { class: ["fa_eleve_sortiePeda"] },
                    GChaine.replaceRCToHTML(
                      aParams.article.hintSortiePeda,
                      " ",
                    ),
                  ),
                );
              }
              if (!aParams.article.estAttendu) {
                lHtml.push(
                  tag(
                    "div",
                    { class: ["fa_eleve_strStatut"] },
                    GChaine.format(
                      GTraductions.getValeur("AbsenceVS.AutoriseSortirEtab"),
                      [aParams.article.getLibelle()],
                    ),
                  ),
                );
              } else if (aParams.article.strStatut) {
                lHtml.push(
                  tag(
                    "div",
                    { class: ["fa_eleve_strStatut"] },
                    GChaine.replaceRCToHTML(aParams.article.strStatut, " "),
                  ),
                );
              }
            }
          }
          lHtml.push("</div>");
          aContenu.push(
            `${this.composePhoto(aParams.article)} ${lHtml.join("")}`,
          );
        })
      : "";
  }
  estLigneOff(aParams) {
    return !!aParams.article && aParams.article.estDetache;
  }
  composePhoto(aEleve) {
    let lAvecPhoto =
      !!aEleve &&
      GApplication.droits.get(TypeDroits.eleves.consulterPhotosEleves);
    return tag("img", {
      src: lAvecPhoto ? false : "FichiersRessource/PortraitSilhouette.png",
      "ie-load-src": lAvecPhoto
        ? GChaine.creerUrlBruteLienExterne(aEleve, { libelle: "photo.jpg" })
        : false,
      "ie-node": tag.funcAttr("nodePhotoEleve", aEleve.getNumero()),
      class: `PetitEspaceGauche PetitEspaceDroit${aEleve.estDetache ? ` fa_voile` : ""}`,
      style: "width: 3rem;height: 3rem;",
    });
  }
  composeDetailsIconesEleve(aEleve) {
    const lListeIcones =
      this.moteur.getListeIconesElevePourFeuilleDAppel(aEleve);
    return tag(
      "div",
      {
        class: `fa_zone_icones moteurAbsences${aEleve.estDetache ? ` fa_voile` : ""}`,
        "ie-node": tag.funcAttr("getNodeIconEleve", [aEleve.getNumero()]),
      },
      (aContenu) => {
        lListeIcones.parcourir((aElement) => {
          if (aElement.actif) {
            aContenu.push(
              tag("i", {
                class: aElement.class,
                title: aElement.getLibelle(),
                "aria-label": aElement.getLibelle(),
              }),
            );
          }
        });
      },
    );
  }
  getZoneComplementaire(aParams) {
    return this.composeDetailsIconesEleve(aParams.article);
  }
  getZoneMessage(aParams) {
    if (!!aParams.article && aParams.article.estDetache) {
      return "";
    } else {
      return tag(
        "div",
        { class: "fa_zone_saisie" },
        tag(
          "div",
          { class: "fa_zone_absences", onclick: "event.stopPropagation();" },
          tag("ie-checkbox", {
            "ie-model": tag.funcAttr("checkAbsence", [
              aParams.article.getNumero(),
              EGenreRessource.Absence,
            ]),
            "ie-icon": "none",
            class: "as-chips fa-chb-absence",
          }),
          tag("ie-checkbox", {
            "ie-model": tag.funcAttr("checkAbsence", [
              aParams.article.getNumero(),
              EGenreRessource.Retard,
            ]),
            "ie-icon": "none",
            class: "as-chips fa-chb-absence",
          }),
          tag("ie-bouton", {
            "ie-icon": "icon_plus_fin",
            "ie-model": tag.funcAttr("btnAutres", [
              aParams.article.getNumero(),
            ]),
            "ie-display": tag.funcAttr("btnAutres.visible", [
              aParams.article.getNumero(),
            ]),
            class: "small-bt themeBoutonNeutre fa_btn_autres",
          }),
        ),
        tag("div", {
          class: "fa-zone-autres",
          "ie-html": tag.funcAttr("getHtmlAutres", [
            aParams.article.getNumero(),
          ]),
        }),
      );
    }
  }
  static getColonnes() {
    return [{ taille: "100%" }];
  }
}
DonneesListe_FeuilleDAppel_Mobile.genreAction = {
  saisieAbsence: 0,
  saisieAutres: 1,
  editionAutres: 2,
};
module.exports = { DonneesListe_FeuilleDAppel_Mobile };
