const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreDirection } = require("Enumere_Direction.js");
const { EEvent } = require("Enumere_Event.js");
const { GDate } = require("ObjetDate.js");
const { Identite } = require("ObjetIdentite.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GObjetWAI, EGenreRole, EGenreObjet } = require("ObjetWAI.js");
const {
  EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { EGenreTriCDT } = require("EGenreTriCDT.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetElement } = require("ObjetElement.js");
class PageCahierDeTexte extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.afficheTitre = true;
    this.afficheTitresContenuEtTAF = false;
    this.ajouterEvenementGlobal(EEvent.SurPreResize, this.surPreResize);
    this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
    this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte();
    this.options = { callbackContextMenuCDT: null };
    this.IdPremierElement = this.Nom + "_Contenu_cdt";
  }
  surPreResize() {
    this.afficher("&nbsp;");
  }
  surPostResize() {
    this.afficher();
    this.recupererDonnees();
  }
  setDonnees(aListeTravailAFaire, aListeCahierDeTextes) {
    this.ListeTravailAFaire = aListeTravailAFaire;
    this.ListeCahierDeTextes = aListeCahierDeTextes;
    this.DonneesRecues = true;
  }
  setParametres(aAfficheTitre, aAfficheTitreContenuEtTAF) {
    this.afficheTitre =
      aAfficheTitre === null || aAfficheTitre === undefined
        ? true
        : aAfficheTitre;
    this.afficheTitresContenuEtTAF =
      aAfficheTitreContenuEtTAF === null ||
      aAfficheTitreContenuEtTAF === undefined
        ? false
        : aAfficheTitreContenuEtTAF;
  }
  setOptionsCDT(aOptions) {
    $.extend(this.options, aOptions);
  }
  actualiser(aModeAffichage, aGenreTri, aNumeroMatiere) {
    this.DonneesActualisees = true;
    this.ModeAffichage = aModeAffichage;
    this.TypeTri = aGenreTri;
    this.NumeroMatiereSelectionne = aNumeroMatiere;
    if (this.TypeTri !== null && this.TypeTri !== undefined) {
      const LListe =
        this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ? this.ListeTravailAFaire
          : this.ListeCahierDeTextes;
      if (this.ModeAffichage !== EGenreAffichageCahierDeTextes.TravailAFaire) {
        LListe.parcourir((D) => {
          if (D.ListeTravailAFaire) {
            D.ListeTravailAFaire.setTri([
              ObjetTri.init("PourLe"),
              ObjetTri.init("Genre"),
              ObjetTri.init("Numero"),
            ]);
            D.ListeTravailAFaire.trier();
          }
        });
      }
      if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
        LListe.setTri([
          ObjetTri.init((D) => {
            return this.TypeTri === EGenreTriCDT.ParDatePourLe
              ? D.PourLe
              : D.Matiere.Numero === this.NumeroMatiereSelectionne;
          }),
          ObjetTri.init("Matiere.Libelle"),
          ObjetTri.init((D) => {
            return this.TypeTri === EGenreTriCDT.ParDatePourLe
              ? null
              : D.PourLe;
          }),
          ObjetTri.init("DonneLe"),
          ObjetTri.init("Genre"),
          ObjetTri.init("Numero"),
        ]);
      } else {
        LListe.setTri([
          ObjetTri.init((D) => {
            return this.TypeTri === EGenreTriCDT.ParMatiere
              ? D.Matiere.Numero === this.NumeroMatiereSelectionne
              : false;
          }),
          ObjetTri.init("Date"),
          ObjetTri.init("Numero"),
        ]);
      }
      LListe.trier();
    }
    this.afficher();
    this.recupererDonnees();
  }
  construireAffichage() {
    if (this.DonneesRecues && this.DonneesActualisees) {
      return this.composePage();
    } else {
      return "";
    }
  }
  recupererDonnees() {
    if (this.options.callbackContextMenuCDT) {
      $('[id^="' + (this.Nom + "_ind_").escapeJQ() + '"]').on(
        "contextmenu",
        { instance: this },
        function (event) {
          const lIndice = GHtml.extraireNombreDId(this.id),
            lInstance = event.data.instance,
            lElement = lInstance.ListeCahierDeTextes.get(lIndice);
          lInstance.options.callbackContextMenuCDT(event, lElement);
        },
      );
    }
  }
  composePage(aPourImpression) {
    const lHtml = [];
    this.DonneePrincipaleCourante = "";
    this.DonneeSecondaireCourante = "";
    this.DonneLeCourant = "";
    this.PourImpression = aPourImpression ? aPourImpression : false;
    this.PremierID = [];
    this.PremierPrincipaleElement = "";
    this.IDSecondairPrecedent = "";
    this.IDPrincipalPrecedent = "";
    this.NumeroPrincipal = 0;
    const lTabIndex = aPourImpression ? 'tabindex="-1"' : 'tabindex="0"';
    this.tableauPiecesJointes = [];
    lHtml.push(
      '<div id="',
      this.IdPremierElement,
      '"',
      lTabIndex,
      ' onkeyup="',
      this.Nom,
      '.surPremierPrincipaleElement ()" class="overflow-auto" >',
    );
    if (this.afficheTitre) {
      lHtml.push(
        GObjetWAI.composeSpan(
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? GTraductions.getValeur("CahierDeTexte.wai.SelectJour") + ", "
            : GTraductions.getValeur("CahierDeTexte.wai.SelectMatiere") + ", ",
        ),
        GObjetWAI.composeSpan(EGenreObjet.NavigationVertical),
        GObjetWAI.composeSpan(
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? GTraductions.getValeur("CahierDeTexte.wai.DetailsMatiereDuJour") +
                " "
            : GTraductions.getValeur(
                "CahierDeTexte.wai.DetailsJourDeLaMatiere",
              ) + " ",
        ),
      );
    }
    lHtml.push(
      GObjetWAI.composeSpan(
        this.TypeTri === EGenreTriCDT.ParDatePourLe
          ? GTraductions.getValeur("CahierDeTexte.wai.NavigationMatiere") + ", "
          : GTraductions.getValeur("CahierDeTexte.wai.NavigationJour") + ", ",
      ),
      GObjetWAI.composeSpan(EGenreObjet.NavigationVertical),
    );
    if (this.afficheTitre) {
      lHtml.push(
        GObjetWAI.composeSpan(
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? GTraductions.getValeur(
                "CahierDeTexte.wai.NavigationMatiereRetour",
              ) + " "
            : GTraductions.getValeur("CahierDeTexte.wai.NavigationJourRetour") +
                " ",
        ),
      );
    }
    lHtml.push(
      '<div class="p-all full-size flex-contain cols ',
      aPourImpression ? " AvecSelectionTexte" : "",
      '">',
    );
    const lListe =
      this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
        ? this.ListeTravailAFaire
        : this.ListeCahierDeTextes;
    const lNbrElements = lListe.count();
    for (let I = 0; I < lNbrElements; I++) {
      const lTravailAFaire = lListe.get(I);
      if (this.verifieConditionAffichageElement(lTravailAFaire)) {
        this.ValeurPrincipaleElementCourant =
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? lTravailAFaire.PourLe
              : new Date(
                  lTravailAFaire.Date.getFullYear(),
                  lTravailAFaire.Date.getMonth(),
                  lTravailAFaire.Date.getDate(),
                )
            : lTravailAFaire.Matiere.Libelle;
        this.TitrePrincipaleElementCourant =
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? " "
            : GTraductions.getValeur("Matiere") + " : ";
        this.ValeurSecondaireElementCourant =
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? lTravailAFaire.Matiere.Libelle
              : lTravailAFaire.Date
            : this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? lTravailAFaire.PourLe
              : lTravailAFaire.Date;
        this.TitreSecondaireElementCourant =
          this.TypeTri === EGenreTriCDT.ParDatePourLe
            ? GTraductions.getValeur("Matiere") + " : "
            : " ";
        if (
          this.verifieConditionNouvelleDonneePrincipale(
            this.DonneePrincipaleCourante,
            this.ValeurPrincipaleElementCourant,
          )
        ) {
          lHtml.push(
            this.composeNouvelleDonneePrincipale(
              lTravailAFaire,
              lListe,
              aPourImpression,
            ),
          );
        }
        if (
          this.verifieConditionNouvelleDonneeSecondaire(
            this.DonneeSecondaireCourante,
            this.ValeurSecondaireElementCourant,
          )
        ) {
          if (
            this.ModeAffichage ===
              EGenreAffichageCahierDeTextes.TravailAFaire &&
            this.DonneLeCourant !== ""
          ) {
            lHtml.push(this.composeFermetureGenre());
          }
          lHtml.push(
            this.composeNouvelleDonneeSecondaire(
              lTravailAFaire,
              I,
              aPourImpression,
            ),
          );
          lHtml.push(
            this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? this.composeDevoirsDonneLe(lTravailAFaire)
              : this.composeContenu(lTravailAFaire),
          );
        } else {
          lHtml.push(
            this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? this.composeDevoirSelonDonneLe(lTravailAFaire)
              : this.composeContenu(lTravailAFaire),
          );
        }
      }
    }
    lHtml.push(this.composeFermeture());
    lHtml.push("</div>");
    lHtml.push("</div>");
    return lHtml.join("");
  }
  verifieConditionNouvelleDonneePrincipale(
    aDonneePrincipaleCourante,
    aValeurPrincipaleElementCourant,
  ) {
    if (this.TypeTri === EGenreTriCDT.ParDatePourLe) {
      if (
        !GDate.estDateEgale(
          aDonneePrincipaleCourante,
          aValeurPrincipaleElementCourant,
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (aDonneePrincipaleCourante !== aValeurPrincipaleElementCourant) {
        return true;
      } else {
        return false;
      }
    }
  }
  verifieConditionNouvelleDonneeSecondaire(
    aDonneeSecondaireCourante,
    aValeurSecondaireElementCourant,
  ) {
    if (this.TypeTri === EGenreTriCDT.ParDatePourLe) {
      if (aDonneeSecondaireCourante !== aValeurSecondaireElementCourant) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !GDate.estDateEgale(
          aDonneeSecondaireCourante,
          aValeurSecondaireElementCourant,
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  verifieConditionAffichageElement(aObjetTravailAFaire) {
    if (this.TypeTri === EGenreTriCDT.ParDatePourLe) {
      return true;
    } else {
      if (
        aObjetTravailAFaire.Matiere.Numero === this.NumeroMatiereSelectionne
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  composeNouvelleDonneePrincipale(
    aObjetTravailAFaire,
    aListeDonnees,
    aPourImpression,
  ) {
    const lHtml = [];
    if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      if (this.DonneLeCourant !== "") {
        lHtml.push(this.composeFermetureGenre());
        lHtml.push(this.composeFermetureTitreSecondaire());
      }
    } else if (this.DonneePrincipaleCourante !== "") {
      lHtml.push(this.composeFermetureTitreSecondaire());
    }
    lHtml.push(
      this.composeTitrePrincipal(
        aObjetTravailAFaire,
        aListeDonnees,
        aPourImpression,
      ),
    );
    this.DonneeSecondaireCourante = "";
    this.DonneLeCourant = "";
    return lHtml.join("");
  }
  composeNouvelleDonneeSecondaire(
    aObjetTravailAFaire,
    aIndice,
    aPourImpression,
  ) {
    const lHtml = [];
    if (this.DonneeSecondaireCourante !== "") {
      lHtml.push(this.composeFermetureTitreSecondaire());
    }
    lHtml.push(
      this.composeTitreSecondaire(
        aObjetTravailAFaire,
        aIndice,
        aPourImpression,
      ),
    );
    return lHtml.join("");
  }
  composeTitrePrincipal(aObjetTravailAFaire, aListeDonnees, aPourImpression) {
    const lHtml = [];
    this.DonneePrincipaleCourante =
      this.TypeTri === EGenreTriCDT.ParDatePourLe
        ? this.ValeurPrincipaleElementCourant
        : aObjetTravailAFaire.Matiere.Libelle;
    const lLibelle =
      this.TypeTri === EGenreTriCDT.ParDatePourLe
        ? GDate.formatDate(
            this.DonneePrincipaleCourante,
            (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
              ? GTraductions.getValeur("CahierDeTexte.pourLe") + " "
              : "") + "%JJJJ %JJ %MMMM %AAAA",
          )
        : GChaine.insecable(this.DonneePrincipaleCourante);
    this.IdPrincipaleElement = this.Nom + "_Nav_" + this.NumeroPrincipal;
    if (this.PremierPrincipaleElement === "") {
      this.PremierPrincipaleElement = this.IdPrincipaleElement;
    }
    if (this.IDSecondairPrecedent !== "") {
      this.ajouterAuTableaux(
        this.IDSecondairPrecedent,
        this.IdPrincipaleElement,
        null,
        EGenreDirection.SensNormal,
      );
    }
    if (this.IDPrincipalPrecedent !== "") {
      this.ajouterAuTableaux(
        this.IDPrincipalPrecedent,
        this.IdPrincipaleElement,
        null,
        EGenreDirection.DeuxSenses,
      );
    }
    this.IDPrincipalPrecedent = this.IdPrincipaleElement;
    this.NumeroPrincipal++;
    this.NumeroSecondair = 0;
    this.IDSecondairPrecedent = "";
    if (this.afficheTitre) {
      lHtml.push(
        '<div id="',
        this.IdPrincipaleElement,
        '" tabindex="0" ',
        GObjetWAI.composeRole(EGenreRole.Document),
        ' class="Bandeau theme-neutre_bg_moyen1" onkeyup="',
        this.Nom,
        '.surPremierSecondaire (id); if (GNavigateur.isToucheFleche () || GNavigateur.isToucheSelection ()) GNavigateur.stopperEvenement (event);">',
        GObjetWAI.composeSpan(this.TitrePrincipaleElementCourant),
        this.composeLibelleTitrePrincipal(
          aListeDonnees,
          lLibelle,
          aPourImpression,
        ),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  composeLibelleTitrePrincipal(aListeDonnees, aLibelle) {
    return aLibelle;
  }
  composeTitreSecondaire(aObjetTravailAFaire, aIndice, aPourImpression) {
    const lHtml = [];
    this.DonneeSecondaireCourante =
      this.TypeTri === EGenreTriCDT.ParDatePourLe
        ? this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ? aObjetTravailAFaire.Matiere.Libelle
          : GDate.formatDate(aObjetTravailAFaire.Date, "%hh%sh%mm - ") +
            aObjetTravailAFaire.Matiere.Libelle
        : this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ? aObjetTravailAFaire.PourLe
          : GDate.formatDate(
              aObjetTravailAFaire.Date,
              "%JJJJ %JJ %MMMM - %hh%sh%mm ",
            );
    const lID = this.IdPrincipaleElement + "_" + this.NumeroSecondair;
    if (this.NumeroSecondair === 0) {
      this.PremierID[this.IdPrincipaleElement] = lID;
      this.ajouterAuTableaux(
        this.IdPrincipaleElement,
        lID,
        EGenreDirection.SensNormal,
      );
      this.ajouterAuTableaux(
        this.IdPrincipaleElement,
        lID,
        null,
        EGenreDirection.SensInverse,
      );
    }
    if (this.IDSecondairPrecedent !== "") {
      this.ajouterAuTableaux(
        this.IDSecondairPrecedent,
        lID,
        null,
        EGenreDirection.DeuxSenses,
      );
    }
    this.ajouterAuTableaux(
      this.IdPrincipaleElement,
      lID,
      EGenreDirection.SensInverse,
    );
    this.IDSecondairPrecedent = lID;
    this.NumeroSecondair++;
    let lLibelle = GChaine.insecable(
      this.TypeTri === EGenreTriCDT.ParDatePourLe
        ? this.DonneeSecondaireCourante
        : this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ? GDate.formatDate(
              this.DonneeSecondaireCourante,
              GTraductions.getValeur("CahierDeTexte.pourLe") +
                " %JJJJ %JJ %MMMM %AAAA",
            )
          : this.DonneeSecondaireCourante,
    );
    let lClasseSelectionnee = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Classe,
    );
    if (!lClasseSelectionnee && GEtatUtilisateur.getMembre()) {
      lClasseSelectionnee = GEtatUtilisateur.getMembre().Classe;
    }
    if (
      aObjetTravailAFaire.listeGroupes &&
      aObjetTravailAFaire.listeGroupes.count() > 0 &&
      !!aObjetTravailAFaire.listeGroupes.get(0) &&
      lClasseSelectionnee.getNumero() !==
        aObjetTravailAFaire.listeGroupes.get(0).getNumero()
    ) {
      lLibelle +=
        " (" +
        aObjetTravailAFaire.listeGroupes.getTableauLibelles().join(", ") +
        ")";
    }
    lHtml.push(
      '<div id="',
      lID,
      '" tabindex="0" ',
      GObjetWAI.composeRole(EGenreRole.Document),
      ' class="fluid-bloc p-x p-top flex-contain cols" onkeyup="',
      this.Nom,
      '.navigationClavier (id); if (GNavigateur.isToucheFleche () || GNavigateur.isToucheSelection ()) GNavigateur.stopperEvenement (event);">',
      GObjetWAI.composeSpan(this.TitreSecondaireElementCourant),
      '<div class="full-width flex-contain flex-center justify-between semi-bold p-all" id="' +
        (this.Nom + "_ind_" + aIndice) +
        '" style="border-bottom:1px solid black;">',
      "<span>",
      lLibelle,
      "</span>",
      '<div class="flex-contain flex-center justify-end flex-gap">',
      this.composeVisas(aObjetTravailAFaire, aIndice, aPourImpression),
      "</div>",
      "</div>",
    );
    lHtml.push(GObjetWAI.composeSpan(". "));
    return lHtml.join("");
  }
  composeVisas(aObjetTravailAFaire) {
    const lHtml = [];
    if (
      [
        EGenreEspace.Professeur,
        EGenreEspace.Mobile_Professeur,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Mobile_PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.Mobile_PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      if (aObjetTravailAFaire.dateVisaI) {
        lHtml.push(
          '<div class="Image_VisaInspecteur" ie-hint="',
          aObjetTravailAFaire.individuVisaI
            ? GChaine.format(GTraductions.getValeur("CahierDeTexte.HintVisa"), [
                GDate.formatDate(
                  aObjetTravailAFaire.dateVisaI,
                  "%JJ/%MM/%AAAA",
                ),
                aObjetTravailAFaire.individuVisaI,
              ])
            : GChaine.format(
                GTraductions.getValeur("CahierDeTexte.HintVisaSansI"),
                [
                  GDate.formatDate(
                    aObjetTravailAFaire.dateVisaI,
                    "%JJ/%MM/%AAAA",
                  ),
                ],
              ),
          '"></div>',
        );
      }
      if (aObjetTravailAFaire.dateVisa) {
        lHtml.push(
          '<div class="Image_VisaEtablissement" ie-hint="',
          aObjetTravailAFaire.individuVisa
            ? GChaine.format(GTraductions.getValeur("CahierDeTexte.HintVisa"), [
                GDate.formatDate(aObjetTravailAFaire.dateVisa, "%JJ/%MM/%AAAA"),
                aObjetTravailAFaire.individuVisa,
              ])
            : GChaine.format(
                GTraductions.getValeur("CahierDeTexte.HintVisaSansI"),
                [
                  GDate.formatDate(
                    aObjetTravailAFaire.dateVisa,
                    "%JJ/%MM/%AAAA",
                  ),
                ],
              ),
          '"></div>',
        );
      }
    }
    return lHtml.join("");
  }
  composeDevoir(aObjetTravailAFaire) {
    const lHtml = [];
    lHtml.push(
      '<div class="flex-contain flex-start justify-between">',
      '<div class="fluid-bloc">',
      aObjetTravailAFaire.descriptif,
      "</div>",
    );
    if (aObjetTravailAFaire.ListePieceJointe.count() > 0) {
      lHtml.push(
        '<div class="p-left-l">',
        this.composePiecesJointes(aObjetTravailAFaire),
        "</div>",
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeDevoirSelonDonneLe(aObjetTravailAFaire) {
    const lDate = aObjetTravailAFaire.DonneLe
      ? aObjetTravailAFaire.DonneLe
      : aObjetTravailAFaire.PourLe;
    if (!GDate.estDateEgale(this.DonneLeCourant, lDate)) {
      const lHtml = [];
      if (this.DonneLeCourant !== "") {
        lHtml.push(this.composeFermetureGenre());
      }
      this.DonneLeCourant = lDate;
      lHtml.push(this.composeDevoirsDonneLe(aObjetTravailAFaire));
      return lHtml.join("");
    } else {
      return this.composeDevoir(aObjetTravailAFaire);
    }
  }
  composeDevoirsDonneLe(aObjetTravailAFaire) {
    this.DonneLeCourant = aObjetTravailAFaire.DonneLe
      ? aObjetTravailAFaire.DonneLe
      : aObjetTravailAFaire.PourLe;
    const lNbJours = aObjetTravailAFaire.DonneLe
      ? GDate.getDifferenceJours(
          aObjetTravailAFaire.PourLe,
          aObjetTravailAFaire.DonneLe,
        )
      : 0;
    const lStrJours = (
      lNbJours > 1
        ? GTraductions.getValeur("TAFEtContenu.jours")
        : GTraductions.getValeur("TAFEtContenu.jour")
    ).toLowerCase();
    const lLibelleDonneLe = aObjetTravailAFaire.DonneLe
      ? GDate.formatDate(
          aObjetTravailAFaire.DonneLe,
          GTraductions.getValeur("TAFEtContenu.donneLe") + " %JJ/%MM",
        ) +
        " [" +
        lNbJours +
        " " +
        lStrJours +
        "] : "
      : GDate.formatDate(
          aObjetTravailAFaire.PourLe,
          GTraductions.getValeur("CahierDeTexte.pourLe") + " %JJ/%MM",
        ) + " : ";
    const lHtml = [];
    lHtml.push(
      '<div class="flex-contain flex-start">',
      '<div style="width:10rem;" class="fix-bloc semi-bold">',
      GChaine.insecable(lLibelleDonneLe),
      "</div>",
      this.composeDevoir(aObjetTravailAFaire),
    );
    return lHtml.join("");
  }
  composeContenu(aCDT) {
    const lHtml = [];
    for (let i = 0; i < aCDT.listeContenus.count(); i++) {
      const lContenu = aCDT.listeContenus.get(i);
      lHtml.push(
        '<div class="p-all semi-bold">',
        lContenu.categorie.Libelle,
        lContenu.categorie.Libelle && lContenu.Libelle ? " - " : "",
        lContenu.Libelle,
        "</div>",
        '<div class="p-all tiny-view">',
        lContenu.descriptif,
        "</div>",
      );
      if (lContenu.ListePieceJointe.count() > 0) {
        lHtml.push(
          '<div class="p-all">',
          this.composePiecesJointes(lContenu),
          "</div>",
        );
      }
      if (lContenu.listeExecutionQCM.count() > 0) {
        lHtml.push(
          '<div class="p-all">',
          this.composeExecutionQCMContenu(aCDT, lContenu),
          "</div>",
        );
      }
    }
    let lElementProgrammeCDT;
    if (
      !aCDT.listeElementsProgrammeCDT &&
      aCDT.listeElementsProgrammeCDT.count()
    ) {
      lHtml.push(
        '<div class="p-all semi-bold">',
        GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
        " :",
        "</div>",
      );
      for (let i = 0; i < aCDT.listeElementsProgrammeCDT.count(); i++) {
        lElementProgrammeCDT = aCDT.listeElementsProgrammeCDT.get(i);
        lHtml.push(
          '<div class="p-all">',
          "-&nbsp;" + lElementProgrammeCDT.getLibelle(),
          "</div>",
        );
      }
    }
    if (aCDT.ListeTravailAFaire.count() > 0) {
      aCDT.ListeTravailAFaire.setTri([
        ObjetTri.init("Genre"),
        ObjetTri.init("PourLe"),
      ]);
      aCDT.ListeTravailAFaire.trier();
      lHtml.push('<div class="p-all">');
      for (let j = 0; j < aCDT.ListeTravailAFaire.count(); j++) {
        const lEltTAF = aCDT.ListeTravailAFaire.get(j);
        const lEstQCM =
          lEltTAF.executionQCM && lEltTAF.executionQCM.existeNumero();
        if (lEstQCM) {
          lHtml.push(
            this.utilitaireCDT.getTitreExecutionQCM(
              aCDT.getNumero() + "_" + j,
              lEltTAF.executionQCM,
              this.Nom,
            ),
          );
        } else {
          lHtml.push(this.composeDevoirPourLe(lEltTAF));
        }
      }
      this.DonneLeCourant = "";
      lHtml.push("</div>");
    }
    return lHtml.join("");
  }
  surExecutionQCM(aEvent, I) {
    const lPos = I.match(
      new RegExp(`^${ObjetElement.regexCaptureNumero}_([0-9]+)$`),
    );
    const lExecutionQCM = this.ListeCahierDeTextes.getElementParNumero(
      lPos[1],
    ).ListeTravailAFaire.get(lPos[2]).executionQCM;
    this.callback.appel({ executionQCM: lExecutionQCM });
  }
  composeDevoirPourLe(aObjetTravailAFaire) {
    const lHtml = [];
    const lLibelle = GChaine.insecable(
      GTraductions.getValeur("CahierDeTexte.PourLe") +
        " " +
        GDate.formatDate(aObjetTravailAFaire.PourLe, "%JJ/%MM") +
        " : ",
    );
    lHtml.push(
      '<div class="p-y semi-bold">',
      lLibelle,
      "</div>",
      '<div class="p-bottom tiny-view">',
      aObjetTravailAFaire.descriptif,
      "</div>",
    );
    if (aObjetTravailAFaire.ListePieceJointe.count() > 0) {
      lHtml.push(this.composePiecesJointes(aObjetTravailAFaire));
    }
    return lHtml.join("");
  }
  composePiecesJointes(aElement) {
    const lHtml = [];
    const nbPiecesJointes = aElement.ListePieceJointe.count();
    for (let I = 0; I < nbPiecesJointes; I++) {
      const lPieceJointe = aElement.ListePieceJointe.get(I);
      this.tableauPiecesJointes[lPieceJointe.getNumero()] = lPieceJointe;
      lHtml.push(
        '<div class="p-y">',
        this.PourImpression
          ? lPieceJointe.getLibelle()
          : GChaine.composerUrlLienExterne({ documentJoint: lPieceJointe }),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  composeExecutionQCMContenu(aObjetTravailAFaire, aObjetContenu) {
    const lHtml = [];
    const nbExecutionQCM = aObjetContenu.listeExecutionQCM.count();
    for (let I = 0; I < nbExecutionQCM; I++) {
      const lExecutionQCM = aObjetContenu.listeExecutionQCM.get(I);
      lHtml.push(
        this.utilitaireCDT.getTitreExecutionQCMContenu(
          aObjetTravailAFaire.getNumero() +
            "_" +
            aObjetContenu.getNumero() +
            "_" +
            I,
          lExecutionQCM,
          this.Nom,
        ),
      );
    }
    return lHtml.join("");
  }
  surExecutionQCMContenu(aEvent, I) {
    const lPos = I.match(
      new RegExp(
        `^${ObjetElement.regexCaptureNumero}_${ObjetElement.regexCaptureNumero}_([0-9]+)$`,
      ),
    );
    const lExecutionQCM = this.ListeCahierDeTextes.getElementParNumero(lPos[1])
      .listeContenus.getElementParNumero(lPos[2])
      .listeExecutionQCM.get(lPos[3]);
    this.callback.appel({ executionQCM: lExecutionQCM });
  }
  composeFermetureTitreSecondaire() {
    const lHtml = [];
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeFermetureGenre() {
    const lHtml = [];
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeFermeture() {
    const lHtml = [];
    if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      lHtml.push(this.composeFermetureGenre());
    }
    lHtml.push(this.composeFermetureTitreSecondaire());
    return lHtml.join("");
  }
  surPremierPrincipaleElement() {
    if (GNavigateur.isToucheFleche() || GNavigateur.isToucheSelection()) {
      GHtml.setFocus(this.PremierPrincipaleElement);
    }
  }
  surPremierSecondaire(aID) {
    if (GNavigateur.isToucheSelection()) {
      GHtml.setFocus(this.PremierID[aID]);
    }
    if (GNavigateur.isToucheFleche()) {
      this.navigationClavier(aID);
    }
  }
}
module.exports = { PageCahierDeTexte };
