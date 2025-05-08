const { GChaine } = require("ObjetChaine.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeNote } = require("TypeNote.js");
const {
  UtilitaireBulletinEtReleve_Mobile,
} = require("UtilitaireBulletinEtReleve_Mobile.js");
const {
  EGenreEvolution,
  EGenreEvolutionUtil,
} = require("Enumere_Evolution.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreDirectionSlide } = require("EGenreDirectionSlide.js");
const { PiedDeBulletinMobile } = require("PiedDeBulletinMobile.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { OptionsPDFSco } = require("OptionsPDFSco.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class PageBulletinMobile extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.estCtxBulletinClasse =
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ConseilDeClasse;
    this.donneesRecues = false;
    this.moteur = new ObjetMoteurReleveBulletin();
    this.instancePiedDeBulletin = Identite.creerInstance(PiedDeBulletinMobile, {
      pere: this,
      evenement: null,
    });
    this.instancePiedDeBulletin.setDonneesContexte({
      typeContexteBulletin: this.estCtxBulletinClasse
        ? TypeContexteBulletin.CB_Classe
        : TypeContexteBulletin.CB_Eleve,
      avecSaisie: false,
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getIdentiteBouton: function () {
        return {
          class: ObjetBoutonFlottant,
          pere: this,
          init: function (aBtn) {
            aInstance.identBtnFlottant = aBtn;
            const lParam = {
              listeBoutons: [
                {
                  primaire: true,
                  icone: "icon_pdf",
                  callback: aInstance.afficherModalitesGenerationPDF.bind(
                    this,
                    aInstance,
                    _genererPdf,
                  ),
                },
              ],
            };
            aBtn.setOptionsBouton(lParam);
          },
        };
      },
    });
  }
  afficherModalitesGenerationPDF(aInstance) {
    let lParams = {
      callbaskEvenement: aInstance.surEvenementFenetre.bind(aInstance),
      modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.PDFEtCloud,
      avecDepot: true,
      avecTitreSelonOnglet: true,
    };
    UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
  }
  surEvenementFenetre(aLigne) {
    const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
    _genererPdf.call(this, !!lService ? lService.getGenre() : null);
  }
  construireAffichage() {
    this.listeRegroupements = new ObjetListeElements();
    this.listeServices = new ObjetListeElements();
    const lHtml = [];
    if (!!this.Message) {
      lHtml.push(this.composeAucuneDonnee(this.Message));
      if (!!this.identBtnFlottant) {
        this.identBtnFlottant.setVisible(false);
      }
    } else if (this.donneesRecues) {
      if (!!this.identBtnFlottant) {
        this.identBtnFlottant.setVisible(true);
      }
      lHtml.push('<div id="', this.Nom, '_Bulletin">');
      if (this.ListeElements.count()) {
        lHtml.push(this.composeCorpsDeBulletin());
      }
      lHtml.push(
        '<div id="',
        this.instancePiedDeBulletin.getNom(),
        '" class="m-bottom-xl"></div>',
      );
      lHtml.push("</div>");
      if (
        GApplication.droits.get(
          TypeDroits.autoriserImpressionBulletinReleveBrevet,
        ) &&
        !this.identBtnFlottant
      ) {
        $("#" + GInterface.idZonePrincipale).ieHtmlAppend(
          '<div class="is-sticky" ie-identite="getIdentiteBouton"></div>',
          { controleur: this.controleur, avecCommentaireConstructeur: false },
        );
      }
    }
    return lHtml.join("");
  }
  composeCorpsDeBulletin() {
    const lHtml = [];
    let lNumeroRegroupement;
    lHtml.push('<ul class="collection with-header bg-white bulletin">');
    lNumeroRegroupement = this.ListeElements.get(0).SurMatiere.getNumero();
    for (let I = 0; this.ListeElements && I < this.ListeElements.count(); I++) {
      const lService = this.ListeElements.get(I);
      if (lService.estService) {
        lHtml.push(
          this.composeService(
            lService,
            lNumeroRegroupement !== null &&
              lService.SurMatiere.getNumero() !== lNumeroRegroupement &&
              lService.SurMatiere.getLibelle() === "",
          ),
        );
        lNumeroRegroupement = lService.SurMatiere.getNumero();
      }
    }
    lHtml.push(this.composeMoyenneGenerale());
    lHtml.push("</ul>");
    return lHtml.join("");
  }
  composeService(aService, aDoitSortirDeRegroupement) {
    const lHtml = [];
    const lDebutRegroupement = this.composeRegroupement({ service: aService });
    lHtml.push(lDebutRegroupement);
    lHtml.push(
      '<li class="collection-item with-action ',
      aDoitSortirDeRegroupement ? "break-group" : "",
      '" onclick="',
      this.Nom,
      ".ouvrirPanel('",
      aService.getNumero(),
      '\')" style="padding:3px 12px;">',
    );
    const lLibelleService = aService.getLibelle();
    this.listeServices.addElement(aService);
    const lInfosMoyComplet =
      this.Affichage.AvecNivMaitriseEleve && this.Affichage.AvecMoyenneEleve;
    lHtml.push(
      '<div class="matiere-conteneur ',
      lInfosMoyComplet ? "infos-moy-complet" : "",
      '" style="border-color: ' +
        (!!aService.couleur && aService.couleur !== ""
          ? aService.couleur
          : "D4D4D4") +
        ';">',
    );
    lHtml.push('<div class="libelle">', lLibelleService, "</div>");
    if (!this.estCtxBulletinClasse) {
      lHtml.push(
        '<div class="moyenne-classe">',
        this.getMoyenneClasse(aService),
        "</div>",
      );
      lHtml.push('<div class="infos-moy-eleve">');
      lHtml.push(
        '<div class="moyenne-eleve">' +
          this.getNoteService(aService, { estMoyNR: aService.estMoyNR }) +
          "</div>",
      );
      lHtml.push(
        '<div class="nivMaitrise-eleve">' +
          this.getNivMaitriseService(aService) +
          "</div>",
      );
      lHtml.push("</div>");
    } else {
      lHtml.push("<div></div>");
      lHtml.push(
        '<div class="infos-moy-classe">',
        this.getNoteClasse(aService),
        "</div>",
      );
    }
    if (aService.estService && aService.nbSousServicesTotal > 0) {
      lHtml.push('<ul class="collection">');
      for (let J = 0; J < aService.nbSousServicesTotal; J++) {
        const lSousService = aService.ListeElements.get(J);
        lHtml.push('<li class="collection-item with-action">');
        const libelleSousService =
          !!lSousService.Matiere && lSousService.Matiere.getLibelle() !== ""
            ? lSousService.Matiere.getLibelle()
            : "";
        lHtml.push('<div class="sous-service-conteneur">');
        lHtml.push('<div class="libelle">');
        if (!!libelleSousService && libelleSousService !== "") {
          lHtml.push("<div>", libelleSousService, "</div>");
        }
        if (
          !!lSousService.ListeProfesseurs &&
          !!lSousService.ListeProfesseurs.count()
        ) {
          lHtml.push(
            "<div>",
            GChaine.replaceRCToHTML(
              lSousService.ListeProfesseurs.getTableauLibelles().join("<br>"),
            ),
            "</div>",
          );
        }
        lHtml.push("</div>");
        if (!this.estCtxBulletinClasse) {
          lHtml.push(
            '<div class="moyenne-classe">',
            this.getMoyenneClasse(lSousService),
            "</div>",
          );
          lHtml.push(
            '<div class="moyenne-eleve">' +
              this.getNoteService(lSousService, {}) +
              "</div>",
          );
        } else {
          lHtml.push("<div></div>");
          lHtml.push(
            '<div class="infos-moy-classe">' +
              this.getNoteClasse(lSousService) +
              "</div>",
          );
        }
        lHtml.push("</div>");
        lHtml.push("</li>");
      }
      lHtml.push("</ul>");
    }
    lHtml.push("</div>");
    lHtml.push("</li>");
    return lHtml.join("");
  }
  composeRegroupement(aParam) {
    const lService = aParam.service.estService
      ? aParam.service
      : aParam.service.pere;
    const lHtml = [];
    if (lService.SurMatiere.existeNumero() && lService.estDebutRegroupement) {
      this.listeRegroupements.addElement(lService);
      lHtml.push(
        '<li class="collection-header collection-group with-action" onclick="',
        this.Nom,
        ".ouvrirPanel('",
        lService.getNumero(),
        "',",
        true,
        ')">',
      );
      lHtml.push(
        '<div class="title left-align InlineBlock" style="width:86%;">' +
          lService.SurMatiere.getLibelle() +
          "</div>",
      );
      let lMoyenneRegroupement = "";
      const lServiceDansRegroupement =
        this.tableauSurMatieres[lService.regroupement];
      if (lService.AvecMoyenneRegroupement) {
        lMoyenneRegroupement = this.getNoteService(
          lServiceDansRegroupement,
          {},
        );
      }
      lHtml.push(
        '<div class="title right-align InlineBlock" style="width:13%;">',
        lMoyenneRegroupement,
        "</div>",
      );
      lHtml.push("</li>");
    }
    return lHtml.join("");
  }
  setDonnees(
    aListeElements,
    aPositionPeriode,
    aPositionMax,
    aTableauSurMatieres,
    aMoyenneGenerale,
    aDonneesAbsences,
    aPiedDePage,
    aAffichage,
    aPeriodeCourante,
  ) {
    if (aListeElements) {
      this.ListeElements = this.getListeDonneesLineaire(aListeElements);
      this.Affichage = aAffichage;
      this.donneesRecues = true;
      this.Message = false;
    }
    if (aTableauSurMatieres) {
      this.tableauSurMatieres = aTableauSurMatieres;
    }
    if (aMoyenneGenerale) {
      this.MoyenneGenerale = aMoyenneGenerale;
    }
    if (aDonneesAbsences) {
      this.donneesAbsences = aDonneesAbsences;
    }
    if (aPiedDePage) {
      this.PiedDePage = aPiedDePage;
    }
    this.periodeCourante = aPeriodeCourante;
    let lSensSlide;
    if (this.precedentePosition === aPositionMax && aPositionPeriode === 0) {
      lSensSlide = EGenreDirectionSlide.Droite;
    } else if (this.precedentePosition === 0 && aPositionPeriode > 1) {
      lSensSlide = EGenreDirectionSlide.Gauche;
    } else {
      lSensSlide =
        aPositionPeriode === this.precedentePosition
          ? EGenreDirectionSlide.Aucune
          : aPositionPeriode < this.precedentePosition
            ? EGenreDirectionSlide.Gauche
            : EGenreDirectionSlide.Droite;
    }
    this.precedentePosition = aPositionPeriode;
    this.afficher(null, lSensSlide);
    this.instancePiedDeBulletin.setDonneesPiedDeBulletin(
      aPiedDePage,
      aDonneesAbsences,
    );
    this.instancePiedDeBulletin.afficher();
  }
  setMessage(aMessage) {
    this.Message = aMessage;
    this.afficher();
  }
  getListeDonneesLineaire(aListeElements) {
    let lService, lSousService, lCmpActifs, lIndiceDernier, lIndiceDernierActif;
    const lListe = new ObjetListeElements();
    for (let I = 0, lNbr = aListeElements.count(); I < lNbr; I++) {
      lService = aListeElements.get(I);
      lService.estService = true;
      lService.nbSousServicesTotal = !!lService.ListeElements
        ? lService.ListeElements.count()
        : 0;
      lService.regroupement = lService.SurMatiere.getNumero();
      lService.avecAppreciationParSousService =
        lService.AvecAppreciationParSousService;
      lCmpActifs = 0;
      lIndiceDernier = 0;
      lIndiceDernierActif = 0;
      for (let J = 0; J < lService.nbSousServicesTotal; J++) {
        if (lService.ListeElements.get(J).Actif) {
          lCmpActifs++;
          lIndiceDernierActif = J;
        }
        lIndiceDernier = J;
      }
      lService.nbSousServicesActifs = lCmpActifs;
      lListe.addElement(lService);
      for (let J = 0; J < lService.nbSousServicesTotal; J++) {
        lSousService = lService.ListeElements.get(J);
        lSousService.estService = false;
        lSousService.estDernier = J === lIndiceDernier;
        lSousService.estDernierActif = J === lIndiceDernierActif;
        lSousService.regroupement = lService.regroupement;
        lSousService.avecAppreciationParSousService =
          lService.avecAppreciationParSousService;
        lListe.addElement(lSousService);
      }
    }
    return lListe;
  }
  calculerTotalECTS() {
    let lTotalECTS = 0;
    if (this.Affichage.avecECTS) {
      let lService;
      const lNombreServices = this.ListeElements.count();
      for (let I = 0; I < lNombreServices; I++) {
        lService = this.ListeElements.get(I);
        if (lService.ECTS !== false) {
          lTotalECTS += lService.ECTS;
        }
      }
    }
    return lTotalECTS.toFixed(3);
  }
  calculerNombrePointsEleve() {
    let lTotal = 0;
    if (this.Affichage.AvecNombrePointsEleve) {
      let lService;
      const lNombreService = this.ListeElements.count();
      for (let I = 0; I < lNombreService; I++) {
        lService = this.ListeElements.get(I);
        if (lService.NombrePointsEleve) {
          lTotal += lService.NombrePointsEleve.valeur;
        }
      }
    }
    return new TypeNote(lTotal, 2);
  }
  composeMoyenneGenerale() {
    const lHtml = [];
    if (this.Affichage && this.Affichage.AvecMoyenneGenerale) {
      lHtml.push(
        '<li class="collection-item raised with-action break-group" onclick="',
        this.Nom,
        '.ouvrirPanel()">',
      );
      lHtml.push(
        '<div class="title text-left InlineBlock" style="width:86%;" >',
        GTraductions.getValeur("BulletinEtReleve.MoyGen"),
        "</div>",
      );
      let lMoyenneGenerale = "";
      if (this.MoyenneGenerale) {
        if (this.estCtxBulletinClasse) {
          lMoyenneGenerale = this.MoyenneGenerale.MoyenneClasse.getNote();
        } else {
          if (
            this.MoyenneGenerale.moyenneDeliberee &&
            this.MoyenneGenerale.moyenneDeliberee.getNote() !== ""
          ) {
            lMoyenneGenerale = this.MoyenneGenerale.moyenneDeliberee.getNote();
          } else if (
            this.MoyenneGenerale.MoyenneEleve &&
            this.MoyenneGenerale.MoyenneEleve.getNote() !== ""
          ) {
            lMoyenneGenerale = this.MoyenneGenerale.MoyenneEleve.getNote();
          }
        }
        lHtml.push(
          '<div class="title text-right InlineBlock" style="width:13%;">',
          lMoyenneGenerale,
          "</div>",
        );
      }
      lHtml.push("</li>");
    }
    return lHtml.join("");
  }
  ouvrirPanel(aNumeroService, aOuvrirePanelRegroupement) {
    const lService = this.ListeElements.getElementParNumero(aNumeroService);
    if (!!lService) {
      if (!!aOuvrirePanelRegroupement) {
        const lRegr = this.composePanelRegroupement(lService);
        GInterface.openPanel(lRegr.html, {
          optionsFenetre: {
            titre: GTraductions.getValeur(
              "BulletinEtReleve.DetailsRegroupement",
            ),
            avecNavigation: true,
            titreNavigation: lRegr.titreNavigation,
            callbackNavigation: (aSuivant) => {
              this.surClickProchainElement(
                lService.getNumero(),
                aSuivant,
                true,
              );
            },
          },
        });
      } else {
        GInterface.openPanel(this.composePanelService(lService), {
          optionsFenetre: {
            titre: GTraductions.getValeur("BulletinEtReleve.DetailsMatiere"),
            avecNavigation: true,
            titreNavigation: () => {
              return this.composeBandeauService(lService);
            },
            callbackNavigation: (aSuivant) => {
              this.surClickProchainElement(lService.getNumero(), aSuivant);
            },
          },
        });
      }
    } else {
      GInterface.openPanel(
        this.composePanelMoyenneGenerale(this.MoyenneGenerale),
        {
          optionsFenetre: {
            titre: GTraductions.getValeur(
              "BulletinEtReleve.DetailsMoyenneGenerale",
            ),
          },
        },
      );
    }
  }
  composePanelRegroupement(aService) {
    const lHtml = [];
    let lMoyenneRegroupement = "";
    const lServiceDansRegroupement =
      this.tableauSurMatieres[aService.regroupement];
    if (aService.AvecMoyenneRegroupement) {
      lMoyenneRegroupement = this.getNoteService(lServiceDansRegroupement, {});
    }
    let lTitreNavigation = "";
    if (aService) {
      lTitreNavigation = `<span>${aService.SurMatiere.getLibelle()}</span><div>${lMoyenneRegroupement}</div>`;
      if (!!this.composeDetails(lServiceDansRegroupement, false)) {
        lHtml.push('<div class="details-conteneur">');
        lHtml.push(this.composeDetails(lServiceDansRegroupement, false));
        lHtml.push("</div>");
      }
      lHtml.push("</div>");
    }
    return { html: lHtml.join(""), titreNavigation: lTitreNavigation };
  }
  composePanelMoyenneGenerale(aMoyenneGenerale) {
    const lHtml = [];
    if (aMoyenneGenerale) {
      lHtml.push(
        '<div class="flex-contain cols flex-center ie-texte"><span>' +
          GTraductions.getValeur("BulletinEtReleve.MoyGen") +
          "</span>",
        this.Affichage.AvecMoyenneEleve &&
          aMoyenneGenerale.MoyenneEleve &&
          aMoyenneGenerale.MoyenneEleve.getNote() !== ""
          ? '<div class="get-note">' +
              aMoyenneGenerale.MoyenneEleve.getNote() +
              "</div>"
          : "",
        "</div>",
      );
      if (!!this.composeDetails(aMoyenneGenerale, true)) {
        lHtml.push('<div class="details-conteneur">');
        lHtml.push(this.composeDetails(aMoyenneGenerale, true));
        lHtml.push("</div>");
      }
    }
    return lHtml.join("");
  }
  composePanelService(aService) {
    const lHtml = [];
    if (aService) {
      if (!!this.composeDetails(aService, false)) {
        lHtml.push('<div class="details-conteneur ">');
        lHtml.push(this.composeDetails(aService, false));
        lHtml.push("</div>");
      }
      lHtml.push(this.composeElementProgrammeBulletin(aService));
      lHtml.push(this.composeAppreciationsService(aService));
      if (aService.estService && aService.nbSousServicesTotal > 0) {
        lHtml.push('<ul class="collapsible popout">');
        for (let J = 0; J < aService.nbSousServicesTotal; J++) {
          const lSousService = aService.ListeElements.get(J);
          lHtml.push(this.composeSousService(lSousService));
        }
        lHtml.push("</ul>");
      }
      lHtml.push(this.composeLegende(aService));
    }
    return lHtml.join("");
  }
  composeBandeauService(aService) {
    const lHtml = [];
    lHtml.push("<span>" + aService.getLibelle());
    const libelleProfesseur = this.getProfesseur(aService);
    if (libelleProfesseur !== "") {
      lHtml.push(" - ", libelleProfesseur);
    }
    lHtml.push("</span>");
    lHtml.push('<div class="infos-moy-eleve-bandeau">');
    lHtml.push(
      "<div>" +
        this.getNoteService(aService, {
          estMoyNR: aService.estMoyNR,
          surMemeLigne: true,
        }) +
        "</div>",
    );
    lHtml.push(
      '<div class="nivMaitrise-eleve-bandeau">' +
        this.getNivMaitriseService(aService) +
        "</div>",
    );
    lHtml.push("</div>");
    if (
      this.Affichage.avecECTS &&
      aService.ECTS &&
      aService.ECTS &&
      aService.ECTS !== ""
    ) {
      lHtml.push("<div>");
      lHtml.push(
        GTraductions.getValeur("BulletinEtReleve.ECTS"),
        "&nbsp;",
        aService.ECTS,
      );
      lHtml.push("</div>");
    }
    return lHtml.join("");
  }
  composeSousService(aSousService) {
    const lHtml = [],
      lDetailSousService = this.composeDetails(aSousService, false),
      libelleSousService =
        !!aSousService.Matiere && aSousService.Matiere.getLibelle() !== ""
          ? aSousService.Matiere.getLibelle()
          : "";
    lHtml.push("<li>");
    lHtml.push(
      '<div class="collapsible-header',
      lDetailSousService ? " active" : " empty-body",
      '">',
    );
    lHtml.push("<div>");
    lHtml.push(
      '<div class="InlineBlock truncate" style="',
      lDetailSousService ? "width:69%;" : "",
      '">',
    );
    if (!!libelleSousService && libelleSousService !== "") {
      lHtml.push("<div>", libelleSousService, "</div>");
    }
    if (
      !!aSousService.ListeProfesseurs &&
      !!aSousService.ListeProfesseurs.count()
    ) {
      lHtml.push(
        "<div>",
        GChaine.replaceRCToHTML(
          aSousService.ListeProfesseurs.getTableauLibelles().join("<br>"),
        ),
        "</div>",
      );
    }
    lHtml.push("</div>");
    lHtml.push(
      '<div class="InlineBlock" style="width:30%;',
      !lDetailSousService ? "float:right;" : "",
      '">',
    );
    lHtml.push(
      '<div class="right-align Italique InlineBlock" style="width:100%;">',
      this.getNoteService(aSousService, {}),
      "</div>",
    );
    lHtml.push("</div>");
    lHtml.push("</div>");
    lHtml.push("</div>");
    lHtml.push('<div class="collapsible-body details-conteneur">');
    lHtml.push(lDetailSousService || "");
    lHtml.push(this.composeAppreciationsService(aSousService));
    lHtml.push("</div>");
    lHtml.push("</li>");
    return lHtml.join("");
  }
  composeDetails(aParam, aEstMoyenneGenerale) {
    const lHtml = [];
    let lMoyNR;
    if (this.Affichage && !!aParam) {
      let lEstMultiLignes = false;
      if (this.Affichage.avecMoyNRUniquement === false) {
        lEstMultiLignes =
          this.Affichage.AvecMoyenneAnnuelle &&
          aParam.estMoyAnnuelleNR === true;
        if (lEstMultiLignes === false && this.Affichage.AvecMoyennePeriode) {
          for (
            let lIndice = 0;
            lIndice < this.Affichage.NombreMoyennesPeriodes;
            lIndice++
          ) {
            if (lEstMultiLignes === false) {
              lMoyNR =
                aParam.ListeMoyNRPeriodes !== null &&
                aParam.ListeMoyNRPeriodes !== undefined
                  ? aParam.ListeMoyNRPeriodes[lIndice]
                  : false;
              if (lMoyNR === true) {
                lEstMultiLignes = true;
              }
            }
          }
        }
      }
      if (
        this.Affichage.AvecVolumeHoraire &&
        !!aParam.VolumeHoraire &&
        aParam.VolumeHoraire !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.VolH"),
            aParam.VolumeHoraire,
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecCoefficient &&
        !!aParam.Coefficient &&
        aParam.Coefficient.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Coeff"),
            aParam.Coefficient.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecNombreDevoirs &&
        !!aParam.NombreDevoirs &&
        aParam.NombreDevoirs !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.NbrNotes"),
            aParam.NombreDevoirs,
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecClassementEleve &&
        !!aParam.ClassementEleve &&
        aParam.ClassementEleve !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Rang"),
            aParam.ClassementEleve,
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecEvolution &&
        !!aParam.Evolution &&
        aParam.Evolution.getGenre() !== null &&
        aParam.Evolution.getGenre() !== EGenreEvolution.Aucune
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Evol"),
            "<div>" +
              EGenreEvolutionUtil.getImage(aParam.Evolution.getGenre()) +
              "</div>",
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecMoyenneAnnuelle &&
        ((!!aParam.MoyenneAnnuelle &&
          aParam.MoyenneAnnuelle.getNote() !== "") ||
          aParam.estMoyAnnuelleNR === true)
      ) {
        const H = [];
        if (aParam.estMoyAnnuelleNR === true) {
          H.push(this.moteur.composeHtmlMoyNR());
        }
        if (
          !(
            aParam.estMoyAnnuelleNR === true &&
            this.Affichage.avecMoyNRUniquement === true
          )
        ) {
          H.push(aParam.MoyenneAnnuelle.getNote());
        }
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoyAnnee"),
            H.join(""),
            lEstMultiLignes,
          ),
        );
      }
      if (this.Affichage.AvecMoyennePeriode) {
        for (let I = 0; I < this.Affichage.NombreMoyennesPeriodes; I++) {
          if (
            aParam.ListeNiveauDAcquisitionPeriodes &&
            aParam.ListeNiveauDAcquisitionPeriodes.count() &&
            aParam.ListeNiveauDAcquisitionPeriodes.existeNumero(I)
          ) {
            const lNiveauDacquisition =
              GParametres.listeNiveauxDAcquisitions.getElementParNumero(
                aParam.ListeNiveauDAcquisitionPeriodes.getNumero(I),
              );
            lHtml.push(
              UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
                this.Affichage.listePeriodes.getLibelle(I),
                EGenreNiveauDAcquisitionUtil.getImagePositionnement({
                  niveauDAcquisition: lNiveauDacquisition,
                }),
                lEstMultiLignes,
              ),
            );
          } else if (
            (aParam.ListeMoyennesPeriodes &&
              aParam.ListeMoyennesPeriodes[I] &&
              aParam.ListeMoyennesPeriodes[I].getNote() !== "") ||
            (aParam.ListeMoyNRPeriodes && aParam.ListeMoyNRPeriodes[I] === true)
          ) {
            const H = [];
            lMoyNR =
              aParam.ListeMoyNRPeriodes !== null &&
              aParam.ListeMoyNRPeriodes !== undefined
                ? aParam.ListeMoyNRPeriodes[I]
                : false;
            if (lMoyNR === true) {
              H.push(this.moteur.composeHtmlMoyNR());
            }
            if (
              !(lMoyNR === true && this.Affichage.avecMoyNRUniquement === true)
            ) {
              H.push(aParam.ListeMoyennesPeriodes[I].getNote());
            }
            lHtml.push(
              UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
                this.Affichage.listePeriodes.getLibelle(I),
                H.join(""),
                lEstMultiLignes,
              ),
            );
          }
        }
      }
      if (aEstMoyenneGenerale) {
        aParam.NombrePointsEleve = this.calculerNombrePointsEleve();
        if (
          !!this.Affichage.AvecNombrePointsEleve &&
          aParam.NombrePointsEleve.valeur !== 0
        ) {
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
              GTraductions.getValeur("BulletinEtReleve.Pts"),
              aParam.NombrePointsEleve.getNote(),
              lEstMultiLignes,
            ),
          );
        }
        aParam.TotalECTS = this.calculerTotalECTS();
        if (!!this.Affichage.avecECTS && aParam.TotalECTS > 0) {
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
              GTraductions.getValeur("BulletinEtReleve.ECTS"),
              aParam.TotalECTS,
              lEstMultiLignes,
            ),
          );
        }
      } else if (
        this.Affichage.AvecNombrePointsEleve &&
        !!aParam.NombrePointsEleve &&
        aParam.NombrePointsEleve.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Pts"),
            aParam.NombrePointsEleve.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecMoyenneClasse &&
        !!aParam.MoyenneClasse &&
        aParam.MoyenneClasse.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Classe"),
            aParam.MoyenneClasse.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (
        !!this.Affichage.AvecMoyenneInfSup &&
        !!aParam.MoyenneInf &&
        aParam.MoyenneInf.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoyInf"),
            aParam.MoyenneInf.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (
        !!this.Affichage.AvecMoyenneInfSup &&
        !!aParam.MoyenneSup &&
        aParam.MoyenneSup.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoySup"),
            aParam.MoyenneSup.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (
        !!this.Affichage.AvecMoyenneMediane &&
        !!aParam.MoyenneMediane &&
        aParam.MoyenneMediane.getNote() !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.Mediane"),
            aParam.MoyenneMediane.getNote(),
            lEstMultiLignes,
          ),
        );
      }
      if (!!this.Affichage.AvecNombrePointsEntre && !!aParam.NombreNotesEntre) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoyInf8"),
            aParam.NombreNotesEntre[0] || "0",
            lEstMultiLignes,
          ),
        );
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoyEntre"),
            aParam.NombreNotesEntre[1] || "0",
            lEstMultiLignes,
          ),
        );
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.MoySup12"),
            aParam.NombreNotesEntre[2] || "0",
            lEstMultiLignes,
          ),
        );
      }
      if (
        this.Affichage.AvecDureeDesAbsenses &&
        !!aParam.DureeDesAbsences &&
        aParam.DureeDesAbsences !== ""
      ) {
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
            GTraductions.getValeur("BulletinEtReleve.HAbs"),
            aParam.DureeDesAbsences,
            lEstMultiLignes,
          ),
        );
      }
    }
    if (lHtml.length === 0) {
      return false;
    } else {
      return lHtml.join("");
    }
  }
  composeLegende(aService) {
    const lAvecInfoNR = _existeInfoNRPourService.call(this, aService);
    const lAvecNiveauAcqu = aService.NiveauDAcquisition;
    const lExisteLegende = lAvecInfoNR || lAvecNiveauAcqu;
    const lHtml = [];
    if (lExisteLegende) {
      lHtml.push('<div class="', this.Nom, '_legende legende-conteneur">');
      lHtml.push(
        "<h5>",
        GTraductions.getValeur("BulletinEtReleve.Legende"),
        "</h5>",
      );
      lHtml.push("<ul>");
      if (lAvecNiveauAcqu) {
        let lNiveauDAcquisition, lLibelle;
        const lGenrePositionnement =
          TypePositionnementUtil.getGenrePositionnementParDefaut(
            aService.TypePositionnementClasse,
          );
        for (
          let i = 0;
          i < GParametres.listeNiveauxDAcquisitions.count();
          i++
        ) {
          lNiveauDAcquisition = GParametres.listeNiveauxDAcquisitions.get(i);
          lLibelle = EGenreNiveauDAcquisitionUtil.getLibellePositionnement({
            niveauDAcquisition: lNiveauDAcquisition,
            avecPositionnementVide: true,
            genrePositionnement: lGenrePositionnement,
          });
          if (
            lLibelle &&
            EGenreNiveauDAcquisitionUtil.getNombrePointsBrevet(
              lNiveauDAcquisition,
            ).getValeur() > 0
          ) {
            lHtml.push(
              "<li>",
              EGenreNiveauDAcquisitionUtil.getImagePositionnement({
                niveauDAcquisition: lNiveauDAcquisition,
                genrePositionnement: lGenrePositionnement,
              }),
              '<span class="libelle">',
              lLibelle,
              "</span>",
              "</li>",
            );
          }
        }
      }
      if (lAvecInfoNR) {
        lHtml.push(
          '<li style="display:flex; align-items:flex-start; margin-top:1rem;">',
          this.moteur.composeHtmlMoyNR(),
          '<span class="libelle EspaceGauche">',
          GTraductions.getValeur("Notes.Colonne.HintMoyenneNR"),
          "</span>",
          "</li>",
        );
      }
      lHtml.push("</ul>");
      lHtml.push("</div>");
    }
    return lHtml.join("");
  }
  composeAppreciationsService(aService) {
    const lHtml = [];
    const lNombreAppreciationsSurService = aService.ListeAppreciations.count();
    for (let I = 0; I < lNombreAppreciationsSurService; I++) {
      const lAppreciationSurService =
        aService.ListeAppreciations.get(I).getLibelle();
      if (lAppreciationSurService !== "") {
        const lIntituleAppreciation =
          this.Affichage.ListeIntitulesAppreciations.get(I).getLibelle();
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
            intituleDAppreciation: lIntituleAppreciation,
            contenuDAppreciation: lAppreciationSurService,
            styleBlockIntitule: "color : #616161;",
            styleBlockContenu:
              "border:1px solid #616161; background-color: #F1F1F1;",
          }),
        );
      }
    }
    return lHtml.join("");
  }
  getNivMaitriseService(aService) {
    if (this.Affichage.AvecNivMaitriseEleve) {
      if (
        aService.NiveauDAcquisition &&
        aService.NiveauDAcquisition.existeNumero()
      ) {
        const lNiveauDAcquisition =
          GParametres.listeNiveauxDAcquisitions.getElementParNumero(
            aService.NiveauDAcquisition.getNumero(),
          );
        return (
          "<div>" +
          EGenreNiveauDAcquisitionUtil.getImagePositionnement({
            niveauDAcquisition: lNiveauDAcquisition,
            genrePositionnement:
              TypePositionnementUtil.getGenrePositionnementParDefaut(
                aService.TypePositionnementClasse,
              ),
          }) +
          "</div>"
        );
      }
    }
    return "";
  }
  getNoteService(aService, aInfosMoyNR) {
    if (
      this.Affichage.AvecMoyenneDeliberee ||
      this.Affichage.AvecMoyenneEleve
    ) {
      if (
        aService.avisReligionPropose &&
        aService.avisReligionPropose.getLibelle() !== ""
      ) {
        return aService.avisReligionPropose.getLibelle();
      } else if (
        aService.avisReligionDelibere &&
        aService.avisReligionDelibere.getLibelle() !== ""
      ) {
        return aService.avisReligionDelibere.getLibelle();
      } else if (
        aService.moyenneDeliberee &&
        aService.moyenneDeliberee.getNote() !== ""
      ) {
        return aService.moyenneDeliberee.getNote();
      } else if (
        aService.NiveauDAcquisition &&
        aService.NiveauDAcquisition.existeNumero() &&
        !this.Affichage.AvecNivMaitriseEleve
      ) {
        const lNiveauDAcquisition =
          GParametres.listeNiveauxDAcquisitions.getElementParNumero(
            aService.NiveauDAcquisition.getNumero(),
          );
        return (
          '<div style="position: relative; float: right; top: 3px;">' +
          EGenreNiveauDAcquisitionUtil.getImagePositionnement({
            niveauDAcquisition: lNiveauDAcquisition,
            genrePositionnement:
              TypePositionnementUtil.getGenrePositionnementParDefaut(
                aService.TypePositionnementClasse,
              ),
          }) +
          "</div>"
        );
      } else if (
        aService.MoyenneEleve &&
        aService.MoyenneEleve.getNote() !== ""
      ) {
        return aService.MoyenneEleve.getNote();
      } else {
        const H = [];
        if (aInfosMoyNR && aInfosMoyNR.estMoyNR === true) {
          H.push(this.moteur.composeHtmlMoyNR());
        }
        if (aService.MoyenneEleve && aService.MoyenneEleve.getNote() !== "") {
          if (
            !(
              aService.estMoyNR === true &&
              this.Affichage.avecMoyNRUniquement === true
            )
          ) {
            H.push(aService.MoyenneEleve.getNote());
          }
        }
        return H.join(
          aInfosMoyNR && aInfosMoyNR.surMemeLigne === true ? " " : "<br />",
        );
      }
    } else {
      return "";
    }
  }
  getMoyenneClasse(aService) {
    if (
      this.Affichage.AvecMoyenneClasse &&
      aService.MoyenneClasse &&
      aService.MoyenneClasse.getNote() !== ""
    ) {
      return (
        GTraductions.getValeur("BulletinEtReleve.ClasseAbr") +
        "&nbsp;" +
        aService.MoyenneClasse.getNote()
      );
    } else {
      return "&nbsp;";
    }
  }
  getNoteClasse(aService) {
    if (aService.MoyenneClasse && aService.MoyenneClasse.getNote() !== "") {
      return aService.MoyenneClasse.getNote();
    } else {
      return "&nbsp;";
    }
  }
  getProfesseur(aService) {
    return !!aService.ListeProfesseurs && aService.ListeProfesseurs.count() > 0
      ? aService.ListeProfesseurs.getLibelle(0)
      : "";
  }
  getCoefficient(aService) {
    if (
      this.Affichage.AvecCoefficient &&
      aService.Coefficient &&
      aService.Coefficient.getNote() !== ""
    ) {
      return (
        GTraductions.getValeur("BulletinEtReleve.Coeff") +
        aService.Coefficient.getNote()
      );
    } else {
      return " ";
    }
  }
  composeElementProgrammeBulletin(aService) {
    const lHtml = [];
    if (
      this.Affichage.avecElementProgramme &&
      aService.ElementsProgrammeBulletin.count() > 0
    ) {
      aService.ElementsProgrammeBulletin.setTri([ObjetTri.init("Libelle")]);
      aService.ElementsProgrammeBulletin.trier();
      lHtml.push('<ul class="browser-default">');
      for (let I = 0; I < aService.ElementsProgrammeBulletin.count(); I++) {
        if (aService.ElementsProgrammeBulletin.get(I).getLibelle() !== "") {
          lHtml.push(
            "<li>",
            aService.ElementsProgrammeBulletin.get(I).getLibelle(),
            "</li>",
          );
        }
      }
      lHtml.push("</ul>");
      return UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
        intituleDAppreciation: this.Affichage.intituleElementProgramme,
        contenuDAppreciation: lHtml,
        styleBlockIntitule: "color : #616161;",
        styleBlockContenu: "border:1px solid #616161;",
      });
    }
    return "";
  }
  surClickProchainElement(aNumeroElement, aEstSuivant, aRegroupementSuivant) {
    let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
    if (!!aRegroupementSuivant) {
      lIndiceElementActuel =
        this.listeRegroupements.getIndiceParNumeroEtGenre(aNumeroElement);
      if (!!aEstSuivant) {
        lIndiceProchainElement =
          lIndiceElementActuel + 1 < this.listeRegroupements.count()
            ? lIndiceElementActuel + 1
            : 0;
      } else {
        lIndiceProchainElement =
          lIndiceElementActuel === 0
            ? this.listeRegroupements.count() - 1
            : lIndiceElementActuel - 1;
      }
      lProchainElement = this.listeRegroupements.get(lIndiceProchainElement);
      this.ouvrirPanel(lProchainElement.getNumero(), aRegroupementSuivant);
    } else {
      lIndiceElementActuel =
        this.listeServices.getIndiceParNumeroEtGenre(aNumeroElement);
      if (!!aEstSuivant) {
        lIndiceProchainElement =
          lIndiceElementActuel + 1 < this.listeServices.count()
            ? lIndiceElementActuel + 1
            : 0;
      } else {
        lIndiceProchainElement =
          lIndiceElementActuel === 0
            ? this.listeServices.count() - 1
            : lIndiceElementActuel - 1;
      }
      lProchainElement = this.listeServices.get(lIndiceProchainElement);
      this.ouvrirPanel(lProchainElement.getNumero(), aRegroupementSuivant);
    }
  }
  free(...aParams) {
    super.free(...aParams);
    if (this.identBtnFlottant) {
      $("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
    }
  }
}
function _genererPdf(aService) {
  const lParametrageAffichage = {
    genreGenerationPDF: TypeHttpGenerationPDFSco.Bulletin,
    periode: this.periodeCourante,
    avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
  };
  GenerationPDF.genererPDF({
    paramPDF: lParametrageAffichage,
    optionsPDF: OptionsPDFSco.Bulletin,
    cloudCible: aService,
  });
}
function _existeInfoNRPourService(aService) {
  let lAvecInfoNR =
    aService &&
    (aService.estMoyNR === true || aService.estMoyAnnuelleNR === true);
  if (
    lAvecInfoNR !== true &&
    this.Affichage.AvecMoyennePeriode &&
    aService.ListeMoyNRPeriodes !== null &&
    aService.ListeMoyNRPeriodes !== undefined
  ) {
    for (
      let lIndice = 0;
      lIndice < this.Affichage.NombreMoyennesPeriodes;
      lIndice++
    ) {
      if (lAvecInfoNR === false && aService.ListeMoyNRPeriodes[lIndice]) {
        lAvecInfoNR = true;
      }
    }
  }
  return lAvecInfoNR;
}
module.exports = { PageBulletinMobile };
