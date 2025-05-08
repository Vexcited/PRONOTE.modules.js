exports.InterfacePageProgrammesBO = void 0;
const ObjetRequeteProgrammesBO_1 = require("ObjetRequeteProgrammesBO");
const DonneesListe_ProgrammesBO_1 = require("DonneesListe_ProgrammesBO");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_Progression_1 = require("ObjetFenetre_Progression");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequeteSaisieCDTProgressions_1 = require("ObjetRequeteSaisieCDTProgressions");
const TypeGenreCumul_1 = require("TypeGenreCumul");
class InterfacePageProgrammesBO extends InterfacePage_1.InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.idProgramme = GUID_1.GUID.getId();
    this.idProgrammeConteneur = GUID_1.GUID.getId();
    this.indiceCumul = 0;
    this.matiere = null;
  }
  construireInstances() {
    this.ajouterEvenementGlobal(
      Enumere_Event_1.EEvent.SurPreResize,
      this._surPreResize,
    );
    this.ajouterEvenementGlobal(
      Enumere_Event_1.EEvent.SurPostResize,
      this._surPostResize,
    );
    const lPage = GApplication.getEtatUtilisateur().getPage();
    this.indiceCumul = lPage && lPage.indiceCumul >= 0 ? lPage.indiceCumul : 0;
    this.matiere = lPage && lPage.matiere ? lPage.matiere : null;
    this.identListe = this.add(
      ObjetListe_1.ObjetListe,
      this._evenementSurListeProgrammesBO,
      this._initialiserListeProgrammesBO,
    );
    this.identComboTypeCumuls = this.add(
      ObjetSaisie_1.ObjetSaisie,
      this._evenementSurCombo,
      this._initialiserComboTypeCumuls,
    );
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.AddSurZone = [this.identComboTypeCumuls];
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
  }
  _evenementSurListeProgrammesBO(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
        this.indiceProgramme = aParametres.ligne;
        const lProgramme = aParametres.article;
        if (!lProgramme.estFeuille) {
          this.viderProgramme();
        } else if (lProgramme.html) {
          this._actionSurRecupererDonnees(lProgramme, null, lProgramme.html);
        } else {
          new ObjetRequeteProgrammesBO_1.ObjetRequeteProgrammesBO(
            this,
            this._actionSurRecupererDonnees.bind(this, lProgramme),
          ).lancerRequete(lProgramme);
        }
        break;
      }
    }
  }
  _evenementSurCombo(aParams) {
    if (
      aParams.genreEvenement ===
      Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
    ) {
      if (aParams.indice !== this.indiceCumul) {
        this.indiceCumul = aParams.indice;
        ObjetHtml_1.GHtml.setHtml(this.idProgramme, "");
        this.recupererDonnees();
      }
    }
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(`<div class="flex-contain full-size flex-gap-xl p-all-l">`);
    H.push(
      `<div class="fix-bloc" id="${this.getNomInstance(this.identListe)}" style="width: 500px;"></div>`,
    );
    H.push(
      `<div class="fluid-bloc flex-contain" id="${this.idProgrammeConteneur}" ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Document)} tabindex="0">`,
    );
    H.push(
      `<div  class="fluid-bloc" id="${this.idProgramme}" style="overflow-y:auto;"></div>`,
    );
    H.push(`</div>`);
    H.push(`</div>`);
    return H.join("");
  }
  recupererDonnees() {
    this.listeCumuls = new ObjetListeElements_1.ObjetListeElements();
    this.listeCumuls.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("progression.cumulNiveau"),
        null,
        TypeGenreCumul_1.TypeGenreCumul.Cumul_Niveau,
      ),
    );
    this.listeCumuls.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("progression.cumulMatiere"),
        null,
        TypeGenreCumul_1.TypeGenreCumul.Cumul_Matiere,
      ),
    );
    new ObjetRequeteProgrammesBO_1.ObjetRequeteProgrammesBO(
      this,
      this._actionSurRecupererDonnees.bind(this, null),
    ).lancerRequete(null, this.listeCumuls.get(this.indiceCumul), this.matiere);
  }
  afficherPage() {
    this.recupererDonnees();
  }
  _actionSurRecupererDonnees(aProgrammeCourant, aListeProgrammes, aProgramme) {
    this.programme = aProgramme;
    if (aProgramme) {
      aProgrammeCourant.html = aProgramme;
      this.viderProgramme();
      this.remplirProgramme();
    } else if (aListeProgrammes) {
      this.listeProgrammes = aListeProgrammes;
      this.getInstance(this.identListe).setDonnees(
        new DonneesListe_ProgrammesBO_1.DonneesListe_ProgrammesBO(
          this.listeProgrammes,
          this.listeCumuls.get(this.indiceCumul).getGenre(),
          this._surCopierLeProgramme.bind(this),
        ),
      );
      this.getInstance(this.identComboTypeCumuls).setDonnees(
        this.listeCumuls,
        this.indiceCumul,
      );
    }
  }
  _surPreResize() {
    this.viderProgramme();
  }
  _surPostResize() {
    this.remplirProgramme();
  }
  viderProgramme() {
    ObjetHtml_1.GHtml.setHtml(this.idProgramme, "");
    $("#" + this.idProgramme.escapeJQ()).height(0);
  }
  remplirProgramme() {
    if (this.programme) {
      const lJqProgramme = $("#" + this.idProgramme.escapeJQ());
      const lHeight = $("#" + this.idProgrammeConteneur.escapeJQ()).height();
      lJqProgramme.height(lHeight);
      ObjetHtml_1.GHtml.setHtml(this.idProgramme, this.programme);
      $(`#${this.idProgramme.escapeJQ()} ul`).addClass("browser-default");
    }
  }
  _initialiserListeProgrammesBO(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ProgrammesBO_1.DonneesListe_ProgrammesBO.colonnes
        .libelle,
      taille: 480,
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      boutons: [
        { genre: ObjetListe_1.ObjetListe.typeBouton.deployer, deploye: false },
      ],
    });
  }
  _initialiserComboTypeCumuls(aInstance) {
    aInstance.setOptionsObjetSaisie({
      longueur: 100,
      labelledById: this.applicationSco.idBreadcrumb,
    });
    aInstance.setControleNavigation(true);
  }
  _evenementSurFenetreProgression(
    aListeProgressions,
    aNumeroBouton,
    aIndiceSelection,
  ) {
    this.setEtatSaisie(false);
    if (aNumeroBouton !== 1) {
      return;
    }
    const lProgression = aListeProgressions.get(aIndiceSelection);
    if (!lProgression) {
      return;
    }
    const lProgramme = this.listeProgrammes.get(this.indiceProgramme);
    if (!lProgramme) {
      return;
    }
    lProgression.creationAutomatique = true;
    lProgression.programmeReference =
      MethodesObjet_1.MethodesObjet.dupliquer(lProgramme);
    lProgression.avecOptionsProgression = true;
    this.viderProgramme();
    new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
      this,
      this.afficherPage,
    ).lancerRequete(aListeProgressions);
  }
  _callbackCreationProgression(aListeProgressions, aInstanceFenetre) {
    this.setEtatSaisie(false);
    if (aInstanceFenetre) {
      aInstanceFenetre.fermer();
    }
    new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
      this,
      this._surCopierLeProgramme,
    ).lancerRequete(aListeProgressions);
  }
  _surReponseRequeteListeCDTProgression(
    aListeProgressions,
    aListeNiveaux,
    aListeCategories,
    aListeDocumentsJoints,
    aListeProgressionsPublicPourCopie,
  ) {
    const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_Progression_1.ObjetFenetre_Progression,
      {
        pere: this,
        evenement: this._evenementSurFenetreProgression.bind(
          this,
          aListeProgressions,
        ),
      },
      {
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "progression.CopierLeProgramme",
        ),
      },
    );
    lInstance.setDonnees({
      listeProgressions: aListeProgressions,
      listeProgressionsPublicPourCopie: aListeProgressionsPublicPourCopie,
      listeNiveaux: aListeNiveaux,
      avecCreation: true,
      callbackFinCreation: this._callbackCreationProgression.bind(
        this,
        aListeProgressions,
        lInstance,
      ),
    });
  }
  _surCopierLeProgramme() {
    this.setEtatSaisie(false);
    new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
      this,
      this._surReponseRequeteListeCDTProgression,
    ).lancerRequete({
      AvecMatiereNiveau: true,
      avecListeCategorieEtDocJoints: false,
      avecListeProgrammesNiveaux: true,
      avecDossierProgression: false,
    });
  }
}
exports.InterfacePageProgrammesBO = InterfacePageProgrammesBO;
