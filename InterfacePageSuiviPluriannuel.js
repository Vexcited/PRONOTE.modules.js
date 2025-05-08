const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const DonneesListe_SuiviPluriAnnuel = require("DonneesListe_SuiviPluriAnnuel.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { InterfacePage } = require("InterfacePage.js");
const ObjetRequetePageSuiviPluriannuel = require("ObjetRequetePageSuiviPluriannuel.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetFicheGraphe } = require("ObjetFicheGraphe.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const DonneesListe_SelectAnnees = require("DonneesListe_SelectAnnees.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { GChaine } = require("ObjetChaine.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { EGenreDocTelechargement } = require("Enumere_DocTelechargement.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_BulletinBIA } = require("ObjetFenetre_BulletinBIA.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetAffichagePageSuiviPluriannuel extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.listeAnnees = new ObjetListeElements();
    this.avecMoyennes = true;
  }
  construireInstances() {
    super.construireInstances();
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
      this.identTripleCombo = this.add(
        ObjetAffichagePageAvecMenusDeroulants,
        this.evenementSurDernierMenuDeroulant,
        initialiserTripleCombo,
      );
    }
    if (
      this.identTripleCombo !== null &&
      this.identTripleCombo !== undefined &&
      this.getInstance(this.identTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
    this.identPage = this.add(ObjetListe);
    this.identFicheGraphe = this.add(ObjetFicheGraphe);
    this.identFenetreSelectAnnees = this.addFenetre(
      ObjetFenetre_Liste,
      this.evenementFenetreSelectAnnees,
      this.initialiserSelectAnnees,
    );
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identPage;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({ separateur: true });
    this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
  }
  evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
    this.NumeroClasse = aLigneClasse.getNumero();
    this.NumeroEleve = aLigneEleve.getNumero();
    this.libelleEleve = aLigneEleve.getLibelle();
    this.NumeroPeriode = aLignePeriode.getNumero();
    this.GenrePeriode = aLignePeriode.getGenre();
    new ObjetRequetePageSuiviPluriannuel(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete(this.getNumeroEleve());
  }
  getNumeroEleve() {
    return GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
      ? this.NumeroEleve
      : GEtatUtilisateur.getMembre().getNumero();
  }
  getLibelleEleve() {
    return GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
      ? this.libelleEleve
      : GEtatUtilisateur.getMembre().getLibelle();
  }
  getTitleBoutonGraphe() {
    return GTraductions.getValeur("SuiviPluriannuel.titreGraphe", [
      this.getLibelleEleve(),
    ]);
  }
  recupererDonnees() {
    if (GEtatUtilisateur.GenreEspace !== EGenreEspace.Professeur) {
      new ObjetRequetePageSuiviPluriannuel(
        this,
        this.actionSurRecupererDonnees,
      ).lancerRequete(this.getNumeroEleve());
    }
  }
  actionSurRecupererDonnees(aParam) {
    this.afficherBandeau(true);
    this.setGraphe(null);
    if (aParam.message) {
      this.evenementAfficherMessage(aParam.message);
    } else {
      this.listeAnnees = aParam.listeAnnees;
      _initialiserListe.call(
        this.getInstance(this.identPage),
        aParam.nombreDAnnees,
        aParam.listeDonnees,
        aParam.afficherMoyenneGenerale,
      );
      const lData = new DonneesListe_SuiviPluriAnnuel({
        listeDonnees: aParam.listeDonnees,
        listeTotal: aParam.listeTotal,
        infosGrapheTotal: aParam.infosGrapheTotal,
        avecMoyennesSaisies: aParam.avecMoyennesSaisies,
      });
      this.getInstance(this.identPage).setDonnees(lData);
      this.actualiserGrapheSuiviPluriAnnuel(aParam);
    }
  }
  initialiserSelectAnnees(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_SelectAnnees.colonnes.coche,
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_SelectAnnees.colonnes.libelle,
      taille: "100%",
    });
    const lParamsListe = { optionsListe: { colonnes: lColonnes } };
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("SuiviPluriannuel.choixAnnees"),
      largeur: 250,
      hauteur: 250,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      modeActivationBtnValider:
        aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
    });
    aInstance.paramsListe = lParamsListe;
  }
  ouvrirFenetreSelectionAnnees() {
    this.getInstance(this.identFenetreSelectAnnees).setDonnees(
      new DonneesListe_SelectAnnees(this.listeAnnees),
      false,
    );
  }
  evenementFenetreSelectAnnees(aGenreBouton) {
    if (aGenreBouton === 1) {
      this.actionApresFiltre();
    }
  }
  actionApresFiltre() {
    const lAnnees = this.listeAnnees.getListeElements((aElement) => {
      return !!aElement.cmsActif;
    });
    const lAnneesGraphe = new TypeEnsembleNombre();
    lAnneesGraphe.add(lAnnees.getTableauNumeros());
    this.copieAnnees = MethodesObjet.dupliquer(this.listeAnnees);
    new ObjetRequetePageSuiviPluriannuel(
      this,
      this.actionSurRecupererGraphe,
    ).lancerRequete(this.getNumeroEleve(), {
      annees: lAnneesGraphe,
      avecMoyennes: this.avecMoyennes,
    });
  }
  actionSurRecupererGraphe(aParam) {
    if (this.copieAnnees) {
      this.listeAnnees = this.copieAnnees;
    }
    this.actualiserGrapheSuiviPluriAnnuel(aParam);
  }
  actualiserGrapheSuiviPluriAnnuel(aParam) {
    const lInterface = this;
    const lAnnees = this.listeAnnees.getListeElements((aElement) => {
      return !!aElement.cmsActif;
    });
    const lGraphe = !!this.avecMoyennes
      ? aParam.grapheAvecMoyenne
      : aParam.grapheSansMoyenne;
    this.setGraphe(
      {
        image: [lGraphe],
        titre: GTraductions.getValeur("SuiviPluriannuel.titreGraphe", [
          this.getLibelleEleve(),
        ]),
        message: aParam.grapheMessage,
        alt: _construireAltGraph.call(this, aParam),
      },
      {
        controleur: {
          btnAnnees: {
            event: function () {
              lInterface.ouvrirFenetreSelectionAnnees();
            },
          },
          cbMoyennes: {
            getValue: function () {
              return !!lInterface.avecMoyennes;
            },
            setValue: function (aValue) {
              lInterface.avecMoyennes = aValue;
              lInterface.actualiserGrapheSuiviPluriAnnuel(aParam);
            },
          },
        },
        filtres: [
          {
            html:
              '<span class="EspaceDroit">' +
              GChaine.insecable(
                GTraductions.getValeur("SuiviPluriannuel.labelAnneesGraphe", [
                  lAnnees.getNumero(0),
                  lAnnees.get(lAnnees.count() - 1).strFin,
                ]),
              ) +
              '</span><ie-bouton ie-model="btnAnnees" class="Texte9">...</ie-bouton>',
          },
          {
            html:
              '<ie-checkbox ie-model="cbMoyennes" class="NoWrap">' +
              GChaine.insecable(
                GTraductions.getValeur("SuiviPluriannuel.avecMoyennes"),
              ) +
              "</ie-checkbox>",
          },
        ],
      },
    );
    this.actualiserFicheGraphe();
  }
}
function _getTitreAnnee(aListeDonnees, aIndice) {
  const lHtml = [];
  lHtml.push(
    '<div class="flex-contain cols justify-center p-y-l" style="',
    GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.bas),
    '">',
  );
  lHtml.push('  <div class="flex-contain flex-center justify-center">');
  lHtml.push(
    '    <div class="fix-bloc i-small m-right" style="',
    GStyle.composeCouleurFond(aListeDonnees.get(0)["annee" + aIndice].couleur),
    '"></div>',
  );
  lHtml.push(
    '    <div class="regular">',
    aListeDonnees.get(0)["annee" + aIndice].strAnnee,
    "</div>",
  );
  lHtml.push("  </div>");
  if (aListeDonnees.get(0)["annee" + aIndice].avecBulletins) {
    lHtml.push(
      '<div class="AvecMain m-top" ie-node="nodeAfficherBulletin(',
      aIndice,
      ')">',
    );
    lHtml.push('  <div class="InlineBlock Image_BtnPDF"></div>');
    lHtml.push(
      '  <div class="InlineBlock AlignementHaut PetitEspaceHaut">',
      GTraductions.getValeur("SuiviPluriannuel.bulletins"),
      "</div>",
    );
    lHtml.push("</div>");
  }
  lHtml.push("</div>");
  lHtml.push(
    '<div class="PetitEspace">',
    aListeDonnees.get(0)["annee" + aIndice].strClasses,
    "</div>",
  );
  return lHtml.join("");
}
function _initialiserListe(aNombreAnnees, aListeDonnees, aAfficherMoyenne) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_SuiviPluriAnnuel.colonnes.matiere,
    titre: GTraductions.getValeur("SuiviPluriannuel.matiere"),
    taille: 200,
  });
  for (let i = 0; i < aNombreAnnees; i++) {
    lColonnes.push({
      id: DonneesListe_SuiviPluriAnnuel.colonnes.annee + i,
      titre: {
        libelleHtml: _getTitreAnnee.call(this, aListeDonnees, i),
        controleur: {
          nodeAfficherBulletin(aIndice) {
            $(this.node).on("click", () => {
              const lLargeur = 500;
              const lInstance = ObjetFenetre.creerInstanceFenetre(
                ObjetFenetre_BulletinBIA,
                { pere: this },
                {
                  titre: GTraductions.getValeur("SuiviPluriannuel.bulletins"),
                  largeur: lLargeur,
                  hauteur: 450,
                },
              );
              const lListeDocs = new ObjetListeElements();
              aListeDonnees
                .get(0)
                ["annee" + aIndice].listeBulletins.parcourir((aBulletin) => {
                  const lElement = new ObjetElement();
                  lElement.typeDocument = EGenreDocTelechargement.bulletinBIA;
                  lElement.bulletin = aBulletin;
                  lElement.annee = aBulletin.annee;
                  lElement.event = function () {
                    GenerationPDF.genererPDF({
                      paramPDF: {
                        genreGenerationPDF:
                          TypeHttpGenerationPDFSco.BulletinBIA,
                        nomFichier: aBulletin.nomFichier,
                        ident: aBulletin.ident,
                      },
                    });
                  };
                  lListeDocs.addElement(lElement);
                });
              lInstance.setDonnees({
                listeDocs: lListeDocs,
                avecNotes: true,
                avecCompetences: true,
                avecCertificat: false,
              });
              lInstance.afficher();
            });
          },
        },
      },
      taille: 100,
    });
  }
  lColonnes.push({
    id: DonneesListe_SuiviPluriAnnuel.colonnes.graphe,
    titre: GTraductions.getValeur("SuiviPluriannuel.graphique"),
    taille: 50 + 20 * aNombreAnnees,
  });
  {
    this.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      avecLigneTotal: aAfficherMoyenne,
    });
  }
}
function initialiserTripleCombo(aInstance) {
  aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
}
function _construireAltGraph(aParam) {
  const H = [];
  if (aParam.listeDonnees && aParam.listeDonnees.count()) {
    if (aParam.listeAnnees.count() > 1) {
      const lAnnees = [];
      aParam.listeAnnees.parcourir((aAnnee) => {
        lAnnees.push(aAnnee.getLibelle());
      });
      H.push(
        GTraductions.getValeur("SuiviPluriannuel.altGraph.annees", [
          lAnnees.join(", "),
        ]),
      );
    } else {
      H.push(
        GTraductions.getValeur("SuiviPluriannuel.altGraph.annee", [
          aParam.listeAnnees.getPremierElement().getLibelle(),
        ]),
      );
    }
    aParam.listeDonnees.parcourir((aService) => {
      if (aService.infosGraphe && aService.infosGraphe.length) {
        H.push(aService.matiere);
        aService.infosGraphe.forEach((aInfo) => {
          if (aInfo.moyenne && aInfo.moyenne.estUneValeur()) {
            H.push(
              _getStrNote(aInfo.moyenne) + "/" + _getStrNote(aInfo.bareme),
            );
          } else {
            H.push(
              GTraductions.getValeur("SuiviPluriannuel.altGraph.pasDeNote"),
            );
          }
        });
        H.push(";");
      }
    });
  }
  return H.join(" ");
}
function _getStrNote(aNote) {
  return aNote !== null && aNote !== false && aNote !== undefined
    ? aNote.getNote !== null && aNote.getNote !== undefined
      ? aNote.getNote()
      : aNote + ""
    : "";
}
module.exports = ObjetAffichagePageSuiviPluriannuel;
