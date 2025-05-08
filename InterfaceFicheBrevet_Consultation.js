const {
  ObjetRequetePageFicheBrevet,
} = require("ObjetRequetePageFicheBrevet.js");
const { GUID } = require("GUID.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_FicheBrevetCompetence,
} = require("DonneesListe_FicheBrevetCompetence.js");
const {
  DonneesListe_FicheBrevetResultat,
} = require("DonneesListe_FicheBrevetResultat.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetZoneTexte } = require("ObjetZoneTexte.js");
const {
  TypeEnseignementComplementUtil,
} = require("TypeEnseignementComplement.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const {
  TypePointsEnseignementComplementUtil,
} = require("TypePointsEnseignementComplement.js");
const { Type3Etats } = require("Type3Etats.js");
class InterfaceFicheBrevet extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.idPage = GUID.getId();
    this.idMessage = GUID.getId();
    this.idEnseignementComplTitreAvis = GUID.getId();
    this.idEnseignementComplAvis = GUID.getId();
    this.idEnseignementComplAppreciation = GUID.getId();
  }
  construireInstances() {
    this.identListeCompetence = this.add(
      ObjetListe,
      null,
      _initialiserCompetence,
    );
    this.identEnseignementCompl = this.add(
      ObjetListe,
      null,
      _initialiserEnseignementCompl.bind(this),
    );
    this.identEnseignementComplPoints = this.add(ObjetZoneTexte);
    this.avecBandeau = true;
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      estPasCFG() {
        return !aInstance.estCFG;
      },
      estCFG() {
        return !!aInstance.estCFG;
      },
      messageCFG() {
        if (!aInstance.recu) {
          return "";
        }
        switch (aInstance.recu.getGenre()) {
          case Type3Etats.TE_Oui:
            return GTraductions.getValeur("FicheBrevet.CFG.obtenue");
          case Type3Etats.TE_Non:
            return GTraductions.getValeur("FicheBrevet.CFG.nonObtenue");
          default:
            return "";
        }
      },
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div id="',
      this.idPage,
      '" class="Espace" style="display: none;">',
    );
    H.push(
      '<div id="',
      this.getNomInstance(this.identListeCompetence),
      '"></div>',
    );
    H.push(
      '<div class="EspaceHaut10" id="',
      this.getNomInstance(this.identEnseignementCompl),
      '" ie-display="estPasCFG" ></div>',
    );
    H.push('<div class="NoWrap EspaceHaut10" ie-display="estPasCFG">');
    H.push(
      '<div class="InlineBlock AlignementMilieuVertical Gras" id="',
      this.idEnseignementComplTitreAvis,
      '" ></div>',
    );
    H.push(
      '<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
      this.idEnseignementComplAvis,
      '" ></div>',
    );
    H.push("</div>");
    H.push(
      '<div class="EspaceHaut" style="width:850px" id="',
      this.idEnseignementComplAppreciation,
      '" ie-display="estPasCFG" ></div>',
    );
    H.push(
      `<div ie-display="estCFG" class="ie-titre m-top-xxl" ie-html="messageCFG"></div>`,
    );
    H.push("</div>");
    H.push('<div id="', this.idMessage, '"></div>');
    return H.join("");
  }
  evenementAfficherMessage(aGenreMessage) {
    GHtml.setDisplay(this.idPage, false);
    GHtml.setDisplay(this.idMessage, true);
    this.afficherBandeau(true);
    const lMessage =
      typeof aGenreMessage === "number"
        ? GTraductions.getValeur("Message")[aGenreMessage]
        : aGenreMessage;
    GHtml.setHtml(this.idMessage, this.composeMessage(lMessage));
  }
  recupererDonnees() {
    new ObjetRequetePageFicheBrevet(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete({ eleve: GEtatUtilisateur.getMembre() });
  }
  actionSurRecupererDonnees(aJSON) {
    if (aJSON.message) {
      this.evenementAfficherMessage(aJSON.message);
    } else {
      this.estCFG = aJSON.estCFG;
      if (this.estCFG) {
        this.initCFG(aJSON);
        return;
      }
      this.donneesRecu = true;
      this.competences = aJSON.competences;
      this.complements = aJSON.Complements;
      this.appGenerale = aJSON.appGenerale;
      GHtml.setDisplay(this.idPage, true);
      const lMessageEnseignementComplTitreAvis =
        GTraductions.getValeur("FicheBrevet.AvisChefEtablissement") + " :";
      const lMessageEnseignementComplAvis =
        this.appGenerale.avisChefDEtablissement.getLibelle();
      const lMessageEnseignementComplAppreciation =
        this.appGenerale.appreciationAnnuelle.getLibelle();
      GHtml.setHtml(
        this.idEnseignementComplTitreAvis,
        lMessageEnseignementComplTitreAvis,
      );
      GHtml.setHtml(
        this.idEnseignementComplAvis,
        lMessageEnseignementComplAvis,
      );
      GHtml.setHtml(
        this.idEnseignementComplAppreciation,
        lMessageEnseignementComplAppreciation,
      );
      const lListeResult = new ObjetListeElements();
      const lResult = new ObjetElement(
        TypeEnseignementComplementUtil.getLibelle(
          this.complements.enseignementComplement.getGenre(),
        ),
        undefined,
        TypePointsEnseignementComplementUtil.getLibelle(
          this.complements.nombreDePoints.getGenre(),
        ),
      );
      lResult.points = TypePointsEnseignementComplementUtil.getPoints(
        this.complements.nombreDePoints.getGenre(),
      );
      lListeResult.addElement(lResult);
      this.afficherListeCompetence();
      this.getInstance(this.identEnseignementCompl).setDonnees(
        new DonneesListe_FicheBrevetResultat(lListeResult),
      );
      this.getInstance(this.identEnseignementComplPoints).setDonnees(
        TypePointsEnseignementComplementUtil.getLibelle(
          this.complements.nombreDePoints.getGenre(),
        ),
      );
      GHtml.setDisplay(this.idEnseignementComplTitreAvis, false);
      if (
        this.appGenerale.avisChefDEtablissement.getLibelle() ||
        this.appGenerale.appreciationAnnuelle.getLibelle()
      ) {
        GHtml.setDisplay(this.idEnseignementComplTitreAvis, true);
        GHtml.setDisplay(this.idEnseignementComplAvis, true);
        GHtml.setDisplay(this.idEnseignementComplAppreciation, true);
      }
      this.activerImpression();
    }
  }
  initCFG(aJSON) {
    this.donneesRecu = true;
    this.competences = aJSON.competences;
    this.recu = aJSON.recu;
    GHtml.setDisplay(this.idPage, true);
    this.afficherListeCompetence();
    this.activerImpression();
  }
  afficherListeCompetence() {
    this.getInstance(this.identListeCompetence).setDonnees(
      new DonneesListe_FicheBrevetCompetence(this.competences, {}),
    );
  }
  activerImpression() {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.GenerationPDF,
      this,
      () => {
        return {
          genreGenerationPDF: TypeHttpGenerationPDFSco.FicheBrevet,
          eleve: GEtatUtilisateur.getMembre(),
        };
      },
    );
  }
}
function _initialiserCompetence(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.competences,
    taille: 400,
    titre: GTraductions.getValeur("FicheBrevet.titre.DomainesSocle"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.maitrise,
    taille: 250,
    titre: GTraductions.getValeur("FicheBrevet.titre.Maitrise"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.points,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Points"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.bareme,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Bareme"),
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: true,
    avecLigneTotal: true,
  });
}
function _initialiserEnseignementCompl(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_FicheBrevetResultat.colonnes.competences,
    taille: 400,
    titre: GTraductions.getValeur("FicheBrevet.EnseignementsComplements"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetResultat.colonnes.objectifs,
    taille: 250,
    titre: GTraductions.getValeur("FicheBrevet.Objectifs"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetResultat.colonnes.points,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Points"),
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: true,
  });
}
module.exports = InterfaceFicheBrevet;
