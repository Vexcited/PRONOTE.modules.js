exports.UtilitaireQCM = void 0;
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const TypeNumerotation_1 = require("TypeNumerotation");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const TypeGenreAssociationQuestionQCM_1 = require("TypeGenreAssociationQuestionQCM");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const ObjetDate_1 = require("ObjetDate");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetTri_1 = require("ObjetTri");
const MethodesObjet_1 = require("MethodesObjet");
const ComparateurChaines_1 = require("ComparateurChaines");
exports.UtilitaireQCM = {
  dessineIconeCategorieQCM(aCouleur, aAbbr) {
    const lCouleur = aCouleur || "#000";
    const lStyleCarre = [""];
    lStyleCarre.push("background-color:", lCouleur, ";");
    lStyleCarre.push(
      "color:",
      GCouleur.getCouleurCorrespondance(lCouleur),
      ";",
    );
    const H = [];
    H.push(
      '<span class="carre-color" style="',
      lStyleCarre.join(""),
      '">',
      aAbbr || "&nbsp;",
      "</span>",
    );
    return H.join("");
  },
  initHeureDebutEtFin(aDate) {
    const lResult = { dateDebut: aDate, dateFin: aDate };
    try {
      const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
      const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
        GParametres.PlacesParJour - 1,
        true,
      );
      lResult.dateDebut = new Date(
        aDate.setHours(lPremiereHeure.getHours(), lPremiereHeure.getMinutes()),
      );
      lResult.dateFin = new Date(
        aDate.setHours(lDerniereHeure.getHours(), lDerniereHeure.getMinutes()),
      );
    } catch (e) {}
    return lResult;
  },
  initFenetreSelectionQCM(aInstance) {
    aInstance.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "FenetreDevoir.SelectionnerUnQCM",
      ),
      largeur: 500,
      hauteur: 600,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  },
  surSelectionQCM(aObj, aEltQCM, aParam) {
    if (aEltQCM.getGenre() === aParam.genreAucune) {
      aObj.executionQCM = new ObjetElement_1.ObjetElement();
    } else {
      const lEstExecQCM = aEltQCM.getGenre() === aParam.genreExecQCM;
      if (lEstExecQCM) {
        aObj.executionQCM = aEltQCM;
      } else {
        if (!aObj.executionQCM) {
          aObj.executionQCM = new ObjetElement_1.ObjetElement(
            null,
            null,
            aParam.genreExecQCM,
          );
        }
      }
      if (lEstExecQCM === true) {
        aObj.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      } else {
        aObj.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
      }
      $.extend(aObj.executionQCM, {
        autoriserLaNavigation: aEltQCM.autoriserLaNavigation,
        homogeneiserNbQuestParNiveau: aEltQCM.homogeneiserNbQuestParNiveau,
        jeuQuestionFixe: aEltQCM.jeuQuestionFixe,
        melangerLesQuestionsGlobalement:
          aEltQCM.melangerLesQuestionsGlobalement,
        melangerLesQuestionsParNiveau: aEltQCM.melangerLesQuestionsParNiveau,
        melangerLesReponses: aEltQCM.melangerLesReponses,
        modeDiffusionCorrige: aEltQCM.modeDiffusionCorrige,
        nombreQuestionsSoumises: aEltQCM.nombreQuestionsSoumises,
        dureeMaxQCM: aEltQCM.dureeMaxQCM,
        nbMaxTentative: aEltQCM.nbMaxTentative,
        dureeSupplementaire: aEltQCM.dureeSupplementaire,
        nombreQuestionsEnMoins: aEltQCM.nombreQuestionsEnMoins,
        ressentiRepondant: aEltQCM.ressentiRepondant,
        tolererFausses: aEltQCM.tolererFausses,
        acceptIncomplet: aEltQCM.acceptIncomplet,
        consigne: aEltQCM.consigne,
      });
      $.extend(true, aObj.executionQCM, {
        QCM: lEstExecQCM ? aEltQCM.QCM : aEltQCM,
        avecParamModifiables: true,
      });
    }
  },
  composeHintDeQuestionQCM(aThis, aIndexQuestion, aQuestion, aOptions) {
    const lOptions = Object.assign(
      {
        avecAffichageInfosCompetences: false,
        avecAffichageBareme: true,
        typeNumerotationQCM: TypeNumerotation_1.TypeNumerotation.n123,
      },
      aOptions,
    );
    const lAvecInfosCompetences =
      lOptions.avecAffichageInfosCompetences && !!aQuestion.infoCompetences;
    let lHtml = [];
    lHtml.push('<article class="hint-wrapper">');
    lHtml.push("<header>");
    lHtml.push('<div class="icon-contain">');
    lHtml.push('<div class="Image_DeploiementListe_Deploye"></div>');
    if (aQuestion.editeur && aQuestion.editeur.existeNumero()) {
      lHtml.push('<span class="Image_QCM_IconeNathan"></span>');
    }
    lHtml.push("</div>");
    lHtml.push(
      '<span class="semi-bold">',
      ObjetTraduction_1.GTraductions.getValeur("QCM.QuestionLibelle"),
      " ",
      exports.UtilitaireQCM.composeNumerotation(
        lOptions.typeNumerotationQCM,
        aIndexQuestion + 1,
      ),
      "</span>",
    );
    let lMaxWidth =
      ObjetPosition_1.GPosition.getWidth(aThis.getNom()) - 100 - 20;
    lHtml.push('<ul class="libelles-contain">');
    if (lOptions.avecAffichageBareme) {
      lHtml.push(
        "<li>",
        ObjetTraduction_1.GTraductions.getValeur("QCM.BaremePts", [
          aQuestion.note,
        ]),
        "</li>",
      );
      lMaxWidth = lMaxWidth - 20 - 45;
    }
    const lLibelleQuestion = aQuestion.getLibelle();
    if (lLibelleQuestion) {
      lHtml.push("<li>", lLibelleQuestion, "</li>");
      lMaxWidth =
        lMaxWidth -
        20 -
        16 -
        ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
          lLibelleQuestion,
          10,
          false,
          true,
        );
    }
    if (lAvecInfosCompetences) {
      lMaxWidth = Math.max(lMaxWidth - 16, 100);
      lHtml.push(
        '<li style=" max-width:' + lMaxWidth + 'px;" ie-ellipsis>',
        aQuestion.infoCompetences,
        "</li>",
      );
    }
    lHtml.push("</ul>");
    lHtml.push(
      '<div class="ico ',
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
        aQuestion.getGenre(),
      ),
      '"></div>',
    );
    lHtml.push("</header>");
    lHtml.push('<div class="PageCorrigeQuestion" >');
    if (lAvecInfosCompetences) {
      lHtml.push('<div class="info-competences" style="width:60%;">');
    }
    const lEnonce = exports.UtilitaireQCM.composeEnonce(aQuestion);
    if (!!lEnonce) {
      lHtml.push('<div class="enonce tiny-view">', lEnonce, "</div>");
    }
    if (aQuestion.image && aQuestion.image !== "") {
      lHtml.push(
        '<div class="media-contain"><img src="data:image/png;base64,' +
          aQuestion.image +
          '" onerror="$(this).parent().html(GTraductions.getValeur(\'ExecutionQCM.ImageNonSupportee\'));" /></div>',
      );
    }
    if (
      aQuestion.mp3name &&
      aQuestion.mp3name !== "" &&
      aQuestion.mp3 &&
      aQuestion.mp3 !== ""
    ) {
      lHtml.push(
        UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
          base64Audio: aQuestion.mp3,
          libelle: aQuestion.mp3name,
          classes: ["media-contain"],
        }),
      );
    }
    if (aQuestion.url && aQuestion.url !== "") {
      lHtml.push(
        '<div class="media-contain"><ie-chips href="',
        aQuestion.url,
        '" target="_blank" class="iconic icon_info_sondage_publier">',
        aQuestion.url,
        "</ie-chips></div>",
      );
    }
    lHtml.push('<div class="zone-reponse">');
    lHtml.push(
      exports.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
        aQuestion,
        aIndexQuestion,
      ),
    );
    lHtml.push("</div>");
    if (aQuestion.editeur && aQuestion.editeur.existeNumero()) {
      lHtml.push(
        '<div class="partner-wrapper">',
        ObjetTraduction_1.GTraductions.getValeur(
          "ExecutionQCM.CopyRightEditeur2013",
          [aQuestion.editeur.getLibelle()],
        ),
        "</div>",
      );
    }
    if (lAvecInfosCompetences) {
      lHtml.push("</div>");
      lHtml.push(
        '<div class="InlineBlock AlignementHaut" style="width:40%;display:none;">',
      );
      if (
        aQuestion.listeEvaluations &&
        aQuestion.listeEvaluations.count() > 0
      ) {
        lHtml.push(
          '<ul style="margin:0;padding:0;list-style-type:disc;list-style-position:outside;">',
        );
        for (let i = 0; i < aQuestion.listeEvaluations.count(); i++) {
          const lCompetence = aQuestion.listeEvaluations.get(i);
          const lCodeCompetences = !!lCompetence.codeAvecPrefixe
            ? lCompetence.codeAvecPrefixe
            : "";
          lHtml.push(
            "<li>",
            lCompetence.getLibelle(),
            !!lCodeCompetences ? " [" + lCodeCompetences + "]" : "",
            "</li>",
          );
        }
        lHtml.push("</ul>");
      }
      lHtml.push("</div>");
    }
    lHtml.push("</div>");
    lHtml.push("</article>");
    return lHtml.join("");
  },
  composeHintReponsesEleveDeQuestionQCM(
    aIndexQuestion,
    aQuestion,
    aReponseEleve,
    aOptions,
  ) {
    const lOptions = Object.assign(
      {
        typeNumerotationQCM: TypeNumerotation_1.TypeNumerotation.n123,
        avecAffichageNote: true,
        avecAffichageInfosCompetences: false,
      },
      aOptions,
    );
    const lQuestion = MethodesObjet_1.MethodesObjet.dupliquer(aQuestion);
    if (!!lQuestion.listeReponses && lQuestion.listeReponses.count() > 0) {
      lQuestion.listeReponses.parcourir((D, aIndice) => {
        if (!!aReponseEleve.ordreReponsesCopieEleve) {
          D.Position = aReponseEleve.ordreReponsesCopieEleve.indexOf(aIndice);
        }
      });
      lQuestion.listeReponses.setTri([ObjetTri_1.ObjetTri.init("Position")]);
      lQuestion.listeReponses.trier();
    }
    const lAvecInfosCompetences =
      lOptions.avecAffichageInfosCompetences && !!lQuestion.infoCompetences;
    const lEnonceQuestion = exports.UtilitaireQCM.composeEnonce(lQuestion);
    const lHtml = [];
    lHtml.push('<article class="hint-wrapper">');
    lHtml.push("<header>");
    lHtml.push(
      '<span class="semi-bold">',
      ObjetTraduction_1.GTraductions.getValeur("QCM.QuestionLibelle"),
      " ",
      exports.UtilitaireQCM.composeNumerotation(
        lOptions.typeNumerotationQCM,
        aIndexQuestion + 1,
      ),
      "</span>",
    );
    if (lQuestion.getLibelle()) {
      lHtml.push("<p>", lQuestion.getLibelle(), "</p>");
    }
    if (lOptions.avecAffichageNote) {
      lHtml.push(
        '<span class="score">',
        aReponseEleve.note || 0,
        " / ",
        ObjetTraduction_1.GTraductions.getValeur("QCM.BaremePts", [
          lQuestion.note,
        ]),
        "</span>",
      );
    }
    if (lAvecInfosCompetences) {
      lHtml.push("<span ie-ellipsis>", lQuestion.infoCompetences, "</span>");
    }
    lHtml.push(
      '<div class="ico ',
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
        lQuestion.getGenre(),
      ),
      '"></div>',
    );
    lHtml.push("</header>");
    lHtml.push('<div class="PageCorrigeQuestion">');
    if (!!lEnonceQuestion) {
      lHtml.push('<div class="enonce tiny-view">', lEnonceQuestion, "</div>");
    }
    if (aQuestion.image && aQuestion.image !== "") {
      lHtml.push(
        '<div class="media-contain"><img src="data:image/png;base64,',
        aQuestion.image,
        '" onerror="$(this).parent().html(GTraductions.getValeur(\'ExecutionQCM.ImageNonSupportee\'));" /></div>',
      );
    }
    lHtml.push(
      '<div class="zone-reponse">',
      exports.UtilitaireQCM.composeReponsesFaitesEleve(
        lQuestion,
        aIndexQuestion,
        aReponseEleve.reponsesFaites,
      ),
      "</div>",
    );
    lHtml.push("</div>");
    lHtml.push("</article>");
    return lHtml.join("");
  },
  estReponsesSingleMultiAvecMiseEnForme(aQuestion) {
    let lAvecReponsesMisesEnForme = false;
    if (!!aQuestion.listeReponses) {
      for (const aReponse of aQuestion.listeReponses) {
        if (aReponse.image || aReponse.editionAvancee) {
          lAvecReponsesMisesEnForme = true;
          break;
        }
      }
    }
    return lAvecReponsesMisesEnForme;
  },
  composeEnonce(aQuestion) {
    let lArrayEnonceQuestion = [];
    if (aQuestion) {
      const lEstUneQuestionCloze =
        aQuestion.getGenre() ===
          TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
            .GEQ_ClozeField ||
        aQuestion.getGenre() ===
          TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
            .GEQ_ClozeFixed ||
        aQuestion.getGenre() ===
          TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
            .GEQ_ClozeVariable;
      if (!lEstUneQuestionCloze) {
        lArrayEnonceQuestion.push(aQuestion.enonce);
      }
    }
    return lArrayEnonceQuestion.join("");
  },
  composeReponsesCorrigeesDeQuestion(
    aQuestion,
    aIndiceQuestion,
    aParametresSupplementaires,
    aEvaluationNote,
  ) {
    let lHtml = [];
    if (
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_SingleChoice ||
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_MultiChoice
    ) {
      lHtml.push(
        exports.UtilitaireQCM._composeReponsesCorrigeesDeQuestionSingleOuMulti(
          aQuestion,
          aIndiceQuestion,
          aParametresSupplementaires,
          aEvaluationNote,
        ),
      );
    } else if (
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ShortAnswer ||
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_NumericalAnswer
    ) {
      lHtml.push(
        exports.UtilitaireQCM._composeReponsesCorrigeesDeQuestionShortOuNumeric(
          aQuestion,
          aIndiceQuestion,
          aEvaluationNote,
        ),
      );
    } else if (
      aQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_SpellAnswer
    ) {
      lHtml.push(
        exports.UtilitaireQCM._composeReponsesCorrigeesDeQuestionSpell(
          aQuestion,
          aIndiceQuestion,
          aEvaluationNote,
        ),
      );
    } else if (
      aQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_Matching
    ) {
      lHtml.push(
        '<div class="association-wrapper corrige">',
        exports.UtilitaireQCM._composeReponsesCorrigeesDeQuestionMatching(
          aQuestion,
          aIndiceQuestion,
          aParametresSupplementaires,
          aEvaluationNote,
        ),
        "</div>",
      );
    } else if (
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeField ||
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeFixed ||
      aQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeVariable
    ) {
      lHtml.push(
        exports.UtilitaireQCM._composeReponsesCorrigeesDeQuestionCloze(
          aQuestion,
          aIndiceQuestion,
          aEvaluationNote,
        ),
      );
    }
    if (lHtml.length > 0) {
      lHtml.unshift('<div class="wrapperQuestionQCM">');
      lHtml.push("</div>");
    }
    return lHtml.join("");
  },
  _composeReponsesCorrigeesDeQuestionSingleOuMulti(
    aQuestion,
    aIndiceQuestion,
    aParametresSupplementaires,
    aEvaluationNote,
  ) {
    const lEstQuestionAChoixUnique =
      aQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_SingleChoice;
    const lFnEstUneBonneReponse = function (aReponse) {
      return lEstQuestionAChoixUnique
        ? aReponse.fractionReponse === 100
        : aReponse.fractionReponse > 0;
    };
    const lFnEstUneReponseCocheeParRepondant = function (
      aQuestion,
      aIndexReponse,
    ) {
      if (aQuestion.reponsesRepondant) {
        for (const x in aQuestion.reponsesRepondant) {
          if (aQuestion.reponsesRepondant[x] !== "") {
            if (
              parseInt(aQuestion.reponsesRepondant[x]) - 1 ===
              aIndexReponse
            ) {
              return true;
            }
          }
        }
      }
      return false;
    };
    const lEvaluationNotePourQuestion = {
      validee: true,
      nbBonnesReponses: aQuestion.listeReponses
        .getListeElements((aReponse) => {
          return lFnEstUneBonneReponse(aReponse);
        })
        .count(),
      nbReponsesJustes: 0,
      question: aQuestion,
    };
    let lForcerFaux = false;
    for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
      const lEstCochee = lFnEstUneReponseCocheeParRepondant(aQuestion, i);
      if (lEstCochee) {
        const lReponse = aQuestion.listeReponses.get(i);
        if (lFnEstUneBonneReponse(lReponse)) {
          lEvaluationNotePourQuestion.nbReponsesJustes += 1;
        } else {
          lForcerFaux = true;
        }
      }
    }
    if (aParametresSupplementaires) {
      if (
        !aParametresSupplementaires.acceptIncomplet &&
        lEvaluationNotePourQuestion.nbReponsesJustes !==
          lEvaluationNotePourQuestion.nbBonnesReponses
      ) {
        lEvaluationNotePourQuestion.nbReponsesJustes = 0;
      }
      if (!aParametresSupplementaires.tolererFausses && lForcerFaux) {
        lEvaluationNotePourQuestion.nbReponsesJustes = 0;
      }
    }
    if (aEvaluationNote) {
      aEvaluationNote[aIndiceQuestion] = lEvaluationNotePourQuestion;
    }
    const lEstAvecReponseMiseEnForme =
      exports.UtilitaireQCM.estReponsesSingleMultiAvecMiseEnForme(aQuestion);
    const H = [];
    H.push('<ul class="cbr-group zone-reponse">');
    for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
      const lReponse = aQuestion.listeReponses.get(i);
      if (lReponse) {
        const lEstCochee = lFnEstUneReponseCocheeParRepondant(aQuestion, i);
        const lEstUneBonneReponse = lFnEstUneBonneReponse(lReponse);
        const lClassesLabel = ["cbr-corrige"];
        if (lEstAvecReponseMiseEnForme) {
          lClassesLabel.push("mis-en-forme");
        }
        if (lEstUneBonneReponse) {
          lClassesLabel.push("is-ok");
        } else if (lEstCochee) {
          lClassesLabel.push("is-ko");
        }
        const lTypeElement = lEstQuestionAChoixUnique ? "radio" : "checkbox";
        const lLibelleReponse = !lReponse.editionAvancee
          ? lReponse.getLibelle()
          : lReponse.libelleHtml;
        const lContenuCbrVisu = [];
        if (lEstAvecReponseMiseEnForme) {
          lContenuCbrVisu.push(
            '<div class="libelle tiny-view">',
            lLibelleReponse,
            "</div>",
          );
          if (lReponse.image) {
            lContenuCbrVisu.push(
              '<div class="thumbnail"><img src="data:image/png;base64,' +
                lReponse.image +
                '" ie-imgviewer /></div>',
            );
          }
        } else {
          lContenuCbrVisu.push(lLibelleReponse);
        }
        H.push("<li>");
        H.push('<label class="', lClassesLabel.join(" "), '">');
        H.push(
          '<input type="',
          lTypeElement,
          '" disabled',
          lEstCochee ? " checked" : "",
          "/>",
        );
        H.push('<span class="cbr-visu">');
        H.push(lContenuCbrVisu.join(""));
        if (lEstCochee || lEstUneBonneReponse) {
          H.push('<i class="icon-result"></i>');
        }
        H.push("</span>");
        if (lEstCochee && !!lReponse.feedback) {
          H.push('<p class="qcm-comment">', lReponse.feedback, "</p>");
        }
        H.push("</label>");
        H.push("</li>");
      }
    }
    H.push("</ul>");
    return H.join("");
  },
  _composeReponsesCorrigeesDeQuestionShortOuNumeric(
    aQuestion,
    aIndiceQuestion,
    aEvaluationNote,
  ) {
    const lEvaluationNotePourQuestion = {
      validee: true,
      nbBonnesReponses: 1,
      nbReponsesJustes: 0,
      question: aQuestion,
    };
    let lReponseRepondant = null;
    if (aQuestion.reponsesRepondant && aQuestion.reponsesRepondant.length > 0) {
      lReponseRepondant = aQuestion.reponsesRepondant[0];
    }
    const lEstQuestionDeTypeShortAnswer =
      aQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_ShortAnswer;
    if (lReponseRepondant !== null) {
      if (!lEstQuestionDeTypeShortAnswer) {
        lReponseRepondant = lReponseRepondant.replace(/\s+/gi, "");
        lReponseRepondant = lReponseRepondant
          .replace(/\./, ",")
          .replace(/٫/gi, ",")
          .replace(/²/gi, "2")
          .replace(/³/gi, "3");
      }
    }
    const lCaseSensitive = aQuestion.casesensitive;
    const lFnEstMemeReponse = (aStrReponseQuestion, aStrReponseTestee) => {
      if (lEstQuestionDeTypeShortAnswer) {
        return _sontChainesIdentiques(
          aStrReponseQuestion,
          aStrReponseTestee,
          lCaseSensitive,
        );
      }
      return (
        ObjetChaine_1.GChaine.latinize(
          aStrReponseQuestion
            .replace(/\s+/gi, "")
            .replace(/\./, ",")
            .replace(/٫/gi, ",")
            .replace(/²/gi, "2")
            .replace(/³/gi, "3"),
        ).toLowerCase() === aStrReponseTestee
      );
    };
    const H = [];
    H.push('<ul class="zone-reponse reponse-input-wrapper">');
    let lReponseRepondantEstBonneReponse = false;
    let lFeedbackAAfficher = "";
    if (lReponseRepondant !== null) {
      if (aQuestion.listeReponses) {
        const lListeReponsesDeQuestionEgaleARepondant =
          aQuestion.listeReponses.getListeElements((aEle) => {
            return lFnEstMemeReponse(aEle.getLibelle(), lReponseRepondant);
          });
        if (lListeReponsesDeQuestionEgaleARepondant.count() > 0) {
          lReponseRepondantEstBonneReponse = true;
          lFeedbackAAfficher =
            lListeReponsesDeQuestionEgaleARepondant.get(0).feedback || "";
          lEvaluationNotePourQuestion.nbReponsesJustes = 1;
        }
      }
      if (!lReponseRepondantEstBonneReponse && !!aQuestion.incorrectFeedback) {
        lFeedbackAAfficher = aQuestion.incorrectFeedback;
      }
      const lClasseCSSReponse = lReponseRepondantEstBonneReponse
        ? "is-ok user-choix"
        : "is-ko";
      H.push("<li>");
      H.push('<div class="reponse-input ', lClasseCSSReponse, '">');
      H.push("<span>", lReponseRepondant, "</span>");
      H.push('<i class="icon-result"></i>');
      H.push("</div>");
      if (lFeedbackAAfficher) {
        H.push('<p class="qcm-comment">', lFeedbackAAfficher, "</p>");
      }
      H.push("</li>");
    }
    if (aEvaluationNote) {
      aEvaluationNote[aIndiceQuestion] = lEvaluationNotePourQuestion;
    }
    if (!lReponseRepondant || !lReponseRepondantEstBonneReponse) {
      if (aQuestion.listeReponses) {
        const lPremiereReponse = aQuestion.listeReponses.get(0);
        if (lPremiereReponse) {
          H.push("<li>");
          H.push('<div class="reponse-input is-ok">');
          H.push("<span>", lPremiereReponse.getLibelle(), "</span>");
          H.push('<i class="icon-result"></i>');
          H.push("</div>");
          H.push("</li>");
        }
      }
    }
    H.push("</ul>");
    return H.join("");
  },
  _composeReponsesCorrigeesDeQuestionSpell(
    aQuestion,
    aIndiceQuestion,
    aEvaluationNote,
  ) {
    const lEvaluationNotePourQuestion = {
      validee: true,
      nbBonnesReponses: 1,
      nbReponsesJustes: 0,
      question: aQuestion,
    };
    let lReponseRepondant = null;
    if (aQuestion.reponsesRepondant && aQuestion.reponsesRepondant.length > 0) {
      lReponseRepondant = aQuestion.reponsesRepondant[0];
      lReponseRepondant = ObjetChaine_1.GChaine.enleverEntites(
        lReponseRepondant.replace("’", "'"),
      );
    }
    const lCaseSensitive = aQuestion.casesensitive;
    const lEstBonneReponseRepondant =
      aQuestion.listeReponses
        .getListeElements((aEle) => {
          return _sontChainesIdentiques(
            ObjetChaine_1.GChaine.enleverEntites(aEle.getLibelle()) || "",
            lReponseRepondant,
            lCaseSensitive,
          );
        })
        .count() > 0;
    if (lEstBonneReponseRepondant) {
      lEvaluationNotePourQuestion.nbReponsesJustes = 1;
    }
    if (aEvaluationNote) {
      aEvaluationNote[aIndiceQuestion] = lEvaluationNotePourQuestion;
    }
    const lBonneReponse = ObjetChaine_1.GChaine.enleverEntites(
      aQuestion.listeReponses.get(0).getLibelle(),
    );
    const H = [];
    H.push('<ul class="zone-reponse">');
    if (lReponseRepondant !== null) {
      const lClasseCSSReponse = lEstBonneReponseRepondant
        ? "user-choix is-ok"
        : "is-ko";
      H.push("<li>");
      H.push(
        '<div class="reponse-input spell-contain ',
        lClasseCSSReponse,
        '">',
      );
      for (let i = 0; i < lBonneReponse.length; i++) {
        const lLettre =
          i < lReponseRepondant.length ? lReponseRepondant[i] : "";
        H.push("<span>", lLettre, "</span>");
      }
      H.push('<i class="icon-result"></i>');
      H.push("</div>");
      H.push("</li>");
    }
    if (!lEstBonneReponseRepondant) {
      H.push("<li>");
      H.push('<div class="reponse-input spell-contain is-ok">');
      for (let i = 0; i < lBonneReponse.length; i++) {
        H.push("<span>", lBonneReponse[i], "</span>");
      }
      H.push('<i class="icon-result"></i>');
      H.push("</div>");
      H.push("</li>");
    }
    H.push("</ul>");
    return H.join("");
  },
  _composeReponsesCorrigeesDeQuestionMatching(
    aQuestion,
    aIndiceQuestion,
    aParametresSupplementaires,
    aEvaluationNote,
  ) {
    const lEvaluationNotePourQuestion = {
      validee: true,
      nbBonnesReponses: aQuestion.listeReponses.count(),
      nbReponsesJustes: 0,
      question: aQuestion,
    };
    const lFnRetrouverReponseAPartirDuHash = (aQuestion, aHash) => {
      let lReponseTrouvee = null;
      for (const lReponse of aQuestion.listeReponses) {
        if (
          lReponse &&
          lReponse.associationB &&
          lReponse.associationB.hashContenu === aHash
        ) {
          lReponseTrouvee = lReponse;
          break;
        }
      }
      return lReponseTrouvee;
    };
    const lEstAvecReponsesRepondant = !!aQuestion.reponsesRepondant;
    const lHtml = [];
    for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
      const lReponse = aQuestion.listeReponses.get(i);
      if (!lReponse) {
        continue;
      }
      if (!lReponse.existe()) {
        continue;
      }
      const lBonneReponse = lReponse.bonneReponse;
      let lReponseDonnee;
      let lEstLaBonneReponse = false;
      if (lEstAvecReponsesRepondant) {
        const lHashReponseDonnee = aQuestion.reponsesRepondant[i];
        lReponseDonnee = lFnRetrouverReponseAPartirDuHash(
          aQuestion,
          lHashReponseDonnee,
        );
        if (!!lBonneReponse) {
          lEstLaBonneReponse = lHashReponseDonnee === lBonneReponse.hashContenu;
        }
        if (lEstLaBonneReponse) {
          lEvaluationNotePourQuestion.nbReponsesJustes += 1;
        }
      }
      const lIEModelAudio = aParametresSupplementaires
        ? aParametresSupplementaires.ieModelAudio
        : "";
      lHtml.push('<div class="asso-item">');
      lHtml.push(
        exports.UtilitaireQCM.getStringAffichageReponseMatching(
          lReponse.associationA,
          true,
          { indiceReponse: i, ieModelAudio: lIEModelAudio },
        ),
      );
      const lCouleurResultat = lReponseDonnee
        ? lEstLaBonneReponse
          ? "is-ok user-choix"
          : "is-ko"
        : "no-reponse";
      if (lEstAvecReponsesRepondant) {
        if (lReponseDonnee) {
          lHtml.push(
            '<div class="',
            lCouleurResultat,
            '">',
            exports.UtilitaireQCM.getStringAffichageReponseMatching(
              lReponseDonnee.associationB,
              true,
              { indiceReponse: i, ieModelAudio: lIEModelAudio },
            ),
            "</div>",
          );
        } else {
          lHtml.push(
            '<div class="',
            lCouleurResultat,
            '"><span class="asso">',
            ObjetTraduction_1.GTraductions.getValeur(
              "ExecutionQCM.Corriger.aucuneReponseDonnee",
            ),
            "</span></div>",
          );
        }
      }
      if (!lEstLaBonneReponse) {
        lHtml.push(
          '<div class="is-ok">',
          exports.UtilitaireQCM.getStringAffichageReponseMatching(
            lBonneReponse,
            true,
            { indiceReponse: i, ieModelAudio: lIEModelAudio },
          ),
          "</div>",
        );
      }
      lHtml.push("</div>");
    }
    if (aEvaluationNote) {
      aEvaluationNote[aIndiceQuestion] = lEvaluationNotePourQuestion;
    }
    return lHtml.join("");
  },
  _composeReponsesCorrigeesDeQuestionCloze(
    aQuestion,
    aIndiceQuestion,
    aEvaluationNote,
  ) {
    const lEvaluationNotePourQuestion = {
      validee: true,
      nbBonnesReponses: 0,
      nbReponsesJustes: 0,
      question: aQuestion,
    };
    const lEnonceOriginel = aQuestion.enonceOriginel || aQuestion.enonce;
    const lEnonceOriginelAvecRempApostrophe = lEnonceOriginel
      .replace(/&#039;/gi, "&apos;")
      .replace(/’/g, "'")
      .replace(/«/g, '"')
      .replace(/»/g, '"');
    const lEstQuestionCaseSensitive = aQuestion.casesensitive !== false;
    const lListeReponsesJustes = [];
    lEnonceOriginelAvecRempApostrophe.replace(
      /{[0-9]*:(ShortAnswer|MultiChoice):(~*(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)+}/gi,
      (ele) => {
        const lResponses = ele.match(
          /((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
        );
        for (const x in lResponses) {
          if (!MethodesObjet_1.MethodesObjet.isNumeric(x)) {
            continue;
          }
          lResponses[x] = lResponses[x].replace(
            /^(multichoice:|shortanswer:)/i,
            "",
          );
          lResponses[x] = lResponses[x].replace(/^(:|~)?=/, "%100%");
          lResponses[x] = lResponses[x].replace(/^(:|~)?([^~%#{}])/, "%0%$2");
          let lResponse = lResponses[x].split("%");
          lResponse.splice(
            2,
            1,
            lResponse[2].split("#")[0],
            lResponse[2].split("#")[1],
          );
          if (lResponse[1] === "100") {
            lListeReponsesJustes.push(lResponse[2].trim());
          }
        }
        return "";
      },
    );
    lEvaluationNotePourQuestion.nbBonnesReponses = lListeReponsesJustes.length;
    let lIndexElementInputSelectTrouve = 0;
    let lEnonceAvecCorrige = lEnonceOriginelAvecRempApostrophe.replace(
      /{[0-9]*:(ShortAnswer|MultiChoice):(~*(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)+}/gi,
      (ele) => {
        const lBonneReponse =
          lListeReponsesJustes[lIndexElementInputSelectTrouve];
        let lReponseRepondant = "";
        if (
          aQuestion.reponsesRepondant &&
          aQuestion.reponsesRepondant.length > 0 &&
          lIndexElementInputSelectTrouve < aQuestion.reponsesRepondant.length
        ) {
          lReponseRepondant =
            aQuestion.reponsesRepondant[lIndexElementInputSelectTrouve];
        }
        lIndexElementInputSelectTrouve++;
        let lRepondantABonneReponse = _sontChainesIdentiques(
          lReponseRepondant,
          lBonneReponse,
          lEstQuestionCaseSensitive,
        );
        if (lRepondantABonneReponse) {
          lEvaluationNotePourQuestion.nbReponsesJustes += 1;
        }
        const lElemReponse = [];
        lElemReponse.push('<div class="zone-reponse inputs-corrige">');
        if (!lRepondantABonneReponse) {
          lElemReponse.push(
            '<span class="is-ko">',
            lReponseRepondant,
            "</span>",
          );
        }
        lElemReponse.push(
          '<span class="',
          lRepondantABonneReponse ? "user-choix " : "",
          'is-ok">',
          lBonneReponse,
          "</span>",
        );
        lElemReponse.push("</div>");
        return lElemReponse.join("");
      },
    );
    if (aEvaluationNote) {
      aEvaluationNote[aIndiceQuestion] = lEvaluationNotePourQuestion;
    }
    const H = [];
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", { class: "tiny-view" }, lEnonceAvecCorrige),
      ),
    );
    return H.join("");
  },
  verifierDateCorrection(aExecutionQCM) {
    if (
      aExecutionQCM.modeDiffusionCorrige !==
      TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate
    ) {
      return;
    }
    if (!!aExecutionQCM.dateFinPublication) {
      if (
        !aExecutionQCM.dateCorrige ||
        ObjetDate_1.GDate.estAvantJour(
          aExecutionQCM.dateCorrige,
          aExecutionQCM.dateFinPublication,
        )
      ) {
        const lDate = ObjetDate_1.GDate.getJourSuivant(
          aExecutionQCM.dateFinPublication,
        );
        aExecutionQCM.dateCorrige = new Date(
          lDate.getFullYear(),
          lDate.getMonth(),
          lDate.getDate(),
        );
      }
    } else {
      if (
        !aExecutionQCM.dateCorrige ||
        ObjetDate_1.GDate.estAvantJour(
          aExecutionQCM.dateCorrige,
          ObjetDate_1.GDate.demain,
        )
      ) {
        const lDate = ObjetDate_1.GDate.demain;
        aExecutionQCM.dateCorrige = new Date(
          lDate.getFullYear(),
          lDate.getMonth(),
          lDate.getDate(),
        );
      }
    }
  },
  getIconeTypeExecutionQCM(aExecutionQCM) {
    let lNomIcone = "";
    if (!!aExecutionQCM) {
      if (aExecutionQCM.estLieADevoir && aExecutionQCM.estLieAEvaluation) {
        lNomIcone = "icon_qcm_Evl_Devoir_20";
      } else if (aExecutionQCM.estLieADevoir) {
        lNomIcone = "icon_saisie_note";
      } else if (aExecutionQCM.estLieAEvaluation) {
        lNomIcone = "icon_saisie_evaluation";
      } else if (aExecutionQCM.estUnTAF) {
        if (aExecutionQCM.estUneActivite) {
          lNomIcone = "icon_ecole";
        } else {
          lNomIcone = "icon_home";
        }
      } else {
        lNomIcone = "icon_taf";
      }
    }
    return lNomIcone;
  },
  composeNumerotation(aTypeNum, aNum) {
    if (aTypeNum === TypeNumerotation_1.TypeNumerotation.n123) {
      return aNum;
    } else if (aTypeNum === TypeNumerotation_1.TypeNumerotation.nABC) {
      return aphabetize(aNum).toUpperCase();
    } else if (aTypeNum === TypeNumerotation_1.TypeNumerotation.NRoman) {
      return romanize(aNum);
    }
    return "";
  },
  estCliquable(aExecutionQCM, aIgnorerTestCorrige) {
    return (
      aExecutionQCM.fichierDispo &&
      (GEtatUtilisateur.estEspacePourEleve()
        ? exports.UtilitaireQCM.estJouable(aExecutionQCM) ||
          (aIgnorerTestCorrige
            ? true
            : exports.UtilitaireQCM.estCorrige(aExecutionQCM))
        : !!GEtatUtilisateur.estEspacePourProf())
    );
  },
  estJouable(aExecutionQCM) {
    return (
      aExecutionQCM.estEnPublication === true &&
      ((aExecutionQCM.etatCloture !==
        TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
          .EQR_DureeMaxDepassee &&
        aExecutionQCM.etatCloture !==
          TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
            .EQR_Termine) ||
        aExecutionQCM.estRejouable ||
        (aExecutionQCM.nbMaxTentative > 1 &&
          aExecutionQCM.nbMaxTentative > aExecutionQCM.nbTentatives))
    );
  },
  estCorrige(aExecutionQCM) {
    return aExecutionQCM.publierCorrige === true;
  },
  getValeurContenuReponseMatching(aElementAssociation) {
    let lStrContenu;
    if (!!aElementAssociation) {
      switch (aElementAssociation.getGenre()) {
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Texte:
          lStrContenu = aElementAssociation.strTexte;
          break;
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Image:
          lStrContenu = ObjetChaine_1.GChaine.ajouterEntites(
            aElementAssociation.strImage,
          );
          break;
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Son:
          lStrContenu = ObjetChaine_1.GChaine.ajouterEntites(
            aElementAssociation.strSon,
          );
          break;
      }
    }
    return lStrContenu;
  },
  getStringAffichageReponseMatching(
    aElementAssociation,
    aPourVisuEleve = false,
    aParametresSupplementairesSon,
  ) {
    const H = [];
    if (!!aElementAssociation) {
      const lStrContenu =
        exports.UtilitaireQCM.getValeurContenuReponseMatching(
          aElementAssociation,
        );
      let lDataContenuAttribut = "";
      switch (aElementAssociation.getGenre()) {
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Texte:
          H.push(
            '<span class="asso" ',
            !!lDataContenuAttribut ? lDataContenuAttribut : "",
            ">",
            lStrContenu,
            "</span>",
          );
          break;
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Image: {
          H.push(
            '<div class="asso with-img" ',
            !!lDataContenuAttribut ? lDataContenuAttribut : "",
            ">",
            '<img src="data:image/png;base64,',
            lStrContenu,
            '" onerror="" onload="" />',
            "</div>",
          );
          break;
        }
        case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
          .GEA_Son:
          H.push(
            '<div class="asso" ',
            !!lDataContenuAttribut ? lDataContenuAttribut : "",
            ">",
          );
          if (!!aPourVisuEleve) {
            let lIndiceReponseAudio = 0;
            if (
              !!aParametresSupplementairesSon &&
              aParametresSupplementairesSon.indiceReponse
            ) {
              lIndiceReponseAudio = aParametresSupplementairesSon.indiceReponse;
            }
            lIndiceReponseAudio++;
            const lLibelleSon =
              aElementAssociation.strLibelleSon ||
              ObjetTraduction_1.GTraductions.getValeur(
                "ExecutionQCM.FichierSonCache",
              ) +
                " " +
                lIndiceReponseAudio;
            const lChips =
              UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
                base64Audio: aElementAssociation.strSon,
                libelle: lLibelleSon,
                ieModel: aParametresSupplementairesSon.ieModelAudio,
              });
            H.push(lChips);
          } else {
            H.push(aElementAssociation.strNomFichier);
          }
          H.push("</div>");
          break;
      }
    }
    return H.join("");
  },
  getStrResumeModalites(aExec, aSansDuree) {
    const H = [];
    let lNbQuestions =
      aExec.nombreQuestionsSoumises > 0
        ? aExec.nombreQuestionsSoumises
        : aExec.QCM.nbQuestionsTotal;
    if (aExec.nombreQuestionsEnMoins) {
      lNbQuestions -= aExec.nombreQuestionsEnMoins;
    }
    lNbQuestions = Math.max(lNbQuestions, 1);
    if (lNbQuestions === 1) {
      H.push(
        ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.NbUneQuestion"),
      );
    } else {
      H.push(
        ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.NbQuestions", [
          lNbQuestions,
        ]),
      );
    }
    if (aExec.dureeMaxQCM > 0 && aSansDuree !== true) {
      let lDureeMax = aExec.dureeMaxQCM;
      if (aExec.dureeSupplementaire) {
        lDureeMax += aExec.dureeSupplementaire;
      }
      H.push(
        " - ",
        ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.DureeExec", [
          UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(lDureeMax),
        ]),
      );
    }
    return H.join("");
  },
  composeReponsesFaitesEleve(
    aCopieQuestion,
    aIndexQuestion,
    aReponsesEleveFaites,
  ) {
    let H = [];
    if (
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_SingleChoice ||
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_MultiChoice
    ) {
      aCopieQuestion.reponsesRepondant = aReponsesEleveFaites;
      H.push(
        exports.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
          aCopieQuestion,
          aIndexQuestion,
        ),
      );
    } else if (
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ShortAnswer ||
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_NumericalAnswer
    ) {
      if (!!aReponsesEleveFaites && aReponsesEleveFaites.length > 0) {
        H.push(
          '<div class="reponse-input"><span>',
          aReponsesEleveFaites[0],
          "</span></div>",
        );
      }
    } else if (
      aCopieQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_SpellAnswer
    ) {
      if (!!aReponsesEleveFaites && aReponsesEleveFaites.length > 0) {
        H.push(
          '<div class="reponse-input spell-contain">',
          $.map(
            ObjetChaine_1.GChaine.enleverEntites(aReponsesEleveFaites[0]).split(
              "",
            ),
            (aVal) => {
              return "<span>" + aVal + "</span>";
            },
          ).join(""),
          "</div>",
        );
      }
    } else if (
      aCopieQuestion.getGenre() ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_Matching
    ) {
      if (!!aReponsesEleveFaites && aReponsesEleveFaites.length > 0) {
        aCopieQuestion.reponsesRepondant = aReponsesEleveFaites;
        H.push(
          exports.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
            aCopieQuestion,
            aIndexQuestion,
          ),
        );
      }
    } else if (
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeField ||
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeFixed ||
      aCopieQuestion.getGenre() ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ClozeVariable
    ) {
      H.push(
        exports.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
          aCopieQuestion,
          aIndexQuestion,
        ),
      );
    }
    return H.join("");
  },
};
function aphabetize(aNum) {
  let lResult = "";
  while (aNum > 0) {
    aNum--;
    const lRemain = aNum % 26;
    lResult = String.fromCharCode(lRemain + 97) + lResult;
    aNum = (aNum - lRemain) / 26;
  }
  return lResult;
}
function romanize(aNum) {
  const lLookup = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let lRoman = "";
  for (const i in lLookup) {
    while (aNum >= lLookup[i]) {
      lRoman += i;
      aNum -= lLookup[i];
    }
  }
  return lRoman;
}
function _sontChainesIdentiques(aValeur1, aValeur2, aCaseSensitive) {
  return ComparateurChaines_1.ComparateurChaines.egal(aValeur1, aValeur2, {
    caseSensitive: aCaseSensitive,
    accentSensitive: aCaseSensitive,
    avecTrim: true,
    unifierEspacements: true,
    unifierCarWord: true,
  });
}
