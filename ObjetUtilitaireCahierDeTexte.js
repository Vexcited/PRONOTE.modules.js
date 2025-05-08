const { TypeDroits } = require("ObjetDroitsPN.js");
const { Callback } = require("Callback.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const { GDate } = require("ObjetDate.js");
const { GImage } = require("ObjetImage.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GObjetWAI, EGenreRole } = require("ObjetWAI.js");
const {
  EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetRequeteSaisieTAFARendreEleve = require("ObjetRequeteSaisieTAFARendreEleve.js");
const {
  TypeGenreRenduTAF,
  TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const {
  TypeOrigineCreationCategorieCahierDeTexte,
  TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const { TUtilitaireCDT } = require("UtilitaireCDT.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
  ObjetFenetre_UploadFichiers,
} = require("ObjetFenetre_UploadFichiers.js");
const {
  ObjetFenetre_EnregistrementAudio,
} = require("ObjetFenetre_EnregistrementAudio.js");
const { ObjetFenetre_CorrectionTaf } = require("ObjetFenetre_CorrectionTaf.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { UtilitaireAudio } = require("UtilitaireAudio.js");
const { TypeGenreTravailAFaire } = require("TypeGenreTravailAFaire.js");
const {
  ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
class ObjetUtilitaireCahierDeTexte {
  constructor(aNom, aPere, aEvenement) {
    this.Nom = aNom;
    this.pere = aPere;
    this.evenement = aEvenement;
    this.callback = new Callback(this.pere, aEvenement);
    this.peuFaireTAF = [EGenreEspace.Eleve].includes(
      GEtatUtilisateur.GenreEspace,
    );
    this.idTAFARendre = GUID.getId();
  }
  composeCDC(aElement, aParam) {
    const lHtml = [];
    for (let i = 0; i < aElement.listeContenus.count(); i++) {
      const lContenu = aElement.listeContenus.get(i);
      lHtml.push(
        '<div class="Espace">',
        '<div class="Espace" style="',
        GStyle.composeCouleur(
          GCouleur.blanc,
          GCouleur.noire,
          GCouleur.themeNeutre.claire,
        ),
        '">',
      );
      if (
        [
          TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
          TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
        ].includes(lContenu.categorie.getGenre())
      ) {
        lHtml.push(
          '<div style="float: right">',
          _composeSymboleCategorie(lContenu.categorie.getGenre()),
          "</div>",
        );
      }
      lHtml.push(
        "<div>",
        lContenu.Libelle,
        lContenu.categorie.Libelle
          ? (lContenu.Libelle ? " - " : "") + lContenu.categorie.Libelle
          : "",
        "</div>",
      );
      lHtml.push("<div>", lContenu.descriptif, "</div>");
      if (lContenu.ListePieceJointe.count() > 0) {
        lHtml.push(
          "<div>",
          this.composePiecesJointes(lContenu.ListePieceJointe),
          "</div>",
        );
      }
      if (lContenu.listeExecutionQCM.count() > 0) {
        const nbExecutionQCM = lContenu.listeExecutionQCM.count();
        for (let j = 0; j < nbExecutionQCM; j++) {
          const lExecutionQCM = lContenu.listeExecutionQCM.get(j);
          lHtml.push(
            "<div>",
            this.getTitreExecutionQCMContenu(
              aElement.getNumero() + "_" + lContenu.getNumero() + "_" + j,
              lExecutionQCM,
              aParam.nom,
            ),
            "</div>",
          );
        }
      }
      lHtml.push("</div>", "</div>");
    }
    let lElementProgrammeCDT;
    if (
      aElement.listeElementsProgrammeCDT &&
      aElement.listeElementsProgrammeCDT.count()
    ) {
      lHtml.push(
        '<div class="Espace">',
        '<div class="Espace" style="',
        GStyle.composeCouleur(
          GCouleur.blanc,
          GCouleur.noire,
          GCouleur.themeNeutre.claire,
        ),
        '">',
        '<div class="Gras">',
        GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
        " :",
        "</div>",
        "<ul>",
      );
      for (let i = 0; i < aElement.listeElementsProgrammeCDT.count(); i++) {
        lElementProgrammeCDT = aElement.listeElementsProgrammeCDT.get(i);
        lHtml.push("<li>", lElementProgrammeCDT.getLibelle(), "</li>");
      }
      lHtml.push("</ul>", "</div>", "</div>");
    }
    if (aElement.ListeTravailAFaire.count()) {
      lHtml.push(
        "<div>",
        this.composeTAF(aElement, aElement.ListeTravailAFaire, true),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  getTitreExecutionQCM(I, aExecutionQCM, aNom) {
    const H = [];
    const lAvecAction = aNom && UtilitaireQCM.estCliquable(aExecutionQCM);
    const lAction = lAvecAction
      ? ' class="AvecMain Souligne" onclick="' +
        aNom +
        ".surExecutionQCM (event, '" +
        I +
        "')\""
      : "";
    H.push(
      "<div>",
      aExecutionQCM.estEnPublication === true
        ? GTraductions.getValeur("ExecutionQCM.RepondreQCM")
        : GDate.formatDate(
            aExecutionQCM.dateDebutPublication,
            "" +
              GTraductions.getValeur("ExecutionQCM.QCMPublieLe") +
              " %J %MMMM",
          ),
      " : ",
      "<span",
      lAction,
      ">",
      aExecutionQCM.QCM.getLibelle(),
      "</span>",
      "</div>",
    );
    return H.join("");
  }
  getTitreExecutionQCMContenu(I, aExecutionQCM, aNom) {
    const H = [];
    const lAvecAction = aNom && UtilitaireQCM.estCliquable(aExecutionQCM);
    const lAction = lAvecAction
      ? ' class="AvecMain Souligne" onclick="' +
        aNom +
        ".surExecutionQCMContenu (event, '" +
        I +
        "')\""
      : "";
    H.push(
      "<div>",
      GTraductions.getValeur("ExecutionQCM.RepondreQCMContenu"),
      " : ",
      "<span",
      lAction,
      ">",
      aExecutionQCM.QCM.getLibelle(),
      "</span>",
      "</div>",
    );
    return H.join("");
  }
  composePiecesJointes(aListePiecesJointes) {
    const lHtml = [];
    if (!!aListePiecesJointes) {
      const nbPiecesJointes = aListePiecesJointes.count();
      for (let I = 0; I < nbPiecesJointes; I++) {
        const lPieceJointe = aListePiecesJointes.get(I);
        lHtml.push(
          "<div>",
          GChaine.composerUrlLienExterne({ documentJoint: lPieceJointe }),
          "</div>",
        );
      }
    }
    return lHtml.join("");
  }
  composeTAF(aElement, aListeTAF, aParam, aPourLe) {
    const T = [];
    const lNbrElements = aElement.ressources
      ? aElement.ressources.count()
      : aListeTAF.count();
    let lElement, lRessource;
    let lBandeauDS;
    let lDonneLe, lNewDonneLe;
    let lPourLe, lNewPourLe;
    for (let I = 0; I < lNbrElements; I++) {
      if (aElement.ressources) {
        lRessource = aElement.ressources.get(I);
        lElement = lRessource.estUnDS
          ? lRessource
          : aListeTAF.getElementParNumero(lRessource.getNumero());
      } else {
        lElement = aListeTAF.get(I);
      }
      if (lElement.estUnDS) {
        if (!lBandeauDS) {
          T.push(
            '<div style="height:4px; ',
            GStyle.composeCouleur(GCouleur.themeNeutre.legere, GCouleur.noire),
            '">&nbsp;</div>',
          );
          lBandeauDS = true;
        }
        if (lElement.estDevoir) {
          T.push(
            '<div class="NoWrap PetitEspace EspaceGauche">',
            '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical" >',
            lElement.getLibelle(),
            "</div>",
            _composeSymboleCategorie(
              TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
            ),
            "</div>",
          );
        }
        if (lElement.estEval) {
          T.push(
            '<div class="NoWrap PetitEspace EspaceGauche">',
            '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical" >',
            lElement.getLibelle(),
            "</div>",
            _composeSymboleCategorie(
              TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
            ),
            "</div>",
          );
        }
      } else {
        const lNbJours = lElement.DonneLe
          ? GDate.getDifferenceJours(lElement.PourLe, lElement.DonneLe)
          : 0;
        const lStrJours = (
          lNbJours > 1
            ? GTraductions.getValeur("TAFEtContenu.jours")
            : GTraductions.getValeur("TAFEtContenu.jour")
        ).toLowerCase();
        lNewDonneLe =
          GTraductions.getValeur("TAFEtContenu.donneLe") +
          GDate.formatDate(lElement.DonneLe, " %JJ/%MM");
        lNewPourLe =
          GTraductions.getValeur("CahierDeTexte.pourLe") +
          GDate.formatDate(lElement.PourLe, " %JJ/%MM");
        T.push('<div class="Espace">');
        if (aPourLe) {
          if (!lPourLe || lPourLe !== lNewPourLe) {
            T.push(
              '<div class="EspaceBas">',
              '<span class="Gras">' + lNewPourLe + "</span><span>",
              "</div>",
            );
          }
        } else {
          if (!lDonneLe || lDonneLe !== lNewDonneLe) {
            T.push(
              '<div class="EspaceBas">',
              '<span class="Gras">' +
                lNewDonneLe +
                "</span><span>" +
                " [" +
                lNbJours +
                " " +
                lStrJours +
                "]</span>",
              "</div>",
            );
          }
        }
        T.push(this.composeInformationsTAF(lElement, aParam));
        T.push(
          '<div class="Espace" style="margin-top: 3px; ',
          GStyle.composeCouleur(
            GCouleur.blanc,
            GCouleur.noire,
            GCouleur.themeNeutre.claire,
          ),
          '">',
        );
        const lEstQCM =
          lElement.executionQCM && lElement.executionQCM.existeNumero();
        T.push(
          '<div class="NoWrap" style="',
          "position:relative; overflow:auto",
          '">',
          _composeCBTAFFait.call(this, lElement),
          '<div class="InlineBlock AlignementHaut" style="',
          _estAvecCocheTAFFait.call(this, lElement)
            ? GStyle.composeWidthCalc(14)
            : "",
          '">',
          lEstQCM
            ? this.getTitreExecutionQCM(
                lElement.getNumero(),
                lElement.executionQCM,
                aParam.nom,
              )
            : lElement.descriptif,
          lElement.ListePieceJointe.count() > 0
            ? this.composePiecesJointes(lElement.ListePieceJointe)
            : "",
          "</div>",
          !aParam || aParam.ignorerTAFFait !== true
            ? _composeLabelTAFFait.call(this, lElement)
            : "",
          "</div>",
        );
        if (!aParam.listeTAF) {
          aParam.listeTAF = aListeTAF;
        }
        T.push(this.composeTAFARendre(lElement, aParam));
        T.push("</div>");
        T.push("</div>");
        lDonneLe = lNewDonneLe;
        lPourLe = lNewPourLe;
      }
    }
    return T.join("");
  }
  composeInformationsTAF(aTaf, aParam) {
    if (
      !(
        aTaf.duree ||
        aTaf.niveauDifficulte ||
        (!!aTaf.ListeThemes && aTaf.ListeThemes.count())
      )
    ) {
      return "";
    }
    const T = [];
    let lAvecMargeGauche = false;
    T.push('<div style="margin-top: 3px; line-height: 14px;">');
    if (aParam && aParam.avecDetailTAF) {
      if (aTaf.nomPublic) {
        T.push(
          '<div class="InlineBlock">',
          GImage.composeImage("Image_TAF_Public"),
          "</div>",
          '<span class="PetitEspaceGauche InlineBlock">',
          aTaf.pourTousLesEleves
            ? aTaf.nomPublic
            : GTraductions.getValeur("CahierDeTexte.TAFARendre.eleves", [
                aTaf.nbrEleves,
              ]),
          "</span>",
        );
      }
      if (aTaf.avecRendu) {
        T.push(getInfoTAFRendu(aTaf.getNumero(), aTaf, aParam.nom));
      }
      lAvecMargeGauche = true;
    }
    if (aTaf.duree) {
      const lFormatMin = aTaf.duree > 60 ? "%mm" : "%xm";
      const lStrDuree = GDate.formatDureeEnMillisecondes(
        aTaf.duree * 60 * 1000,
        aTaf.duree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
      );
      T.push(
        '<div class="InlineBlock SansMain" title="',
        GTraductions.getValeur("CahierDeTexte.DureeEstimee"),
        '">',
        '<span class="',
        lAvecMargeGauche ? "GrandEspaceGauche " : "",
        'InlineBlock">',
        GImage.composeImage("Image_TAF_Duree"),
        "</span>",
        '<span class="PetitEspaceGauche InlineBlock">',
        lStrDuree,
        "</span>",
        "</div>",
      );
      lAvecMargeGauche = true;
    }
    if (aTaf.niveauDifficulte) {
      T.push(
        '<div class="InlineBlock SansMain" title="',
        GTraductions.getValeur("CahierDeTexte.NiveauDifficulte"),
        '">',
        '<span class="',
        lAvecMargeGauche ? "GrandEspaceGauche " : "",
        'InlineBlock">',
        GImage.composeImage("Image_TAF_Niveau"),
        "</span>",
        '<span class="PetitEspaceGauche InlineBlock">',
        TypeNiveauDifficulteUtil.typeToStr(aTaf.niveauDifficulte),
        "</span>",
        "</div>",
      );
      lAvecMargeGauche = true;
    }
    T.push("</div>");
    if (!!aTaf.ListeThemes && aTaf.ListeThemes.count()) {
      T.push(
        '<div style="margin-top: 3px; line-height: 14px;">',
        GTraductions.getValeur("Themes"),
        " : ",
        aTaf.ListeThemes.getTableauLibelles().join(", "),
        "</div>",
      );
    }
    return T.join("");
  }
  surSupprimer(aNumeroTAF) {
    const lFichier = new ObjetElement(),
      lListeFichiers = new ObjetListeElements();
    lListeFichiers.addElement(lFichier, 0);
    lFichier.TAF = new ObjetElement("", aNumeroTAF);
    lFichier.setEtat(EGenreEtat.Suppression);
    new ObjetRequeteSaisieTAFARendreEleve(
      this,
      this.actionSurRequeteSaisieTAFARendreEleve,
    ).lancerRequete(lListeFichiers);
  }
  actionSurRequeteSaisieTAFARendreEleve() {
    this.callback.appel();
  }
  surSurvol(aElement, aSurSurvol, aAvecSouligne) {
    if (aSurSurvol) {
      GHtml.setClass(
        aElement,
        "InlineBlock AlignementMilieuVertical LienAccueil AvecMain Souligne",
      );
    } else {
      GHtml.setClass(
        aElement,
        "InlineBlock AlignementMilieuVertical LienAccueil AvecMain" +
          (aAvecSouligne ? " Souligne" : ""),
      );
    }
  }
  execFicheSelecFile(aTaf) {
    return _executerDepotFichierPourTAF.call(this, aTaf);
  }
  utilFicheFileTAF(aInstance, aNumero, aTaf, aParam) {
    let lTaf = aTaf;
    let lListeTaf = aParam.listeTAF;
    if (!lListeTaf && this.instance && this.instance.donnees) {
      lListeTaf =
        this.instance.donnees.listeTAF ||
        (!!this.instance.donnees.travailAFaire
          ? this.instance.donnees.travailAFaire.listeTAF
          : undefined);
    }
    if (lListeTaf) {
      lTaf = lListeTaf.getElementParNumero(aNumero);
    }
    $(this.node).eventValidation(
      function (aTaf, aEvent) {
        aEvent.stopPropagation();
        _executerDepotFichierPourTAF.call(this, aTaf);
      }.bind(aInstance, lTaf),
    );
  }
  composeTAFARendrePourWidget(aTaf, aParam) {
    const H = [];
    if (
      [
        EGenreEspace.Eleve,
        EGenreEspace.Parent,
        EGenreEspace.Mobile_Eleve,
        EGenreEspace.Mobile_Parent,
        EGenreEspace.PrimEleve,
        EGenreEspace.Mobile_PrimEleve,
        EGenreEspace.PrimParent,
        EGenreEspace.Mobile_PrimParent,
        EGenreEspace.Accompagnant,
        EGenreEspace.Mobile_Accompagnant,
        EGenreEspace.PrimAccompagnant,
        EGenreEspace.Mobile_PrimAccompagnant,
        EGenreEspace.Tuteur,
        EGenreEspace.Mobile_Tuteur,
      ].includes(GEtatUtilisateur.GenreEspace) &&
      aTaf.avecRendu
    ) {
      const lPeutFaireTAF = [
        EGenreEspace.Eleve,
        EGenreEspace.PrimEleve,
        EGenreEspace.Mobile_Eleve,
        EGenreEspace.Mobile_PrimEleve,
        EGenreEspace.PrimParent,
        EGenreEspace.Mobile_PrimParent,
      ].includes(GEtatUtilisateur.GenreEspace);
      const lPeutFaireActivite = [
        EGenreEspace.Eleve,
        EGenreEspace.PrimEleve,
        EGenreEspace.Mobile_Eleve,
        EGenreEspace.Mobile_PrimEleve,
      ].includes(GEtatUtilisateur.GenreEspace);
      const lEstActivite =
        aTaf.getGenre() === TypeGenreTravailAFaire.tGTAF_Activite;
      const lPeutFaire =
        (lPeutFaireTAF && !lEstActivite) ||
        (lPeutFaireActivite && lEstActivite);
      H.push('<div class="taf-btn-conteneur flex-center">');
      switch (aTaf.genreRendu) {
        case TypeGenreRenduTAF.GRTAF_RenduPapier:
          H.push(
            '<span class="as-info-light',
            aTaf.TAFFait ? " done" : "",
            '">',
            TypeGenreRenduTAFUtil.getLibelleDeposer(aTaf.genreRendu),
            "</span>",
          );
          break;
        case TypeGenreRenduTAF.GRTAF_RenduPronote:
        case TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio: {
          if (aTaf.peuRendre && aTaf.dateReport) {
            const lClass = ["m-right-l", "taille-s"];
            H.push(
              `<span class="${lClass.join(" ")}">${GTraductions.getValeur("CahierDeTexte.TAFARendre.Eleve.ProlongeJusquAu", [GDate.formatDate(aTaf.dateReport, "%JJJ %JJ/%MM")])}</span>`,
            );
          }
          if (
            !aTaf.peuRendre &&
            aTaf.documentRendu &&
            aTaf.dateRendu &&
            GDate.estDateJourAvant(aTaf.PourLe, aTaf.dateRendu)
          ) {
            H.push(
              `<span class="m-right-l taille-s">${GTraductions.getValeur("CahierDeTexte.TAFARendre.Eleve.DepotEnRetard")}</span>`,
            );
          }
          if (aTaf.peuRendre && !aTaf.documentRendu) {
            const lLibelle = TypeGenreRenduTAFUtil.getLibelleDeposer(
              aTaf.genreRendu,
              lPeutFaire,
            );
            if (lPeutFaire) {
              const lIconEnregistrer = TypeGenreRenduTAFUtil.estUnRenduMedia(
                aTaf.genreRendu,
              )
                ? '<i class="icon_microphone EspaceDroit"></i>'
                : "";
              H.push(
                '<a role="button" tabindex="0" id="',
                getIdTAFARendre.call(this, aTaf),
                '" ',
                _getFicheSelecFile.call(this, aTaf, aParam),
                ' class="as-cta rendu-pn fix-bloc">',
                lIconEnregistrer,
                lLibelle,
                "</a>",
              );
            } else {
              H.push(
                '<span class="as-info-light',
                aTaf.TAFFait ? " done" : "",
                '">',
                lLibelle,
                "</span>",
              );
            }
          }
          if (aTaf.documentRendu) {
            let lIEModelChips = null;
            if (aTaf.peuRendre && lPeutFaire) {
              lIEModelChips = _getIEModelChipsCopieDeposeeEleve.call(
                this,
                aTaf,
                aParam,
              );
            }
            if (TypeGenreRenduTAFUtil.estUnRenduMedia(aTaf.genreRendu)) {
              const lIEModelAudio = _getIEModelChipsCopieJouerSon.call(
                this,
                aTaf,
                aParam,
              );
              const lUrl = GChaine.creerUrlBruteLienExterne(aTaf.documentRendu);
              H.push(
                UtilitaireAudio.construitChipsAudio({
                  libelle: TypeGenreRenduTAFUtil.getLibelleConsultation(
                    aTaf.genreRendu,
                  ),
                  url: lUrl,
                  ieModel: lIEModelAudio,
                  argsIEModel: [aTaf.getNumero(), aTaf.peuRendre && lPeutFaire],
                  idAudio: aTaf.getNumero(),
                  estLien: true,
                }),
              );
            } else {
              H.push(
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf.documentRendu,
                  genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
                  libelleEcran: TypeGenreRenduTAFUtil.getLibelleConsultation(
                    aTaf.genreRendu,
                  ),
                  ieModelChips: lIEModelChips,
                  argsIEModel: [aTaf.getNumero()],
                }),
              );
            }
          }
          const lEstAvecUneCorrection =
            !!aTaf.documentCorrige || !!aTaf.commentaireCorrige;
          if (lEstAvecUneCorrection) {
            H.push('<div style="padding-left:0.4rem">');
            const lContientQueLaCopieCorrigee =
              !!aTaf.documentCorrige && !aTaf.commentaireCorrige;
            if (lContientQueLaCopieCorrigee) {
              H.push(
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf.documentCorrige,
                  genreRessource:
                    TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
                  libelleEcran: GTraductions.getValeur(
                    "CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
                  ),
                }),
              );
            } else {
              H.push(
                "<ie-chips ",
                _composeIEModelChipsOuvrirFenetreCorrectionTAF.call(
                  this,
                  aTaf,
                  aParam,
                ),
                ">",
                GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
                ),
                "</ie-chips>",
              );
            }
            H.push("</div>");
          }
          break;
        }
        case TypeGenreRenduTAF.GRTAF_RenduKiosque:
          if (aTaf.peuRendre && !aTaf.documentRendu) {
            if (
              aTaf.avecUrlAppliMobile &&
              [
                EGenreEspace.Mobile_PrimEleve,
                EGenreEspace.Mobile_Eleve,
                EGenreEspace.Mobile_PrimParent,
              ].includes(GEtatUtilisateur.GenreEspace)
            ) {
              H.push(
                "<div>",
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf,
                  iconeOverride: "icon_th_large",
                  infoSupp: { universalLink: true },
                  libelleEcran: GTraductions.getValeur(
                    "CahierDeTexte.TAFARendre.ACompleterEditeurAppli",
                  ),
                  title: aTaf.titreKiosque || "",
                }),
                "</div>",
              );
            }
            const lTrad = TypeGenreRenduTAFUtil.getLibelleDeposer(
              aTaf.genreRendu,
              [
                EGenreEspace.Mobile_PrimEleve,
                EGenreEspace.Mobile_Eleve,
                EGenreEspace.Mobile_Accompagnant.PrimParent,
              ].includes(GEtatUtilisateur.GenreEspace),
            );
            H.push(
              "<div>",
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf,
                iconeOverride: "icon_book",
                libelleEcran: lTrad,
                title: aTaf.titreKiosque || "",
              }),
              "</div>",
            );
          }
          if (aTaf.documentRendu) {
            let lIEModelChipsKiosque = null;
            if (aTaf.peuRendre && lPeutFaire) {
              lIEModelChipsKiosque = _getIEModelChipsCopieDeposeeEleve.call(
                this,
                aTaf,
                aParam,
              );
            }
            H.push(
              '<div class="InlineBlock AlignementMilieuVertical">',
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf.documentRendu,
                genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
                libelle: TypeGenreRenduTAFUtil.getLibelleConsultation(
                  aTaf.genreRendu,
                  lPeutFaire,
                ),
                ieModelChips: lIEModelChipsKiosque,
                argsIEModel: [aTaf.getNumero()],
              }),
              "</div>",
            );
          }
          if (aTaf.peuRendre && aTaf.documentRendu) {
            if (lPeutFaire) {
              H.push(
                '<div style="padding-left:0.4rem">',
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf,
                  libelleEcran: GTraductions.getValeur(
                    "CahierDeTexte.TAFARendre.Eleve.RepondreANouveau",
                  ),
                  title: aTaf.titreKiosque || "",
                }),
                "</div>",
              );
            }
          }
          break;
      }
      H.push("</div>");
    }
    return H.join("");
  }
  composeTAFARendre(aTaf, aParam) {
    const H = [];
    let lAvecImage = [
      EGenreEspace.Mobile_Eleve,
      EGenreEspace.Eleve,
      EGenreEspace.Mobile_Parent,
      EGenreEspace.Parent,
      EGenreEspace.Accompagnant,
      EGenreEspace.Tuteur,
    ].includes(GEtatUtilisateur.GenreEspace);
    const lAvecSouligne =
      [
        EGenreEspace.Mobile_Eleve,
        EGenreEspace.Mobile_Parent,
        EGenreEspace.Mobile_Accompagnant,
        EGenreEspace.Mobile_Tuteur,
      ].includes(GEtatUtilisateur.GenreEspace) && !aParam.pourAccueil;
    if (
      [
        EGenreEspace.Eleve,
        EGenreEspace.Parent,
        EGenreEspace.Mobile_Eleve,
        EGenreEspace.Mobile_Parent,
        EGenreEspace.Mobile_PrimEleve,
        EGenreEspace.PrimParent,
        EGenreEspace.Mobile_PrimParent,
        EGenreEspace.Accompagnant,
        EGenreEspace.Mobile_Accompagnant,
        EGenreEspace.PrimAccompagnant,
        EGenreEspace.Mobile_PrimAccompagnant,
        EGenreEspace.Tuteur,
        EGenreEspace.Mobile_Tuteur,
      ].includes(GEtatUtilisateur.GenreEspace) &&
      aTaf.avecRendu
    ) {
      H.push('<div style="float: right;">');
      switch (aTaf.genreRendu) {
        case TypeGenreRenduTAF.GRTAF_RenduPapier:
          H.push(
            lAvecImage ? '<i class="icon_punition EspaceDroit"></i>' : "",
            '<span class="InlineBlock AlignementMilieuVertical">',
            TypeGenreRenduTAFUtil.getLibelleDeposer(aTaf.genreRendu),
            "</span>",
          );
          break;
        case TypeGenreRenduTAF.GRTAF_RenduPronote:
        case TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio:
          if (aTaf.peuRendre && !aTaf.documentRendu) {
            if (
              [
                EGenreEspace.Eleve,
                EGenreEspace.Mobile_Eleve,
                EGenreEspace.Mobile_PrimEleve,
                EGenreEspace.PrimParent,
                EGenreEspace.Mobile_PrimParent,
              ].includes(GEtatUtilisateur.GenreEspace)
            ) {
              H.push(
                lAvecImage ? '<i class="icon_punition EspaceDroit"></i>' : "",
                '<div id="',
                getIdTAFARendre.call(this, aTaf),
                '" ',
                _getFicheSelecFile.call(this, aTaf, aParam),
                ' tabindex="0" class="InlineBlock LienAccueil AlignementMilieuVertical AvecMain' +
                  (lAvecSouligne ? " Souligne" : "") +
                  '" onmouseenter="',
                this.Nom,
                '.surSurvol (this, true)" onmouseleave="',
                this.Nom,
                ".surSurvol (this, false, " + lAvecSouligne + ')">',
                TypeGenreRenduTAFUtil.getLibelleDeposer(aTaf.genreRendu, true),
                "</div>",
              );
            } else {
              H.push(
                lAvecImage ? '<i class="icon_punition EspaceDroit"></i>' : "",
                '<span class="InlineBlock AlignementMilieuVertical">',
                TypeGenreRenduTAFUtil.getLibelleDeposer(aTaf.genreRendu),
                "</span>",
              );
            }
          }
          if (aTaf.documentRendu) {
            const lLibelleLienDocumentRendu =
              TypeGenreRenduTAFUtil.getLibelleConsultation(aTaf.genreRendu);
            H.push(
              lAvecImage ? '<i class="icon_punition EspaceDroit"></i>' : "",
              '<div class="InlineBlock AlignementMilieuVertical">',
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf.documentRendu,
                genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
                libelleEcran: lLibelleLienDocumentRendu,
                afficherIconeDocument: false,
              }),
              "</div>",
            );
          }
          if (aTaf.documentCorrige) {
            const lLibelleLienDocumentCorrige = GTraductions.getValeur(
              "CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
            );
            H.push(
              '<span class="InlineBlock AlignementMilieuVertical">',
              "&nbsp;-&nbsp;",
              "</span>",
            );
            lAvecImage = false;
            H.push(
              lAvecImage ? '<i class="icon_punition EspaceDroit"></i>' : "",
              '<div class="InlineBlock AlignementMilieuVertical">',
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf.documentCorrige,
                genreRessource: TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
                libelleEcran: lLibelleLienDocumentCorrige,
                afficherIconeDocument: false,
              }),
              "</div>",
            );
          }
          if (aTaf.peuRendre && aTaf.documentRendu) {
            if (
              [
                EGenreEspace.Eleve,
                EGenreEspace.Mobile_Eleve,
                EGenreEspace.Mobile_PrimEleve,
                EGenreEspace.PrimParent,
                EGenreEspace.Mobile_PrimParent,
              ].includes(GEtatUtilisateur.GenreEspace)
            ) {
              H.push(
                '<span class="InlineBlock AlignementMilieuVertical">',
                "&nbsp;-&nbsp;",
                "</span>",
                '<a id="',
                getIdTAFARendre.call(this, aTaf),
                '" ',
                _getFicheSelecFile.call(this, aTaf, aParam),
                ' tabindex="0" class="InlineBlock AlignementMilieuVertical LienAccueil AvecMain' +
                  (lAvecSouligne ? " Souligne" : "") +
                  '" title="',
                GEtatUtilisateur.pourPrimaire()
                  ? GTraductions.getValeur(
                      "CahierDeTexte.TAFARendre.Eleve.NouveauRenduPrimaire",
                    )
                  : GTraductions.getValeur(
                      "CahierDeTexte.TAFARendre.Eleve.NouveauRenduPronote",
                    ),
                '" onmouseenter="',
                this.Nom,
                '.surSurvol (this, true)" onmouseleave="',
                this.Nom,
                ".surSurvol (this, false, " + lAvecSouligne + ')">',
                GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.Eleve.Deposer",
                ),
                "</a>",
                '<span class="InlineBlock AlignementMilieuVertical">',
                "&nbsp;-&nbsp;",
                "</span>",
                '<a class="InlineBlock AlignementMilieuVertical LienAccueil AvecMain' +
                  (lAvecSouligne ? " Souligne" : "") +
                  '" tabindex="0" title="',
                GEtatUtilisateur.pourPrimaire()
                  ? GTraductions.getValeur(
                      "CahierDeTexte.TAFARendre.Eleve.SupprimerRenduPrimaire",
                    )
                  : GTraductions.getValeur(
                      "CahierDeTexte.TAFARendre.Eleve.SupprimerRenduPronote",
                    ),
                '" ',
                _supprimerFichier.call(this, aTaf, aParam),
                ">",
                GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.Eleve.Supprimer",
                ),
                "</a>",
              );
            }
          }
          break;
        case TypeGenreRenduTAF.GRTAF_RenduKiosque:
          if (aTaf.peuRendre && !aTaf.documentRendu) {
            if (
              aTaf.avecUrlAppliMobile &&
              [
                EGenreEspace.Mobile_PrimEleve,
                EGenreEspace.Mobile_Eleve,
              ].includes(GEtatUtilisateur.GenreEspace)
            ) {
              H.push(
                "<div>",
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf,
                  iconeOverride: "icon_th_large",
                  infoSupp: { universalLink: true },
                  libelleEcran: GTraductions.getValeur(
                    "CahierDeTexte.TAFARendre.ACompleterEditeurAppli",
                  ),
                  title: aTaf.titreKiosque || "",
                }),
                "</div>",
              );
            }
            const lTrad = [
              EGenreEspace.Mobile_PrimEleve,
              EGenreEspace.Mobile_Eleve,
            ].includes(GEtatUtilisateur.GenreEspace)
              ? GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.ACompleterEditeurSite",
                )
              : GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.ACompleterEditeur",
                );
            H.push(
              "<div>",
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf,
                iconeOverride: "icon_book",
                libelleEcran: lTrad,
                title: aTaf.titreKiosque || "",
              }),
              "</div>",
            );
          }
          if (aTaf.documentRendu) {
            H.push(
              '<div class="InlineBlock AlignementMilieuVertical">',
              GChaine.composerUrlLienExterne({
                documentJoint: aTaf.documentRendu,
                genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
                libelle: TypeGenreRenduTAFUtil.getLibelleConsultation(
                  aTaf.genreRendu,
                  [
                    EGenreEspace.Eleve,
                    EGenreEspace.Mobile_Eleve,
                    EGenreEspace.Mobile_PrimEleve,
                  ].includes(GEtatUtilisateur.GenreEspace),
                ),
              }),
              "</div>",
            );
          }
          if (aTaf.peuRendre && aTaf.documentRendu) {
            if (
              [
                EGenreEspace.Eleve,
                EGenreEspace.Mobile_Eleve,
                EGenreEspace.Mobile_PrimEleve,
              ].includes(GEtatUtilisateur.GenreEspace)
            ) {
              H.push(
                '<span class="InlineBlock AlignementMilieuVertical">',
                "&nbsp;-&nbsp;",
                "</span>",
                GChaine.composerUrlLienExterne({
                  documentJoint: aTaf,
                  libelleEcran: GTraductions.getValeur(
                    "CahierDeTexte.TAFARendre.Eleve.RepondreANouveau",
                  ),
                  title: aTaf.titreKiosque || "",
                }),
                '<span class="InlineBlock AlignementMilieuVertical">',
                "&nbsp;-&nbsp;",
                "</span>",
                '<a class="InlineBlock AlignementMilieuVertical LienAccueil AvecMain' +
                  (lAvecSouligne ? " Souligne" : "") +
                  '" title="',
                GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.Eleve.SupprimerMesReponses",
                ),
                '" tabindex="0" ',
                _supprimerFichier.call(this, aTaf, aParam),
                ">",
                GTraductions.getValeur(
                  "CahierDeTexte.TAFARendre.Eleve.Supprimer",
                ),
                "</a>",
              );
            }
          }
          break;
      }
      H.push("</div>");
      H.push('<div style="clear: both;"></div>');
    }
    return H.join("");
  }
  getListeDonneesBrute(aParam) {
    if (aParam.modeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      if (aParam.avecDS && aParam.listeDS) {
        aParam.listeDS.parcourir((D) => {
          D.estUnDS = true;
          return true;
        });
        if (aParam.avecTAF) {
          return new ObjetListeElements()
            .add(aParam.listeTAF)
            .add(aParam.listeDS);
        } else {
          return aParam.listeDS;
        }
      } else {
        return aParam.avecTAF ? aParam.listeTAF : new ObjetListeElements();
      }
    } else {
      return aParam.listeCDT;
    }
  }
  _getListeFusionnee(aMatieres, aDonnees, aAvecMatieresVides) {
    let lMatiere;
    let lDateCourante = null;
    function _filtrerParMatiereEtDate(aElt) {
      let lResult = false;
      if (
        aElt.getNumero() === lMatiere &&
        GDate.estJourEgal(aElt.Date, lDateCourante)
      ) {
        aElt.estTraite = true;
        lResult = true;
      }
      return lResult;
    }
    function _filtrerDonneesParDateNonTraite(aElt) {
      return !aElt.estTraite && GDate.estJourEgal(aElt.Date, lDateCourante);
    }
    let lMatiereCourante;
    let lListeMatieresDuJour = [];
    let lDonneesNonTraitees;
    const lResult = new ObjetListeElements();
    for (let i = 0, lNbr = aMatieres.count(); i < lNbr; i++) {
      let lElt = aMatieres.get(i);
      const lDate = lElt.date;
      lMatiere = lElt.Matiere.getNumero();
      if (!GDate.estJourEgal(lDate, lDateCourante)) {
        let n = 0;
        while (
          GDate.estDateJourAvant(lDateCourante, lDate) &&
          !!lDateCourante &&
          n < 7
        ) {
          lDonneesNonTraitees = aDonnees.getListeElements(
            _filtrerDonneesParDateNonTraite,
          );
          if (lDonneesNonTraitees.count() > 0) {
            lResult.add(lDonneesNonTraitees);
          }
          lDateCourante = GDate.getJourSuivant(lDateCourante);
          n++;
        }
        lDateCourante = lDate;
        lMatiereCourante = null;
        lListeMatieresDuJour = [];
      }
      if (lMatiere !== lMatiereCourante) {
        lMatiereCourante = lMatiere;
        if (!lListeMatieresDuJour.includes(lMatiere)) {
          lListeMatieresDuJour.push(lMatiere);
          const lDonneeFiltre = aDonnees.getListeElements(
            _filtrerParMatiereEtDate,
          );
          if (lDonneeFiltre.count() === 1) {
            lResult.addElement(lDonneeFiltre.get(0));
          } else {
            if (aAvecMatieresVides) {
              const lEltMatiere = new ObjetElement(
                lElt.Matiere.Libelle,
                lElt.Matiere.Numero,
                lElt.Matiere.Genre,
                lElt.Matiere.Position,
                lElt.Matiere.Actif,
              );
              lEltMatiere.Date = lDateCourante;
              lEltMatiere.couleurBordure = GCouleur.liste.bordure;
              lEltMatiere.estUneSuite = false;
              lEltMatiere.aUneSuite = false;
              lEltMatiere.CouleurFond = lElt.CouleurFond;
              lEltMatiere.ressources = new ObjetListeElements();
              lResult.addElement(lEltMatiere);
            }
          }
        }
      }
    }
    if (!!lDateCourante && !!aDonnees) {
      lDonneesNonTraitees = aDonnees.getListeElements(
        _filtrerDonneesParDateNonTraite,
      );
      if (!!lDonneesNonTraitees && lDonneesNonTraitees.count() > 0) {
        lResult.add(lDonneesNonTraitees);
      }
    }
    return lResult;
  }
  formatDonnees(aParam) {
    let I, lElt, elementRessource, newElement;
    const lModeTAF =
      aParam.modeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire;
    const lListeDonnees = this.getListeDonneesBrute(aParam);
    let lResult = new ObjetListeElements();
    let lDate = null;
    let lMatiere = null;
    let lElementPrecedent = null;
    lListeDonnees.setTri([
      ObjetTri.init((D) => {
        if (lModeTAF) {
          return D.PourLe;
        }
        return D.Date;
      }),
      ObjetTri.init("Matiere.Libelle"),
      ObjetTri.init((D) => {
        if (lModeTAF && !D.estUnDS) {
          return GDate.getJour(D.DonneLe);
        }
        return null;
      }),
      ObjetTri.init((D) => {
        if (lModeTAF && !D.estUnDS) {
          return D.getGenre();
        }
        return null;
      }),
      ObjetTri.init((D) => {
        if (lModeTAF && !D.estUnDS) {
          return D.getLibelle();
        }
        return null;
      }),
    ]);
    lListeDonnees.trier();
    for (I = 0; I < lListeDonnees.count(); I++) {
      lElt = lListeDonnees.get(I);
      if (lModeTAF || (lElt.listeContenus && lElt.listeContenus.count() > 0)) {
        if (
          aParam.estChargeTAF &&
          lElementPrecedent &&
          GDate.estJourEgal(lElementPrecedent.Date, lElt.PourLe) &&
          lElementPrecedent.Libelle === lElt.Matiere.Libelle
        ) {
          newElement = lElementPrecedent;
        } else {
          newElement = new ObjetElement(
            lElt.Matiere.Libelle,
            lElt.Matiere.Numero,
            lElt.Matiere.Genre,
            lElt.Matiere.Position,
            lElt.Matiere.Actif,
          );
          newElement.genreBloc = lModeTAF
            ? EGenreBloc.TravailAFaire
            : EGenreBloc.ContenuDeCours;
          newElement.Date = lModeTAF ? lElt.PourLe : lElt.Date;
          newElement.DateDebut = newElement.Date;
          newElement.couleurBordure = GCouleur.liste.bordure;
          newElement.estUneSuite = false;
          newElement.aUneSuite = false;
          newElement.CouleurFond = lElt.CouleurFond;
          if (lModeTAF) {
            newElement.listeGroupes = MethodesObjet.dupliquer(
              lElt.listeGroupes,
            );
          }
        }
        elementRessource = new ObjetElement(
          lModeTAF
            ? lElt.estUnDS
              ? lElt.horaires
              : lElt.Libelle
            : lElt.listeContenus.getLibelle(0),
          lElt.Numero,
          lElt.Genre,
          lElt.Position,
          lElt.Actif,
        );
        elementRessource.genreMatiere = lElt.Matiere.Genre;
        elementRessource.elementOriginal = lElt;
        if (lModeTAF) {
          elementRessource.estUnDS = lElt.estUnDS;
          if (lElt.estUnDS) {
            elementRessource.estDevoir = lElt.estDevoir;
            elementRessource.estEval = lElt.estEval;
          }
          elementRessource.DonneLe = lElt.DonneLe;
          elementRessource.nomPublic = lElt.nomPublic;
        } else {
          for (let j = 0, lNbr = lElt.listeContenus.count(); j < lNbr; j++) {
            let lContenu = lElt.listeContenus.get(j);
            if (
              lContenu.categorie &&
              lContenu.categorie.getGenre() ===
                TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
            ) {
              elementRessource.estUnDS = true;
            }
          }
        }
        if (
          lModeTAF &&
          !aParam.sansRegroupementTAF &&
          lDate &&
          GDate.estJourEgal(lDate, newElement.Date) &&
          lMatiere === newElement.Libelle
        ) {
          lElementPrecedent.ressources.addElement(elementRessource);
          lElementPrecedent.ressources.setTri([
            ObjetTri.init((D) => {
              return !D.estUnDS;
            }),
            ObjetTri.init("DonneLe"),
            ObjetTri.init("genreMatiere"),
          ]);
          lElementPrecedent.ressources.trier();
        } else {
          newElement.ressources = new ObjetListeElements();
          newElement.ressources.addElement(elementRessource);
          lResult.addElement(MethodesObjet.dupliquer(newElement));
          lElementPrecedent = lResult.get(lResult.count() - 1);
        }
        if (elementRessource.estUnDS) {
          lElementPrecedent.estAvecDS = true;
          lElementPrecedent.estDevoir = lElt.estDevoir;
          lElementPrecedent.estEval = lElt.estEval;
        }
        lDate = newElement.Date;
        lMatiere = newElement.Libelle;
      }
    }
    lResult.setTri([ObjetTri.init("Date"), ObjetTri.init("Libelle")]);
    lResult.trier();
    if (lModeTAF && aParam.listeMatieres) {
      const lTri = [
        ObjetTri.init("place"),
        ObjetTri.init((D) => {
          return D.Matiere.getLibelle();
        }),
      ];
      aParam.listeMatieres.setTri(lTri);
      aParam.listeMatieres.trier();
      lResult = this._getListeFusionnee(
        aParam.listeMatieres,
        lResult,
        aParam.avecMatieres,
      );
    }
    $.extend(aParam, { listeElements: lResult });
    if (aParam.estChargeTAF) {
      _apresFormatterDonneesPourAffichage.call(this, aParam);
    }
    return lResult;
  }
}
function composeTitreTAF(aElement, aPourGrille) {
  const T = [];
  T.push(
    "<table ",
    GObjetWAI.composeRole(EGenreRole.Gridcell),
    ' style="',
    GStyle.composeCouleur(GCouleur.themeNeutre.legere, GCouleur.noire),
    ' height:15px;">',
    "<tr>",
    '<td class="Texte10 ',
    !aPourGrille ? "AvecMove" : "",
    '"><div class="PetitEspace Texte10">',
    TUtilitaireCDT.strtMatiere(aElement, aElement.groupe, false),
    "</td>",
    "</tr>",
    "</table>",
  );
  return T.join("");
}
function composeTitreCDC(aElement, aListeCDT) {
  const T = [];
  const lElt = aListeCDT.getElementParNumero(aElement.ressources.getNumero(0));
  let lClasseSelectionnee = GEtatUtilisateur.Navigation.getRessource(
    EGenreRessource.Classe,
  );
  if (!lClasseSelectionnee && GEtatUtilisateur.getMembre()) {
    lClasseSelectionnee = GEtatUtilisateur.getMembre().Classe;
  }
  const lAvecGroupe =
    !!lElt.listeGroupes &&
    lElt.listeGroupes.count() > 0 &&
    !!lElt.listeGroupes.get(0) &&
    lClasseSelectionnee &&
    lClasseSelectionnee.getNumero() !== lElt.listeGroupes.get(0).getNumero();
  T.push(
    "<table ",
    GObjetWAI.composeRole(EGenreRole.Gridcell),
    ' style="',
    GStyle.composeCouleur(GCouleur.themeNeutre.legere, GCouleur.noire),
    ' height:15px;" class="full-width">',
    "<tr>",
    '<td class="Texte10 AvecMove"><div class="PetitEspace Texte10">',
    "<div>",
    TUtilitaireCDT.strtMatiere(
      aElement,
      lAvecGroupe ? lElt.listeGroupes : false,
      false,
    ),
    "</div>",
    "<div>",
    TUtilitaireCDT.strtDate(aElement.Date),
    "</div>",
    "</td>",
    "</tr>",
    "</table>",
  );
  return T.join("");
}
function _composeSymboleCategorie(aGenre) {
  const T = [];
  T.push(
    '<div class="InlineBlock ',
    TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(aGenre),
    ' AlignementMilieuVertical" style="width:17px"></div>',
  );
  return T.join("");
}
function _estAvecCocheTAFFait(aElement) {
  const lAvecERendu = TypeGenreRenduTAFUtil.estUnRenduEnligne(
    aElement.genreRendu,
  );
  const lEstQCM = aElement.executionQCM && aElement.executionQCM.existeNumero();
  if (!this.peuFaireTAF || lEstQCM || lAvecERendu) {
    return false;
  }
  return true;
}
function _composeCBTAFFait(aElement) {
  if (!_estAvecCocheTAFFait.call(this, aElement)) {
    return "";
  }
  const H = [];
  H.push(
    '<div class="InlineBlock AlignementHaut"><ie-checkbox ie-hint="getHint" ie-model="cbxTAFFait (\'',
    aElement.getNumero(),
    "')\">",
  );
  H.push("</ie-checkbox></div>");
  return H.join("");
}
function _composeLabelTAFFait(lElement) {
  const H = [];
  const lTitle =
    !this.peuFaireTAF && lElement.TAFFait
      ? ' title="' +
        GTraductions.getValeur("accueil.hintParentTravailFait", [
          GEtatUtilisateur.getMembre().getLibelle(),
        ]) +
        '"'
      : "";
  H.push(
    '<div class="InlineBlock AlignementHaut" style="float:right;"',
    lTitle,
    "><div ie-html=\"labelTAFFait ('",
    lElement.getNumero(),
    "')\"></div></div>",
  );
  return H.join("");
}
function getInfoTAFRendu(I, aTaf, aNom) {
  const H = [];
  const lAvecAction = aNom && aTaf && aTaf.avecRendu;
  const lFoncExist = MethodesObjet.isFunction(aNom.surDetailRendu);
  const lAction =
    lAvecAction && lFoncExist
      ? ' class="AvecMain LienAccueil" onclick="' +
        aNom +
        ".surDetailRendu (event, '" +
        I +
        "')\""
      : "";
  H.push(
    '<span class="InlineBlock" style="line-height: 14px;">',
    "&nbsp;-&nbsp;",
    GTraductions.getValeur("CahierDeTexte.TAFARendre.RenduPar"),
    "&nbsp;",
    "</span>",
    "<span",
    lAction,
    ' class="InlineBlock" style="line-height: 14px;">',
    aTaf.nbrRendus + "/" + aTaf.nbrEleves,
    "</span>",
  );
  return H.join("");
}
function _executerDepotFichierPourTAF(aTaf) {
  if (TypeGenreRenduTAFUtil.estUnRenduMedia(aTaf.genreRendu)) {
    ouvrirFenetreCreation.call(this, aTaf);
  } else {
    _executerDepotFichier.call(this, aTaf);
  }
}
function ouvrirFenetreCreation(aTaf) {
  const lThis = this;
  const lTabActions = [];
  lTabActions.push({
    libelle: GTraductions.getValeur("EnregistrementAudio.record"),
    icon: "icon_microphone",
    event() {
      _executerDepotMedia.call(lThis, aTaf);
    },
    class: "bg-util-marron-claire",
  });
  lTabActions.push({
    libelle: GTraductions.getValeur("EnregistrementAudio.deposerExistant"),
    icon: "icon_folder_open",
    selecFile: true,
    optionsSelecFile: _getOptionsSelecFile(false),
    event(aParamsInput) {
      if (!!aParamsInput && !!aParamsInput.eltFichier) {
        UtilitaireAudio.estFichierAudioValide(aParamsInput.eltFichier).then(
          (aResult) => {
            if (aResult) {
              const lParametres = { numero: aTaf.getNumero() };
              _evenementInputFile.call(lThis, aParamsInput, lParametres);
            } else {
              UtilitaireAudio.messageErreurFormat(aParamsInput.eltFichier);
            }
          },
        );
      }
    },
    class: "bg-util-marron-claire",
  });
  ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, { pere: this });
}
function _getOptionsSelecFile() {
  return {
    maxSize: GApplication.droits.get(TypeDroits.tailleMaxRenduTafEleve),
    accept: UtilitaireAudio.getTypeMimeAudio(),
    avecTransformationFlux: false,
  };
}
function _evenementInputFile(aParamUpload, aParametres) {
  if (aParamUpload.eltFichier.getEtat() === EGenreEtat.Creation) {
    const lListeFichier = new ObjetListeElements();
    lListeFichier.addElement(aParamUpload.eltFichier);
    aParamUpload.eltFichier.TAF = new ObjetElement("", aParametres.numero);
    new ObjetRequeteSaisieTAFARendreEleve(
      this,
      this.actionSurRequeteSaisieTAFARendreEleve,
    )
      .addUpload({ listeFichiers: lListeFichier })
      .lancerRequete(lListeFichier);
  }
}
function _executerDepotMedia(aTaf) {
  let lContexte = "";
  const lThis = this;
  const lNumeroTAF = aTaf.getNumero();
  const lFenetreAudio = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_EnregistrementAudio,
    {
      pere: this,
      evenement: function (aGenreBouton, aParametres) {
        if (
          !!aParametres &&
          !!aParametres.bouton &&
          aParametres.bouton.valider
        ) {
          if (
            !!aParametres.listeFichiers &&
            aParametres.listeFichiers.count() > 0
          ) {
            const lSeulFichier = aParametres.listeFichiers.getPremierElement();
            lSeulFichier.TAF = new ObjetElement("", lNumeroTAF);
            new ObjetRequeteSaisieTAFARendreEleve(
              lThis,
              lThis.actionSurRequeteSaisieTAFARendreEleve,
            )
              .addUpload({ listeFichiers: aParametres.listeFichiers })
              .lancerRequete(aParametres.listeFichiers);
          }
        }
      },
    },
  );
  lFenetreAudio.setOptions({
    contexte: lContexte,
    maxLengthAudio: TypeGenreRenduTAFUtil.getDureeMaxEnregistrementAudio(),
  });
  lFenetreAudio.setDonnees(EGenreRessource.DocumentJoint);
  lFenetreAudio.afficher();
}
function _executerDepotFichier(aTaf) {
  let lLibelle = "";
  if (aTaf && aTaf.matiere) {
    lLibelle = aTaf.matiere.getLibelle();
  } else if (aTaf && aTaf.Matiere) {
    lLibelle = aTaf.Matiere.getLibelle();
  }
  if (aTaf && aTaf.pourLe) {
    lLibelle +=
      " - " +
      (GDate.estDateParticulier(aTaf.pourLe)
        ? GTraductions.getValeur("accueil.pour").ucfirst()
        : GTraductions.getValeur("accueil.pourle").ucfirst()) +
      " " +
      GDate.formatDate(aTaf.pourLe, "[" + "%JJJJ %J %MMM" + "]");
  }
  const lThis = this;
  const lNumeroTAF = aTaf.getNumero();
  const lObjetFenetreAjoutMultiple = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_UploadFichiers,
    {
      pere: this,
      evenement: function (aGenreBouton, aListeFichiers) {
        if (aGenreBouton === EGenreAction.Valider) {
          if (!!aListeFichiers && aListeFichiers.count() > 0) {
            const lSeulFichier = aListeFichiers.getPremierElement();
            lSeulFichier.TAF = new ObjetElement("", lNumeroTAF);
            new ObjetRequeteSaisieTAFARendreEleve(
              lThis,
              lThis.actionSurRequeteSaisieTAFARendreEleve,
            )
              .addUpload({ listeFichiers: aListeFichiers })
              .lancerRequete(aListeFichiers);
          }
        }
        lObjetFenetreAjoutMultiple.fermer();
      },
    },
  );
  if (TypeGenreRenduTAFUtil.estUnRenduMedia(aTaf.genreRendu)) {
    lObjetFenetreAjoutMultiple.setOptions({
      avecEnregistrement: true,
      avecAudioUniquement: true,
      avecUploadPlusieursImages: false,
      maxLengthAudio: TypeGenreRenduTAFUtil.getDureeMaxEnregistrementAudio(),
    });
  }
  lObjetFenetreAjoutMultiple.setOptionsFenetre({
    titre: GTraductions.getValeur(
      "CahierDeTexte.TAFARendre.Eleve.DeposerCopie",
    ),
  });
  lObjetFenetreAjoutMultiple.setDonnees(EGenreRessource.DocumentJoint, {
    tailleMaxUploadFichier: GApplication.droits.get(
      TypeDroits.tailleMaxRenduTafEleve,
    ),
    libelleContexteFenetre: lLibelle,
    functionGetNomPdfGenere: function () {
      const lLibelleUtilisateur = GEtatUtilisateur.getMembre().getLibelle();
      return (
        lLibelleUtilisateur +
        "_" +
        GDate.formatDate(
          GDate.getDateHeureCourante(),
          "%JJ%MM%AAAA_%hh%mm%ss",
        ) +
        ".pdf"
      );
    },
  });
  lObjetFenetreAjoutMultiple.afficher();
}
function _getFicheSelecFile(aTaf, aParam) {
  const lThis = this;
  if (aTaf && aTaf.avecRendu) {
    if (!aParam.controleur) {
      return "";
    }
    aParam.controleur.utilFicheFileTAF = function (aNumero) {
      lThis.utilFicheFileTAF.call(this, lThis, aNumero, aTaf, aParam);
    };
    return GHtml.composeAttr("ie-node", "utilFicheFileTAF", [aTaf.getNumero()]);
  }
  return "";
}
function _supprimerFichier(aTaf, aParam) {
  const lThis = this;
  if (aTaf && aTaf.avecRendu) {
    if (!aParam.controleur) {
      return "";
    }
    if (!aParam.controleur.supprimerFichier) {
      aParam.controleur.supprimerFichier = function (aNumero) {
        $(this.node).eventValidation(
          function (aNumero) {
            this.surSupprimer(aNumero);
          }.bind(lThis, aNumero),
        );
      };
    }
    return GHtml.composeAttr("ie-node", "supprimerFichier", [aTaf.getNumero()]);
  }
  return "";
}
function _composeIEModelChipsOuvrirFenetreCorrectionTAF(aTaf, aParam) {
  const H = [];
  if (!!aTaf && (!!aTaf.documentCorrige || !!aTaf.commentaireCorrige)) {
    if (!aParam.controleur) {
      return "";
    }
    if (!aParam.listeTAF) {
      return "";
    }
    if (!aParam.controleur.chipsOuvrirFenetreCorrectionTAF) {
      const lThis = this;
      aParam.controleur.chipsOuvrirFenetreCorrectionTAF = {
        event: function (aNumeroTaf) {
          const lListeTaf = aParam.listeTAF;
          const lTaf = lListeTaf.getElementParNumero(aNumeroTaf);
          if (!!lTaf) {
            const lFenetreCorrectionTaf = ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_CorrectionTaf,
              { pere: lThis },
            );
            lFenetreCorrectionTaf.setTAF(lTaf);
            lFenetreCorrectionTaf.afficher();
          }
        },
      };
    }
    H.push(
      GHtml.composeAttr("ie-model", "chipsOuvrirFenetreCorrectionTAF", [
        aTaf.getNumero(),
      ]),
    );
  }
  return H.join("");
}
function _getIEModelChipsCopieDeposeeEleve(aTaf, aParam) {
  let lNomIEModel = null;
  if (!!aTaf) {
    if (!aParam.controleur) {
      return "";
    }
    if (!aParam.listeTAF) {
      return "";
    }
    if (!aParam.controleur.chipsCopieDeposeeEleve) {
      const lThis = this;
      aParam.controleur.chipsCopieDeposeeEleve = {
        eventBtn: function (aNumeroTaf) {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "TAFEtContenu.suppressionCopieEleve",
            ),
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                lThis.surSupprimer(aNumeroTaf);
              }
            },
          });
        },
      };
    }
    lNomIEModel = "chipsCopieDeposeeEleve";
  }
  return lNomIEModel;
}
function _getIEModelChipsCopieJouerSon(aTaf, aParam) {
  let lNomIEModel = null;
  if (!!aTaf) {
    if (!aParam.controleur) {
      return "";
    }
    if (!aParam.listeTAF) {
      return "";
    }
    const lStrCtrlAudio = "chipsAudio";
    if (!(lStrCtrlAudio in aParam.controleur)) {
      const lThis = this;
      aParam.controleur[lStrCtrlAudio] = {
        event: function () {
          UtilitaireAudio.executeClicChipsParDefaut(this.node);
        },
        eventBtn: function (aNumeroTaf) {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "TAFEtContenu.suppressionCopieEleve",
            ),
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                lThis.surSupprimer(aNumeroTaf);
              }
            },
          });
        },
        node: function () {
          const $chips = $(this.node);
          const $audio = $chips.find("audio");
          $audio.on("play", () => {
            $chips
              .removeClass(UtilitaireAudio.IconeLecture)
              .addClass(UtilitaireAudio.IconeStop);
          });
          $audio.on("pause", () => {
            $chips
              .removeClass(UtilitaireAudio.IconeStop)
              .addClass(UtilitaireAudio.IconeLecture);
          });
        },
        getOptions: function (aNumeroTaf, aAvecBtnSuppr) {
          return { avecBtn: aAvecBtnSuppr };
        },
      };
    }
    lNomIEModel = lStrCtrlAudio;
  }
  return lNomIEModel;
}
function getIdTAFARendre(aTaf) {
  return this.idTAFARendre + "_" + aTaf.getNumero();
}
function _apresFormatterDonneesPourAffichage(aParam) {
  let lElt;
  let T = [];
  for (let i = 0, lNbr = aParam.listeElements.count(); i < lNbr; i++) {
    lElt = aParam.listeElements.get(i);
    T = [];
    if (lElt.estAvecDS) {
      T.push('<div class="NoWrap">');
      T.push(
        '<div class="InlineBlock AlignementMilieuVertical GrandEspaceDroit">',
      );
    }
    T.push(
      '<div style="float: left; height: 100%; margin-top: 3px; margin-bottom: 3px; margin-left : 3px;" class="NoWrap">',
      TUtilitaireCDT.strtMatiere(lElt, false, false),
      "</div>",
    );
    T.push('<div style="clear: both"></div>');
    if (lElt.estAvecDS) {
      T.push("</div>");
      if (lElt.estDevoir) {
        T.push(
          '<div class="InlineBlock AlignementMilieuVertical" >',
          _composeSymboleCategorie(
            TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
          ),
          "</div>",
        );
      }
      if (lElt.estEval) {
        T.push(
          '<div class="InlineBlock AlignementMilieuVertical',
          lElt.estDevoir ? " PetitEspaceGauche" : "",
          '" >',
          _composeSymboleCategorie(
            TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
          ),
          "</div>",
        );
      }
      T.push("</div>");
    }
    if (aParam.avecDonneeLe) {
      let lRessource;
      let lDonneeLeCourant = null;
      for (let j = 0, lNbr2 = lElt.ressources.count(); j < lNbr2; j++) {
        lRessource = lElt.ressources.get(j);
        if (!lRessource.estUnDS && lRessource.DonneLe !== lDonneeLeCourant) {
          lDonneeLeCourant = lRessource.DonneLe;
          const lNbJours = GDate.getDifferenceJours(
            lElt.Date,
            lDonneeLeCourant,
          );
          const lStrJours = (
            lNbJours > 1
              ? GTraductions.getValeur("TAFEtContenu.jours")
              : GTraductions.getValeur("TAFEtContenu.jour")
          ).toLowerCase();
          T.push('<div class=" GrandEspaceGauche">');
          T.push(
            '<ul style="padding: 0px; margin: 0px;"><li style="list-style-position: inside; padding: 0px 0px 5px 0px;">',
          );
          T.push(
            '<span class="EspaceGauche">' +
              GTraductions.getValeur("TAFEtContenu.donneLe") +
              GDate.formatDate(lDonneeLeCourant, " %JJ/%MM") +
              "</span>",
          );
          T.push("<span>" + " [" + lNbJours + " " + lStrJours + "]</span>");
          T.push("</li></ul>");
          T.push("</div>");
        }
      }
    }
    lElt.html = [];
    lElt.html[0] = T.join("");
    const lAffTAF =
      aParam.modeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire;
    T = [];
    T.push("<table ", GObjetWAI.composeRole(EGenreRole.Gridcell), ">");
    T.push(
      "<tr><td>",
      lAffTAF
        ? composeTitreTAF(lElt, true)
        : composeTitreCDC(lElt, aParam.listeCDT),
      "</td></tr>",
    );
    T.push('<tr><td class="FondBlanc full-height v-top">');
    T.push("<table>");
    T.push("<tr>");
    T.push('<td class="AlignementHaut">');
    T.push('<div style=width:100%; height:100%;">');
    T.push("</div>");
    T.push(
      lAffTAF
        ? this.composeTAF(lElt, aParam.listeTAF, {
            avecDetailTAF: aParam.avecDetailTAF,
            nom: aParam.nom,
            listeDS: aParam.listeDS,
            controleur: aParam.controleur,
          })
        : this.composeCDC(
            aParam.listeCDT.getElementParNumero(lElt.ressources.getNumero(0)),
            aParam,
          ),
    );
    T.push("</td>");
    T.push("</tr>");
    T.push("</table>");
    T.push("</td></tr>");
    T.push("</table>");
    lElt.html[1] = T.join("");
  }
}
module.exports = { ObjetUtilitaireCahierDeTexte };
