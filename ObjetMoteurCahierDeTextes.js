const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  TypeGenreRenduTAF,
  TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const {
  TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const {
  ObjetRequeteSaisieCahierDeTextes,
} = require("ObjetRequeteSaisieCahierDeTextes.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const EGenreEvntCdT = {
  publierCdT: "publierCdT",
  publierDate: "publierDate",
  copierCdT: "copierCdT",
  collerCdT: "collerCdT",
  deleteCdT: "deleteCdT",
  createContenu: "createContenu",
  editContenu: "editContenu",
  deleteContenu: "deleteContenu",
  createTAF: "createTAF",
  editTAF: "editTAF",
  deleteTAF: "deleteTAF",
  actualiserFicheTAFDuCours: "actualiserFicheTAFDuCours",
  editNoteProchaineSeance: "editNoteProchaineSeance",
  editCommentairePrive: "editCommentairePrive",
};
class ObjetMoteurCDT {
  estContenuVide(aContenu) {
    return (
      this.estContenuSansTitre(aContenu) &&
      !this.estContenuAvecDescriptif(aContenu) &&
      !this.estContenuAvecCategorie(aContenu) &&
      !this.estContenuAvecPJ(aContenu) &&
      !this.estContenuAvecExecQCM(aContenu) &&
      (!GApplication.parametresUtilisateur.get("avecGestionDesThemes") ||
        !this.estContenuAvecThemes(aContenu))
    );
  }
  strTitreContenu(aContenu) {
    return aContenu !== null && aContenu !== undefined
      ? aContenu.getLibelle()
      : "";
  }
  estContenuSansTitre(aContenu) {
    return this.strTitreContenu(aContenu) === "";
  }
  getCategorieDeContenu(aContenu) {
    return aContenu !== null && aContenu !== undefined
      ? aContenu.categorie
      : null;
  }
  estContenuAvecCategorie(aContenu) {
    const lCategorie = this.getCategorieDeContenu(aContenu);
    return (
      lCategorie !== null &&
      lCategorie !== undefined &&
      lCategorie.getNumero() !== 0 &&
      lCategorie.getLibelle() !== ""
    );
  }
  strCategorieContenu(aContenu) {
    const lCategorie = this.getCategorieDeContenu(aContenu);
    return lCategorie !== null && lCategorie !== undefined
      ? lCategorie.getLibelle()
      : "";
  }
  strCategorie(aCategorie) {
    return aCategorie !== null && aCategorie !== undefined
      ? aCategorie.getLibelle()
      : "";
  }
  estCategorieContenuAvecImg(aContenu) {
    return this.estCategorieAvecImg(aContenu.categorie);
  }
  estCategorieAvecImg(aCategorie) {
    return (
      aCategorie &&
      aCategorie.getGenre() &&
      TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecImage(
        aCategorie.getGenre(),
      )
    );
  }
  htmlIconCategorieContenu(aContenu) {
    if (aContenu && aContenu.categorie) {
      return this.htmlIconCategorie(aContenu.categorie);
    }
  }
  htmlIconCategorie(aCategorie) {
    if (aCategorie) {
      return (
        '<div class="' +
        TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
          aCategorie.getGenre(),
        ) +
        '"></div>'
      );
    }
  }
  estContenuAvecThemes(aContenu) {
    return (
      !!aContenu.ListeThemes &&
      aContenu.ListeThemes.count() &&
      GApplication.parametresUtilisateur.get("avecGestionDesThemes")
    );
  }
  strThemesContenu(aContenu) {
    return (
      GTraductions.getValeur("Themes") +
      " : " +
      aContenu.ListeThemes.getTableauLibelles().join(", ")
    );
  }
  strDescriptifContenu(aContenu) {
    return aContenu !== null && aContenu !== undefined
      ? aContenu.descriptif
      : "";
  }
  estContenuAvecDescriptif(aContenu) {
    return this.strDescriptifContenu(aContenu) !== "";
  }
  textAreaToDescription(aValeur) {
    return "<div>" + aValeur.replace(/\n/g, "<br>\n") + "</div>";
  }
  estContenuAvecPJ(aContenu) {
    return this.getListePJDeContenu(aContenu).getNbrElementsExistes() > 0;
  }
  getListePJDeContenu(aContenu) {
    return aContenu !== null && aContenu !== undefined
      ? aContenu.ListePieceJointe
      : new ObjetListeElements();
  }
  estContenuAvecExecQCM(aContenu) {
    return this.getListeExecQCMDeContenu(aContenu).getNbrElementsExistes() > 0;
  }
  getListeExecQCMDeContenu(aContenu) {
    return aContenu !== null && aContenu !== undefined
      ? aContenu.listeExecutionQCM
      : new ObjetListeElements();
  }
  creerContenuParDefaut() {
    const lContenu = new ObjetElement();
    lContenu.Libelle = "";
    lContenu.descriptif = "";
    lContenu.estVide = true;
    lContenu.categorie = new ObjetElement("", 0);
    lContenu.ListePieceJointe = new ObjetListeElements();
    lContenu.listeExecutionQCM = new ObjetListeElements();
    lContenu.setEtat(EGenreEtat.Creation);
    lContenu.libelleCBTheme = GTraductions.getValeur("Theme.libelleCB.contenu");
    return lContenu;
  }
  creerTAFParDefaut(aParam) {
    const lTAF = new ObjetElement();
    lTAF.setEtat(EGenreEtat.Creation);
    Object.assign(lTAF, {
      descriptif: "",
      PourLe: aParam && aParam.date ? aParam.date : GDate.getDateCourante(),
      listeEleves: new ObjetListeElements(),
      estPourTous: true,
      pourTousLesEleves: true,
      avecMiseEnForme: GApplication.parametresUtilisateur.get(
        "CDT.TAF.ActiverMiseEnForme",
      ),
      niveauDifficulte: GApplication.parametresUtilisateur.get(
        "CDT.TAF.NiveauDifficulte",
      ),
      duree: GApplication.parametresUtilisateur.get("CDT.TAF.Duree"),
      genreRendu: TypeGenreRenduTAF.GRTAF_AucunRendu,
      ListePieceJointe: new ObjetListeElements(),
      libelleCBTheme: GTraductions.getValeur("Theme.libelleCB.taf"),
    });
    return lTAF;
  }
  estTAFVide(aTAF) {
    return !this.estTAFAvecDescriptif(aTAF);
  }
  estTAFQCM(aTAF) {
    return !!aTAF.executionQCM;
  }
  estTAFAvecDescriptif(aTAF) {
    return this.strDescriptifTAF(aTAF) !== "";
  }
  strDescriptifTAF(aTAF) {
    let lStr = "";
    if (aTAF !== null && aTAF !== undefined) {
      if (this.estTAFQCM(aTAF)) {
        lStr = this.getTitreExecutionQCM({ execQCM: aTAF.executionQCM });
      } else {
        lStr = aTAF.descriptif;
      }
    }
    return lStr;
  }
  strPourLeTAF(aTAF, aParam) {
    const lAvecTraduc =
      aParam && aParam.avecTraduc !== null && aParam.avecTraduc !== undefined
        ? aParam.avecTraduc
        : false;
    const lStr = [];
    if (lAvecTraduc) {
      lStr.push(GTraductions.getValeur("CahierDeTexte.PourLe") + " ");
    }
    lStr.push(GDate.formatDate(aTAF.PourLe, "%JJJ %J %MMM"));
    return lStr.join("");
  }
  strDonneLeTAF(aTAF, aParam) {
    const lAvecTraduc =
      aParam && aParam.avecTraduc !== null && aParam.avecTraduc !== undefined
        ? aParam.avecTraduc
        : false;
    const lStr = [];
    if (lAvecTraduc) {
      lStr.push(GTraductions.getValeur("TAFEtContenu.donneLe") + " ");
    }
    lStr.push(GDate.formatDate(aTAF.DonneLe, " %JJ/%MM"));
    return lStr.join("");
  }
  strModeRenduTAF(aTAF, aOptions) {
    const lStr = [];
    lStr.push(
      aTAF.executionQCM
        ? ""
        : TypeGenreRenduTAFUtil.getLibelle(aTAF.genreRendu),
    );
    if (
      aOptions !== null &&
      aOptions !== undefined &&
      aOptions.avecNbRendu === true &&
      !aTAF.executionQCM
    ) {
      lStr.push(" (", aTAF.nbrRendus, "/", aTAF.nbrEleves, ")");
    }
    return lStr.join("");
  }
  strSuiviRenduTAF(aTAF) {
    const lStr = [];
    const lAvecAction = false;
    const lIENode = " ie-node=\"renduTAF('" + aTAF.getNumero() + "')\"";
    const lAction = lAvecAction ? ' class="link" ' + lIENode : "";
    if (lAvecAction) {
      lStr.push("<a ", lAction, ">");
    }
    lStr.push(
      GTraductions.getValeur("CahierDeTexte.TAFARendre.RenduPar"),
      " ",
      aTAF.nbrRendus,
      "/",
      aTAF.nbrEleves,
    );
    if (lAvecAction) {
      lStr.push("</a>");
    }
    return lStr.join("");
  }
  strSuiviFaitSelonEleves(aTAF) {
    const lStr = [];
    const lAvecAction = false;
    const lIENode = " ie-node=\"renduTAF('" + aTAF.getNumero() + "')\"";
    const lAction = lAvecAction ? ' class="link" ' + lIENode : "";
    if (lAvecAction) {
      lStr.push("<a ", lAction, ">");
    }
    lStr.push(
      GTraductions.getValeur("CahierDeTexte.TAFARendre.FaitPar"),
      " ",
      aTAF.nbrFaitsSelonEleve,
      "/",
      aTAF.nbrEleves,
    );
    if (lAvecAction) {
      lStr.push("</a>");
    }
    return lStr.join("");
  }
  strPublicTAF(aTAF, aParam) {
    const lLibelleCourt = aParam.avecLibellesCourt === true;
    if (!aTAF || aTAF.estPourTous || aTAF.pourTousLesEleves) {
      return lLibelleCourt
        ? GTraductions.getValeur("tous")
        : GTraductions.getValeur("CahierDeTexte.tousLesEleves");
    }
    const lNombresDElevesDeTAF = aTAF.listeEleves
      ? aTAF.listeEleves.count()
      : aTAF.nbrEleves;
    const lNbrTotal = aParam.listeTousEleves.count();
    return lLibelleCourt
      ? lNombresDElevesDeTAF + "/" + lNbrTotal
      : GChaine.format(
          lNombresDElevesDeTAF === 1
            ? GTraductions.getValeur("CahierDeTexte.eleve")
            : GTraductions.getValeur("CahierDeTexte.eleves"),
          [lNombresDElevesDeTAF, lNbrTotal],
        );
  }
  strDureeTAF(aTAF) {
    const lStr = [];
    if (aTAF.duree) {
      const lFormatMin = aTAF.duree > 60 ? "%mm" : "%xm";
      lStr.push(
        GDate.formatDureeEnMillisecondes(
          aTAF.duree * 60 * 1000,
          aTAF.duree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
        ),
      );
    }
    return lStr.join("");
  }
  estTAFAvecPublic(aTAF) {
    return (
      aTAF.nomPublic !== null &&
      aTAF.nomPublic !== undefined &&
      aTAF.nomPublic !== ""
    );
  }
  estTAFAvecDuree(aTAF) {
    return (
      aTAF.duree !== null &&
      aTAF.duree !== undefined &&
      aTAF.duree !== "" &&
      aTAF.duree !== 0
    );
  }
  estTAFAvecDifficulte(aTAF) {
    return (
      aTAF.niveauDifficulte !== null &&
      aTAF.niveauDifficulte !== undefined &&
      aTAF.niveauDifficulte !== ""
    );
  }
  strDifficulteTAF(aTAF) {
    return TypeNiveauDifficulteUtil.typeToStr(aTAF.niveauDifficulte);
  }
  htmlIconDifficulteTAF(aTAF, aOptions) {
    return TypeNiveauDifficulteUtil.getImage(aTAF.niveauDifficulte, {
      color: aOptions.color,
      avecTitle: aOptions.avecTitle,
    });
  }
  getListeDifficulte() {
    return TypeNiveauDifficulteUtil.toListe(true);
  }
  iconPublicTAF() {
    return "icon_group";
  }
  iconModeRenduTAF() {
    return "icon_arrow_right";
  }
  iconDureeTAF() {
    return "icon_time";
  }
  iconPourLeDonneLeTAF() {
    return "icon_calendar_empty";
  }
  estTAFAvecRendu(aTAF) {
    return !TypeGenreRenduTAFUtil.estSansRendu(aTAF.genreRendu);
  }
  estTAFAvecERendu(aTAF) {
    return TypeGenreRenduTAFUtil.estUnRenduEnligne(aTAF.genreRendu, false);
  }
  iconSuiviRenduTAF() {
    return "icon_inbox";
  }
  getListeModeRendu() {
    const lTabAExclure = [TypeGenreRenduTAF.GRTAF_RenduKiosque];
    return TypeGenreRenduTAFUtil.toListe(lTabAExclure);
  }
  estTAFAvecPJ(aTAF) {
    return this.getListePJDeTAF(aTAF).getNbrElementsExistes() > 0;
  }
  getListePJDeTAF(aTAF) {
    return aTAF !== null && aTAF !== undefined && !aTAF.executionQCM
      ? aTAF.ListePieceJointe
      : new ObjetListeElements();
  }
  getHtmlCategorie(aCategorie) {
    const H = [];
    H.push('<div style="display:flex; flex-wrap:nowrap; align-items:center;">');
    H.push("<div>", this.strCategorie(aCategorie), "</div>");
    H.push(
      '<div style="margin-left:auto;">',
      this.htmlIconCategorie(aCategorie),
      "</div>",
    );
    H.push("</div>");
    return H.join("");
  }
  formatterDataCdtGeneral(aParams) {
    const lListeCategories = aParams.ListeCategories;
    lListeCategories.parcourir((aCategorie) => {
      if (this.estCategorieAvecImg(aCategorie)) {
        const lHtmlCategorie = this.getHtmlCategorie(aCategorie);
        aCategorie.libelleHtml = lHtmlCategorie;
        aCategorie.libelleHtmlTitre = lHtmlCategorie;
      }
    });
    const lEltAucun = new ObjetElement("", 0);
    const lHtmlAucun =
      "<div>" +
      GTraductions.getValeur("CahierDeTexte.CategorieAucune") +
      "</div>";
    lEltAucun.libelleHtml = lHtmlAucun;
    lEltAucun.libelleHtmlTitre = lHtmlAucun;
    lListeCategories.addElement(lEltAucun);
    lListeCategories.trier();
    return aParams;
  }
  saisieCdT(aParam) {
    return new ObjetRequeteSaisieCahierDeTextes(this)
      .addUpload({
        listeFichiers: aParam.listeFichiersUpload || new ObjetListeElements(),
        listeDJCloud: aParam.listeDocumentsJoints,
      })
      .lancerRequete(
        aParam.cours.getNumero(),
        aParam.numeroSemaine,
        aParam.listeCategories,
        aParam.listeDocumentsJoints,
        aParam.listeModeles,
        new ObjetListeElements().addElement(aParam.cdt),
      )
      .then((aArgs) => {
        let lJSONRapportSaisie = null;
        if (aArgs && aArgs[1]) {
          lJSONRapportSaisie = aArgs[1];
        }
        aParam.clbck({
          contenu: lJSONRapportSaisie ? lJSONRapportSaisie.contenu : null,
          taf: lJSONRapportSaisie ? lJSONRapportSaisie.taf : null,
        });
      });
  }
  getListeTousEleves(aParam) {
    const lListeTousEleves = new ObjetListeElements();
    if (aParam.listeClassesEleves) {
      aParam.listeClassesEleves.parcourir((aClasse) => {
        if (!!aClasse.listeEleves) {
          lListeTousEleves.add(aClasse.listeEleves);
        }
      });
    }
    lListeTousEleves.trier();
    return lListeTousEleves;
  }
  getListeSelectionEleves(aParam) {
    let lListeSelectionEleves = new ObjetListeElements();
    if (!aParam.listeEleves || aParam.listeEleves.count() === 0) {
      lListeSelectionEleves = MethodesObjet.dupliquer(aParam.listeTousEleves);
    } else {
      aParam.listeEleves.parcourir((D) => {
        const lEleve = MethodesObjet.dupliquer(D);
        lEleve.Genre = EGenreRessource.Eleve;
        lListeSelectionEleves.addElement(lEleve);
      });
    }
    return lListeSelectionEleves;
  }
  majDataTAFSurModifPublic(aParam) {
    const lTAF = aParam.data;
    let lEstPourTousInitial = lTAF.estPourTous;
    const lListeDetaches = new ObjetListeElements();
    const lListeEnCours = new ObjetListeElements();
    aParam.listeTousEleves.parcourir((aElement) => {
      if (aElement.estElevesDetachesDuCours) {
        lListeDetaches.addElement(aElement);
      } else {
        lListeEnCours.addElement(aElement);
      }
    });
    lTAF.listeEleves = new ObjetListeElements();
    const lListe = aParam.listeRessourcesSelectionnees;
    if (!lListeDetaches || lListeDetaches.count() === 0) {
      lTAF.estPourTous = lListe.count() === aParam.listeTousEleves.count();
    } else {
      lTAF.estPourTous =
        lListe.count() === lListeEnCours.count() &&
        lListe.getIndiceElementParFiltre((aElement) => {
          return aElement.estElevesDetachesDuCours;
        }) === -1;
    }
    lTAF.pourTousLesEleves = lTAF.estPourTous;
    lTAF.nbrEleves = lListe.count();
    if (!lTAF.estPourTous) {
      lListe.parcourir((D) => {
        D.setEtat(EGenreEtat.Modification);
        lTAF.listeEleves.addElement(D);
      });
    } else {
      if (lEstPourTousInitial !== lTAF.estPourTous) {
        lTAF.avecModificationPublic = true;
      }
    }
    lTAF.setEtat(EGenreEtat.Modification);
  }
  getListeRessourcesDeGenre(aParam) {
    return aParam.data.ListePieceJointe.getListeElements((aElt) => {
      const lParam = { documentJoint: aElt };
      if (
        aParam.genreRessource === EGenreDocumentJoint.LienKiosque ||
        aParam.genreRessource === EGenreDocumentJoint.Url
      ) {
        $.extend(lParam, { afficherIconeDocument: false });
      }
      aElt.libelleHtml = GChaine.composerUrlLienExterne(lParam);
      if (aElt.getGenre() === aParam.genreRessource) {
        aElt.avecSaisie = aParam.avecSaisie;
      }
      return aElt.getGenre() === aParam.genreRessource;
    });
  }
  majDataSurRemoveRessource(aParam) {
    const lRessource = aParam.data.ListePieceJointe.getElementParNumeroEtGenre(
      aParam.numeroRessource,
      aParam.genreRessource,
    );
    if (lRessource !== null && lRessource !== undefined) {
      lRessource.setEtat(EGenreEtat.Suppression);
    }
  }
  majDataContenuCdT(aParam) {
    if (!aParam.contenu || !aParam.cdt) {
      return;
    }
    if (
      aParam.contenuARemplacer !== null &&
      aParam.contenuARemplacer !== undefined
    ) {
      aParam.contenuARemplacer.setEtat(EGenreEtat.Suppression);
      aParam.contenuARemplacer.ListePieceJointe.parcourir((D) => {
        D.setEtat(EGenreEtat.Suppression);
      });
    }
    const lContenu = MethodesObjet.dupliquer(aParam.contenu);
    aParam.cdt.listeContenus.addElement(lContenu);
    aParam.cdt.setEtat(EGenreEtat.Modification);
    lContenu.setEtat(EGenreEtat.Creation);
    lContenu.ListePieceJointe.parcourir((D) => {
      D.setEtat(EGenreEtat.Creation);
    });
    lContenu.listeExecutionQCM.parcourir((D) => {
      D.setEtat(EGenreEtat.Creation);
    });
  }
  majDataTAFCdT(aParam) {
    if (!aParam.taf || !aParam.cdt) {
      return;
    }
    if (aParam.tafARemplacer) {
      aParam.tafARemplacer.setEtat(EGenreEtat.Suppression);
      aParam.tafARemplacer.ListePieceJointe.parcourir((D) => {
        D.setEtat(EGenreEtat.Suppression);
      });
    }
    const lTAF = MethodesObjet.dupliquer(aParam.taf);
    aParam.cdt.ListeTravailAFaire.addElement(lTAF);
    aParam.cdt.setEtat(EGenreEtat.Modification);
    lTAF.PourLe = aParam.date;
    lTAF.listeEleves = new ObjetListeElements();
    lTAF.estPourTous = true;
    lTAF.pourTousLesEleves = true;
    lTAF.setEtat(EGenreEtat.Creation);
    if (lTAF.executionQCM) {
      lTAF.executionQCM.setEtat(EGenreEtat.Creation);
    } else {
      lTAF.ListePieceJointe.parcourir((D) => {
        D.setEtat(EGenreEtat.Creation);
      });
    }
  }
  majDataListeTAFsCdT(aParam) {
    if (!aParam.cdt || !aParam.listeTAFs || !aParam.date) {
      return;
    }
    for (let I = 0; I < aParam.cdt.ListeTravailAFaire.count(); I++) {
      let lTAF = aParam.cdt.ListeTravailAFaire.get(I);
      lTAF.setEtat(EGenreEtat.Suppression);
      for (let J = 0; J < lTAF.ListePieceJointe.count(); J++) {
        let lPJ = lTAF.ListePieceJointe.get(J);
        lPJ.setEtat(EGenreEtat.Suppression);
      }
    }
    aParam.listeTAFs.parcourir((aTaf) => {
      if (aTaf.getNumero() !== 0) {
        this.majDataTAFCdT({ cdt: aParam.cdt, taf: aTaf, date: aParam.date });
      }
    });
    aParam.cdt.ListeTravailAFaire.trier();
  }
  majDataSurCollerCdT(aParam) {
    if (!aParam.cible || !aParam.source) {
      return;
    }
    aParam.cible.publie = aParam.source.publie;
    aParam.cible.setEtat(EGenreEtat.Modification);
    aParam.cible.listeContenus.parcourir((aContenu) => {
      aContenu.setEtat(EGenreEtat.Suppression);
      aContenu.ListePieceJointe.parcourir((D) => {
        D.setEtat(EGenreEtat.Suppression);
      });
    });
    aParam.source.listeContenus.parcourir((aContenu) => {
      if (aContenu.getNumero() !== 0 && !this.estContenuVide(aContenu)) {
        this.majDataContenuCdT({ cdt: aParam.cible, contenu: aContenu });
      }
    });
    this.majDataListeTAFsCdT({
      cdt: aParam.cible,
      listeTAFs: aParam.source.ListeTravailAFaire,
      date: aParam.dateTAF,
    });
    if (aParam.avecCopieEltPgm && aParam.source.listeElementsProgrammeCDT) {
      if (!aParam.cible.listeElementsProgrammeCDT) {
        aParam.cible.listeElementsProgrammeCDT = new ObjetListeElements();
      }
      aParam.cible.listeElementsProgrammeCDT = new ObjetListeElements().add(
        aParam.source.listeElementsProgrammeCDT,
      );
      aParam.cible.listeElementsProgrammeCDT.avecSaisie = true;
      aParam.cible.listeElementsProgrammeCDT.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
  }
  getTitreExecutionQCM(aParam) {
    const H = [];
    const lExec = aParam.execQCM;
    const lAction = "";
    H.push(
      "<div>",
      lExec.estEnPublication === true
        ? GTraductions.getValeur("ExecutionQCM.RepondreQCM")
        : GDate.formatDate(
            lExec.dateDebutPublication,
            "" +
              GTraductions.getValeur("ExecutionQCM.QCMPublieLe") +
              " %J %MMMM",
          ),
      " : ",
      "<span",
      lAction,
      ">",
      lExec.QCM.getLibelle(),
      "</span>",
      "</div>",
    );
    return H.join("");
  }
  getHtmlTAFExecutionQCM(aParam) {
    const H = [];
    const lExec = aParam.execQCM;
    H.push(
      aParam.descriptif,
      " (",
      UtilitaireQCM.getStrResumeModalites(lExec, true),
      ")",
    );
    H.push("<br />");
    const lAction = "";
    const lHtml =
      "<span " +
      lAction +
      ">" +
      GDate.formatDate(lExec.dateDebutPublication, "%JJ/%MM - %hh%sh%mm") +
      "</span> ";
    H.push(
      GTraductions.getValeur("CahierDeTexte.taf.DisponibleAPartirDuNet", [
        lHtml,
      ]),
    );
    if (!aParam.CDTPublie) {
      H.push(
        "(",
        GTraductions.getValeur("CahierDeTexte.taf.SousReserveQueCDTSoitPublie"),
        ")",
      );
    }
    return H.join("");
  }
  composeHtmlLigneQCM(aParam) {
    const lHtml = [];
    lHtml.push(
      '<div style="display:flex; flex-wrap:nowrap;">',
      '<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
      "<div>",
      aParam.libelle,
      "</div>",
      "</div>",
    );
    return lHtml.join("");
  }
}
module.exports = { ObjetMoteurCDT, EGenreEvntCdT };
