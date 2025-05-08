const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetRequeteListeServices } = require("ObjetRequeteListeServices.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { GDate } = require("ObjetDate.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GImage } = require("ObjetImage.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { MethodesObjet } = require("MethodesObjet.js");
Requetes.inscrire("listeClassesGroupes", ObjetRequeteConsultation);
Requetes.inscrire("ListePeriodes", ObjetRequeteConsultation);
Requetes.inscrire("ListeEleves", ObjetRequeteConsultation);
class MoteurSelectionContexte {
  constructor() {
    this.selection = { classe: null };
  }
  getListeClasses(aParam) {
    if (
      [
        EGenreEspace.Mobile_Etablissement,
        EGenreEspace.Mobile_Administrateur,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      _actionSurGetListeClasses.call(this, aParam);
    } else {
      Requetes("listeClassesGroupes", this, (aJSON) => {
        _actionSurGetListeClasses.call(this, aParam, aJSON);
      }).lancerRequete();
    }
  }
  getListePeriodes(aParam) {
    Requetes("ListePeriodes", this, (aXML) => {
      const lListePeriodes = _actionSurGetListePeriodes.call(this, aXML);
      if (!!lListePeriodes) {
        const lParamClbck = { listeElts: lListePeriodes };
        aParam.clbck.call(aParam.pere, lParamClbck);
      }
    }).lancerRequete({ ressource: aParam.classe });
  }
  getListeServices(aParam) {
    new ObjetRequeteListeServices(this, (aXML) => {
      const lListeServices = _actionSurGetListeServices.call(this, aXML);
      if (!!lListeServices) {
        const lDefault = _getServiceParDefaut.call(this, lListeServices, {
          classe: aParam.classe,
        });
        const lIndiceDefault = lListeServices.getIndiceParElement(lDefault);
        const lParamClbck = {
          listeElts: lListeServices,
          indiceEltParDefaut: lIndiceDefault,
        };
        aParam.clbck.call(aParam.pere, lParamClbck);
      }
    }).lancerRequete(aParam.utilisateur, aParam.classe, aParam.periode);
  }
  getListeEleves(aParam) {
    GEtatUtilisateur.Navigation.setRessource(
      EGenreRessource.Classe,
      aParam.classe,
    );
    Requetes("ListeEleves", this, (aJSON) => {
      const lListeEleves = _actionSurRequeteListeEleves.call(
        this,
        aParam,
        aJSON,
      );
      if (!!lListeEleves) {
        const lParamClbck = { listeElts: lListeEleves };
        aParam.clbck.call(aParam.pere, lParamClbck);
      }
    }).lancerRequete({
      ressource: aParam.classe,
      listeRessources: GEtatUtilisateur.Navigation.getRessources(
        EGenreRessource.Classe,
      ).setSerialisateurJSON({ ignorerEtatsElements: true }),
    });
  }
  getLibelleMenu(aParam) {
    switch (aParam.genreRessource) {
      case EGenreRessource.Classe:
        return aParam.avecGroupe === true
          ? GTraductions.getValeur("competences.ClasseGroupe")
          : GTraductions.getValeur("Classe");
      case EGenreRessource.Matiere:
        return GTraductions.getValeur("Matiere");
      case EGenreRessource.Periode:
        return GTraductions.getValeur("Periode");
      case EGenreRessource.Pilier:
        return GTraductions.getValeur("Competence");
      case EGenreRessource.Service:
        return GTraductions.getValeur("Service");
      case EGenreRessource.Eleve:
        return GTraductions.getValeur("Eleve");
      case EGenreRessource.Competence:
        return GTraductions.getValeur("Competence");
      case EGenreRessource.Appreciation:
        return GTraductions.getValeur("Appreciation");
      case EGenreRessource.DisciplineLivretScolaire:
        return GTraductions.getValeur("Discipline");
      case EGenreRessource.Palier:
        return GTraductions.getValeur("competences.palier");
      case EGenreRessource.Salle:
        return GTraductions.getValeur("Salle");
      case EGenreRessource.Enseignant:
        return GTraductions.getValeur("Professeur");
      case EGenreRessource.Personnel:
        return GTraductions.getValeur("Personnel");
      case EGenreRessource.Materiel:
        return GTraductions.getValeur("Materiel");
      default:
        return null;
    }
  }
  getGenreMessageAucunElement(aGenreRessource) {
    switch (aGenreRessource) {
      case EGenreRessource.Classe:
        return EGenreMessage.AucuneClasseDisponible;
      case EGenreRessource.Matiere:
        return EGenreMessage.AucunMatiere;
      case EGenreRessource.Periode:
        return EGenreMessage.AucunePeriodes;
      case EGenreRessource.Pilier:
        return null;
      case EGenreRessource.Service:
        return EGenreMessage.AucunService;
      case EGenreRessource.Eleve: {
        const lRessource = GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Classe,
        );
        return lRessource && lRessource.getGenre() === EGenreRessource.Groupe
          ? EGenreMessage.AucunElevePourGroupe
          : EGenreMessage.AucunElevePourClasse;
      }
      case EGenreRessource.Appreciation:
        return EGenreMessage.AucunAppreciation;
      case EGenreRessource.DisciplineLivretScolaire:
        return EGenreMessage.AucuneDiciplineLivret;
      case EGenreRessource.Palier:
        return EGenreMessage.AucunPalier;
      case EGenreRessource.Salle:
        return EGenreMessage.AucuneSalleDisponible;
      case EGenreRessource.Enseignant:
      case EGenreRessource.Personnel:
        return null;
      case EGenreRessource.Materiel:
        return EGenreMessage.AucunMaterielDisponible;
      default:
        return null;
    }
  }
  remplirSelecteur(aParam) {
    const lListe = aParam.listeElts;
    aParam.instance.setDonnees(lListe, aParam.indiceEltParDefaut);
    const lCombo = aParam.instance.getCombo();
    lCombo.setActif(true);
    if (!lListe || lListe.count() === 0) {
      const lGenreMessageAucunElement = this.getGenreMessageAucunElement(
        aParam.genreRessource,
      );
      const lMsg = lGenreMessageAucunElement
        ? GTraductions.getValeur("Message")[lGenreMessageAucunElement]
        : "";
      aParam.clbck.call(aParam.pere, lMsg);
      const lLibelle = this.getLibelleMenu({
        genreRessource: aParam.genreRessource,
        avecGroupe: true,
      });
      lCombo.setOptionsObjetSaisie({ placeHolder: lLibelle });
      lCombo.setActif(false);
    }
  }
  formatterListeCours(aParam) {
    const lListeCours = aParam.listeCours;
    const lGenreTri =
      aParam.genreTri !== undefined && aParam.genreTri !== null
        ? aParam.genreTri
        : EGenreTriElement.Decroissant;
    if (lListeCours.count() > 0) {
      for (let i = 0, lNbr = lListeCours.count(); i < lNbr; i++) {
        const lElementCours = lListeCours.get(i);
        const lDateDebut = GDate.placeAnnuelleEnDate(
          lElementCours.Debut,
          false,
        );
        const lDateFin = GDate.placeAnnuelleEnDate(lElementCours.Fin, true);
        lElementCours.dateDebut = new Date(
          lElementCours.DateDuCours.getFullYear(),
          lElementCours.DateDuCours.getMonth(),
          lElementCours.DateDuCours.getDate(),
          lDateDebut.getHours(),
          lDateDebut.getMinutes(),
          lDateDebut.getSeconds(),
          lDateDebut.getMilliseconds(),
        );
        lElementCours.dateFin = new Date(
          lElementCours.DateDuCours.getFullYear(),
          lElementCours.DateDuCours.getMonth(),
          lElementCours.DateDuCours.getDate(),
          lDateFin.getHours(),
          lDateFin.getMinutes(),
          lDateFin.getSeconds(),
          lDateFin.getMilliseconds(),
        );
        lElementCours.Libelle =
          GDate.formatDate(lElementCours.DateDuCours, `[%JJJ %J %MMM]`) +
          " " +
          GDate.formatDate(
            lDateDebut,
            GTraductions.getValeur("De") + " %hh:%mm",
          ) +
          " " +
          GDate.formatDate(lDateFin, GTraductions.getValeur("A") + " %hh:%mm");
        const lPublics = [];
        for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
          const lElementContenu = lElementCours.ListeContenus.get(J);
          const lGenre = lElementContenu.getGenre();
          switch (lGenre) {
            case EGenreRessource.Classe:
            case EGenreRessource.PartieDeClasse:
            case EGenreRessource.Groupe:
              lPublics.push(lElementContenu.getLibelle());
              break;
          }
        }
        lElementCours.classe = lPublics.join(", ");
        lElementCours.sousTitre =
          (lElementCours.classe ? lElementCours.classe : "") +
          (lElementCours.estSortiePedagogique
            ? " - " + GTraductions.getValeur("EDT.AbsRess.SortiePedagogique")
            : "") +
          (lElementCours.matiere && lElementCours.matiere.getLibelle()
            ? " - " + lElementCours.matiere.getLibelle()
            : "") +
          (lElementCours.NomImageAppelFait
            ? " " +
              '<div class="InlineBlock AlignementMilieuVertical">' +
              GImage.composeImage(
                "Image_" + lElementCours.NomImageAppelFait,
                16,
              ) +
              "</div>"
            : "");
      }
      lListeCours.setTri([
        ObjetTri.init("DateDuCours", lGenreTri),
        ObjetTri.init("Debut", lGenreTri),
      ]);
      lListeCours.trier();
      return lListeCours;
    }
  }
}
function _actionSurGetListeClasses(aParam, aJSON) {
  const lListeClasse = [
    EGenreEspace.Mobile_Etablissement,
    EGenreEspace.Mobile_Administrateur,
  ].includes(GEtatUtilisateur.GenreEspace)
    ? GEtatUtilisateur.getListeClasses({
        avecClasse: true,
        avecGroupe: true,
        uniquementClasseEnseignee: true,
      })
    : aJSON.listeClassesGroupes;
  const lAvecMesServices =
    [EGenreEspace.Mobile_Professeur].includes(GEtatUtilisateur.GenreEspace) &&
    [EGenreOnglet.SaisieNotes].includes(GEtatUtilisateur.getGenreOnglet());
  const lListe = new ObjetListeElements();
  let lGenre;
  let lAvecClasse = false;
  let lAvecGroupe = false;
  for (let I = 0; I < lListeClasse.count(); I++) {
    lGenre = lListeClasse.getGenre(I);
    if (lGenre === EGenreRessource.Classe) {
      lAvecClasse = true;
    }
    if (lGenre === EGenreRessource.Groupe) {
      lAvecGroupe = true;
    }
  }
  lListe.add(lListeClasse);
  if (lAvecMesServices) {
    const lMesServices = new ObjetElement(
      GTraductions.getValeur("MesServices"),
      -1,
      EGenreRessource.Aucune,
      null,
    );
    lMesServices.AvecSelection = true;
    lListe.addElement(lMesServices);
  }
  if (lAvecClasse && lAvecGroupe) {
    let lElement = new ObjetElement(
      GTraductions.getValeur("Classe"),
      -1,
      EGenreRessource.Classe,
      null,
    );
    lElement.AvecSelection = false;
    lListe.addElement(lElement);
    lElement = new ObjetElement(
      GTraductions.getValeur("Groupe"),
      -1,
      EGenreRessource.Groupe,
      null,
    );
    lElement.AvecSelection = false;
    lListe.addElement(lElement);
  }
  lListe.setTri([
    ObjetTri.init((D) => {
      return D.getGenre() !== EGenreRessource.Aucune;
    }),
    ObjetTri.init((D) => {
      return D.getNumero() !== 0;
    }),
    ObjetTri.init((D) => {
      return D.getGenre() !== EGenreRessource.Classe;
    }),
    ObjetTri.init((D) => {
      return D.getNumero() !== -1;
    }),
    ObjetTri.init("Libelle"),
  ]);
  lListe.trier();
  if (!!lListe) {
    const lDefault = _getClasseParDefaut.call(this, lListe);
    const lIndiceDefault = lListe.getIndiceParElement(lDefault);
    const lParamClbck = {
      listeElts: lListe,
      indiceEltParDefaut: lIndiceDefault,
    };
    aParam.clbck.call(aParam.pere, lParamClbck);
  }
  return lListe;
}
function _getClasseParDefaut(aListeClasses) {
  let lClasse = null;
  if (this.selection.classe !== null && this.selection.classe !== undefined) {
    lClasse = aListeClasses.getElementParNumero(
      this.selection.classe.getNumero(),
    );
  }
  if (lClasse !== null && lClasse !== undefined) {
    return lClasse;
  }
  aListeClasses.parcourir((aElement) => {
    if (aElement.getNumero() !== 0 && aElement.getNumero() !== -1) {
      lClasse = aElement;
      return false;
    }
  });
  return lClasse;
}
function _actionSurGetListePeriodes(aXml) {
  return aXml.listePeriodes;
}
function _getServiceParDefaut(aListeServices, aParam) {
  let lServiceParDefaut = null;
  const lRessource = aParam.classe;
  aListeServices.parcourir((aElement) => {
    if (aElement._estSurProfesseur) {
      if (!lServiceParDefaut || aElement.estUnService) {
        if (
          !lServiceParDefaut ||
          !(
            lRessource.getGenre() === EGenreRessource.Classe &&
            aElement._estServicePartie
          )
        ) {
          lServiceParDefaut = aElement;
        }
      }
    }
  });
  return lServiceParDefaut;
}
function _actionSurGetListeServices(aListeServices) {
  const lListe = aListeServices;
  let lServicePere = null;
  lListe.parcourir((aElement) => {
    const lLibelleClasse = aElement.classe.getLibelle();
    const lLibelleGroupe = aElement.groupe.getLibelle();
    const lLibelleClasseGroupe =
      lLibelleClasse +
      (lLibelleClasse && lLibelleGroupe ? " > " : "") +
      lLibelleGroupe;
    let lLibelleProfesseurs = [];
    let lEstSurProfesseur = false;
    for (
      let I = 0;
      aElement.listeProfesseurs && I < aElement.listeProfesseurs.count();
      I++
    ) {
      lLibelleProfesseurs.push(aElement.listeProfesseurs.getLibelle(I));
      if (
        aElement.listeProfesseurs.getNumero(I) ===
        GEtatUtilisateur.getUtilisateur().getNumero()
      ) {
        lEstSurProfesseur = true;
      }
    }
    lLibelleProfesseurs = lLibelleProfesseurs.join("<br>");
    aElement._libelleClasseGroupe = lLibelleClasseGroupe;
    aElement._libelleProfesseurs = lLibelleProfesseurs;
    aElement._estSurProfesseur = lEstSurProfesseur;
    if (aElement.estUnService) {
      lServicePere = aElement;
    } else {
      aElement.pere = lServicePere;
      aElement.setLibelle("&nbsp;&nbsp;&nbsp;&nbsp;" + aElement.getLibelle());
    }
    const T = [];
    T.push(lLibelleClasseGroupe, " - ", lLibelleProfesseurs);
    aElement.sousTitre = T.join("");
  });
  lListe.setTri([
    ObjetTri.initRecursif("pere", [
      ObjetTri.init((D) => {
        return D.matiere && D.matiere.getNumero() ? 1 : 0;
      }),
      ObjetTri.init((D) => {
        return D.matiere ? D.matiere.getLibelle() : "";
      }),
      ObjetTri.init((D) => {
        return D._libelleClasseGroupe;
      }),
      ObjetTri.init((D) => {
        return D._libelleProfesseurs;
      }),
      ObjetTri.init((D) => {
        return !D.estUnService;
      }),
      ObjetTri.init((D) => {
        return D.getNumero();
      }),
    ]),
  ]);
  lListe.trier();
  return lListe;
}
function _actionSurRequeteListeEleves(aXml, aJSON) {
  const lListeEleves = new ObjetListeElements();
  if (this.avecDeLaClasse) {
    const lDonneeDeLaClasse = new ObjetElement(
      this.estUneClasse
        ? "< " + GTraductions.getValeur("DeLaClasse") + " >"
        : "< " + GTraductions.getValeur("DuGroupe") + " >",
      0,
      null,
      -1,
    );
    lListeEleves.addElement(lDonneeDeLaClasse);
  }
  aJSON.listeEleves.parcourir((D) => {
    const lEleve = MethodesObjet.dupliquer(D);
    lListeEleves.addElement(lEleve);
  });
  lListeEleves.setTri([
    ObjetTri.init((D) => {
      return D.getNumero() !== 0;
    }),
    ObjetTri.init("Position"),
  ]);
  lListeEleves.trier();
  return lListeEleves;
}
module.exports = { MoteurSelectionContexte };
