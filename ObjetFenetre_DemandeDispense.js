exports.ObjetFenetre_DemandeDispense = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const jsx_1 = require("jsx");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
class ObjetFenetre_DemandeDispense extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.applicationPN = GApplication;
    this.setOptionsFenetre({
      largeur: 500,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
    if (!IE.estMobile) {
      this.setOptionsFenetre({ hauteurMaxContenu: GNavigateur.clientH - 300 });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      chipsValidation: {
        getValue(aEstAccepter, aNumero) {
          const lElem =
            aInstance.listeDemandesDispense.getElementParNumero(aNumero);
          if (aInstance.filtreElementASaisir(lElem)) {
            return lElem.estValider === aEstAccepter;
          }
          return false;
        },
        setValue(aEstAccepter, aNumero) {
          const lElem =
            aInstance.listeDemandesDispense.getElementParNumero(aNumero);
          if (lElem) {
            lElem.estValider = aEstAccepter;
            lElem.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          }
        },
      },
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          var _a, _b, _c, _d;
          if (aBoutonRepeat.element.index === 1) {
            return (
              ((_d =
                (_c =
                  (_b =
                    (_a =
                      aInstance === null || aInstance === void 0
                        ? void 0
                        : aInstance.listeDemandesDispense) === null ||
                    _a === void 0
                      ? void 0
                      : _a.getListeElements) === null || _b === void 0
                    ? void 0
                    : _b.call(
                        _a,
                        (aElement) =>
                          aElement.getEtat() ===
                          Enumere_Etat_1.EGenreEtat.Modification,
                      )) === null || _c === void 0
                  ? void 0
                  : _c.count) === null || _d === void 0
                ? void 0
                : _d.call(_c)) === 0
            );
          }
          return false;
        },
      },
    });
  }
  setDonnees(aParams) {
    this.listeDemandesOriginal = aParams.listeDemandesDispense;
    this.listeDemandesDispense = MethodesObjet_1.MethodesObjet.dupliquer(
      aParams.listeDemandesDispense,
    );
    this.placeSaisieDebut = aParams.placeSaisieDebut;
    this.placeSaisieFin = aParams.placeSaisieFin;
    this.listeDemandesDispense.parcourir((aDemande) => {
      if (aDemande.estTraitee) {
        aDemande.estValider = !aDemande.estRefusee;
      }
    });
    this.afficher(this.getHtmlFenetre());
  }
  filtreElementASaisir(aElement) {
    return (
      aElement &&
      (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Modification ||
        aElement.estTraitee) &&
      "estValider" in aElement
    );
  }
  getHtmlFenetre() {
    return IE.jsx.str(
      "section",
      { class: ["full-height", "overflow-auto"] },
      this.listeDemandesDispense.getTableau((...aParams) =>
        this.getHtmlDemande(...aParams, this.listeDemandesDispense),
      ),
    );
  }
  getHtmlDemande(aDemande, aIndex, aListeDemandes) {
    const lEleve = aDemande.eleve;
    const lAvecPhoto =
      !!lEleve &&
      this.applicationPN.droits.get(
        ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
      );
    const lAvecSep = aListeDemandes.count() - 1 > aIndex;
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "article",
        { class: ["p-y-l"] },
        IE.jsx.str(
          "header",
          null,
          IE.jsx.str(
            "div",
            { class: ["flex-contain", "flex-gap"] },
            IE.jsx.str(
              "div",
              null,
              IE.jsx.str(
                "figure",
                null,
                IE.jsx.str("img", {
                  "ie-load-src":
                    lAvecPhoto &&
                    ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lEleve, {
                      libelle: "photo.jpg",
                    }),
                  "aria-hidden": "true",
                  class: "img-portrait",
                }),
              ),
            ),
            IE.jsx.str(
              "div",
              { class: ["flex-contain", "cols"] },
              IE.jsx.str("p", { class: "ie-titre" }, lEleve.getLibelle()),
              IE.jsx.str(
                "p",
                null,
                "(",
                aDemande.strDemandeur,
                aDemande.lien &&
                  IE.jsx.str(IE.jsx.fragment, null, ", ", aDemande.lien),
                ")",
              ),
            ),
          ),
        ),
        IE.jsx.str(
          "div",
          { class: ["m-top-l"] },
          IE.jsx.str("p", null, aDemande.commentaire),
          IE.jsx.str(
            "div",
            { class: ["m-top-l"] },
            UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(aDemande.listePJ),
          ),
        ),
        IE.jsx.str(
          "footer",
          { class: ["m-top-xl"] },
          IE.jsx.str(
            "div",
            { class: ["flex-contain", "flex-gap-l"] },
            IE.jsx.str(
              "ie-radio",
              {
                class: "as-chips",
                name: aDemande.getNumero(),
                "ie-model": (0, jsx_1.jsxFuncAttr)("chipsValidation", [
                  true,
                  aDemande.getNumero(),
                ]),
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Accepter"),
            ),
            IE.jsx.str(
              "ie-radio",
              {
                class: ["as-chips", "indisponibilites"],
                name: aDemande.getNumero(),
                "ie-model": (0, jsx_1.jsxFuncAttr)("chipsValidation", [
                  false,
                  aDemande.getNumero(),
                ]),
              },
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Refuser"),
            ),
          ),
        ),
      ),
      lAvecSep &&
        IE.jsx.str("hr", { class: "separateur", role: "presentation" }),
    );
  }
  async surValidation(aGenreBouton) {
    if (aGenreBouton === 1) {
      const lListeASaisir = this.listeDemandesDispense.getListeElements(
        (aElement) =>
          aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Modification,
      );
      const getStrListeNomEleve = (aListe) =>
        aListe
          .getTableau(
            (aElement) => aElement.eleve && aElement.eleve.getLibelle(),
          )
          .join(", ");
      const lListeDemandeAvecDemandesAcceptee = lListeASaisir.getListeElements(
        (aDemande) =>
          aDemande.getEtat() === Enumere_Etat_1.EGenreEtat.Modification &&
          aDemande.estValider,
      );
      const lListeNomElevesAvecDemandesAcceptee = getStrListeNomEleve(
        lListeDemandeAvecDemandesAcceptee,
      );
      const lListeDemandeAvecDemandesRefusee = lListeASaisir.getListeElements(
        (aDemande) =>
          aDemande.getEtat() === Enumere_Etat_1.EGenreEtat.Modification &&
          "estValider" in aDemande &&
          !aDemande.estValider,
      );
      const lListeNomElevesAvecDemandesRefusee = getStrListeNomEleve(
        lListeDemandeAvecDemandesRefusee,
      );
      const lListeDemandeNonTraitee =
        this.listeDemandesDispense.getListeElements(
          (aDemande) =>
            aDemande.getEtat() !== Enumere_Etat_1.EGenreEtat.Modification &&
            !aDemande.estTraitee,
        );
      const lListeNomElevesDeDemandeNonTraitee = getStrListeNomEleve(
        lListeDemandeNonTraitee,
      );
      const lPlaceSaisieDebut =
        this.placeSaisieDebut % GParametres.PlacesParJour;
      const lPlaceSaisieFin =
        1 + (this.placeSaisieFin % GParametres.PlacesParJour);
      const lGParametres = GParametres;
      const lLibellePlaceSaisieDebut =
        lGParametres.LibellesHeures.getLibelle(lPlaceSaisieDebut);
      const lLibellePlaceSaisieFin =
        lGParametres.LibellesHeures.getLibelle(lPlaceSaisieFin);
      const H = [];
      H.push(
        `<section class="flex-contain cols flex-gap-l">`,
        `<article>`,
        lListeDemandeNonTraitee.count() === 1
          ? `<p>${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeDispense.warningDispenseATraiter", [lListeNomElevesDeDemandeNonTraitee])}</p>`
          : "",
        lListeDemandeNonTraitee.count() > 1
          ? `<p>${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeDispense.warningDispensesATraiter", [lListeNomElevesDeDemandeNonTraitee])}</p>`
          : "",
        `</article>`,
        `<article>`,
        lListeDemandeAvecDemandesAcceptee.count() > 0
          ? `<p>${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeDispense.confirmerCreationDispense", [lListeNomElevesAvecDemandesAcceptee, lLibellePlaceSaisieDebut, lLibellePlaceSaisieFin])}</p>`
          : "",
        lListeDemandeAvecDemandesRefusee.count() > 0
          ? `<p>${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeDispense.confirmerRejetDispense", [lListeNomElevesAvecDemandesRefusee, lLibellePlaceSaisieDebut, lLibellePlaceSaisieFin])}</p>`
          : "",
        `</article>`,
        `</section>`,
      );
      const lRes = await GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
        message: H.join(""),
      });
      if (lRes === Enumere_Action_1.EGenreAction.Valider) {
        this.callback.appel(aGenreBouton, {
          listeDemandeOriginal: this.listeDemandesOriginal,
          listeDemandeASaisir: lListeASaisir,
          listeDemandesDispense: this.listeDemandesDispense,
        });
        this.fermer();
      }
    } else {
      super.surValidation(aGenreBouton);
    }
  }
}
exports.ObjetFenetre_DemandeDispense = ObjetFenetre_DemandeDispense;
