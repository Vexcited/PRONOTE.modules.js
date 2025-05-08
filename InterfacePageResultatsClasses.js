const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  ObjetRequetePageResultatsClasses,
} = require("ObjetRequetePageResultatsClasses.js");
const { ObjetInvocateur } = require("Invocateur.js");
const { Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const {
  ObjetFenetre_ParamResultats,
} = require("ObjetFenetre_ParamResultats.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  DonneesListe_ResultatsClasse,
} = require("DonneesListe_ResultatsClasse.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreTotalAffiche } = require("Enumere_ResultatsClasse.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GUID } = require("GUID.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const {
  ObjetFenetre_MoyenneTableauResultats,
} = require("ObjetFenetre_MoyenneTableauResultats.js");
const { GHtml } = require("ObjetHtml.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfacePageResultatsClasses extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    GEtatUtilisateur.etatComboTypeMoyenne =
      GEtatUtilisateur.etatComboTypeMoyenne
        ? GEtatUtilisateur.etatComboTypeMoyenne
        : 0;
    this.idTitreColonneNom = GUID.getId();
    this.titreNom = GTraductions.getValeur("resultatsClasses.titres.nom");
    this.avecGestionNotation = GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionNotation,
    );
  }
  initialiserMethodeCalculMoyenne(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      titre: GTraductions.getValeur(
        "BulletinEtReleve.TitreFenetreCalculMoyenne",
      ),
      largeur: 600,
      hauteur: 300,
      listeBoutons: [GTraductions.getValeur("principal.fermer")],
      largeurMin: 600,
      hauteurMin: 150,
    });
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    this.identComboTypeMoyenne = this.add(
      ObjetSaisiePN,
      this.evenementCombo,
      this.initialiserCombo,
    );
    this.identPage = this.add(ObjetListe, this.eventListe);
    this.identFenetreParamResultats = this.addFenetre(
      ObjetFenetre_ParamResultats,
      _evntFenetreParamResultats,
      _initFenetreParamResultats,
    );
    this.identFenetreMethodeCalculMoyenne = this.add(
      ObjetFenetre_MoyenneTableauResultats,
      null,
      this.initialiserMethodeCalculMoyenne,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identPage;
    this.avecBandeau = true;
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({
      html:
        '<span style="display:none;" id="' +
        this.Nom +
        '_LabelMoyenne">' +
        GTraductions.getValeur("resultatsClasses.titres.moyenne") +
        " : </span>",
    });
    this.AddSurZone.push(this.identComboTypeMoyenne);
    this.AddSurZone.push({ separateur: true });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnOptionsAffichage"),
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnOptionsAffichage: {
        event() {
          const lFenetreParam = aInstance.getInstance(
            aInstance.identFenetreParamResultats,
          );
          const avecEtat =
            GEtatUtilisateur.resultatsClasse_referentiel !== undefined;
          lFenetreParam.setOptions({
            avecDonneesItalie: aInstance.avecDonneesItalie,
            avecMediane: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecMediane
              : false,
            avecHaute: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecHaute
              : false,
            avecBasse: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecBasse
              : false,
            avecAbsences: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecAbsences
              : false,
            avecCompetences: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecCompetences
              : true,
            avecSousServices: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecSousServices
              : true,
            uniquementSousServices: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel
                  .uniquementSousServices
              : false,
            matieresEquivalence: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.matieresEquivalence
              : false,
            parametresBulletin: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.parametresBulletin
              : true,
            masquerSansNotes: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.masquerSansNotes
              : false,
            avecCouleurMoyenne: avecEtat
              ? GEtatUtilisateur.resultatsClasse_referentiel.avecCouleurMoyenne
              : false,
          });
          lFenetreParam.afficher();
        },
        getSelection() {
          return aInstance
            .getInstance(aInstance.identFenetreParamResultats)
            .estAffiche();
        },
      },
    });
  }
  eventListe(aParametres) {
    if (
      aParametres.idColonne ===
        DonneesListe_ResultatsClasse.colonnes.moyenneGenerale ||
      aParametres.declarationColonne.estMoyenneRegroupement
    ) {
      const lSource = aParametres.declarationColonne.estMoyenneRegroupement
        ? aParametres.article.notesEleve.get(
            aParametres.declarationColonne.rangColonne,
          )
        : aParametres.article;
      const lParametresCalcul = {
        libelleEleve: aParametres.article.nom,
        html: lSource.FormuleHTML,
        titreFenetre: lSource.chaineTitre,
        moyenneNette: true,
      };
      if (!!lSource.resultatAffiche) {
        this.getInstance(this.identFenetreMethodeCalculMoyenne).setDonnees(
          lParametresCalcul,
        );
      }
    }
  }
  initialiserCombo(aObjet) {
    aObjet.setParametres(false, false, 160, false);
    const listeTypesMoyennes = new ObjetListeElements()
      .addElement(
        new ObjetElement(
          GTraductions.getValeur("resultatsClasses.options.calculee"),
          0,
        ),
      )
      .addElement(
        new ObjetElement(
          GTraductions.getValeur("resultatsClasses.options.proposee"),
          1,
        ),
      )
      .addElement(
        new ObjetElement(
          GTraductions.getValeur("resultatsClasses.options.deliberee"),
          2,
        ),
      );
    aObjet.setDonnees(listeTypesMoyennes);
    aObjet.setVisible(false);
  }
  evenementCombo(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      if (aParams.element.Numero !== GEtatUtilisateur.etatComboTypeMoyenne) {
        new ObjetRequetePageResultatsClasses(
          this,
          this.actionSurRecupererDonnees,
        ).lancerRequete(
          this.ressource,
          this.periode,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.avecAbsences
            : false,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.avecCompetences
            : true,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.avecSousServices
            : true,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel
                .uniquementSousServices
            : false,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.matieresEquivalence
            : false,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.parametresBulletin
            : true,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.masquerSansNotes
            : false,
          GEtatUtilisateur.resultatsClasse_referentiel
            ? GEtatUtilisateur.resultatsClasse_referentiel.avecCouleurMoyenne
            : false,
          aParams.element.Numero,
        );
      }
      GEtatUtilisateur.etatComboTypeMoyenne = aParams.element.Numero;
    }
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Periode]);
  }
  evenementSurDernierMenuDeroulant() {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    this.ressource = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Classe,
    );
    this.periode = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Periode,
    );
    new ObjetRequetePageResultatsClasses(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete(
      this.ressource,
      this.periode,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecAbsences
        : false,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecCompetences
        : true,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecSousServices
        : true,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.uniquementSousServices
        : false,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.matieresEquivalence
        : false,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.parametresBulletin
        : true,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.masquerSansNotes
        : false,
      GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecCouleurMoyenne
        : false,
      GEtatUtilisateur.etatComboTypeMoyenne,
    );
  }
  actionSurRecupererDonnees(aDonneesAffichage) {
    if (aDonneesAffichage) {
      this.donneesAffichage = MethodesObjet.dupliquer(aDonneesAffichage);
      this.afficherBandeau(true);
      this.avecDonneesItalie = !!aDonneesAffichage.avecDonneesItalie;
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.GenerationPDF,
        this,
        this.getParametresPDF.bind(this),
      );
    }
    this.initialiserListe(aDonneesAffichage);
    const lListeMiseEnForme = new ObjetListeElements();
    aDonneesAffichage.resultats.setTri([
      ObjetTri.init("ressource"),
      ObjetTri.init("periode"),
    ]);
    aDonneesAffichage.resultats.trier();
    let eltCourant;
    aDonneesAffichage.resultats.parcourir((aElement) => {
      if (aElement.lignePere === 0) {
        aElement.estUnDeploiement = true;
        aElement.estDeploye = false;
        eltCourant = aElement;
      } else {
        aElement.pere = eltCourant;
      }
      lListeMiseEnForme.addElement(aElement);
    });
    this.listeMiseEnForme = lListeMiseEnForme;
    this.nbColonnesDynamiques = aDonneesAffichage.nbColonnesDynamiques;
    this.moyenneGeneraleClasse = {
      generale: aDonneesAffichage.moyenneGeneraleClasse,
      haute: aDonneesAffichage.moyenneHauteClasse,
      basse: aDonneesAffichage.moyenneBasseClasse,
      mediane: aDonneesAffichage.moyenneMedianeClasse,
    };
    this.moyennes = aDonneesAffichage.moyennes;
    this.anneeComplete = aDonneesAffichage.anneeComplete;
    this.getInstance(this.identComboTypeMoyenne).setSelection(
      GEtatUtilisateur.etatComboTypeMoyenne,
    );
    GHtml.setDisplay(this.Nom + "_LabelMoyenne", this.avecDonneesItalie);
    if (this.avecDonneesItalie) {
      this.afficherBandeau(true);
      this.getInstance(this.identComboTypeMoyenne).setVisible(true);
    }
    if (!this.listeAffichee) {
      this.listeAffichee = [
        EGenreTotalAffiche.moyenneClasse,
        EGenreTotalAffiche.moyenneGroupe,
      ];
    }
    if (!!GEtatUtilisateur.resultatsClasse_referentiel) {
      if (
        GEtatUtilisateur.resultatsClasse_referentiel.avecMediane &&
        this.listeAffichee.indexOf(EGenreTotalAffiche.noteMediane) === -1
      ) {
        this.listeAffichee.push(EGenreTotalAffiche.noteMediane);
      }
      if (
        GEtatUtilisateur.resultatsClasse_referentiel.avecHaute &&
        this.listeAffichee.indexOf(EGenreTotalAffiche.noteHaute) === -1
      ) {
        this.listeAffichee.push(EGenreTotalAffiche.noteHaute);
      }
      if (
        GEtatUtilisateur.resultatsClasse_referentiel.avecBasse &&
        this.listeAffichee.indexOf(EGenreTotalAffiche.noteHaute) === -1
      ) {
        this.listeAffichee.push(EGenreTotalAffiche.noteBasse);
      }
    }
    const lDonnees = new DonneesListe_ResultatsClasse(lListeMiseEnForme, {
      nbColonnes: aDonneesAffichage.nbColonnesDynamiques,
      moyennes: aDonneesAffichage.moyennes,
      moyenneClasse: this.moyenneGeneraleClasse,
      anneeComplete: aDonneesAffichage.anneeComplete,
      listeTotaux: this.listeAffichee,
      avecDonneesItalie: this.avecDonneesItalie,
      avecGestionNotation: this.avecGestionNotation,
      genrePositonnementClasse: aDonneesAffichage.genrePositonnementClasse,
    });
    this.getInstance(this.identPage).setDonnees(lDonnees);
    GEtatUtilisateur.setTriListe({
      liste: this.getInstance(this.identPage),
      tri: DonneesListe_ResultatsClasse.colonnes.nom,
    });
  }
  initialiserListe(aList) {
    let lColonnes;
    const lColonneCarnetLiaisonDeLaClasse = [];
    lColonneCarnetLiaisonDeLaClasse.push(
      '<div id="',
      this.idTitreColonneNom,
      '">',
      '<span ie-event="click->surClickColonneNom();" class="AvecMain PetitEspaceDroit">',
      this.titreNom,
      "</span>",
      "</div>",
    );
    lColonnes = [
      { id: DonneesListe_ResultatsClasse.colonnes.ressource, taille: 1 },
      { id: DonneesListe_ResultatsClasse.colonnes.lignePere, taille: 1 },
      { id: DonneesListe_ResultatsClasse.colonnes.deploye, taille: 1 },
      {
        id: DonneesListe_ResultatsClasse.colonnes.nom,
        titre: {
          libelleHtml: lColonneCarnetLiaisonDeLaClasse.join(""),
          libelle: GTraductions.getValeur("resultatsClasses.titres.nom"),
          title: this.titreNom,
          controleur: {
            surClickColonneNom: function (aEvent) {
              const lThis = this.instance.Pere;
              const lListe = this.instance;
              aEvent.stopPropagation();
              ObjetMenuContextuel.afficher({
                pere: lThis,
                initCommandes: function (aMenu) {
                  aMenu.add(
                    GTraductions.getValeur("resultatsClasses.titres.nom"),
                    true,
                    () => {
                      lListe.getDonneesListe().afficherNom(true);
                      lThis.titreNom = GTraductions.getValeur(
                        "resultatsClasses.titres.nom",
                      );
                      lThis.initialiserListe(lThis.donneesAffichage);
                      lListe.setDonnees(lListe.getDonneesListe());
                    },
                  );
                  aMenu.add(
                    GTraductions.getValeur(
                      "resultatsClasses.titres.numeroNational",
                    ),
                    true,
                    () => {
                      lListe.getDonneesListe().afficherNom(false);
                      lThis.titreNom = GTraductions.getValeur(
                        "resultatsClasses.titres.numeroNational",
                      );
                      lThis.initialiserListe(lThis.donneesAffichage);
                      lListe.setDonnees(lListe.getDonneesListe());
                    },
                  );
                },
              });
            },
          },
        },
        taille: 150,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.neLe,
        titre: GTraductions.getValeur("resultatsClasses.titres.neLe"),
        taille: 65,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.redoublant,
        titre: {
          libelle: GTraductions.getValeur(
            "resultatsClasses.titres.redoublantLong",
          ),
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.redoublantCourt",
          ),
          titleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.redoublantLong",
          ),
        },
        taille: 40,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.projetsAccompagnement,
        titre: {
          libelle: GTraductions.getValeur(
            "resultatsClasses.titres.projetAccLong",
          ),
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.projetAccCourt",
          ),
          titleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.projetAccLong",
          ),
        },
        taille: 80,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.dernierEtablissement,
        titre: {
          libelle: GTraductions.getValeur(
            "resultatsClasses.titres.dernierEtabLong",
          ),
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.dernierEtabCourt",
          ),
          titleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.dernierEtabLong",
          ),
        },
        taille: 120,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.absences,
        titre: this.avecDonneesItalie
          ? {
              libelle: GTraductions.getValeur(
                "resultatsClasses.titres.volumeHoraire",
              ),
              libelleHtml: GTraductions.getValeur(
                "resultatsClasses.titres.volumeHoraire",
              ),
            }
          : {
              libelle: GTraductions.getValeur(
                "resultatsClasses.titres.absenceLong",
              ),
              libelleHtml: GTraductions.getValeur(
                "resultatsClasses.titres.absenceCourt",
              ),
              titleHtml: GTraductions.getValeur(
                "resultatsClasses.titres.absenceLong",
              ),
            },
        taille: 60,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.nombreRetards,
        titre: {
          libelle: GTraductions.getValeur("resultatsClasses.titres.nbRetards"),
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.nbRetards",
          ),
        },
        taille: 45,
      },
      {
        id: DonneesListe_ResultatsClasse.colonnes.rang,
        titre: GTraductions.getValeur("resultatsClasses.titres.rang"),
        taille: 40,
      },
      { id: DonneesListe_ResultatsClasse.colonnes.classe, taille: 40 },
    ];
    if (this.avecDonneesItalie) {
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.mention,
        titre: [
          {
            libelle: GTraductions.getValeur("resultatsClasses.titres.mention"),
          },
          {
            libelle: GTraductions.getValeur(
              "resultatsClasses.titres.moyenneCourt",
            ),
          },
        ],
        taille: 100,
      });
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.mentionV,
        titre: [
          { libelle: TypeFusionTitreListe.FusionGauche },
          { libelle: GTraductions.getValeur("resultatsClasses.titres.um") },
        ],
        taille: 30,
      });
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.credits,
        titre: [
          {
            libelle: GTraductions.getValeur("resultatsClasses.titres.credits"),
          },
          {
            libelle: GTraductions.getValeur(
              "resultatsClasses.titres.moyenneCourt",
            ),
          },
        ],
        taille: 70,
      });
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.creditsV,
        titre: [
          { libelle: TypeFusionTitreListe.FusionGauche },
          { libelle: GTraductions.getValeur("resultatsClasses.titres.um") },
        ],
        taille: 30,
      });
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.validite,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.validite",
          ),
        },
        taille: 60,
      });
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.creditsTotaux,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "resultatsClasses.titres.creditsTotaux",
          ),
        },
        taille: 60,
      });
    }
    if (this.avecGestionNotation) {
      lColonnes.push({
        id: DonneesListe_ResultatsClasse.colonnes.moyenneGenerale,
        titre: GTraductions.getValeur("resultatsClasses.titres.moyenne"),
        taille: 60,
      });
    }
    const avecSousServices = GEtatUtilisateur.resultatsClasse_referentiel
      ? GEtatUtilisateur.resultatsClasse_referentiel.uniquementSousServices
      : false;
    const avecParamsBulletin = true;
    let lAvecTitre1 = false;
    for (let i = 0; i < aList.titresColonnes.count(); i++) {
      lAvecTitre1 =
        lAvecTitre1 ||
        (aList.titresColonnes.get(i).ColMoy &&
          aList.titresColonnes.get(i).ColMoy.titre1 !== " ");
    }
    for (let i = 0; i < aList.titresColonnes.count(); i++) {
      const lColonneCourante = aList.titresColonnes.get(i);
      for (let j = 0; j <= 2; j++) {
        const titre = [];
        let lColonneTitre, lTypeColonne;
        switch (j) {
          case 0: {
            lColonneTitre = lColonneCourante.ColMoy;
            lTypeColonne = "moyenne";
            break;
          }
          case 1:
            lColonneTitre = lColonneCourante.ColPos;
            lTypeColonne = "positionnement";
            break;
          case 2:
            lColonneTitre = lColonneCourante.ColAbs;
            lTypeColonne = "absence";
            break;
          default:
        }
        if (!!lColonneTitre && lColonneTitre.visible) {
          const lTitreLigne1 = lColonneTitre.titre1;
          const lTitreLigne2 = lColonneTitre.titre2;
          const lTitreLigne3 = lColonneTitre.titre3;
          const couleurFond = lColonneTitre.couleur;
          const lItalique = !lColonneTitre.estPere ? "Italique " : "";
          const libelleHtml =
            lTitreLigne2 !== ""
              ? '<div class="NoWrap ' +
                lItalique +
                '" style="' +
                GStyle.composeCouleurBordure(couleurFond) +
                '">' +
                lTitreLigne2 +
                "</div>"
              : "";
          let { hint } = lColonneTitre;
          hint = hint.replace(/&gt;/g, ">");
          hint = hint.replace(/&lt;/g, "<");
          hint = hint.replace(/&quot;/g, '"');
          const lHintLigne2 =
            lTypeColonne === "absence"
              ? GTraductions.getValeur(
                  "resultatsClasses.titres.absenceParServiceLong",
                )
              : lTypeColonne === "positionnement"
                ? GTraductions.getValeur(
                    "resultatsClasses.titres.positionnement",
                  )
                : hint;
          if (lColonneTitre.estMoyenneRegroupement) {
            if (lAvecTitre1 && lTitreLigne1 !== "") {
              titre.push({ libelleHtml: lTitreLigne1, titleHtml: hint });
            }
            titre.push({ libelle: lTitreLigne3, titleHtml: hint });
          } else if (avecSousServices || avecParamsBulletin) {
            if (lAvecTitre1) {
              titre.push({ libelle: lTitreLigne1, avecFusionColonne: true });
            }
            titre.push({
              libelleCSV: lTitreLigne2,
              libelleHtml: libelleHtml,
              avecFusionColonne: lColonneTitre.estPere,
              titleHtml: hint,
            });
            if (!avecSousServices) {
              titre.push({
                libelleCSV: lTitreLigne3,
                libelle: lTitreLigne3,
                titleHtml: lHintLigne2,
              });
            }
          } else {
            titre.push({
              libelleHtml: libelleHtml,
              avecFusionColonne: lColonneTitre.estPere,
              titleHtml: hint,
            });
            titre.push({ libelle: lTitreLigne3, titleHtml: hint });
          }
          lColonnes.push({
            id: DonneesListe_ResultatsClasse.colonnes.sousCol + i + "_" + j,
            estPere: lColonneTitre.estPere,
            rangColonne: i,
            idSousColonne: j,
            typeColonne: lTypeColonne,
            estTri: false,
            titre: titre,
            estMoyenneRegroupement: lColonneTitre.estMoyenneRegroupement,
            taille: 50,
          });
        }
      }
    }
    const boutons = [];
    if (
      GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ).getGenre() === 1
    ) {
      boutons.push({ genre: ObjetListe.typeBouton.deployer });
    }
    boutons.push({ genre: ObjetListe.typeBouton.exportCSV });
    {
      this.getInstance(this.identPage).setOptionsListe({
        colonnes: lColonnes,
        colonnesCachees: [
          DonneesListe_ResultatsClasse.colonnes.ressource,
          DonneesListe_ResultatsClasse.colonnes.lignePere,
          DonneesListe_ResultatsClasse.colonnes.deploye,
          DonneesListe_ResultatsClasse.colonnes.classe,
        ],
        colonnesTriables: true,
        avecLigneCreation: false,
        avecSelection: false,
        scrollHorizontal: this.avecDonneesItalie ? 17 : 11,
        avecLigneTotal: this.avecGestionNotation,
        hauteurAdapteContenu: true,
        boutons: boutons,
      });
    }
  }
  getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.ResultatsClasse,
      genreRessource: EGenreRessource.Eleve,
      classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      periode: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ),
      typeMoyenne: GEtatUtilisateur.etatComboTypeMoyenne
        ? GEtatUtilisateur.etatComboTypeMoyenne
        : 0,
      matieresEquivalence: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.matieresEquivalence
        : false,
      parametresBulletin: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.parametresBulletin
        : true,
      avecAbsences: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecAbsences
        : false,
      avecSansNotes: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecCompetences
        : true,
      afficherSousServices: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecSousServices
        : true,
      afficherServices: GEtatUtilisateur.resultatsClasse_referentiel
        ? !GEtatUtilisateur.resultatsClasse_referentiel.uniquementSousServices
        : true,
      avecMediane: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecMediane
        : false,
      avecBasse: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecBasse
        : false,
      avecHaute: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.avecHaute
        : false,
      masquerSansNotes: GEtatUtilisateur.resultatsClasse_referentiel
        ? GEtatUtilisateur.resultatsClasse_referentiel.masquerSansNotes
        : false,
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
  }
}
function _initFenetreParamResultats(aInstance) {
  aInstance.setContexte(this.avecDonneesItalie);
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur(
      "competencesGrilles.FenetreParametrage.Titre",
    ),
    largeur: 600,
    avecTailleSelonContenu: true,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
}
function _evntFenetreParamResultats(aNumeroBouton, aParametresGrille) {
  if (aNumeroBouton === 1) {
    const listeAffichee = [EGenreTotalAffiche.moyenneClasse];
    if (!!aParametresGrille.avecMediane) {
      listeAffichee.push(EGenreTotalAffiche.noteMediane);
    }
    if (!!aParametresGrille.avecHaute) {
      listeAffichee.push(EGenreTotalAffiche.noteHaute);
    }
    if (!!aParametresGrille.avecBasse) {
      listeAffichee.push(EGenreTotalAffiche.noteBasse);
    }
    listeAffichee.push(EGenreTotalAffiche.moyenneGroupe);
    const changerAbsences =
      GEtatUtilisateur.resultatsClasse_referentiel.avecAbsences !==
      aParametresGrille.avecAbsences;
    const changerCompetences =
      GEtatUtilisateur.resultatsClasse_referentiel.avecCompetences !==
      aParametresGrille.avecCompetences;
    const uniquementSousServices =
      GEtatUtilisateur.resultatsClasse_referentiel.uniquementSousServices !==
      aParametresGrille.uniquementSousServices;
    const avecSousServices =
      GEtatUtilisateur.resultatsClasse_referentiel.avecSousServices !==
      aParametresGrille.avecSousServices;
    const matieresEquivalence =
      GEtatUtilisateur.resultatsClasse_referentiel.matieresEquivalence !==
      aParametresGrille.matieresEquivalence;
    const parametresBulletin =
      GEtatUtilisateur.resultatsClasse_referentiel.parametresBulletin !==
      aParametresGrille.parametresBulletin;
    const masquerSansNotes =
      GEtatUtilisateur.resultatsClasse_referentiel.masquerSansNotes !==
      aParametresGrille.masquerSansNotes;
    const avecCouleurMoyenne =
      GEtatUtilisateur.resultatsClasse_referentiel.avecCouleurMoyenne !==
      aParametresGrille.avecCouleurMoyenne;
    this.listeAffichee = listeAffichee;
    if (
      changerAbsences ||
      changerCompetences ||
      uniquementSousServices ||
      avecSousServices ||
      matieresEquivalence ||
      parametresBulletin ||
      masquerSansNotes ||
      avecCouleurMoyenne
    ) {
      new ObjetRequetePageResultatsClasses(
        this,
        this.actionSurRecupererDonnees,
      ).lancerRequete(
        this.ressource,
        this.periode,
        aParametresGrille.avecAbsences,
        aParametresGrille.avecCompetences,
        aParametresGrille.avecSousServices,
        aParametresGrille.uniquementSousServices,
        aParametresGrille.matieresEquivalence,
        aParametresGrille.parametresBulletin,
        aParametresGrille.masquerSansNotes,
        aParametresGrille.avecCouleurMoyenne,
        GEtatUtilisateur.etatComboTypeMoyenne,
      );
    } else {
      const lDonnees = new DonneesListe_ResultatsClasse(this.listeMiseEnForme, {
        nbColonnes: this.nbColonnesDynamiques,
        moyennes: this.moyennes,
        moyenneClasse: this.moyenneGeneraleClasse,
        anneeComplete: this.anneeComplete,
        listeTotaux: listeAffichee,
        avecDonneesItalie: this.avecDonneesItalie,
        avecGestionNotation: this.avecGestionNotation,
      });
      this.getInstance(this.identPage).setDonnees(lDonnees);
    }
    GEtatUtilisateur.setTriListe({
      liste: this.getInstance(this.identPage),
      tri: DonneesListe_ResultatsClasse.colonnes.nom,
    });
  }
  GEtatUtilisateur.resultatsClasse_referentiel = {
    avecMediane: aParametresGrille.avecMediane,
    avecHaute: aParametresGrille.avecHaute,
    avecBasse: aParametresGrille.avecBasse,
    avecAbsences: aParametresGrille.avecAbsences,
    avecCompetences: aParametresGrille.avecCompetences,
    avecSousServices: aParametresGrille.avecSousServices,
    uniquementSousServices: aParametresGrille.uniquementSousServices,
    matieresEquivalence: aParametresGrille.matieresEquivalence,
    parametresBulletin: aParametresGrille.parametresBulletin,
    masquerSansNotes: aParametresGrille.masquerSansNotes,
    avecCouleurMoyenne: aParametresGrille.avecCouleurMoyenne,
  };
}
module.exports = InterfacePageResultatsClasses;
