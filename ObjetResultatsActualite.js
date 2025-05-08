const {
  DonneesListe_ResultatsActualite,
  ETypeFiltreRepondus,
} = require("DonneesListe_ResultatsActualite.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ZoneFenetre } = require("IEZoneFenetre.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetHint } = require("ObjetHint.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { tag } = require("tag.js");
const { GDate } = require("ObjetDate.js");
const TypeEvenementCallback = {
  RenvoyerNotification: "RenvoyerNotification",
  ChangerCumulClasse: "ChangerCumulClasse",
};
class ObjetResultatsActualite extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.idLibelleAnonyme = this.Nom + "_libelleAnonyme";
    this.idListeQuestions = this.Nom + ".listeQuestions";
    this.idListeResultats = this.Nom + ".listeResultats";
    this.idVisuQuestion = this.Nom + ".visuQuestion";
    this.classVisuQuestion = GUID.getClassCss();
    this.objetListeQuestions = new ObjetListe(
      this.idListeQuestions,
      null,
      this,
      this._eventListeQuestions,
    );
    this.objetListeQuestions.setOptionsListe({
      colonnes: [
        { taille: 100, titre: GTraductions.getValeur("actualites.Question") },
      ],
      hauteurAdapteContenu: false,
      avecMultiSelection: true,
    });
    this.listeResultats = new ObjetListe(
      this.idListeResultats,
      null,
      this,
      null,
    );
    this.idFenetreGraph = this.Nom + ".objetFenetreGraph";
    this.objetFenetreGraph = new ObjetFenetre(this.idFenetreGraph, null, this);
    ZoneFenetre.ajouterFenetre(this.objetFenetreGraph.getNom());
    this.objetFenetreGraph.setOptionsFenetre({
      modale: true,
      hauteur: 400,
      hauteurMin: 400,
      largeur: 400,
      largeurMin: 400,
      listeBoutons: [GTraductions.getValeur("Fermer")],
      avecRetaillage: true,
    });
    this.objetFenetreGraph.initialiser();
    this.filtreRepondu = ETypeFiltreRepondus.tous;
    this.avecNombreReponses = false;
    this._options = {
      avecBarreTitre: true,
      avecNotificationRelance: false,
      avecSeparationNomPrenom: true,
    };
    this.donneesAffichage = { avecAffichageCumulClasses: true };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboFiltreSelonRepondus: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 350,
            hauteur: 16,
            hauteurLigneDefault: 16,
            labelWAICellule: GTraductions.getValeur(
              "infoSond.Edition.LabelFiltreDestinataire",
            ),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees && aInstance) {
            aInstance.listeChoixFiltres = new ObjetListeElements();
            aInstance.listeChoixFiltres.addElement(
              new ObjetElement(
                GTraductions.getValeur("infoSond.Edition.FiltreTous"),
                0,
                ETypeFiltreRepondus.tous,
              ),
            );
            aInstance.listeChoixFiltres.addElement(
              new ObjetElement(
                GTraductions.getValeur("infoSond.Edition.FiltreRepondu"),
                0,
                ETypeFiltreRepondus.repondus,
              ),
            );
            aInstance.listeChoixFiltres.addElement(
              new ObjetElement(
                GTraductions.getValeur("infoSond.Edition.FiltreNonRepondu"),
                0,
                ETypeFiltreRepondus.nonRepondus,
              ),
            );
            return aInstance.listeChoixFiltres;
          }
        },
        getIndiceSelection: function () {
          let lIndice = 0;
          if (aInstance && aInstance.listeChoixFiltres) {
            lIndice = aInstance.listeChoixFiltres.getIndiceElementParFiltre(
              (D) => {
                return D.Genre === aInstance.filtreRepondu;
              },
            );
          }
          return Math.max(lIndice, 0);
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            !!aParametres.element &&
            !!aInstance.filtreRepondu !== aParametres.element.Genre
          ) {
            aInstance.filtreRepondu = aParametres.element.Genre;
            aInstance.actualiserListe();
          }
        },
      },
      cbAfficherNbReponses: {
        getValue: function () {
          return !!aInstance.avecNombreReponses;
        },
        setValue: function (aValeur) {
          aInstance.avecNombreReponses = aValeur;
          aInstance.actualiserListe();
        },
      },
      cbAvecCumulParClasses: {
        getValue() {
          return aInstance.donneesAffichage.avecAffichageCumulClasses;
        },
        setValue(aValeur) {
          aInstance.donneesAffichage.avecAffichageCumulClasses = aValeur;
          aInstance.callback.appel(TypeEvenementCallback.ChangerCumulClasse, {
            actualite: aInstance.actualite,
          });
        },
        getLibelle() {
          const H = [
            GTraductions.getValeur(
              "actualites.Edition.AfficherCumulParClasses",
            ),
          ];
          if (aInstance.estUnSondageAnonyme()) {
            H.push(
              " (",
              GTraductions.getValeur(
                "actualites.Edition.NonActifSurSondageAnonyme",
              ),
              ")",
            );
          }
          return H.join("");
        },
        getDisabled() {
          return aInstance.estUnSondageAnonyme();
        },
      },
    });
  }
  estAvecCumulParClasse() {
    return this.donneesAffichage.avecAffichageCumulClasses;
  }
  estUnSondage() {
    return !!(this.actualite && this.actualite.estSondage);
  }
  estUnSondageAnonyme() {
    return (
      this.estUnSondage() && !!(this.actualite && this.actualite.reponseAnonyme)
    );
  }
  setOptions(aOptions) {
    $.extend(this._options, aOptions);
  }
  setUtilitaires(aUtilitaires) {
    this.utilitaires = aUtilitaires;
    this.moteur = new MoteurInfoSondage(aUtilitaires);
  }
  setDonnees(aActualite) {
    let lEstMemeActualite = false;
    if (
      aActualite &&
      this.actualite &&
      aActualite.getNumero() === this.actualite.getNumero()
    ) {
      lEstMemeActualite = true;
    }
    this.actualite = aActualite;
    if (this.estUnSondageAnonyme()) {
      this.donneesAffichage.avecAffichageCumulClasses = false;
    }
    _miseAJourLibelleAnonyme.bind(this)();
    if (this.actualite.avecResultats) {
      $("#" + this.Nom.escapeJQ() + " > table").show();
      this.objetListeQuestions.setDonnees(
        new DonneesListe_Simple(
          _getListeQuestionsConcernees.call(this, this.actualite),
          { avecMenuContextuel: false, avecMultiSelection: true },
        ),
      );
      let lIndiceLigneASelectionner = 0;
      if (lEstMemeActualite) {
        if (
          this.actualite.listeQuestions &&
          this.questionsSelectionnees &&
          this.questionsSelectionnees.length > 0
        ) {
          for (const lQuestionSelectionnee of this.questionsSelectionnees) {
            const lQuestionConcernee = lQuestionSelectionnee.article;
            if (lQuestionConcernee) {
              let lIndiceRetrouvee = _getIndiceDeQuestionsConcernees.call(
                this,
                this.actualite,
                lQuestionConcernee,
              );
              if (lIndiceRetrouvee || lIndiceRetrouvee === 0) {
                lIndiceLigneASelectionner = lIndiceRetrouvee;
                break;
              }
            }
          }
        }
      }
      this.objetListeQuestions.selectionnerLigne({
        ligne: lIndiceLigneASelectionner,
        avecEvenement: true,
      });
    } else {
      $("#" + this.Nom.escapeJQ() + " > table").hide();
    }
  }
  initialiserListeReponses(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ResultatsActualite.colonnes.destinataires,
      genreColonne: DonneesListe_ResultatsActualite.colonnes.destinataires,
      taille: IE.estMobile
        ? "100%"
        : this.avecSeparationNomPrenom
          ? "16rem"
          : "25rem",
      titre: this._options.avecBarreTitre
        ? this.avecSeparationNomPrenom
          ? GTraductions.getValeur("actualites.Edition.ColonneNom")
          : GTraductions.getValeur("actualites.Edition.ColonneDest")
        : null,
    });
    let lIdPremiereColonneScrollable = null;
    if (this.avecSeparationNomPrenom) {
      lColonnes.push({
        id: DonneesListe_ResultatsActualite.colonnes.prenom,
        genreColonne: DonneesListe_ResultatsActualite.colonnes.prenom,
        taille: IE.estMobile ? "100%" : "14rem",
        titre: this._options.avecBarreTitre
          ? GTraductions.getValeur("actualites.Edition.ColonnePrenom")
          : null,
      });
    }
    if (!IE.estMobile && _avecColonneClasse.call(this)) {
      lColonnes.push({
        id: DonneesListe_ResultatsActualite.colonnes.classe,
        genreColonne: DonneesListe_ResultatsActualite.colonnes.classe,
        taille: "10rem",
        titre: this._options.avecBarreTitre
          ? GTraductions.getValeur("actualites.Classe")
          : null,
      });
    }
    const lAvecGenreReponse =
      this.question.genreReponse !== undefined &&
      this.question.genreReponse !== null;
    let lTitre = "";
    if (this.questionsSelectionnees.length > 0) {
      const lAvecMultiSelection = this.questionsSelectionnees.length > 1;
      for (let i = 0; i < this.questionsSelectionnees.length; i++) {
        const lQuestion = this.questionsSelectionnees[i].article;
        if (lQuestion) {
          const lFusionColonne = lAvecMultiSelection
            ? {
                libelle: lQuestion.getLibelle(),
                titleHtml: lQuestion.texte,
                avecFusionColonne: true,
              }
            : "";
          if (
            (lAvecGenreReponse &&
              this.utilitaires.genreReponse.estGenreAvecAR(
                lQuestion.genreReponse,
              )) ||
            lQuestion.avecAR
          ) {
            lTitre = GTraductions.getValeur("actualites.Edition.ColonneARRecu");
          } else if (
            lAvecGenreReponse &&
            this.utilitaires.genreReponse.estGenreTextuelle(
              lQuestion.genreReponse,
            )
          ) {
            lTitre = GTraductions.getValeur(
              "actualites.Edition.ColonneReponse",
            );
          } else if (
            lAvecGenreReponse &&
            (this.utilitaires.genreReponse.estGenreChoixUnique(
              lQuestion.genreReponse,
            ) ||
              this.utilitaires.genreReponse.estGenreChoixMultiple(
                lQuestion.genreReponse,
              ))
          ) {
            lTitre = GTraductions.getValeur(
              "actualites.Edition.ColonneRepondu",
            );
          } else {
          }
          const lIdColonne =
            DonneesListe_ResultatsActualite.colonnes.reponse + "_" + i;
          let lColonneTitre = lAvecMultiSelection
            ? [lFusionColonne, lTitre]
            : lTitre;
          lColonnes.push({
            id: lIdColonne,
            genreColonne: DonneesListe_ResultatsActualite.colonnes.reponse,
            numeroQuestion: lQuestion.getNumero(),
            taille: "5rem",
            titre: this._options.avecBarreTitre ? lColonneTitre : null,
          });
          if (lIdPremiereColonneScrollable === null) {
            lIdPremiereColonneScrollable = lIdColonne;
          }
          if (
            lAvecGenreReponse &&
            (this.utilitaires.genreReponse.estGenreChoixUnique(
              lQuestion.genreReponse,
            ) ||
              this.utilitaires.genreReponse.estGenreChoixMultiple(
                lQuestion.genreReponse,
              ))
          ) {
            let j = 0;
            const lInstance = this;
            lQuestion.listeChoix.parcourir((aChoix) => {
              lColonneTitre = lAvecMultiSelection
                ? [lFusionColonne, aChoix.getLibelle()]
                : aChoix.getLibelle();
              lColonnes.push({
                id:
                  DonneesListe_ResultatsActualite.colonnes.choix +
                  "_" +
                  aChoix.getNumero(),
                numeroChoix: j,
                genreColonne: DonneesListe_ResultatsActualite.colonnes.choix,
                estChoixAutre: !!aChoix.estReponseLibre,
                numeroQuestion: lQuestion.getNumero(),
                taille: "5rem",
                titre: lInstance._options.avecBarreTitre ? lColonneTitre : null,
              });
              j++;
            });
          }
        }
      }
    }
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      boutons: [{ genre: ObjetListe.typeBouton.deployer }],
      nonEditable: false,
      avecCelluleEditableTriangle: false,
      scrollHorizontal:
        lIdPremiereColonneScrollable ||
        DonneesListe_ResultatsActualite.colonnes.destinataires,
    });
  }
  recupererDonnees() {}
  construireAffichage() {
    return tag(
      "div",
      {
        class: ["flex-contain", "flex-cols", "flex-gap"],
        style: ["height:100%"],
      },
      () => {
        const H = [];
        if (!IE.estMobile) {
          H.push(
            tag(
              "div",
              { class: ["flex-contain", "flex-gap-l"] },
              tag("ie-combo", { "ie-model": "comboFiltreSelonRepondus" }),
              tag(
                "ie-checkbox",
                { "ie-model": "cbAfficherNbReponses" },
                GTraductions.getValeur("actualites.Edition.AvecNombreRepondu"),
              ),
            ),
          );
          H.push(
            "<div>",
            '<ie-checkbox ie-model="cbAvecCumulParClasses"></ie-checkbox>',
            "</div>",
          );
          H.push(
            '<div class="Texte10" id="',
            this.idLibelleAnonyme,
            '"></div>',
          );
        }
        H.push(
          tag(
            "div",
            { class: ["flex-contain", "fluid-bloc"] },
            tag("div", { id: this.idListeQuestions }),
            tag("div", { class: ["fluid-bloc"] }, () => {
              const T = [];
              T.push(
                '<table class="full-size">',
                '<tr class="',
                this.classVisuQuestion,
                '"><td class="full-width"><div id="',
                this.idVisuQuestion,
                '" class="Bordure MargeBas" style="margin-right:',
                GNavigateur.getLargeurBarreDeScroll
                  ? GNavigateur.getLargeurBarreDeScroll()
                  : 10,
                'px; box-sizing: border-box;"></div></td></tr>',
                '<tr><td class="full-size"><div id="',
                this.idListeResultats,
                '" class="full-size"></div></td></tr>',
                "</table>",
              );
              return T.join("");
            }),
          ),
        );
        return H.join("");
      },
    );
  }
  actualiserListe() {
    if (this.actualite === null || this.actualite === undefined) {
      return;
    }
    if (this.estUnSondage() && this.questionsSelectionnees.length === 1) {
      $("." + this.classVisuQuestion.escapeJQ()).show();
    } else {
      $("." + this.classVisuQuestion.escapeJQ()).hide();
    }
    this.avecSeparationNomPrenom = this._options.avecSeparationNomPrenom;
    if (
      this._options.avecSeparationNomPrenom &&
      this.actualite &&
      !!this.actualite.reponseAnonyme
    ) {
      this.avecSeparationNomPrenom = false;
    }
    this.initialiserListeReponses(this.listeResultats);
    if (this.estUnSondage()) {
      const lHtml = [];
      lHtml.push(
        '<div ie-scrollv ie-scrollreservation style="max-height: 250px;"><div class="Espace">',
      );
      lHtml.push(
        this.moteur.composeComposanteInfoSondage({
          instance: this,
          actu: this.actualite,
          composante: this.question,
          indice: 0,
          avecLibelleQuestion: false,
          estAffEditionActualite: true,
        }),
      );
      lHtml.push("</div></div>");
      GHtml.setHtml(this.idVisuQuestion, lHtml.join(""), {
        controleur: this.controleur,
      });
    }
    _visibiliteQuestions.call(this);
    this.listeResultats.setDonnees(
      new DonneesListe_ResultatsActualite(
        {
          donnees: _formatDonnees.call(this),
          pere: this,
          evenement: this.evenementMenuContextuelListe,
          genre: this.question.genreReponse,
          niveauMaxCumul: this.question.niveauMaxCumul,
          filtreRepondu: this.filtreRepondu,
          avecNombreReponses: this.avecNombreReponses,
          avecCommandeRenvoyerNotfication:
            _avecCommandeRenvoyerNotfication.call(this, this.actualite),
          avecSeparationNomPrenom: this.avecSeparationNomPrenom,
        },
        { genreReponse: this.utilitaires.genreReponse },
      ),
    );
  }
  _eventListeQuestions(aParametres) {
    if (aParametres.genreEvenement === EGenreEvenementListe.Selection) {
      this.questionsSelectionnees =
        aParametres.instance.getTableauCellulesSelection();
      this.question = this.actualite.listeQuestions.getElementParNumero(
        aParametres.article.getNumero(),
      );
      this.actualiserListe();
    }
  }
  evenementMenuContextuelListe(aCommande, aElement) {
    if (
      aCommande === DonneesListe_ResultatsActualite.genreCommande.graphique ||
      aCommande === DonneesListe_ResultatsActualite.genreCommande.graphiqueTotal
    ) {
      let lElement;
      if (
        aCommande === DonneesListe_ResultatsActualite.genreCommande.graphique
      ) {
        lElement = aElement;
      } else {
        lElement = new ObjetElement();
        lElement.valeurCumul = [];
        lElement.nbRecue = 0;
        lElement.nbAttendue = 0;
        for (
          let i = 0;
          i < this.question.resultats.listeRepondant.count();
          i++
        ) {
          const lEle = this.question.resultats.listeRepondant.get(i);
          if (lEle.estCumul && !lEle.pere) {
            lElement.nbAttendue += lEle.nbAttendue;
            lElement.nbRecue += lEle.nbRecue;
            for (let j = 0; j < lEle.valeurCumul.length; j++) {
              if (lElement.valeurCumul[j]) {
                lElement.valeurCumul[j] += lEle.valeurCumul[j];
              } else {
                lElement.valeurCumul[j] = lEle.valeurCumul[j];
              }
            }
          }
        }
      }
      const lNbColonnes =
        (this.utilitaires.genreReponse.estGenreChoixUnique(
          this.question.genreReponse,
        ) ||
        this.utilitaires.genreReponse.estGenreChoixMultiple(
          this.question.genreReponse,
        )
          ? this.question.listeChoix.count()
          : 1) + 1;
      const lLargeurColonne = Math.floor(100 / lNbColonnes) + "%";
      let lMaxAbscisse = lElement.nbAttendue;
      while (lMaxAbscisse % 5 !== 0 && (lMaxAbscisse / 5) % 5 !== 0) {
        lMaxAbscisse += 1;
      }
      const lHtmlBarres = [],
        lHtmlAbscisses = [];
      if (
        this.utilitaires.genreReponse.estGenreChoixUnique(
          this.question.genreReponse,
        ) ||
        this.utilitaires.genreReponse.estGenreChoixMultiple(
          this.question.genreReponse,
        )
      ) {
        for (let i = 0; i < this.question.listeChoix.count(); i++) {
          lHtmlAbscisses.push(
            '<div style="width:' +
              lLargeurColonne +
              ';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
              this.question.listeChoix.get(i).getLibelle() +
              "</div>",
          );
          lHtmlBarres.push(
            '<div style="width:' +
              lLargeurColonne +
              ';height:100%;position:relative;" class="Texte10 InlineBlock">',
            '<div class="objetResultatsActualiteBarreGraph" data-libelle="',
            this.question.listeChoix.get(i).getLibelle(),
            '" data-valeur="',
            lElement.valeurCumul[i + 1],
            '" data-hauteur="',
            Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse),
            '" style="position:absolute;left:10%;right:10%;bottom:0;height:',
            Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse),
            '%;background-color:#c8c8c8;"></div>',
            '<div style="position:absolute;left:10%;right:10%;bottom:',
            Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse) + 1,
            '%;text-align:center;">',
            lElement.valeurCumul[i + 1],
            "</div>",
            "</div>",
          );
        }
      } else {
        lHtmlAbscisses.push(
          '<div style="width:' +
            lLargeurColonne +
            ';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
            GTraductions.getValeur("actualites.Edition.ColonneRepondu") +
            "</div>",
        );
        lHtmlBarres.push(
          '<div style="width:' +
            lLargeurColonne +
            ';height:100%;position:relative;" class="Texte10 InlineBlock">',
          '<div class="objetResultatsActualiteBarreGraph" data-libelle="',
          GTraductions.getValeur("actualites.Edition.ColonneRepondu"),
          '" data-valeur="',
          lElement.nbRecue,
          '" data-hauteur="',
          Math.round((100 * lElement.nbRecue) / lMaxAbscisse),
          '" style="position:absolute;left:10%;right:10%;bottom:0;height:',
          Math.round((100 * lElement.nbRecue) / lMaxAbscisse),
          '%;background-color:#c8c8c8;"></div>',
          '<div style="position:absolute;left:10%;right:10%;bottom:',
          Math.round((100 * lElement.nbRecue) / lMaxAbscisse) + 1,
          '%;text-align:center;">',
          lElement.nbRecue,
          "</div>",
          "</div>",
        );
      }
      lHtmlAbscisses.push(
        '<div style="width:' +
          lLargeurColonne +
          ';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
          GTraductions.getValeur("actualites.Edition.ColonneNonRepondu") +
          "</div>",
      );
      lHtmlBarres.push(
        '<div style="width:' +
          lLargeurColonne +
          ';height:100%;position:relative;" class="Texte10 InlineBlock">',
        '<div class="objetResultatsActualiteBarreGraph" data-libelle="',
        GTraductions.getValeur("actualites.Edition.ColonneNonRepondu"),
        '" data-valeur="',
        lElement.nbAttendue - lElement.nbRecue,
        '" data-hauteur="',
        Math.round(
          (100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
        ),
        '" style="position:absolute;left:10%;right:10%;bottom:0;height:',
        Math.round(
          (100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
        ),
        '%;background-color:#c8c8c8;"></div>',
        '<div style="position:absolute;left:10%;right:10%;bottom:',
        Math.round(
          (100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
        ) + 1,
        '%;text-align:center;">',
        lElement.nbAttendue - lElement.nbRecue,
        "</div>",
        "</div>",
      );
      const lHtml = [
        '<div style="position:relative;width:100%;height:95%;margin-top:5%;">',
        '<div style="position:absolute;top:0;left:20px;right:0;bottom:20px;background-color:#fff;">',
        '<div style="position:absolute;top:0;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
        '<div style="position:absolute;top:20%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
        '<div style="position:absolute;top:40%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
        '<div style="position:absolute;top:60%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
        '<div style="position:absolute;top:80%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
        lHtmlBarres.join(""),
        "</div>",
        '<div class="Texte10" style="position:absolute;top:0;left:0;width:19px;border-right:#000 1px solid;bottom:20px;">',
        '<div style="position:absolute;top:0;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse,
        "</div></div>",
        '<div style="position:absolute;top:20%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse * 0.8,
        "</div></div>",
        '<div style="position:absolute;top:40%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse * 0.6,
        "</div></div>",
        '<div style="position:absolute;top:60%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse * 0.4,
        "</div></div>",
        '<div style="position:absolute;top:80%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse * 0.2,
        "</div></div>",
        '<div style="position:absolute;top:100%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
        lMaxAbscisse * 0,
        "</div></div>",
        "</div>",
        '<div style="position:absolute;height:19px;border-top:#000 1px solid;left:20px;right:0;bottom:0;">',
        lHtmlAbscisses.join(""),
        "</div>",
        "</div>",
      ];
      if (this.objetFenetreGraph.EnAffichage) {
        this.objetFenetreGraph.fermer();
      }
      this.objetFenetreGraph.afficher(lHtml.join(""));
      $(".objetResultatsActualiteBarreGraph")
        .height("0%")
        .on("mousemove", function () {
          ObjetHint.start(
            "<strong>" +
              $(this).attr("data-libelle") +
              "</strong><br />" +
              $(this).attr("data-valeur"),
            { sansDelai: true },
          );
          $(this).css({ border: "#000 1px solid", borderBottom: "0px" });
        })
        .on("mouseleave", function () {
          ObjetHint.stop();
          $(this).css({ border: "0px" });
        })
        .each(function () {
          $(this)
            .delay(250)
            .animate({ height: $(this).attr("data-hauteur") + "%" }, 250);
        });
      let lTitreFenetre;
      if (
        aCommande === DonneesListe_ResultatsActualite.genreCommande.graphique
      ) {
        lTitreFenetre = GTraductions.getValeur(
          "actualites.Edition.TitreGrapheCumul",
          [lElement.getLibelle()],
        );
      } else {
        lTitreFenetre = GTraductions.getValeur(
          "actualites.Edition.TitreGrapheTotal",
        );
      }
      this.objetFenetreGraph.setOptionsFenetre({ titre: lTitreFenetre });
    } else if (
      aCommande ===
      DonneesListe_ResultatsActualite.genreCommande.renvoyerNotification
    ) {
      this.callback.appel(TypeEvenementCallback.RenvoyerNotification, {
        actualite: this.actualite,
        participantSelectionne: aElement,
      });
    }
  }
}
function _getIndiceDeQuestionsConcernees(aActualite, aQuestionRecherchee) {
  let lIndiceTrouve = -1;
  const lListeQuestionsConcernees = _getListeQuestionsConcernees.call(
    this,
    aActualite,
  );
  if (lListeQuestionsConcernees) {
    lIndiceTrouve =
      lListeQuestionsConcernees.getIndiceParElement(aQuestionRecherchee);
  }
  return lIndiceTrouve;
}
function _getListeQuestionsConcernees(aActualite) {
  let lListeQuestions = new ObjetListeElements();
  if (!!aActualite && !!aActualite.listeQuestions) {
    lListeQuestions = aActualite.listeQuestions.getListeElements((D) => {
      if (this.utilitaires.genreReponse.estGenreSansReponse(D.genreReponse)) {
        return false;
      }
      return true;
    });
  }
  return lListeQuestions;
}
function _visibiliteQuestions() {
  const lListeQuestionsActu = _getListeQuestionsConcernees.call(
    this,
    this.actualite,
  );
  if (lListeQuestionsActu.getNbrElementsExistes() > 1) {
    $("#" + this.idListeQuestions.escapeJQ()).show();
    this.objetListeQuestions.actualiser(true);
  } else {
    $("#" + this.idListeQuestions.escapeJQ()).hide();
  }
}
function _miseAJourLibelleAnonyme() {
  let lLibelle = "";
  if (this.estUnSondage()) {
    lLibelle = this.actualite.reponseAnonyme
      ? GTraductions.getValeur("actualites.InfoAnonyme")
      : GTraductions.getValeur("actualites.InfoNominatif");
  }
  GHtml.setHtml(this.idLibelleAnonyme, lLibelle);
  if (this.estUnSondage()) {
    $("#" + this.idLibelleAnonyme.escapeJQ()).show();
  } else {
    $("#" + this.idLibelleAnonyme.escapeJQ()).hide();
  }
}
function _avecColonneClasse() {
  let lAvecClasse = false;
  if (!this.estUnSondageAnonyme()) {
    if (this.questionsSelectionnees && this.questionsSelectionnees.length > 0) {
      for (let i = 0; i < this.questionsSelectionnees.length; i++) {
        const lQuestion = this.questionsSelectionnees[i];
        if (
          !!lQuestion.article &&
          !!lQuestion.article.resultats &&
          !!lQuestion.article.resultats.listeRepondant
        ) {
          lQuestion.article.resultats.listeRepondant.parcourir((aRepondant) => {
            if (!!aRepondant.libelleClasse && aRepondant.libelleClasse !== "") {
              lAvecClasse = true;
            }
          });
        }
      }
    }
  }
  return lAvecClasse;
}
function _formatDonnees() {
  const lListe = new ObjetListeElements();
  if (this.questionsSelectionnees.length === 0) {
    return lListe;
  }
  for (let i = 0; i < this.questionsSelectionnees.length; i++) {
    const lQuestion = this.questionsSelectionnees[i];
    if (!!lQuestion && !!lQuestion.article.resultats) {
      lQuestion.article.resultats.listeRepondant.parcourir((aRepondant) => {
        const lReponse = new ObjetElement(
          lQuestion.article.getLibelle(),
          lQuestion.article.getNumero(),
          lQuestion.article.genreReponse,
        );
        lReponse.nbRecue = aRepondant.nbRecue;
        lReponse.nbAttendue = aRepondant.nbAttendue;
        lReponse.pourcentageRecue = aRepondant.pourcentageRecue;
        lReponse.texteReponse = aRepondant.texteReponse;
        lReponse.repondu = aRepondant.repondu;
        lReponse.domaineReponse = aRepondant.domaineReponse;
        lReponse.valeurCumul = aRepondant.valeurCumul;
        lReponse.percentCumul = aRepondant.percentCumul;
        const lElement = lListe.get(
          lListe.getIndiceElementParFiltre((aElement) => {
            return (
              aElement.NumeroArticleLigne === aRepondant.NumeroArticleLigne
            );
          }),
        );
        if (!!lElement) {
          lElement.listeReponses.add(lReponse);
        } else {
          aRepondant.listeReponses = new ObjetListeElements();
          aRepondant.listeReponses.add(lReponse);
          lListe.add(aRepondant);
        }
      });
    }
  }
  return lListe;
}
function _avecCommandeRenvoyerNotfication(aActualite) {
  return (
    !IE.estMobile &&
    this._options.avecNotificationRelance &&
    aActualite.nbIndividusSansReponses > 0 &&
    aActualite.pourcentRepondu < 100 &&
    aActualite.publie &&
    (GDate.estAvantJourCourant(aActualite.dateDebut) ||
      GDate.estJourCourant(aActualite.dateDebut)) &&
    !GDate.estAvantJourCourant(aActualite.dateFin)
  );
}
module.exports = { ObjetResultatsActualite, TypeEvenementCallback };
