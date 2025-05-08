exports.WidgetVieScolaire = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetFenetre_DetailElementVS_1 = require("ObjetFenetre_DetailElementVS");
const ObjetVSListeDetails_1 = require("ObjetVSListeDetails");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
class WidgetVieScolaire extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    this.etatUtilisateurSco = GEtatUtilisateur;
    this.estEspaceParent = [
      Enumere_Espace_1.EGenreEspace.Parent,
      Enumere_Espace_1.EGenreEspace.PrimParent,
      Enumere_Espace_1.EGenreEspace.Mobile_Parent,
      Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
    ].includes(this.etatUtilisateurSco.GenreEspace);
  }
  creerObjets() {
    this.utilitaireAbsence =
      new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence();
  }
  initialiserObjets() {}
  getEtablissementConcerne() {
    return this.etatUtilisateurSco.getEtablissement();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnCommandesVieScolaire: {
        event() {
          aInstance.afficherMenuContextuelCommandesVS(this.node);
        },
      },
      surAbsence(aIndice) {
        $(this.node).eventValidation(() => {
          aInstance._surAbsence(aIndice);
        });
      },
    });
  }
  afficherMenuContextuelCommandesVS(aHtmlElementOuvertureMenuContextuel) {
    ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
      pere: this,
      id: aHtmlElementOuvertureMenuContextuel,
      initCommandes: (aInstance) => {
        var _a;
        if (this.utilitaireAbsence.avecCommandeContacterReferentsVS()) {
          aInstance.add(
            ObjetTraduction_1.GTraductions.getValeur(
              "AbsenceVS.ContacterLaVieScolaire",
            ),
            true,
            () => {
              UtilitaireContactReferents_1.UtilitaireContactReferents.contacterReferentsVieScolaire(
                this,
                this.etatUtilisateurSco.getEtablissement()
                  .listeReferentsVieScolaire,
              );
            },
            { icon: "icon_envoyer" },
          );
        }
        if (this.utilitaireAbsence.avecCommandeDeclarerUneAbsence()) {
          aInstance.add(
            ObjetTraduction_1.GTraductions.getValeur(
              "AbsenceVS.PrevenirAbsenceParent",
            ),
            true,
            () => {
              ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterAbsence({
                instanceAppel: this,
                callbackApresSaisieAbsences:
                  this.callbackApresSaisieEvt.bind(this),
              });
            },
            { icon: "icon_absences_prevue" },
          );
        }
        const lAvecAuMoinsUneMatiereDispensable =
          (_a =
            this.etatUtilisateurSco.getMembre()
              .listeMatieresDeclarationDispense) === null || _a === void 0
            ? void 0
            : _a.count();
        if (lAvecAuMoinsUneMatiereDispensable) {
          if (
            this.utilitaireAbsence.avecCommandeDeclarerUneDispensePonctuelle()
          ) {
            aInstance.add(
              ObjetTraduction_1.GTraductions.getValeur(
                "AbsenceVS.PrevenirDispensePonctuelle",
              ),
              true,
              () => {
                ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterDispense(
                  {
                    instanceAppel: this,
                    estDispenseLongue: false,
                    callbackApresSaisieDispense:
                      this.callbackApresSaisieEvt.bind(this),
                  },
                );
              },
              { icon: "icon_dispense" },
            );
          }
          if (this.utilitaireAbsence.avecCommandeDeclarerUneDispenseLongue()) {
            aInstance.add(
              ObjetTraduction_1.GTraductions.getValeur(
                "AbsenceVS.PrevenirDispenseLongue",
              ),
              true,
              () => {
                ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterDispense(
                  {
                    instanceAppel: this,
                    estDispenseLongue: true,
                    callbackApresSaisieDispense:
                      this.callbackApresSaisieEvt.bind(this),
                  },
                );
              },
              { icon: "icon_dispense mix-icon_time i-as-deco" },
            );
          }
        }
      },
    });
  }
  avecCommandeContacter() {
    return (
      this.donnees.avecContactReferentsVieScolaire &&
      this.utilitaireAbsence.avecCommandeContacterReferentsVS()
    );
  }
  avecBoutonCommandesVieScolaire() {
    if (this.etatUtilisateurSco.pourPrimaire()) {
      return false;
    }
    return (
      this.avecCommandeContacter() ||
      this.utilitaireAbsence.avecCommandeDeclarerUneAbsence() ||
      this.utilitaireAbsence.avecCommandeDeclarerUneDispensePonctuelle() ||
      this.utilitaireAbsence.avecCommandeDeclarerUneDispenseLongue()
    );
  }
  callbackApresSaisieEvt() {
    this.callback.appel(
      this.donnees.genre,
      Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
    );
  }
  composeWidget() {
    const H = [];
    if (this.avecBoutonCommandesVieScolaire()) {
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "div",
            { class: "AlignementDroit p-right-xl" },
            IE.jsx.str(
              "ie-bouton",
              { class: "small-bt", "ie-model": "btnCommandesVieScolaire" },
              ObjetTraduction_1.GTraductions.getValeur(
                "AbsenceVS.ContacterLaVieScolaire",
              ),
            ),
          ),
        ),
      );
    }
    if (this.donnees.listeAbsences.count() > 0) {
      this.donnees.listeAbsences.setTri([
        ObjetTri_1.ObjetTri.init(
          "dateDebut",
          Enumere_TriElement_1.EGenreTriElement.Decroissant,
        ),
      ]);
      this.donnees.listeAbsences.trier();
      H.push('<ul class="liste-clickable">');
      for (let I = 0; I < this.donnees.listeAbsences.count(); I++) {
        const lAbsence = this.donnees.listeAbsences.get(I);
        H.push(this.composeAbsence(lAbsence, I));
      }
      H.push("</ul>");
    } else {
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "div",
            { class: "no-events" },
            IE.jsx.str("p", null, this.donnees.message),
          ),
        ),
      );
    }
    return H.join("");
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.creerObjets();
    const lWidget = {
      html: this.composeWidget(),
      nbrElements: this.donnees.listeAbsences.count(),
      afficherMessage: false,
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
    this.initialiserObjets();
  }
  composeAbsence(aAbsence, i) {
    const H = [];
    let lLibelleAbsence = aAbsence.getLibelle();
    if (
      aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Commission
    ) {
      lLibelleAbsence = aAbsence.nature.getLibelle();
    } else if (
      aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense
    ) {
      lLibelleAbsence = aAbsence.strGenreDispense;
    }
    let lLibelle = this.utilitaireAbsence
      .getChaineTraductionGenreAbsence({
        genre: aAbsence.getGenre(),
        genreObservation: aAbsence.genreObservation,
        libelle: lLibelleAbsence,
        singulier: true,
        justifie: aAbsence.justifie,
        aRegulariser: !!aAbsence.aRegulariser && this.estEspaceParent,
        enAttente: !!aAbsence.enAttente && this.estEspaceParent,
        confirmee: aAbsence.confirmee,
        estUneCreationParent:
          aAbsence.estUneCreationParent || !!aAbsence.auteur,
        reglee: aAbsence.reglee,
      })
      .ucfirst();
    const lDate = this.utilitaireAbsence.getDate(aAbsence, true);
    const lEstLue =
      aAbsence.genreObservation ===
        TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement ||
      aAbsence.estLue;
    const lClassIcon =
      Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
        aAbsence.getGenre(),
        {
          genreObservation: aAbsence.genreObservation,
          genreNature: aAbsence.nature ? aAbsence.nature.getGenre() : null,
          justifie: aAbsence.justifie && !aAbsence.aRegulariser,
          confirmee: aAbsence.confirmee,
          estLue: lEstLue,
          avecSursis: aAbsence.avecSursis,
          estUneCreationParent: aAbsence.estUneCreationParent,
          refusee: aAbsence.refusee,
        },
      );
    const lClasses = "wrapper-link icon " + lClassIcon;
    const lIENode = "surAbsence(" + i + ")";
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "li",
          null,
          IE.jsx.str(
            "a",
            { tabindex: "0", "ie-node": lIENode, class: lClasses },
            IE.jsx.str(
              "div",
              { class: "wrap" },
              IE.jsx.str("h3", null, lLibelle),
              IE.jsx.str("span", { class: "date" }, lDate),
            ),
          ),
        ),
      ),
    );
    return H.join("");
  }
  _apresFiche() {
    this.callback.appel(
      this.donnees.genre,
      Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
    );
  }
  _surAbsence(i) {
    const lAbsence = this.donnees.listeAbsences.get(i);
    const lEstAbsenceOuRetard =
      lAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence ||
      lAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard;
    const lEstAvecSaisie =
      !!lAbsence.avecSaisie &&
      [
        Enumere_Espace_1.EGenreEspace.Parent,
        Enumere_Espace_1.EGenreEspace.PrimParent,
        Enumere_Espace_1.EGenreEspace.Mobile_Parent,
        Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
      ].includes(this.etatUtilisateurSco.GenreEspace);
    if (
      lEstAbsenceOuRetard &&
      (!lAbsence.justifie || lAbsence.aRegulariser || lAbsence.enAttente) &&
      lEstAvecSaisie
    ) {
      const lFenetreDetailElement =
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_DetailElementVS_1.ObjetFenetre_DetailElementVS,
          {
            pere: this,
            evenement(aTypeEvenement, aDonnees) {
              this.utilitaireAbsence.eventApresFiche.call(this, lAbsence, {
                element: aDonnees.element,
                documents: aDonnees.documents,
                callback: this._apresFiche.bind(this),
              });
            },
            initialiser(aInstance) {
              const lTitre =
                lAbsence.getGenre() ===
                Enumere_Ressource_1.EGenreRessource.Absence
                  ? lAbsence.estUneCreationParent
                    ? ObjetTraduction_1.GTraductions.getValeur(
                        "AbsenceVS.PrevenirAbsenceParent",
                      )
                    : ObjetTraduction_1.GTraductions.getValeur(
                        "AbsenceVS.JustifierAbsence",
                      )
                  : ObjetTraduction_1.GTraductions.getValeur(
                      "AbsenceVS.JustifierRetard",
                    );
              aInstance.setOptionsFenetre({ titre: lTitre, listeBoutons: [] });
            },
          },
        );
      const lEvenement =
        ObjetVSListeDetails_1.ObjetVSListeDetails.evenement.selection;
      let lNode = null;
      if (this.estEspaceParent) {
        lNode = ObjetHtml_1.GHtml.composeAttr("ie-node", "selectionDetail", [
          lEvenement,
          lAbsence.getNumero(),
        ]);
      }
      this.utilitaireAbsence.remplirContentHtml({
        element: lAbsence,
        genre: Enumere_Ressource_1.EGenreRessource.Absence,
        pourParent: this.estEspaceParent,
        avecSaisie: true,
        node: lNode,
        nodeEdition: ObjetHtml_1.GHtml.composeAttr(
          "ie-node",
          "selectionDetail",
          [
            ObjetVSListeDetails_1.ObjetVSListeDetails.evenement
              .editionMotifParent,
            lAbsence.getNumero(),
          ],
        ),
        ieHintPJ: ObjetHtml_1.GHtml.composeAttr("ie-hint", "hintPJ", [
          lAbsence.getNumero(),
        ]),
        ieHintCommentaire: ObjetHtml_1.GHtml.composeAttr(
          "ie-hint",
          "hintCommentaire",
          [lAbsence.getNumero()],
        ),
      });
      lFenetreDetailElement.setDonnees(lAbsence);
    } else if (
      lAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense &&
      lEstAvecSaisie
    ) {
      ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterDispense({
        instanceAppel: this,
        element: lAbsence,
        callbackApresSaisieDispense: this._apresFiche.bind(this),
      });
    } else {
      this.etatUtilisateurSco.SaisieAbsence = {
        ongletProvenance: this.etatUtilisateurSco.getGenreOnglet(),
      };
      this.etatUtilisateurSco.setPage({
        Onglet: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
        executerSaisieMotifAbsence: true,
        retourAccueil: true,
        element: lAbsence,
      });
      this.etatUtilisateurSco.Navigation.OptionsOnglet = {};
      if (this.etatUtilisateurSco.getGenreOnglet()) {
        const lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
        if (
          this.etatUtilisateurSco.listeOngletsInvisibles.indexOf(
            lGenreOnglet,
          ) === -1
        ) {
          let lPageDestination;
          if (IE.estMobile) {
            lPageDestination = { genreOngletDest: lGenreOnglet };
          } else {
            lPageDestination = {
              Onglet: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
              executerSaisieMotifAbsence: true,
              retourAccueil: true,
              element: lAbsence,
            };
          }
          this.callback.appel(
            this.donnees.genre,
            Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
            lPageDestination,
          );
        }
      }
    }
  }
  majAbsenceApresSaisie(aAbsenceOrig, aAbsenceSaisie) {
    this.utilitaireAbsence._majAbsenceApresSaisie(aAbsenceOrig, aAbsenceSaisie);
  }
}
exports.WidgetVieScolaire = WidgetVieScolaire;
