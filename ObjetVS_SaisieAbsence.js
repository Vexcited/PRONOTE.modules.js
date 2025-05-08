exports.ObjetVS_SaisieAbsence = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetHtml_1 = require("ObjetHtml");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const GUID_1 = require("GUID");
const Enumere_Action_1 = require("Enumere_Action");
const UtilitaireUrl_1 = require("UtilitaireUrl");
class ObjetVS_SaisieAbsence extends ObjetIdentite_1.Identite {
  constructor() {
    super(...arguments);
    this.idCommentaire = GUID_1.GUID.getId();
    this.boutons = { annuler: 0, valider: 1, supprimer: 2 };
    this.parametres = {
      avecHoraire: false,
      avecSuppression: false,
      saisieDJavecPasHoraire: false,
      afficherNew: false,
    };
    this.ids = {
      labelMotif: GUID_1.GUID.getId(),
      labelDebut: GUID_1.GUID.getId(),
      labelFin: GUID_1.GUID.getId(),
      labelCommentaire: GUID_1.GUID.getId(),
    };
  }
  construireInstances() {
    this.selecDateDebut = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      {
        pere: this,
        evenement: this._surDateDebut,
        options: {
          ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
            "AbsenceVS.ChoixDateDebut",
          ),
        },
      },
    );
    this.selecDateFin = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      {
        pere: this,
        evenement: this._surDateFin,
        options: {
          ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
            "AbsenceVS.ChoixDateFin",
          ),
        },
      },
    );
  }
  setParametres(aParams) {
    $.extend(this.parametres, aParams);
  }
  _surDateDebut(aDate) {
    const lNbMaxJoursDeclarationAbsence =
      this.nbMaxJoursDeclarationAbsence ||
      GEtatUtilisateur.Identification.ressource.nbMaxJoursDeclarationAbsence;
    const lDateMax = lNbMaxJoursDeclarationAbsence
      ? ObjetDate_1.GDate.getJourSuivant(
          ObjetDate_1.GDate.aujourdhui,
          lNbMaxJoursDeclarationAbsence,
        )
      : ObjetDate_1.GDate.derniereDate;
    const lDateOriginale = this.absenceTraitee.debut.date;
    if (ObjetDate_1.GDate.estAvantJour(aDate, lDateMax)) {
      const lDate = new Date(
        aDate.getFullYear(),
        aDate.getMonth(),
        aDate.getDate(),
        lDateOriginale ? lDateOriginale.getHours() : this.heureDebut.getHours(),
        lDateOriginale
          ? lDateOriginale.getMinutes()
          : this.heureDebut.getMinutes(),
      );
      this.absenceTraitee.debut.date = lDate;
      if (this.absenceTraitee.debut.date >= this.absenceTraitee.fin.date) {
        let lDateFin = new Date(
          aDate.getFullYear(),
          aDate.getMonth(),
          aDate.getDate(),
          this.absenceTraitee.fin.date
            ? this.absenceTraitee.fin.date.getHours()
            : this.heureFin.getHours(),
          this.absenceTraitee.fin.date
            ? this.absenceTraitee.fin.date.getMinutes()
            : this.heureFin.getMinutes(),
        );
        if (this.absenceTraitee.debut.date >= lDateFin) {
          this.absenceTraitee.fin.estMatin = false;
          lDateFin = new Date(
            aDate.getFullYear(),
            aDate.getMonth(),
            aDate.getDate(),
            this.heureFin.getHours(),
            this.heureFin.getMinutes(),
          );
        }
        this.selecDateFin.setDonnees(aDate, true);
      }
      this.selecDateFin.setPremiereDateSaisissable(aDate, true);
    } else {
      const lThis = this;
      const lDateMaxFormatee = ObjetDate_1.GDate.formatDate(
        lDateMax,
        "%JJ/%MM/%AAAA",
      );
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        message: ObjetTraduction_1.GTraductions.getValeur(
          "AbsenceVS.DateLimiteDeclaration",
          [lDateMaxFormatee],
        ),
        callback: function () {
          lThis.selecDateDebut.setDonnees(lDateOriginale);
        },
      });
    }
  }
  _surDateFin(aDate) {
    const lDateFin = new Date(
      aDate.getFullYear(),
      aDate.getMonth(),
      aDate.getDate(),
      this.absenceTraitee.fin.date
        ? this.absenceTraitee.fin.date.getHours()
        : this.heureFin.getHours(),
      this.absenceTraitee.fin.date
        ? this.absenceTraitee.fin.date.getMinutes()
        : this.heureFin.getMinutes(),
    );
    this.absenceTraitee.fin.date = lDateFin;
  }
  construireAffichage() {
    if (this.selecDateDebut && this.selecDateFin) {
      if (this.parametres.afficherNew) {
        return IE.jsx.str(
          "div",
          {
            id: `${this.Nom}_container`,
            class: [
              "ObjetDetailElementVS",
              "ovs-saisie-absence",
              "ObjetFenetre_Edition",
            ],
          },
          IE.jsx.str(
            "div",
            { class: ["ObjetFenetre_Edition_Contenu"] },
            this._composeDebut(),
            this._composeFin(),
            this._composeChoixMotif(),
            _composeJustificatif.call(this),
            this._composeCommentaire(),
          ),
          IE.jsx.str(
            "div",
            { class: ["zone-bas", "NePasImprimer"] },
            this._composeBas(),
          ),
        );
      } else {
        const H = [];
        H.push(
          '<div id="',
          this.Nom +
            '_conteneur" class="ObjetDetailElementVS ObjetFenetre_Edition">',
        );
        H.push(_composeHeadMobile.call(this));
        H.push('<div class="ObjetFenetre_Edition_Contenu">');
        H.push(
          " <div ",
          !IE.estMobile || !this.parametres.avecHoraire
            ? 'class="dates-contain"'
            : 'class="p-top rounded"',
          ">",
          "        <label>",
          IE.estMobile && this.parametres.avecHoraire
            ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.dateDeDebut")
            : ObjetTraduction_1.GTraductions.getValeur("Du").ucfirst(),
          "</label>",
          '        <div id="',
          this.selecDateDebut.getNom(),
          '" ie-node="getNodeSelecDate(true)"></div>',
        );
        if (this.parametres.avecHoraire) {
          H.push(
            "<ie-combo ",
            IE.estMobile ? 'class="rounded" ' : "",
            'ie-model="comboHeureDebut"></ie-combo>',
          );
        } else {
          H.push(
            ' <ie-radio ie-model="radioDuDemiJournee(true)">',
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin"),
            "</ie-radio>",
            '      <ie-radio ie-model="radioDuDemiJournee(false)">',
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi"),
            "</ie-radio>",
          );
        }
        H.push(" </div>");
        H.push(
          " <div ",
          !IE.estMobile || !this.parametres.avecHoraire
            ? 'class="dates-contain"'
            : 'class="p-top rounded separateur-haut"',
          ">",
          "        <label>",
          IE.estMobile && this.parametres.avecHoraire
            ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.dateDeFin")
            : ObjetTraduction_1.GTraductions.getValeur("Au").ucfirst(),
          "</label>",
          '        <div id="',
          this.selecDateFin.getNom(),
          '" ie-node="getNodeSelecDate(false)"></div>',
        );
        if (this.parametres.avecHoraire) {
          H.push(
            "<ie-combo ",
            IE.estMobile ? 'class="rounded" ' : "",
            'ie-model="comboHeureFin"></ie-combo>',
          );
        } else {
          H.push(
            ' <ie-radio ie-model="radioAuDemiJournee(true)">',
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin"),
            "</ie-radio>",
            '        <ie-radio ie-model="radioAuDemiJournee(false)">',
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi"),
            "</ie-radio>",
          );
        }
        H.push(" </div>");
        H.push(
          ' <ie-combo class="rounded separateur-haut" ie-model="comboMotif"></ie-combo>',
        );
        H.push(
          ' <div class="LigneSaisieDocumentJoint m-top">',
          '   <div tabindex="0" class="bt-pj-unique flex-contain flex-center icon_piece_jointe" ie-model="telechargerJustificatif" ie-selecfile>',
          '     <div class="libelle-pj fluid-bloc" ie-html="getLibellePJ"></div>',
          '<ie-btnimage class="icon_supprimer_pj btnImageIcon" ie-model="btnSupprDocumentJoint" ie-display="btnSupprDocumentJoint.estVisible" title="',
          ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
          '"></ie-btnimage>',
          "   </div></div>",
        );
        H.push(
          ` <div class="p-top-l rounded separateur-haut"><label class="Gras" for="${this.idCommentaire}">${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commentaire")}</label><ie-textareamax ie-model="commentaire" ie-autoresize maxlength="200" class="txt-comment fluid-bloc" ${!IE.estMobile ? 'style="min-height:6rem;"' : ""} ie-class="getClassCommentaire" placeholder="${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AjouterUnCommentaire")}" id="${this.idCommentaire}"></ie-textareamax></div>`,
        );
        H.push("</div>");
        const lHtmlBtnSupp = `<ie-btnicon ie-model="btnSupp" class="icon_trash avecFond i-medium" title="${ObjetTraduction_1.GTraductions.getValeur("Supprimer")}"></ie-btnicon>`;
        const lHtmlBtnAnnulerEtValider = `<ie-bouton ie-model="btnFermer" class="${Type_ThemeBouton_1.TypeThemeBouton.secondaire}">${ObjetTraduction_1.GTraductions.getValeur("Annuler")}</ie-bouton><ie-bouton ie-model="btnValider" class="ml-large ${Type_ThemeBouton_1.TypeThemeBouton.primaire}">${ObjetTraduction_1.GTraductions.getValeur("Valider")}</ie-bouton>`;
        H.push('<div class="zone-bas NePasImprimer">');
        if (!IE.estMobile) {
          H.push(
            this.parametres.avecSuppression
              ? `<div class="m-top-xl">${lHtmlBtnSupp}</div>`
              : "",
          );
          H.push('<div class="btn-conteneur">');
          H.push(lHtmlBtnAnnulerEtValider);
          H.push("</div>");
        } else {
          H.push(
            `<div class="flex-contain ${this.parametres.avecSuppression ? "justify-between" : "justify-end"} m-top-xxl">`,
          );
          H.push(this.parametres.avecSuppression ? `${lHtmlBtnSupp}` : "");
          H.push(
            '<div class="flex-contain justify-end">',
            lHtmlBtnAnnulerEtValider,
            "</div>",
          );
          H.push("</div>");
        }
        H.push("</div>");
        H.push("</div>");
        return H.join("");
      }
    } else {
      return "";
    }
  }
  surValidation(aGenreBouton) {
    if (this.options.avecBascule) {
      if (this.options.instanceAppelante) {
        this.options.instanceAppelante.afficherEcranSaisie();
        this.options.instanceAppelante.initialiser(true);
      }
    } else {
      this.Pere.fermer();
    }
    this.callback.appel(aGenreBouton, this.absenceTraitee);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnFermer: {
        event: function () {
          aInstance.options.callbackRetour();
        },
      },
      btnValider: {
        event: function () {
          aInstance.surValidation(aInstance.boutons.valider);
        },
        getDisabled: function () {
          return (
            !!!aInstance.absenceTraitee.motifParent ||
            (aInstance.parametres.avecHoraire &&
              aInstance.absenceTraitee.debut.heure.Position >
                aInstance.absenceTraitee.fin.heure.Position &&
              ObjetDate_1.GDate.estJourEgal(
                aInstance.absenceTraitee.debut.date,
                aInstance.absenceTraitee.fin.date,
              ))
          );
        },
      },
      btnSupp: {
        event: function () {
          GApplication.getMessage().afficher({
            type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
            message: ObjetTraduction_1.GTraductions.getValeur(
              "AbsenceVS.confirmezSuppression",
            ),
            callback: function (aGenreAction) {
              if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
                aInstance.absenceTraitee.setEtat(
                  Enumere_Etat_1.EGenreEtat.Suppression,
                );
                aInstance.surValidation(aInstance.boutons.supprimer);
              }
            },
          });
        },
      },
      radioDuDemiJournee: {
        getValue: function (aEstMatin) {
          let lResult = false;
          if (!!aInstance.absenceTraitee) {
            lResult = aInstance.absenceTraitee.debut.estMatin === aEstMatin;
          }
          return lResult;
        },
        setValue: function (aEstMatin) {
          if (!!aInstance.absenceTraitee) {
            const lDateMidi = new Date(
              aInstance.absenceTraitee.debut.date.getFullYear(),
              aInstance.absenceTraitee.debut.date.getMonth(),
              aInstance.absenceTraitee.debut.date.getDate(),
              aInstance.heureMidi.getHours(),
              aInstance.heureMidi.getMinutes(),
            );
            aInstance.absenceTraitee.debut.estMatin = aEstMatin;
            if (
              aEstMatin === false &&
              ObjetDate_1.GDate.estJourEgal(
                aInstance.absenceTraitee.debut.date,
                aInstance.absenceTraitee.fin.date,
              ) &&
              !!aInstance.absenceTraitee.fin.estMatin
            ) {
              aInstance.absenceTraitee.fin.estMatin = false;
              aInstance.absenceTraitee.fin.date = new Date(
                aInstance.absenceTraitee.fin.date.getFullYear(),
                aInstance.absenceTraitee.fin.date.getMonth(),
                aInstance.absenceTraitee.fin.date.getDate(),
                aInstance.heureFin.getHours(),
                aInstance.heureFin.getMinutes(),
              );
            }
            if (aEstMatin && aInstance.absenceTraitee.debut.date >= lDateMidi) {
              aInstance.absenceTraitee.debut.date = new Date(
                aInstance.absenceTraitee.debut.date.getFullYear(),
                aInstance.absenceTraitee.debut.date.getMonth(),
                aInstance.absenceTraitee.debut.date.getDate(),
                aInstance.heureDebut.getHours(),
                aInstance.heureDebut.getMinutes(),
              );
            } else if (
              !aEstMatin &&
              aInstance.absenceTraitee.debut.date < lDateMidi
            ) {
              aInstance.absenceTraitee.debut.date = lDateMidi;
            }
            aInstance.absenceTraitee.setEtat(
              Enumere_Etat_1.EGenreEtat.Modification,
            );
          }
        },
      },
      radioAuDemiJournee: {
        getValue: function (aEstMatin) {
          let lResult = false;
          if (!!aInstance.absenceTraitee) {
            lResult = aInstance.absenceTraitee.fin.estMatin === aEstMatin;
          }
          return lResult;
        },
        setValue: function (aEstMatin) {
          if (!!aInstance.absenceTraitee) {
            let lDate = aInstance.absenceTraitee.fin.date;
            const lDateMidi = new Date(
              aInstance.absenceTraitee.fin.date.getFullYear(),
              aInstance.absenceTraitee.fin.date.getMonth(),
              aInstance.absenceTraitee.fin.date.getDate(),
              aInstance.heureMidi.getHours(),
              aInstance.heureMidi.getMinutes(),
            );
            if (aEstMatin && aInstance.absenceTraitee.fin.date > lDateMidi) {
              lDate = lDateMidi;
            } else if (
              !aEstMatin &&
              aInstance.absenceTraitee.fin.date <= lDateMidi
            ) {
              lDate = new Date(
                aInstance.absenceTraitee.fin.date.getFullYear(),
                aInstance.absenceTraitee.fin.date.getMonth(),
                aInstance.absenceTraitee.fin.date.getDate(),
                aInstance.heureFin.getHours(),
                aInstance.heureFin.getMinutes(),
              );
            }
            if (lDate < aInstance.absenceTraitee.debut.date) {
              GApplication.getMessage().afficher({
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "AbsenceVS.dateFinAvantDebut",
                ),
              });
            } else {
              aInstance.absenceTraitee.fin.estMatin = aEstMatin;
              aInstance.absenceTraitee.fin.date = lDate;
              aInstance.absenceTraitee.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
            }
          }
        },
        getDisabled: function (aEstMatin) {
          if (!!aInstance.absenceTraitee) {
            if (
              aEstMatin === true &&
              ObjetDate_1.GDate.estJourEgal(
                aInstance.absenceTraitee.debut.date,
                aInstance.absenceTraitee.fin.date,
              ) &&
              aInstance.absenceTraitee.debut.estMatin === false
            ) {
              return true;
            }
          }
          return false;
        },
      },
      commentaire: {
        getValue: function () {
          return aInstance.absenceTraitee &&
            aInstance.absenceTraitee.justification
            ? aInstance.absenceTraitee.justification
            : "";
        },
        setValue: function (aValue) {
          if (aInstance.absenceTraitee.justification !== aValue) {
            aInstance.absenceTraitee.justification = aValue;
            aInstance.absenceTraitee.setEtat(
              Enumere_Etat_1.EGenreEtat.Modification,
            );
          }
        },
        getDisabled: function () {
          return !aInstance.absenceTraitee;
        },
      },
      getClassCommentaire: function () {
        const lClass = [];
        if (!!aInstance.absenceTraitee) {
          if (!aInstance.absenceTraitee.justification) {
            lClass.push("sansCommentaire");
          }
          if (!IE.estMobile) {
            lClass.push(
              "txt-comment",
              "round-style",
              "fluid-bloc",
              "min-height-commentaire",
            );
          }
        }
        return lClass.join(" ");
      },
      telechargerJustificatif: {
        getOptionsSelecFile: function () {
          return aInstance.getOptionsSelecFile();
        },
        addFiles: function (aParams) {
          aInstance.absenceTraitee.documents.addElement(aParams.eltFichier);
          aInstance.absenceTraitee.setEtat(
            Enumere_Etat_1.EGenreEtat.Modification,
          );
        },
        getDisabled: function () {
          return (
            !aInstance.absenceTraitee ||
            !!(
              aInstance.absenceTraitee.documents &&
              aInstance.absenceTraitee.documents.getNbrElementsExistes()
            )
          );
        },
        getIcone() {
          return '<i class="icon_piece_jointe"></i>';
        },
        getLibelle() {
          return ObjetTraduction_1.GTraductions.getValeur(
            "AbsenceVS.TelechargerUnJustifcatif",
          );
        },
      },
      getLibellePJ: function () {
        if (
          aInstance.absenceTraitee &&
          aInstance.absenceTraitee.documents &&
          aInstance.absenceTraitee.documents.getNbrElementsExistes()
        ) {
          if (aInstance.parametres.afficherNew) {
            return [
              UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
                aInstance.absenceTraitee.documents,
                { IEModelChips: "chipsDocument" },
              ),
            ].join("");
          } else {
            const lDocs = [];
            for (
              let i = 0;
              i < aInstance.absenceTraitee.documents.count();
              i++
            ) {
              const lDocument = aInstance.absenceTraitee.documents.get(i);
              if (lDocument.existe()) {
                lDocs.push(aInstance.composeDocument(lDocument));
              }
            }
            return lDocs.join(", ");
          }
        }
      },
      btnSupprDocumentJoint: {
        event() {
          if (
            aInstance.absenceTraitee &&
            aInstance.absenceTraitee.documents &&
            aInstance.absenceTraitee.documents.getNbrElementsExistes()
          ) {
            aInstance.absenceTraitee.documents.parcourir((aDocument) => {
              if (aDocument.existe()) {
                aDocument.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
                aInstance.absenceTraitee.setEtat(
                  Enumere_Etat_1.EGenreEtat.Modification,
                );
              }
            });
          }
        },
        estVisible() {
          return (
            aInstance.absenceTraitee &&
            aInstance.absenceTraitee.documents &&
            !!aInstance.absenceTraitee.documents.getNbrElementsExistes()
          );
        },
      },
      chipsDocument: {
        eventBtn: function (aIndice) {
          if (
            aInstance.absenceTraitee &&
            aInstance.absenceTraitee.documents &&
            aInstance.absenceTraitee.documents.getNbrElementsExistes()
          ) {
            const lDoc = aInstance.absenceTraitee.documents.get(aIndice);
            if (lDoc) {
              lDoc.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
              aInstance.absenceTraitee.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
            }
          }
        },
      },
      getNodeSelecDate: function (aEstDebut) {
        const lSelecteur = aEstDebut
          ? aInstance.selecDateDebut
          : aInstance.selecDateFin;
        lSelecteur.initialiser();
        const lDateBornee = ObjetDate_1.GDate.getDateBornee(
          ObjetDate_1.GDate.aujourdhui,
        );
        const lDate = ObjetDate_1.GDate.estUnJourOuvre(lDateBornee)
          ? lDateBornee
          : ObjetDate_1.GDate.getProchainJourOuvre(lDateBornee);
        const lNbMaxJoursDeclarationAbsence =
          aInstance.nbMaxJoursDeclarationAbsence ||
          GEtatUtilisateur.Identification.ressource
            .nbMaxJoursDeclarationAbsence;
        const lDateMax =
          lNbMaxJoursDeclarationAbsence && aEstDebut
            ? ObjetDate_1.GDate.getJourSuivant(
                ObjetDate_1.GDate.aujourdhui,
                lNbMaxJoursDeclarationAbsence,
              )
            : GParametres.DerniereDate;
        lSelecteur.setParametresFenetre(
          GParametres.PremierLundi,
          lDate,
          lDateMax,
          GParametres.JoursOuvres,
          null,
          GParametres.JoursFeries,
          null,
        );
        if (aEstDebut && aInstance.absenceTraitee.debut.date) {
          const lDateSelonValidite = lSelecteur.moteurDate.getDateSelonValidite(
            aInstance.absenceTraitee.debut.date,
          );
          aInstance.absenceTraitee.debut.date = new Date(
            lDateSelonValidite.getFullYear(),
            lDateSelonValidite.getMonth(),
            lDateSelonValidite.getDate(),
            aInstance.absenceTraitee.debut.date.getHours(),
            aInstance.absenceTraitee.debut.date.getMinutes(),
          );
          lSelecteur.setDonnees(aInstance.absenceTraitee.debut.date);
        } else if (!aEstDebut && aInstance.absenceTraitee.fin.date) {
          const lDateSelonValidite = lSelecteur.moteurDate.getDateSelonValidite(
            aInstance.absenceTraitee.fin.date,
          );
          aInstance.absenceTraitee.fin.date = new Date(
            lDateSelonValidite.getFullYear(),
            lDateSelonValidite.getMonth(),
            lDateSelonValidite.getDate(),
            aInstance.absenceTraitee.fin.date.getHours(),
            aInstance.absenceTraitee.fin.date.getMinutes(),
          );
          lSelecteur.setDonnees(aInstance.absenceTraitee.fin.date);
        } else {
          if (aEstDebut) {
            if (aInstance.absenceTraitee.debut.estMatin === false) {
              aInstance.absenceTraitee.debut.date = new Date(
                lDate.getFullYear(),
                lDate.getMonth(),
                lDate.getDate(),
                aInstance.heureMidi.getHours(),
                aInstance.heureMidi.getMinutes(),
              );
            } else {
              aInstance.absenceTraitee.debut.date = new Date(
                lDate.getFullYear(),
                lDate.getMonth(),
                lDate.getDate(),
                aInstance.heureDebut.getHours(),
                aInstance.heureDebut.getMinutes(),
              );
            }
            lSelecteur.setDonnees(aInstance.absenceTraitee.debut.date);
          } else {
            if (aInstance.absenceTraitee.fin.estMatin === true) {
              aInstance.absenceTraitee.fin.date = new Date(
                lDate.getFullYear(),
                lDate.getMonth(),
                lDate.getDate(),
                aInstance.heureMidi.getHours(),
                aInstance.heureMidi.getMinutes(),
              );
            } else {
              aInstance.absenceTraitee.fin.date = new Date(
                lDate.getFullYear(),
                lDate.getMonth(),
                lDate.getDate(),
                aInstance.heureFin.getHours(),
                aInstance.heureFin.getMinutes(),
              );
            }
            lSelecteur.setDonnees(aInstance.absenceTraitee.fin.date);
          }
        }
      },
      comboHeureDebut: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            iconeGauche: "icon_reorder",
            labelWAICellule: ObjetTraduction_1.GTraductions.getValeur("Heure"),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.parametres.listeHeuresDebut;
          }
        },
        getIndiceSelection: function () {
          const lElement = aInstance.absenceTraitee;
          if (!lElement || !lElement.debut || !lElement.debut.heure) {
            return 0;
          }
          let lIndice = lElement.debut.heure.Position;
          if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
            lIndice = 0;
          }
          return lIndice;
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            aParametres.element
          ) {
            aInstance.absenceTraitee.debut.heure = aParametres.element;
            aInstance.absenceTraitee.fin.heure =
              !aInstance.absenceTraitee.fin.heure ||
              (aInstance.absenceTraitee.debut.heure.Position >
                aInstance.absenceTraitee.fin.heure.Position &&
                ObjetDate_1.GDate.estJourEgal(
                  aInstance.absenceTraitee.debut.date,
                  aInstance.absenceTraitee.fin.date,
                ))
                ? aInstance.parametres.listeHeuresFin.getDernierElement()
                : aInstance.absenceTraitee.fin.heure;
          }
        },
      },
      comboHeureFin: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            iconeGauche: "icon_reorder",
            labelWAICellule: ObjetTraduction_1.GTraductions.getValeur("Heure"),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.parametres.listeHeuresFin;
          }
        },
        getIndiceSelection: function () {
          const lElement = aInstance.absenceTraitee;
          if (!lElement || !lElement.fin.heure || !lElement.fin.heure) {
            return aInstance.parametres.listeHeuresFin.count() - 1;
          }
          let lIndice = lElement.fin.heure.Position;
          if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
            lIndice = aInstance.parametres.listeHeuresFin.count() - 1;
          }
          return lIndice;
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            aParametres.element
          ) {
            aInstance.absenceTraitee.fin.heure = aParametres.element;
            aInstance.absenceTraitee.debut.heure =
              !aInstance.absenceTraitee.debut.heure ||
              (aInstance.absenceTraitee.fin.heure.Position <
                aInstance.absenceTraitee.debut.heure.Position &&
                ObjetDate_1.GDate.estJourEgal(
                  aInstance.absenceTraitee.debut.date,
                  aInstance.absenceTraitee.fin.date,
                ))
                ? aInstance.absenceTraitee.fin.heure
                : aInstance.absenceTraitee.debut.heure;
          }
        },
      },
      comboMotif: {
        init: function (aInstanceCombo) {
          if (!aInstance.parametres.afficherNew) {
            const lOptionsObjetSaisie = Object.assign(
              {
                required: true,
                forcerBoutonDeploiement: true,
                labelledById: aInstance.ids.labelMotif,
              },
              _getOptionsCombo.call(aInstanceCombo),
            );
            lOptionsObjetSaisie.longueur = "100%";
            aInstanceCombo.setOptionsObjetSaisie(lOptionsObjetSaisie);
          } else {
            aInstanceCombo.setOptionsObjetSaisie({
              longueur: 200,
              required: true,
              forcerBoutonDeploiement: true,
              placeHolder: ObjetTraduction_1.GTraductions.getValeur(
                "AbsenceVS.aPreciser",
              ),
              labelledById: aInstance.ids.labelMotif,
            });
          }
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.listeMotifs;
          }
        },
        getIndiceSelection: function () {
          const lElement = aInstance.absenceTraitee;
          if (
            !lElement ||
            !lElement.motifParent ||
            !lElement.motifParent.existeNumero()
          ) {
            return -1;
          }
          let lIndice = aInstance.listeMotifs.getIndiceParNumeroEtGenre(
            lElement.motifParent.getNumero(),
          );
          if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
            lIndice = -1;
          }
          return lIndice;
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            aParametres.element
          ) {
            aInstance.absenceTraitee.motifParent = aParametres.element;
          }
        },
        getDisabled: function () {
          return false;
        },
      },
      debut: {
        heure: {
          getValueInit() {
            return !!aInstance.absenceTraitee &&
              !!aInstance.absenceTraitee.debut &&
              aInstance.absenceTraitee.debut.date
              ? ObjetDate_1.GDate.formatDate(
                  aInstance.absenceTraitee.debut.date,
                  "%hh:%mm",
                )
              : "";
          },
          exitChange(aValue, aParamsSetter) {
            const lDate = new Date(
              aInstance.absenceTraitee.debut.date.getFullYear(),
              aInstance.absenceTraitee.debut.date.getMonth(),
              aInstance.absenceTraitee.debut.date.getDate(),
              aParamsSetter.time.heure,
              aParamsSetter.time.minute,
            );
            const lDateMidi = new Date(
              aInstance.absenceTraitee.debut.date.getFullYear(),
              aInstance.absenceTraitee.debut.date.getMonth(),
              aInstance.absenceTraitee.debut.date.getDate(),
              aInstance.heureMidi.getHours(),
              aInstance.heureMidi.getMinutes(),
            );
            aInstance.absenceTraitee.debut.date = lDate;
            aInstance.absenceTraitee.debut.estMatin =
              aInstance.absenceTraitee.debut.date < lDateMidi;
            aInstance.absenceTraitee.setEtat(
              Enumere_Etat_1.EGenreEtat.Modification,
            );
            if (lDate >= aInstance.absenceTraitee.fin.date) {
              if (
                !!aInstance.absenceTraitee.fin.estMatin &&
                !aInstance.absenceTraitee.debut.estMatin
              ) {
                aInstance.absenceTraitee.fin.estMatin = false;
              }
              if (aInstance.absenceTraitee.fin.estMatin) {
                aInstance.absenceTraitee.fin.date = lDateMidi;
              } else {
                aInstance.absenceTraitee.fin.date = new Date(
                  aInstance.absenceTraitee.debut.date.getFullYear(),
                  aInstance.absenceTraitee.debut.date.getMonth(),
                  aInstance.absenceTraitee.debut.date.getDate(),
                  aInstance.heureFin.getHours(),
                  aInstance.heureFin.getMinutes(),
                );
              }
            }
          },
          getDisabled: function () {
            return !aInstance.parametres.saisieDJavecPasHoraire;
          },
        },
        avecSaisiePasHoraire: function () {
          return aInstance.parametres.saisieDJavecPasHoraire;
        },
      },
      fin: {
        heure: {
          getValueInit() {
            return !!aInstance.absenceTraitee &&
              !!aInstance.absenceTraitee.fin &&
              aInstance.absenceTraitee.fin.date
              ? ObjetDate_1.GDate.formatDate(
                  aInstance.absenceTraitee.fin.date,
                  "%hh:%mm",
                )
              : "";
          },
          exitChange(aValue, aParamsSetter) {
            const lDate = new Date(
              aInstance.absenceTraitee.fin.date.getFullYear(),
              aInstance.absenceTraitee.fin.date.getMonth(),
              aInstance.absenceTraitee.fin.date.getDate(),
              aParamsSetter.time.heure,
              aParamsSetter.time.minute,
            );
            const lDateMidi = new Date(
              aInstance.absenceTraitee.fin.date.getFullYear(),
              aInstance.absenceTraitee.fin.date.getMonth(),
              aInstance.absenceTraitee.fin.date.getDate(),
              aInstance.heureMidi.getHours(),
              aInstance.heureMidi.getMinutes(),
            );
            if (lDate < aInstance.absenceTraitee.debut.date) {
              GApplication.getMessage().afficher({
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "AbsenceVS.dateFinAvantDebut",
                ),
              });
            } else {
              aInstance.absenceTraitee.fin.date = lDate;
              aInstance.absenceTraitee.fin.estMatin =
                aInstance.absenceTraitee.fin.date <= lDateMidi;
              aInstance.absenceTraitee.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
            }
          },
          getDisabled: function () {
            return !aInstance.parametres.saisieDJavecPasHoraire;
          },
        },
        avecSaisiePasHoraire: function () {
          return aInstance.parametres.saisieDJavecPasHoraire;
        },
      },
      avecSuppression: function () {
        return aInstance.parametres.avecSuppression;
      },
      saisieParDJ: function () {
        return !aInstance.parametres.avecHoraire;
      },
      saisieHoraire: function () {
        return aInstance.parametres.avecHoraire;
      },
    });
  }
  setDonnees(aDonnees, aParams) {
    this.absenceTraitee = aDonnees;
    if (!this.absenceTraitee.documents) {
      this.absenceTraitee.documents =
        new ObjetListeElements_1.ObjetListeElements();
    }
    if (aParams) {
      if (aParams.listeMotifsAbsences) {
        this.listeMotifs = aParams.listeMotifsAbsences;
      }
      if (aParams.nbMaxJoursDeclarationAbsence) {
        this.nbMaxJoursDeclarationAbsence =
          aParams.nbMaxJoursDeclarationAbsence;
      }
    }
    this.construireInstances();
    if (aParams && aParams.estConteneur) {
      ObjetHtml_1.GHtml.setHtml(aParams.id, this.construireAffichage(), {
        controleur: this.controleur,
      });
    } else {
      this.afficher();
    }
  }
  _composeDebut() {
    return IE.jsx.str(
      "div",
      { class: ["field-contain", "border-bottom", "p-bottom-xl"] },
      IE.jsx.str(
        "label",
        { id: this.ids.labelDebut, class: ["m-bottom"] },
        ObjetTraduction_1.GTraductions.getValeur("Debut"),
      ),
      IE.jsx.str(
        "div",
        { class: ["flex-contain", "justify-between"] },
        IE.jsx.str("div", {
          id: this.selecDateDebut.getNom(),
          "ie-node": "getNodeSelecDate(true)",
        }),
        IE.jsx.str(
          "div",
          { "ie-if": "saisieParDJ" },
          IE.jsx.str(
            "fieldset",
            { class: ["flex-contain", "flex-center", "justify-end"] },
            IE.jsx.str(
              "legend",
              { class: ["sr-only"] },
              ObjetTraduction_1.GTraductions.getValeur(
                "AbsenceVS.ChoixDJDebut",
              ),
            ),
            IE.jsx.str(
              "ie-radio",
              {
                name: "debut",
                "ie-model": "radioDuDemiJournee(true)",
                "ie-icon": "icon_check_fin",
                class: ["as-chips"],
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin"),
            ),
            IE.jsx.str(
              "ie-radio",
              {
                name: "debut",
                "ie-model": "radioDuDemiJournee(false)",
                "ie-icon": "icon_check_fin",
                class: ["as-chips", "m-left-l"],
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi"),
            ),
          ),
          IE.jsx.str(
            "div",
            {
              "ie-display": "debut.avecSaisiePasHoraire",
              class: ["flex-contain", "fea-baseline", "m-top-l"],
            },
            IE.jsx.str(
              "label",
              {
                for: this.ids.labelDebut + "heure",
                class: ["m-right", "fluid-bloc", "text-right"],
              },
              ObjetTraduction_1.GTraductions.getValeur("aPartirDe"),
            ),
            IE.jsx.str("input", {
              id: this.ids.labelDebut + "heure",
              type: "time",
              step: 30 * 60 + "",
              min: this.strDebut,
              max: this.strFin,
              "ie-model": "debut.heure",
              class: ["round-style", "fea-time"],
            }),
          ),
        ),
        IE.jsx.str(
          "div",
          { "ie-if": "saisieHoraire" },
          IE.jsx.str("ie-combo", {
            "ie-model": "comboHeureDebut",
            class: [IE.estMobile ? "rounded" : ""],
          }),
        ),
      ),
    );
  }
  _composeFin() {
    return IE.jsx.str(
      "div",
      { class: ["field-contain", "border-bottom", "p-bottom-xl"] },
      IE.jsx.str(
        "label",
        { id: this.ids.labelFin, class: ["m-bottom"] },
        ObjetTraduction_1.GTraductions.getValeur("Fin"),
      ),
      IE.jsx.str(
        "div",
        { class: ["flex-contain", "justify-between"] },
        IE.jsx.str("div", {
          id: this.selecDateFin.getNom(),
          "ie-node": "getNodeSelecDate(false)",
        }),
        IE.jsx.str(
          "div",
          { "ie-if": "saisieParDJ" },
          IE.jsx.str(
            "fieldset",
            { class: ["flex-contain", "flex-center", "justify-end"] },
            IE.jsx.str(
              "legend",
              { class: ["sr-only"] },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ChoixDJFin"),
            ),
            IE.jsx.str(
              "ie-radio",
              {
                name: "fin",
                "ie-model": "radioAuDemiJournee(true)",
                "ie-icon": "icon_check_fin",
                class: ["as-chips"],
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin"),
            ),
            IE.jsx.str(
              "ie-radio",
              {
                name: "fin",
                "ie-model": "radioAuDemiJournee(false)",
                "ie-icon": "icon_check_fin",
                class: ["as-chips", "m-left-l"],
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi"),
            ),
          ),
          IE.jsx.str(
            "div",
            {
              "ie-display": "fin.avecSaisiePasHoraire",
              class: ["flex-contain", "fea-baseline", "m-top-l"],
            },
            IE.jsx.str(
              "label",
              {
                for: this.ids.labelFin + "heure",
                class: ["m-right", "fluid-bloc", "text-right"],
              },
              ObjetTraduction_1.GTraductions.getValeur("jusquA"),
            ),
            IE.jsx.str("input", {
              id: this.ids.labelFin + "heure",
              type: "time",
              step: 30 * 60 + "",
              min: this.strDebut,
              max: this.strFin,
              "ie-model": "fin.heure",
              class: ["round-style", "fea-time"],
            }),
          ),
        ),
        IE.jsx.str(
          "div",
          { "ie-if": "saisieHoraire" },
          IE.jsx.str("ie-combo", {
            "ie-model": "comboHeureFin",
            class: [IE.estMobile ? "rounded" : ""],
          }),
        ),
      ),
    );
  }
  _composeChoixMotif() {
    return IE.jsx.str(
      "div",
      { class: ["field-contain", "border-bottom", "p-bottom-xl"] },
      IE.jsx.str(
        "label",
        { id: this.ids.labelMotif, class: ["m-bottom"] },
        ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Raison"),
      ),
      IE.jsx.str("ie-combo", { "ie-model": "comboMotif" }),
    );
  }
  _composeCommentaire() {
    const lClass = ["txt-comment fluid-bloc"];
    if (!IE.estMobile) {
      lClass.push("min-height-commentaire");
    }
    return IE.jsx.str(
      "div",
      { class: ["field-contain"] },
      IE.jsx.str(
        "label",
        { for: this.ids.labelCommentaire, class: ["m-bottom"] },
        ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commentaire"),
      ),
      IE.jsx.str("ie-textareamax", {
        id: this.ids.labelCommentaire,
        "ie-model": "commentaire",
        "ie-autoresize": true,
        maxlength: "200",
        class: lClass,
        placeholder: ObjetTraduction_1.GTraductions.getValeur(
          "AbsenceVS.AjouterUnCommentaire",
        ),
      }),
    );
  }
  _composeBas() {
    if (!IE.estMobile) {
      return IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { "ie-if": "avecSuppression", class: ["m-top-xl"] },
          IE.jsx.str("ie-btnicon", {
            "ie-model": "btnSupp",
            class: ["icon_trash", "avecFond", "i-medium"],
            title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
          }),
        ),
        IE.jsx.str(
          "div",
          { class: "btn-conteneur" },
          IE.jsx.str(
            "ie-bouton",
            {
              "ie-model": "btnFermer",
              class: [Type_ThemeBouton_1.TypeThemeBouton.secondaire],
            },
            ObjetTraduction_1.GTraductions.getValeur("Annuler"),
          ),
          IE.jsx.str(
            "ie-bouton",
            {
              "ie-model": "btnValider",
              class: ["ml-large", Type_ThemeBouton_1.TypeThemeBouton.primaire],
            },
            ObjetTraduction_1.GTraductions.getValeur("Valider"),
          ),
        ),
      );
    } else {
      const lClassJust = this.parametres.avecSuppression
        ? "justify-between"
        : "justify-end";
      return IE.jsx.str(
        "div",
        { class: ["flex-contain", lClassJust, "m-top-xxl"] },
        IE.jsx.str("ie-btnicon", {
          "ie-model": "btnSupp",
          "ie-if": "avecSuppression",
          class: ["icon_trash", "avecFond", "i-medium"],
          title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
        }),
        IE.jsx.str(
          "div",
          { class: ["flex-contain", "justify-end"] },
          IE.jsx.str(
            "ie-bouton",
            {
              "ie-model": "btnFermer",
              class: [Type_ThemeBouton_1.TypeThemeBouton.secondaire],
            },
            ObjetTraduction_1.GTraductions.getValeur("Annuler"),
          ),
          IE.jsx.str(
            "ie-bouton",
            {
              "ie-model": "btnValider",
              class: ["ml-large", Type_ThemeBouton_1.TypeThemeBouton.primaire],
            },
            ObjetTraduction_1.GTraductions.getValeur("Valider"),
          ),
        ),
      );
    }
  }
}
exports.ObjetVS_SaisieAbsence = ObjetVS_SaisieAbsence;
function _composeHeadMobile() {
  if (IE.estMobile) {
    return IE.jsx.str(
      "div",
      { class: ["navheader", "no-bg", "header-titre"] },
      IE.jsx.str("ie-btnimage", {
        "ie-model": "btnFermer",
        class: ["fleche-nav", "icon_retour_mobile", "btnImageIcon"],
      }),
      IE.jsx.str(
        "span",
        { class: ["as-titre"] },
        ObjetTraduction_1.GTraductions.getValeur(
          "AbsenceVS.PrevenirAbsenceParent",
        ),
      ),
    );
  } else {
    return "";
  }
}
function _composeJustificatif() {
  return IE.jsx.str(
    "div",
    { class: ["field-contain", "border-bottom", "p-bottom-xl"] },
    IE.jsx.str(
      "div",
      { class: ["pj-global-conteneur"] },
      IE.jsx.str("ie-btnselecteur", {
        "ie-model": "telechargerJustificatif",
        role: "button",
        "ie-selecfile": true,
        class: ["pj"],
        title: ObjetTraduction_1.GTraductions.getValeur(
          "AbsenceVS.TelechargerUnJustifcatif",
        ),
      }),
      IE.jsx.str("div", {
        class: ["pj-liste-conteneur"],
        "ie-html": "getLibellePJ",
      }),
    ),
  );
}
function _getContenuCombo(aLibelle) {
  const T = ['<div class="libelle-contain" style="font-size:var(--taille-m)">'];
  if (!!aLibelle) {
    if (IE.estMobile) {
      T.push(aLibelle);
    } else {
      T.push("<span>", aLibelle, "</span>");
    }
  }
  T.push("</div>");
  return T.join("");
}
function _getOptionsCombo() {
  return {
    placeHolder: ObjetTraduction_1.GTraductions.getValeur(
      "AbsenceVS.aPreciser",
    ),
    getContenuCellule: (aElement) => {
      return { libelleHtml: _getContenuCombo(aElement.getLibelle() || "") };
    },
    getContenuElement: (aParams) => {
      const T = [];
      if (!!aParams.element) {
        T.push(
          '<div style="width:100%;">',
          aParams.element.getLibelle(),
          "</div>",
        );
      }
      return T.join("");
    },
  };
}
