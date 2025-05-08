const { TypeDroits } = require("ObjetDroitsPN.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { ObjetAbsencesGrille } = require("ObjetAbsencesGrille.js");
const { ObjetRequeteAbsencesGrille } = require("ObjetRequeteAbsencesGrille.js");
const {
  ObjetRequeteSaisieAbsencesGrille,
} = require("ObjetRequeteSaisieAbsencesGrille.js");
const {
  ObjetFenetre_ListeMemosEleves,
} = require("ObjetFenetre_ListeMemosEleves.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetGrilleGabarit } = require("ObjetGrilleGabarit.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeDomaine } = require("TypeDomaine.js");
const {
  DonneesListe_AbsencesGrille,
} = require("DonneesListe_AbsencesGrille.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { ObjetFenetre_Infirmerie } = require("ObjetFenetre_Infirmerie.js");
const {
  ObjetFenetre_SelectionMotif,
} = require("ObjetFenetre_SelectionMotif.js");
const { ObjetFenetre_SuiviUnique } = require("ObjetFenetre_SuiviUnique.js");
const {
  ObjetRequetePageEmploiDuTemps,
} = require("ObjetRequetePageEmploiDuTemps.js");
const {
  DonneesListe_SelectionMotifs,
} = require("DonneesListe_SelectionMotifs.js");
const {
  TypeHttpSaisieAbsencesGrille,
} = require("TypeHttpSaisieAbsencesGrille.js");
const { TypeRessourceAbsence } = require("TypeRessourceAbsence.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const { GCache } = require("Cache.js");
const { TDecorateurAbsencesGrille } = require("UtilitaireAbsencesGrille.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfaceAbsencesGrille extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.idPage = this.Nom + "_page";
    this.idMessage = this.Nom + "_message";
    this.idConteneurGrille = this.Nom + "_grille";
    this.idConteneurListeAnnee = this.Nom + "_listeAnnee";
    let lInfosAffichage = GEtatUtilisateur.getOnglet().absencesGrille;
    if (!lInfosAffichage) {
      lInfosAffichage = GEtatUtilisateur.getOnglet().absencesGrille = {
        choixAbsence: EGenreRessource.Absence,
        motifAbsenceSelectionne: null,
        motifRetardSelectionne: null,
        listeAnneeVisible: false,
      };
    }
    this.parametres = {
      affichage: lInfosAffichage,
      eleve: {
        absencesGrille: null,
        joursStage: null,
        listeAbsences: null,
        titre: "",
      },
      hauteurListeDomaine: 191,
      largeurListeAnnee: 250,
    };
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evenementSurDernierMenuDeroulant,
      (aInstance) => {
        aInstance.setParametres([
          EGenreRessource.Classe,
          EGenreRessource.Eleve,
        ]);
      },
    );
    this.IdentCalendrier = this.add(
      ObjetCalendrier,
      _evenementSurCalendrier,
      _initialiserCalendrier,
    );
    this.IdentGrille = this.add(ObjetAbsencesGrille, null, _initialiserGrille);
    this.identListe = this.add(
      ObjetListe,
      _evenemnentSurListe,
      _initialiserListe,
    );
    this.construireFicheEleveEtFichePhoto();
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({
      html: '<div ie-html="getTitreEleve" class="NoWrap"></div>',
    });
    this.AddSurZone.push({ separateur: true });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnules(
        "btnCoursAnnules",
      ),
    });
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnAfficherMasquerZone(
        "btnAfficherListeAnnee",
      ),
    });
  }
  getPrioriteAffichageBandeauLargeur() {
    return [];
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getTitreEleve: function () {
        return aInstance.parametres.eleve
          ? aInstance.parametres.eleve.titre
          : "";
      },
      getNodeMemo: function () {
        const lInstance = aInstance;
        $(this.node).on("click", () => {
          _demandeMemos(lInstance);
        });
      },
      btnCoursAnnules: {
        event() {
          GEtatUtilisateur.setAvecCoursAnnule(
            !GEtatUtilisateur.getAvecCoursAnnule(),
          );
          _actualiserGrille.call(aInstance);
        },
        getSelection() {
          return GEtatUtilisateur.getAvecCoursAnnule();
        },
        getTitle() {
          return GEtatUtilisateur.getAvecCoursAnnule()
            ? GTraductions.getValeur("EDT.MasquerCoursAnnules")
            : GTraductions.getValeur("EDT.AfficherCoursAnnules");
        },
        getClassesMixIcon() {
          return UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
            GEtatUtilisateur.getAvecCoursAnnule(),
          );
        },
      },
      btnAfficherListeAnnee: {
        event() {
          aInstance.parametres.affichage.listeAnneeVisible =
            !aInstance.parametres.affichage.listeAnneeVisible;
          if (aInstance.parametres.affichage.listeAnneeVisible) {
            aInstance.parametres.eleve.listeAbsences = null;
            _actualiserAbsences.call(aInstance);
          } else {
            _actualiserGrille.call(aInstance);
          }
        },
        getSelection() {
          return !!aInstance.parametres.affichage.listeAnneeVisible;
        },
        getTitle() {
          return GTraductions.getValeur(
            "grilleAbsence.HintAfficherListeRecapitulative",
          );
        },
      },
      rbChoixAbsence: {
        getValue: function (aGenre) {
          return aInstance.parametres.affichage.choixAbsence === aGenre;
        },
        setValue: function (aGenre) {
          aInstance.parametres.affichage.choixAbsence = aGenre;
          const lCalendrier = aInstance.getInstance(aInstance.IdentCalendrier),
            lAvecMultiSelection = aGenre === EGenreRessource.Absence,
            lDomaine = GEtatUtilisateur.getDomaineSelectionne();
          lCalendrier.setOptionsCalendrier({
            avecMultiSemainesContinues: lAvecMultiSelection,
          });
          aInstance.parametres.eleve.listeAbsences = null;
          if (!lAvecMultiSelection && lDomaine.getNbrValeurs() > 1) {
            lCalendrier.setSelection(lDomaine.getPremierePosition());
          } else {
            _actualiserAbsences.call(aInstance);
          }
        },
      },
      comboMotifAbsence: $.extend(_getControleurCombo(), {
        avecComboMotifAbsence: function () {
          return (
            aInstance.parametres.affichage.choixAbsence ===
              EGenreRessource.Absence &&
            _getListeCacheDAbsence(EGenreRessource.Absence)
          );
        },
      }),
      comboMotifRetard: $.extend(_getControleurCombo(), {
        avecComboMotifRetard: function () {
          return (
            aInstance.parametres.affichage.choixAbsence ===
              EGenreRessource.Retard &&
            _getListeCacheDAbsence(EGenreRessource.Retard)
          );
        },
      }),
      getTitreListeAnnee: function () {
        return GChaine.enleverEntites(
          GTraductions.getValeur("grilleAbsence.SurLAnnee") +
            " " +
            (aInstance.parametres.eleve.listeAbsences
              ? aInstance.parametres.eleve.listeAbsences.titre
              : ""),
        );
      },
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div style="height:100%; display:none;" class="interface_affV interface_affV_padding" id="',
      this.idPage,
      '">',
    );
    H.push(
      '<div id="' +
        this.getInstance(this.IdentCalendrier).getNom() +
        '" style="width: 100%;"></div>',
    );
    H.push(_composeSelecteurAbsences.call(this));
    H.push(
      '<div id="',
      this.idConteneurGrille,
      '" class="interface_affV_client" style="position:relative;">',
    );
    H.push(
      '<div id="' +
        this.getInstance(this.IdentGrille).getNom() +
        '" class="AlignementHaut" style="height:100%;"></div>',
    );
    H.push(
      '<div id="' +
        this.idConteneurListeAnnee +
        '" style="display:none;"></div>',
    );
    H.push("</div>");
    H.push(
      '<div class="AlignementHaut EspaceHaut" id="' +
        this.getInstance(this.identListe).getNom() +
        '" style="width: 100%; height:',
      this.parametres.hauteurListeDomaine,
      'px;"></div>',
    );
    H.push("</div>");
    H.push('<div class="Espace" id="', this.idMessage, '"></div>');
    return H.join("");
  }
  _evenementAfficherMessage(AGenreMessage) {
    this.afficherBandeau(false);
    GHtml.setDisplay(this.idPage, false);
    GHtml.setDisplay(this.idMessage, true);
    const LMessage =
      typeof AGenreMessage === "number"
        ? GTraductions.getValeur("Message")[AGenreMessage]
        : AGenreMessage;
    GHtml.setHtml(this.idMessage, this.composeMessage(LMessage));
  }
  recupererDonnees() {
    this.afficherPage();
  }
  afficherPage() {
    this.setEtatSaisie(false);
  }
}
function _creerColonnesListe() {
  const lDomaine = GEtatUtilisateur.getDomaineSelectionne(),
    lColonnes = [
      {
        id: DonneesListe_AbsencesGrille.colonnes.date,
        titre: [
          GTraductions.getValeur("grilleAbsence.liste.SemaineDuAu", [
            GDate.formatDate(
              IE.Cycles.dateDebutCycle(lDomaine.getPremierePosition()),
              "%JJ/%MM/%AA",
            ),
            GDate.formatDate(
              IE.Cycles.dateFinCycle(lDomaine.getDernierePosition()),
              "%JJ/%MM/%AA",
            ),
          ]),
          GTraductions.getValeur("Date"),
        ],
        taille: ObjetListe.initColonne(100, 100, 450),
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.duree,
        titre: GTraductions.getValeur("Duree"),
        taille: 60,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.motif,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Motif"),
        taille: ObjetListe.initColonne(100, 200, 300),
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.heuresCours,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "grilleAbsence.liste.titre.HeureCours",
          ),
          title: GTraductions.getValeur("grilleAbsence.liste.hint.HeureCours"),
        },
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
        titre: GTraductions.getValeur(
          "grilleAbsence.liste.titre.AbsenceOuverte",
        ),
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.AbsenceOuverte"),
        taille: 22,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.DJBrutes,
        titre: [
          GTraductions.getValeur("grilleAbsence.liste.titre.NbDemiJournee"),
          {
            libelle: GTraductions.getValeur(
              "grilleAbsence.liste.titre.DJBrutes",
            ),
            title: GTraductions.getValeur("grilleAbsence.liste.hint.DJBrutes"),
          },
        ],
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.DJCalc,
        titre: [
          TypeFusionTitreListe.FusionGauche,
          GTraductions.getValeur("grilleAbsence.liste.titre.DJCalc"),
        ],
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.DJCalc"),
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.DJBulletin,
        titre: [
          TypeFusionTitreListe.FusionGauche,
          GTraductions.getValeur("grilleAbsence.liste.titre.DJBulletin"),
        ],
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.DJBulletin"),
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.justifie,
        titre: [
          GTraductions.getValeur("grilleAbsence.liste.titre.Statuts"),
          {
            libelle: GTraductions.getValeur(
              "grilleAbsence.liste.titre.Justifie",
            ),
            title: GTraductions.getValeur("grilleAbsence.liste.hint.Justifie"),
          },
        ],
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.horsEtab,
        titre: [
          TypeFusionTitreListe.FusionGauche,
          GTraductions.getValeur("grilleAbsence.liste.titre.HorsEtab"),
        ],
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.HorsEtab"),
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.sante,
        titre: [
          TypeFusionTitreListe.FusionGauche,
          GTraductions.getValeur("grilleAbsence.liste.titre.Sante"),
        ],
        taille: 50,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.regle,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.RA"),
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.RA"),
        taille: 22,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.certificat,
        titre: {
          classeCssImage: "Image_Trombone",
          title: GTraductions.getValeur("grilleAbsence.liste.hint.Certificat"),
        },
        taille: 20,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.matiere,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Matiere"),
        taille: ObjetListe.initColonne(100, 150, 250),
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.accompagnateur,
        titre: GTraductions.getValeur(
          "grilleAbsence.liste.titre.Accompagnateur",
        ),
        taille: ObjetListe.initColonne(100, 150, 250),
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.commentaire,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Commentaire"),
        taille: ObjetListe.initColonne(100, 150, 250),
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.publieWeb,
        titre: "[Image_Publie]",
        hint: GTraductions.getValeur(
          "grilleAbsence.liste.hint.PublicationEspaceParent",
        ),
        taille: 22,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.suivi,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Suivi"),
        taille: ObjetListe.initColonne(100, 170, 250),
      },
    ];
  return lColonnes;
}
function _initialiserListe(aListe) {
  aListe.setOptionsListe({ colonnes: _creerColonnesListe() });
}
function _actualiserListeDomaine() {
  const lListe = this.getInstance(this.identListe);
  let lColoneesCachees = [];
  const lColonnesAbsences = [
    DonneesListe_AbsencesGrille.colonnes.heuresCours,
    DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
    DonneesListe_AbsencesGrille.colonnes.DJBrutes,
    DonneesListe_AbsencesGrille.colonnes.DJCalc,
    DonneesListe_AbsencesGrille.colonnes.DJBulletin,
    DonneesListe_AbsencesGrille.colonnes.horsEtab,
    DonneesListe_AbsencesGrille.colonnes.sante,
  ];
  switch (this.parametres.affichage.choixAbsence) {
    case EGenreRessource.Absence:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.duree,
        DonneesListe_AbsencesGrille.colonnes.matiere,
        DonneesListe_AbsencesGrille.colonnes.accompagnateur,
        DonneesListe_AbsencesGrille.colonnes.commentaire,
        DonneesListe_AbsencesGrille.colonnes.publieWeb,
      ];
      break;
    case EGenreRessource.Retard:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.accompagnateur,
        DonneesListe_AbsencesGrille.colonnes.commentaire,
        DonneesListe_AbsencesGrille.colonnes.publieWeb,
        DonneesListe_AbsencesGrille.colonnes.certificat,
      ].concat(lColonnesAbsences);
      break;
    case EGenreRessource.Exclusion:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.justifie,
        DonneesListe_AbsencesGrille.colonnes.regle,
        DonneesListe_AbsencesGrille.colonnes.certificat,
        DonneesListe_AbsencesGrille.colonnes.matiere,
        DonneesListe_AbsencesGrille.colonnes.accompagnateur,
        DonneesListe_AbsencesGrille.colonnes.commentaire,
        DonneesListe_AbsencesGrille.colonnes.suivi,
      ].concat(lColonnesAbsences);
      break;
    case EGenreRessource.Infirmerie:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.motif,
        DonneesListe_AbsencesGrille.colonnes.justifie,
        DonneesListe_AbsencesGrille.colonnes.regle,
        DonneesListe_AbsencesGrille.colonnes.certificat,
        DonneesListe_AbsencesGrille.colonnes.matiere,
        DonneesListe_AbsencesGrille.colonnes.suivi,
      ].concat(lColonnesAbsences);
      break;
  }
  if (!this.parametres.eleve.listeAbsences.avecColAbsenceOuverte) {
    lColoneesCachees.push(DonneesListe_AbsencesGrille.colonnes.absenceOuverte);
  }
  if (!this.parametres.eleve.listeAbsences.avecGestionStatutAbsenceRetard) {
    lColoneesCachees.push(
      DonneesListe_AbsencesGrille.colonnes.horsEtab,
      DonneesListe_AbsencesGrille.colonnes.sante,
    );
  }
  clearTimeout(this.parametres._timerListe);
  this.parametres._timerListe = setTimeout(() => {
    const lSelections = lListe.getListeElementsSelection();
    lListe.setOptionsListe({
      colonnes: _creerColonnesListe(),
      colonnesCachees: lColoneesCachees,
    });
    if (this.parametres.eleve.listeAbsences) {
      lListe.setDonnees(
        new DonneesListe_AbsencesGrille(
          this.parametres.eleve.listeAbsences.liste,
        ).setOptions({
          estSurDomaine: true,
          choixAbsence: this.parametres.affichage.choixAbsence,
          saisie: _saisieAbsence.bind(this, this),
        }),
      );
      lListe.setListeElementsSelection(lSelections);
    }
  }, 0);
}
function _initialiserListeAnnee(aListe) {
  aListe.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_AbsencesGrille.colonnes.date,
        titre: GTraductions.getValeur("Date"),
        taille: "100%",
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.motif,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Motif"),
        taille: 70,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.regle,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.RA"),
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.RA"),
        taille: 22,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
        titre: GTraductions.getValeur(
          "grilleAbsence.liste.titre.AbsenceOuverte",
        ),
        hint: GTraductions.getValeur("grilleAbsence.liste.hint.AbsenceOuverte"),
        taille: 22,
      },
      {
        id: DonneesListe_AbsencesGrille.colonnes.matiere,
        titre: GTraductions.getValeur("grilleAbsence.liste.titre.Matiere"),
        taille: 50,
      },
    ],
  });
}
function _actualiserListeAnnee() {
  let lColoneesCachees = [];
  switch (this.parametres.affichage.choixAbsence) {
    case EGenreRessource.Absence:
      lColoneesCachees = [DonneesListe_AbsencesGrille.colonnes.matiere];
      break;
    case EGenreRessource.Retard:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.matiere,
        DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
      ];
      break;
    case EGenreRessource.Exclusion:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.regle,
        DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
      ];
      break;
    case EGenreRessource.Infirmerie:
      lColoneesCachees = [
        DonneesListe_AbsencesGrille.colonnes.motif,
        DonneesListe_AbsencesGrille.colonnes.matiere,
        DonneesListe_AbsencesGrille.colonnes.regle,
        DonneesListe_AbsencesGrille.colonnes.absenceOuverte,
      ];
      break;
  }
  if (!this.parametres.eleve.listeAbsences.avecColAbsenceOuverte) {
    lColoneesCachees.push(DonneesListe_AbsencesGrille.colonnes.absenceOuverte);
  }
  const lListe = this.listeAnnee;
  clearTimeout(this.parametres._timerListeAnnee);
  this.parametres._timerListeAnnee = setTimeout(() => {
    const lSelections = lListe.getListeElementsSelection();
    lListe.setOptionsListe({ colonnesCachees: lColoneesCachees });
    lListe.setDonnees(
      new DonneesListe_AbsencesGrille(
        this.parametres.eleve.listeAbsences.liste,
      ),
    );
    lListe.setListeElementsSelection(lSelections);
  }, 0);
}
function _colonneToGenreSaisie(aColonne) {
  switch (aColonne) {
    case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
      return TypeHttpSaisieAbsencesGrille.sag_AbsenceOuverte;
    case DonneesListe_AbsencesGrille.colonnes.regle:
      return TypeHttpSaisieAbsencesGrille.sag_Reglement;
    case DonneesListe_AbsencesGrille.colonnes.justifie:
      return TypeHttpSaisieAbsencesGrille.sag_MotifRecevable;
    case DonneesListe_AbsencesGrille.colonnes.horsEtab:
      return TypeHttpSaisieAbsencesGrille.sag_HorsEtab;
    case DonneesListe_AbsencesGrille.colonnes.sante:
      return TypeHttpSaisieAbsencesGrille.sag_Sante;
    case DonneesListe_AbsencesGrille.colonnes.publieWeb:
      return TypeHttpSaisieAbsencesGrille.sag_PublicationWeb;
    default:
  }
  return -1;
}
function _ouvrirFenetreSelectionMotif(aInstance, aListeMotifs, aCallback) {
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SelectionMotif,
    { pere: aInstance },
    {
      callback: function (aNumeroBouton, aMotif) {
        if (aNumeroBouton !== 1) {
          return;
        }
        if (aCallback) {
          aCallback(aMotif);
        }
      },
    },
  );
  lFenetre.setDonnees(aListeMotifs, false);
}
function _reponseAbsencesGrillePassageInfirmerie(aPassage, aJSONReponse) {
  if (!aJSONReponse.detailsPassage) {
    return;
  }
  const lPassage = MethodesObjet.dupliquer(aPassage),
    lDetailsPassage = aJSONReponse.detailsPassage,
    lSelf = this;
  lPassage.Accompagnateur = lPassage.accompagnateur || new ObjetElement();
  lPassage.DateDebut = lDetailsPassage.dateDebut;
  lPassage.DateFin = lDetailsPassage.dateFin;
  lPassage.estPubliee = lDetailsPassage.estPubliee;
  lPassage.estConfidentiel = lDetailsPassage.estConfidentiel;
  lDetailsPassage.listeEleves.addElement(
    new ObjetElement("&lt;" + GTraductions.getValeur("Aucun") + "&gt;", 0),
  );
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Infirmerie, {
    pere: lSelf,
    evenement: function (aNumeroBouton) {
      if (aNumeroBouton !== 1) {
        return;
      }
      _saisieAbsence(lSelf, {
        genreSaisie: TypeHttpSaisieAbsencesGrille.sag_PassageInfirmerie,
        article: aPassage,
        heureDebut: lPassage.DateDebut,
        heureFin: lPassage.DateFin,
        accompagnateur: lPassage.Accompagnateur,
        commentaire: lPassage.commentaire,
        publicationWeb: lPassage.estPubliee,
        estConfidentiel: lPassage.estConfidentiel,
      });
    },
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("AbsenceVS.Titre_FenetreInfirmerie"),
        largeur: 380,
      });
    },
  });
  lFenetre.setDonnees(lDetailsPassage.listeEleves, {
    numeroEleve: GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    ).getNumero(),
    borneMin: lDetailsPassage.dateMin,
    borneMax: lDetailsPassage.dateMax,
    absence: lPassage,
    avecEditionPublication: !lPassage.estConfidentiel,
    avecBoutonSupprimer: false,
  });
}
function _evenemnentSurListe(aParams) {
  let lListeMotifs;
  const lSelf = this;
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Edition:
      switch (aParams.idColonne) {
        case DonneesListe_AbsencesGrille.colonnes.motif:
          switch (aParams.article.getGenre()) {
            case TypeRessourceAbsence.TR_Exclusion:
              _ouvrirFenetreMotifsExclusion(
                this,
                (aListeMotifs) => {
                  _saisieAbsence(lSelf, {
                    genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Motif,
                    article: aParams.article,
                    listeMotifsExclusion: aListeMotifs,
                  });
                },
                aParams.article.listeMotifs,
              );
              break;
            case TypeRessourceAbsence.TR_Absence:
            case TypeRessourceAbsence.TR_AbsenceRepas:
            case TypeRessourceAbsence.TR_AbsenceInternat:
            case TypeRessourceAbsence.TR_Retard:
              lListeMotifs = MethodesObjet.dupliquer(
                aParams.article.getGenre() === TypeRessourceAbsence.TR_Retard
                  ? GCache.listeMotifsRetards
                  : GCache.listeMotifsAbsenceEleve,
              );
              lListeMotifs.setTri([
                ObjetTri.init((D) => {
                  return !D.ssMotif;
                }, ObjetTri.init("Libelle")),
              ]);
              _ouvrirFenetreSelectionMotif(this, lListeMotifs, (aMotif) => {
                _saisieAbsence(lSelf, {
                  genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Motif,
                  article: aParams.article,
                  motifModifie: aMotif,
                });
              });
              break;
            default:
          }
          break;
        case DonneesListe_AbsencesGrille.colonnes.duree:
        case DonneesListe_AbsencesGrille.colonnes.accompagnateur:
        case DonneesListe_AbsencesGrille.colonnes.commentaire:
          new ObjetRequeteAbsencesGrille(
            this,
            _reponseAbsencesGrillePassageInfirmerie.bind(this, aParams.article),
          ).lancerRequete({
            eleve: GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Eleve,
            ),
            domaine: GEtatUtilisateur.getDomaineSelectionne(),
            genreAbsence: this.parametres.affichage.choixAbsence,
            avecDetailPassageInfirmerie: true,
            passageInfirmerie: aParams.article,
          });
          break;
        case DonneesListe_AbsencesGrille.colonnes.absenceOuverte:
          _saisieAbsence(this, {
            genreSaisie: _colonneToGenreSaisie(aParams.idColonne),
            absence: aParams.article,
            estAbsenceOuverte: aParams.article.absenceOuverte,
            avecConfirmationFermeture: true,
          });
          break;
        case DonneesListe_AbsencesGrille.colonnes.suivi:
          ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SuiviUnique,
            {
              pere: this,
              evenement: function () {
                this.parametres.eleve.listeAbsences = null;
                _actualiserAbsences.call(this);
              },
            },
            {
              titre: GTraductions.getValeur("grilleAbsence.liste.titre.Suivi"),
            },
          ).setDonnees(
            GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
            aParams.article,
          );
          break;
        default: {
          const lGenre = _colonneToGenreSaisie(aParams.idColonne);
          if (lGenre >= 0) {
            _saisieAbsence(this, {
              genreSaisie: lGenre,
              article: aParams.article,
            });
          }
        }
      }
      break;
    case EGenreEvenementListe.ApresEdition: {
      const lArticle = aParams.article;
      switch (aParams.idColonne) {
        case DonneesListe_AbsencesGrille.colonnes.duree:
          if (lArticle.getGenre() !== TypeRessourceAbsence.TR_Retard) {
            return;
          }
          if (lArticle.editDureeModifie === lArticle.editDuree) {
            return;
          }
          if (
            !MethodesObjet.isNumber(lArticle.editDureeModifie) ||
            lArticle.editDureeModifie < 1 ||
            lArticle.editDureeModifie > 99
          ) {
            GApplication.getMessage().afficher({
              message: GTraductions.getValeur("ErreurMinMaxEntier", [1, 99]),
            });
            return;
          }
          _saisieAbsence(this, {
            genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Duree,
            article: lArticle,
            duree: lArticle.editDureeModifie,
          });
          break;
        case DonneesListe_AbsencesGrille.colonnes.DJBulletin:
          if (
            lArticle.DJBulletin_modifie === lArticle.DJBulletin ||
            (lArticle.DJBulletin_modifie === 0 && !lArticle.DJBulletin)
          ) {
            return;
          }
          if (
            !MethodesObjet.isNumber(lArticle.DJBulletin_modifie) ||
            lArticle.DJBulletin_modifie < 0 ||
            lArticle.DJBulletin_modifie >= 100
          ) {
            GApplication.getMessage().afficher({
              message: GTraductions.getValeur("ErreurMinMaxEntier", [0, 100]),
            });
            return;
          }
          _saisieAbsence(this, {
            genreSaisie: TypeHttpSaisieAbsencesGrille.sag_DJBulletin,
            article: lArticle,
            DJBulletin: lArticle.DJBulletin_modifie,
          });
          break;
        default:
      }
      break;
    }
    case EGenreEvenementListe.Suppression:
      if (aParams.listeSuppressions && aParams.listeSuppressions.count() > 0) {
        _saisieAbsence(this, {
          genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Suppression,
          articles: aParams.listeSuppressions,
        });
      }
      break;
  }
}
function _evenemnentSurListeAnnee(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Edition:
      switch (aParametres.idColonne) {
        case DonneesListe_AbsencesGrille.colonnes.regle:
          _saisieAbsence(this, {
            genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Reglement,
            article: aParametres.article,
          });
          break;
      }
      break;
    case EGenreEvenementListe.SelectionDblClick: {
      const lArticle = aParametres.article;
      if (lArticle && lArticle.semaine) {
        const lDomaine = new TypeDomaine();
        lDomaine.setValeur(true, lArticle.semaine);
        if (!lDomaine.egal(GEtatUtilisateur.getDomaineSelectionne())) {
          this.parametres.eleve.listeAbsences = null;
          this.getInstance(this.IdentCalendrier).setSelection(
            lDomaine.getPremierePosition(),
          );
        }
      }
      break;
    }
  }
}
function _getListeCacheDAbsence(aGenre) {
  switch (aGenre) {
    case EGenreRessource.Absence:
      return GCache.listeMotifsAbsenceEleve;
    case EGenreRessource.Retard:
      return GCache.listeMotifsRetards;
  }
}
function _getAccesseurMotifDAbsence(aGenre) {
  switch (aGenre) {
    case EGenreRessource.Absence:
      return "motifAbsenceSelectionne";
    case EGenreRessource.Retard:
      return "motifRetardSelectionne";
  }
}
function _getContenuComboMotif(aLibelle, aCouleur) {
  const H = [];
  H.push(
    '<span class="InlineBlock AlignementMilieuVertical" style="width: 12px; height: 12px; ' +
      GStyle.composeCouleurBordure("black") +
      " " +
      GStyle.composeCouleurFond(aCouleur) +
      '">',
    "&nbsp;",
    "</span>",
  );
  H.push(
    '<span class="PetitEspaceGauche AlignementMilieuVertical">',
    aLibelle,
    "</span>",
  );
  return H.join("");
}
function _selectionnerMotifAbsence(aMotif) {
  this.parametres.affichage[
    _getAccesseurMotifDAbsence(this.parametres.affichage.choixAbsence)
  ] = aMotif;
  this.getInstance(this.IdentGrille).setOptions({
    motifAbsence:
      this.parametres.affichage[
        _getAccesseurMotifDAbsence(this.parametres.affichage.choixAbsence)
      ],
  });
}
function _getControleurCombo() {
  return {
    init: function (aInstance) {
      aInstance.setOptionsObjetSaisie({
        celluleAvecTexteHtml: true,
        longueur: 200,
      });
    },
    getDonnees: function (aDonnees) {
      if (!aDonnees) {
        const lListeModele = _getListeCacheDAbsence(
          this.instance.parametres.affichage.choixAbsence,
        );
        if (!lListeModele) {
          return new ObjetListeElements();
        }
        const lListe = MethodesObjet.dupliquer(lListeModele);
        lListe.parcourir((aElement) => {
          aElement.libelleHtml = _getContenuComboMotif(
            aElement.getLibelle(),
            aElement.couleur,
          );
        });
        lListe.setTri([
          ObjetTri.init((D) => {
            return !D.nonConnu;
          }),
          ObjetTri.init("Libelle"),
        ]);
        lListe.trier();
        const lAccesseur = _getAccesseurMotifDAbsence(
          this.instance.parametres.affichage.choixAbsence,
        );
        if (!this.instance.parametres.affichage[lAccesseur]) {
          this.instance.parametres.affichage[lAccesseur] = lListe.get(0);
          const lGrille = this.instance.getInstance(this.instance.IdentGrille);
          lGrille.setOptions({
            motifAbsence: this.instance.parametres.affichage[lAccesseur],
          });
          lGrille.EnAffichage = true;
        }
        return lListe;
      }
    },
    getIndiceSelection: function (aInstance) {
      return aInstance.ListeElements.getIndiceParElement(
        this.instance.parametres.affichage[
          _getAccesseurMotifDAbsence(
            this.instance.parametres.affichage.choixAbsence,
          )
        ],
      );
    },
    event: function (aParametres, aCombo) {
      if (
        aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection &&
        aCombo.InteractionUtilisateur
      ) {
        _selectionnerMotifAbsence.call(this.instance, aParametres.element);
      }
    },
  };
}
function _demandeMemos(aInstance) {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ListeMemosEleves, {
    pere: aInstance,
  }).setDonnees(
    false,
    GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
  );
}
function _construireGroupe(aLibelle, aContenu) {
  const H = [];
  H.push('<fieldset class="Bordure" style="margin:0; padding:0;">');
  H.push('<legend class="Legende">', aLibelle, "</legend>");
  H.push('<div style="padding :2px 10px;">');
  H.push(aContenu);
  H.push("</div>");
  H.push("</fieldset>");
  return H.join("");
}
function _composeSelecteurAbsences() {
  const H = [];
  let lContenu;
  H.push('<div class="EspaceHaut EspaceBas">');
  H.push('<div class="InlineBlock AlignementHaut">');
  lContenu = [];
  lContenu.push(
    '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical">',
    '<ie-radio ie-model="rbChoixAbsence(',
    EGenreRessource.Absence,
    ')">',
    GTraductions.getValeur("grilleAbsence.absence"),
    "</ie-radio>",
    "</div>",
  );
  lContenu.push(
    '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical">',
    '<ie-radio ie-model="rbChoixAbsence(',
    EGenreRessource.Retard,
    ')">',
    GTraductions.getValeur("grilleAbsence.retard"),
    "</ie-radio>",
    "</div>",
  );
  if (GApplication.droits.get(TypeDroits.absences.avecSaisieExclusion)) {
    lContenu.push(
      '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical">',
      '<ie-radio ie-model="rbChoixAbsence(',
      EGenreRessource.Exclusion,
      ')">',
      GTraductions.getValeur("grilleAbsence.exclusion"),
      "</ie-radio>",
      "</div>",
    );
  }
  if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionInfirmerie)) {
    lContenu.push(
      '<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical">',
      '<ie-radio ie-model="rbChoixAbsence(',
      EGenreRessource.Infirmerie,
      ')">',
      GTraductions.getValeur("grilleAbsence.infirmerie"),
      "</ie-radio>",
      "</div>",
    );
  }
  lContenu.push(
    '<div  class="InlineBlock AlignementMilieuVertical" style="width:230px;">',
  );
  lContenu.push(
    '<ie-combo ie-model="comboMotifAbsence" ie-if="avecComboMotifAbsence"></ie-combo>',
  );
  lContenu.push(
    '<ie-combo ie-model="comboMotifRetard" ie-if="avecComboMotifRetard"></ie-combo>',
  );
  lContenu.push("</div>");
  lContenu.push(
    '<div class="InlineBlock AlignementMilieuVertical">',
    '<div style="height:25px;">&nbsp;</div>',
    "</div>",
  );
  H.push(
    _construireGroupe(
      GTraductions.getValeur("grilleAbsence.typeSaisie"),
      lContenu.join(""),
    ),
  );
  H.push("</div>");
  if (GApplication.droits.get(TypeDroits.dossierVS.consulterMemosEleve)) {
    H.push('<div class="InlineBlock EspaceGauche AlignementHaut">');
    lContenu = [];
    lContenu.push(
      '<div ie-node="getNodeMemo" class="Gras AvecMain" style="line-height: 24px;">',
    );
    lContenu.push(
      '<i class="icon_post_it_rempli InlineBlock AlignementMilieuVertical" style="font-size:1.3em;"></i>',
    );
    lContenu.push(
      '<div class="InlineBlock EspaceGauche AlignementMilieuVertical SouligneSurvol" style="',
      GStyle.composeCouleurTexte(GCouleur.themeCouleur.foncee),
      '">',
      GTraductions.getValeur("grilleAbsence.afficherMemos"),
      "</div>",
    );
    lContenu.push("</div>");
    H.push(
      _construireGroupe(
        GTraductions.getValeur("grilleAbsence.titreMemo"),
        lContenu.join(""),
      ),
    );
    H.push("</div>");
  }
  H.push(
    '<div class="InlineBlock GrandEspaceGauche AlignementMilieuVertical" style="padding:23px 0 0 15px;">',
  );
  H.push(
    '<div class="InlineBlock AlignementMilieuVertical Image_AppelFait"></div>',
  );
  H.push(
    '<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
    GTraductions.getValeur("grilleAbsence.AppelFait"),
    "</div>",
  );
  H.push("</div>");
  H.push("</div>");
  return H.join("");
}
function _construireListeAnnee() {
  if (this.parametres.affichage.listeAnneeVisible && this.listeAnnee) {
    _actualiserListeAnnee.call(this);
    return;
  }
  if (this.listeAnnee) {
    this.listeAnnee.free();
  }
  this.listeAnnee = null;
  $("#" + this.idConteneurListeAnnee.escapeJQ())
    .ieHtml("")
    .hide();
  if (this.parametres.affichage.listeAnneeVisible) {
    this.listeAnnee = Identite.creerInstance(ObjetListe, {
      pere: this,
      evenement: _evenemnentSurListeAnnee,
    });
    const H = [];
    H.push(
      '<div ie-texte="getTitreListeAnnee" style="position:absolute; top:5px; right:0; width:',
      this.parametres.largeurListeAnnee,
      'px;"></div>',
    );
    H.push(
      '<div id="' + this.listeAnnee.getNom() + '"',
      ' style="position:absolute; top:22px; bottom:5px; right:0; width:',
      this.parametres.largeurListeAnnee,
      'px;"></div>',
    );
    $("#" + this.idConteneurListeAnnee.escapeJQ())
      .show()
      .ieHtml(H.join(""), { controleur: this.controleur });
    this.listeAnnee.recupererDonnees();
    _initialiserListeAnnee.call(this, this.listeAnnee);
    _actualiserListeAnnee.call(this);
  }
}
function _initialiserCalendrier(AInstance) {
  UtilitaireInitCalendrier.init(AInstance);
}
function _initialiserGrille(AInstance) {
  AInstance.setOptions({
    decorateurAbsences: new TDecorateurAbsencesGrille(),
    avecSeparationDemiJAbsence: true,
  });
  AInstance.moduleCours.setParametres({
    modeGrilleAbsence: true,
    couleurFondCours: "#AEAEAE",
  });
}
function _evenementSurDernierMenuDeroulant() {
  GHtml.setDisplay(this.idMessage, false);
  GHtml.setDisplay(this.idPage, true);
  this.parametres.eleve = {};
  this.surSelectionEleve();
  this.surResizeInterface();
  const lCalendrier = this.getInstance(this.IdentCalendrier);
  lCalendrier.surPostResize();
  lCalendrier.setFrequences(GParametres.frequences, true);
  lCalendrier.setPeriodeDeConsultation(
    GApplication.droits.get(TypeDroits.cours.domaineConsultationEDT),
  );
  const lDomaine = GEtatUtilisateur.getDomaineSelectionne(),
    lAvecMultiSelection =
      this.parametres.affichage.choixAbsence === EGenreRessource.Absence;
  lCalendrier.setOptionsCalendrier({
    avecMultiSemainesContinues: lAvecMultiSelection,
  });
  if (lAvecMultiSelection) {
    lCalendrier.setDomaine(lDomaine);
  } else {
    lCalendrier.setSelection(lDomaine.getPremierePosition());
  }
}
function _ouvrirFenetreMotifsExclusion(
  aInstance,
  aCallback,
  aListeDejaSelectionnee,
) {
  const lListeMotifsSelection = MethodesObjet.dupliquer(
    GCache.listeMotifsExclusion,
  );
  lListeMotifsSelection
    .setTri([
      ObjetTri.init((D) => {
        return !D.ssMotif;
      }),
      ObjetTri.init("Libelle"),
    ])
    .trier();
  if (aListeDejaSelectionnee) {
    aListeDejaSelectionnee.parcourir((D) => {
      const lElement = lListeMotifsSelection.getElementParNumero(D.getNumero());
      if (lElement) {
        lElement.cmsActif = true;
      }
    });
  }
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_Liste,
    { pere: aInstance, initialiser: false },
    {
      callback: function (aNumeroBouton) {
        if (aNumeroBouton !== 1) {
          return;
        }
        const lListeMotifs = lListeMotifsSelection
          .getListeElements((aElement) => {
            return aElement.cmsActif;
          })
          .setSerialisateurJSON({ ignorerEtatsElements: true });
        if (aCallback) {
          aCallback(lListeMotifs);
        }
      },
    },
  );
  lFenetre.setOptionsFenetre({
    modeActivationBtnValider:
      lFenetre.modeActivationBtnValider.auMoinsUnEltSelectionne,
  });
  const lParam = {
    titres: [
      { estCoche: true },
      GTraductions.getValeur("fenetreMotifs.motif"),
      "",
      GTraductions.getValeur("fenetreMotifs.genre"),
    ],
    tailles: [20, "100%", 15, 120],
    editable: true,
  };
  lFenetre.setOptionsFenetre({
    titre: GTraductions.getValeur("fenetreMotifs.titre"),
    largeur: 450,
    hauteur: 400,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  lFenetre.paramsListe = lParam;
  lFenetre.initialiser();
  lFenetre.setDonnees(
    new DonneesListe_SelectionMotifs(lListeMotifsSelection),
    false,
  );
}
function _reponseSaisie(aDonnees, aJSONReponse) {
  const lInstance = this;
  if (aJSONReponse) {
    if (aJSONReponse.donneesApresSaisie) {
      _reponseAbsencesGrille.call(this, aJSONReponse.donneesApresSaisie);
      return;
    }
    if (aJSONReponse.alert) {
      GApplication.getMessage().afficher({ message: aJSONReponse.alert });
      _actualiserAbsences.call(this);
      return;
    }
    if (aJSONReponse.confirm || aJSONReponse.confirm_continue) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: aJSONReponse.confirm || aJSONReponse.confirm_continue,
        callback: function (aAccepte) {
          const lAccepte = aAccepte === EGenreAction.Valider;
          if (aJSONReponse.confirm_continue) {
            _saisieAbsence(lInstance, aDonnees, true, lAccepte);
            return;
          }
          if (lAccepte) {
            _saisieAbsence(lInstance, aDonnees, true);
          } else {
            _actualiserAbsences.call(lInstance);
          }
        },
      });
      return;
    }
    if (aJSONReponse.demandeMotifsExclusion) {
      _ouvrirFenetreMotifsExclusion(this, (aListeMotifs) => {
        _saisieAbsence(
          lInstance,
          $.extend(aDonnees, {
            genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Grille,
            listeMotifsExclusion: aListeMotifs,
          }),
          true,
        );
      });
      return;
    }
  }
  this.parametres.eleve.absencesGrille = null;
  this.parametres.eleve.listeAbsences = null;
  _actualiserAbsences.call(this);
}
function _saisieAbsence(
  aInstance,
  aDonnees,
  aConfirmation,
  aConfirmation_continue,
  aListeFichiersUpload,
) {
  const lParametres = $.extend(
    {
      genreSaisie: null,
      eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
      domaine: GEtatUtilisateur.getDomaineSelectionne(),
      genreAbsence: aInstance.parametres.affichage.choixAbsence,
      avecListeAbsencesAnnee:
        !!aInstance.parametres.affichage.listeAnneeVisible,
    },
    aDonnees,
  );
  if (aConfirmation) {
    lParametres.confirmation = aConfirmation;
  }
  lParametres.confirmation_continue = aConfirmation_continue;
  switch (aInstance.parametres.affichage.choixAbsence) {
    case EGenreRessource.Absence:
      lParametres.motif =
        aInstance.parametres.affichage[
          _getAccesseurMotifDAbsence(
            aInstance.parametres.affichage.choixAbsence,
          )
        ];
      break;
    case EGenreRessource.Retard:
      lParametres.motif =
        aInstance.parametres.affichage[
          _getAccesseurMotifDAbsence(
            aInstance.parametres.affichage.choixAbsence,
          )
        ];
      break;
  }
  new ObjetRequeteSaisieAbsencesGrille(
    aInstance,
    _reponseSaisie.bind(aInstance, aDonnees),
  )
    .addUpload({ listeFichiers: aListeFichiersUpload })
    .lancerRequete(lParametres)
    .catch(() => {
      _actualiserAbsences.call(aInstance);
    });
}
function _surMenuContextuelMotifAbsence(aMotif) {
  if (!aMotif) {
    return;
  }
  const lSelf = this;
  ObjetMenuContextuel.afficher({
    pere: this,
    evenement: function () {
      _selectionnerMotifAbsence.call(lSelf, aMotif);
      lSelf.$refreshSelf();
    },
    initCommandes: function (aInstance) {
      aInstance.addCommande(
        0,
        GTraductions.getValeur("grilleAbsence.SelectionnerLeMotifDeLAbsence"),
        aMotif.getNumero() !==
          lSelf.parametres.affichage.motifAbsenceSelectionne.getNumero(),
      );
    },
  });
}
function _callbackGabaritFin(aInstance, aGrille, aParam) {
  if (aParam.gabarit.placeDebut < 0) {
    return;
  }
  _saisieAbsence(aInstance, {
    genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Grille,
    placeDebut: aGrille.getPlaceAbsence(aParam.gabarit.placeDebut, true),
    placeFin: aGrille.getPlaceAbsence(aParam.gabarit.placeFin, false),
    ajout: aParam.gabarit.ajout,
    genreAbsence: EGenreRessource.Absence,
  });
}
function _actualiserGrille() {
  let lGabarit = null;
  const lGrille = this.getInstance(this.IdentGrille);
  const lThis = this;
  lGrille.getDecorateurAbsences().setOptions({
    avecAbsencesDynamique:
      this.parametres.affichage.choixAbsence === EGenreRessource.Absence,
    rayureRetard:
      this.parametres.affichage.choixAbsence !== EGenreRessource.Retard,
    rayureAbsence:
      this.parametres.affichage.choixAbsence !== EGenreRessource.Absence,
    callbackAbsenceOuverte: function (aAbsence) {
      _saisieAbsence(lThis, {
        genreSaisie: TypeHttpSaisieAbsencesGrille.sag_AbsenceOuverte,
        absence: aAbsence,
        estAbsenceOuverte: aAbsence.absenceOuverte,
      });
    },
  });
  if (this.parametres.affichage.choixAbsence === EGenreRessource.Absence) {
    lGabarit = new ObjetGrilleGabarit({
      avecRetaillageHoraire: false,
      avecDeplacement: false,
      gabaritMonoTranche: false,
      modeCreationSaisieParHoraire: true,
      tailleTrait: 2,
      styleTrait: "dotted",
      couleurTrait: "red",
      zIndex: 3,
      class: "",
      tailleBordureInterne: 0,
      tailleBordureExterne: 0,
      callbackPositionner: function (aParam) {
        lGrille.actualisationGabarit(aParam);
      },
      callbackFinCreation: function (aParam) {
        _callbackGabaritFin(lThis, lGrille, aParam);
      },
    });
  }
  lGrille.setOptions({
    choixAbsence: this.parametres.affichage.choixAbsence,
    motifAbsence:
      this.parametres.affichage[
        _getAccesseurMotifDAbsence(this.parametres.affichage.choixAbsence)
      ],
    callbackSaisieAbsence: function (aDonnees) {
      _saisieAbsence(lThis, aDonnees);
    },
    callbackMenuContextuelMotifAbsence:
      _surMenuContextuelMotifAbsence.bind(this),
    avecPiedTranche:
      (!!this.parametres.eleve.absencesGrille.avecDemiPension ||
        !!this.parametres.eleve.absencesGrille.avecInternat) &&
      (this.parametres.affichage.choixAbsence === EGenreRessource.Absence ||
        this.parametres.affichage.choixAbsence === EGenreRessource.Exclusion),
    largeurReserve: this.parametres.affichage.listeAnneeVisible
      ? this.parametres.largeurListeAnnee
      : 0,
    recreations: this.parametres.eleve.recreations || GParametres.recreations,
  });
  const lDomaine = GEtatUtilisateur.getDomaineSelectionne();
  lGrille.setDonnees({
    numeroSemaine: lDomaine.getPremierePosition(),
    domaine: lDomaine.getNbrValeurs() > 1 ? lDomaine : null,
    avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
    listeCours: this.parametres.eleve.listeCours,
    gabarit: lGabarit,
    joursStage: this.parametres.eleve.joursStage,
  });
  _actualiserListeDomaine.call(this);
  _construireListeAnnee.call(this);
  this.afficherBandeau(true);
}
function _reponseAbsencesGrille(aDonnees) {
  if (aDonnees.absencesGrille) {
    this.parametres.eleve.absencesGrille = aDonnees.absencesGrille;
  }
  if (aDonnees.liste) {
    this.parametres.eleve.listeAbsences = aDonnees.liste;
  }
  if (aDonnees.titre) {
    this.parametres.eleve.titre = aDonnees.titre;
  }
  this.getInstance(this.IdentGrille)
    .getDecorateurAbsences()
    .setDonnees({
      absencesGrille: this.parametres.eleve.absencesGrille,
      domaine: GEtatUtilisateur.getDomaineSelectionne(),
    });
  _actualiserGrille.call(this);
}
function _actualiserAbsences() {
  new ObjetRequeteAbsencesGrille(this, _reponseAbsencesGrille).lancerRequete({
    eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
    domaine: GEtatUtilisateur.getDomaineSelectionne(),
    genreAbsence: this.parametres.affichage.choixAbsence,
    avecAbsencesGrille: !this.parametres.eleve.absencesGrille,
    avecListeAbsences: !this.parametres.eleve.listeAbsences,
    avecListeAbsencesAnnee: !!this.parametres.affichage.listeAnneeVisible,
  });
}
function _reponseEDT(aDonnees) {
  $.extend(this.parametres.eleve, aDonnees);
  _actualiserAbsences.call(this);
}
function _evenementSurCalendrier(
  ASelection,
  aDomaine,
  AGenreDomaineInformation,
  aEstDansPeriodeConsultation,
  AIsToucheSelection,
) {
  if (AIsToucheSelection) {
    this.setFocusIdCourant();
  } else {
    this.setIdCourant(this.Instances[this.IdentCalendrier].IdPremierElement);
    this.setEtatIdCourant(false);
    GEtatUtilisateur.setDomaineSelectionne(aDomaine);
    this.parametres.eleve.absencesGrille = null;
    this.parametres.eleve.listeAbsences = null;
    if (aDomaine.getNbrValeurs() !== 1) {
      this.parametres.eleve.listeCours = new ObjetListeElements();
      _actualiserAbsences.call(this);
    } else {
      new ObjetRequetePageEmploiDuTemps(this, _reponseEDT).lancerRequete({
        ressource: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Eleve,
        ),
        numeroSemaine: aDomaine.getPremierePosition(),
        avecCoursSortiePeda: true,
        avecRetenuesEleve: true,
      });
    }
  }
}
module.exports = { InterfaceAbsencesGrille };
