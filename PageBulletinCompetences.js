const { MethodesObjet } = require("MethodesObjet.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  UtilitaireBulletinEtReleve_Mobile,
} = require("UtilitaireBulletinEtReleve_Mobile.js");
const {
  EGenreNiveauDAcquisition,
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  UtilitaireDeserialiserPiedBulletin,
} = require("UtilitaireDeserialiserPiedBulletin.js");
const {
  ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
  TypeGenreColonneBulletinCompetence,
} = require("TypeGenreColonneBulletinCompetence.js");
const {
  TypeGenreElementBulletinCompetence,
} = require("TypeGenreElementBulletinCompetence.js");
const {
  TypeJaugeEvaluationBulletinCompetence,
} = require("TypeJaugeEvaluationBulletinCompetence.js");
const { TypePositionnement } = require("TypePositionnement.js");
const { PiedDeBulletinMobile } = require("PiedDeBulletinMobile.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { tag } = require("tag.js");
class ObjetBulletinCompetences extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
    this.estBilanParMatiere = false;
    this.corpsDePage = this.Nom + "_corpsDePage";
    this.listeEvaluations = this.Nom + "_listeEvaluations";
    this.piedDePage = this.Nom + "_piedDeBulletin";
    this.eltProg = this.Nom + "_elementsDuProgramme";
    this.instancePiedDeBulletin = Identite.creerInstance(PiedDeBulletinMobile, {
      pere: this,
      evenement: null,
    });
    this.instancePiedDeBulletin.setDonneesContexte({
      typeContexteBulletin: TypeContexteBulletin.CB_Eleve,
      avecSaisie: false,
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
    });
  }
  setDonnees(aDonneesCorpsDePage, aEstBilanParMatiere) {
    if (!!aDonneesCorpsDePage.maquette) {
      this.donnees = aDonneesCorpsDePage;
      this.listeServices = new ObjetListeElements();
      this.estBilanParMatiere = aEstBilanParMatiere;
      this.donneesRecues = true;
      this.message = false;
    } else {
      this.donnees = false;
      this.estBilanParMatiere = false;
      this.donneesRecues = false;
      this.message = false;
    }
    this.afficher();
    const lDonneesPiedDeBulletin =
      new UtilitaireDeserialiserPiedBulletin().creerPiedDePage(this.donnees);
    const lDonneesAbsences =
      new UtilitaireDeserialiserPiedBulletin().creerAbsences(this.donnees);
    this.instancePiedDeBulletin.setDonneesPiedDeBulletin(
      lDonneesPiedDeBulletin,
      lDonneesAbsences,
    );
    this.instancePiedDeBulletin.afficher();
  }
  afficher(aHtml, aDirectionSlide) {
    super.afficher(aHtml, aDirectionSlide);
  }
  setMessage(aMessage) {
    this.message = aMessage;
    this.afficher();
  }
  construireAffichage() {
    const lHtml = [];
    if (!!this.message) {
      lHtml.push(this.composeAucuneDonnee(this.message));
    } else if (this.donneesRecues) {
      this.formaterListes();
      if (!!this.estBilanParMatiere) {
        lHtml.push(this.composeCorpsDePage(this.estBilanParMatiere));
      } else {
        lHtml.push(this.composeCombo());
        lHtml.push(
          '<div id="',
          this.corpsDePage,
          '">' +
            this.composeCorpsDePage(this.estBilanParMatiere, "2") +
            "</div>",
        );
      }
      lHtml.push('<div id="', this.instancePiedDeBulletin.getNom(), '"></div>');
    }
    return lHtml.join("");
  }
  formaterListes() {
    let lRegroupement = null;
    if (!!this.donnees && this.donnees.listeLignes.count()) {
      this.donnees.listeLignes.parcourir((D) => {
        if (
          D.getGenre() === TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
        ) {
          D.estUnDeploiement = true;
          D.estDeploye = true;
          lRegroupement = D;
        } else {
          if (
            D.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_EltPilier ||
            (D.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
              D.estDansRegroupement)
          ) {
            D.pere = lRegroupement;
          } else {
            lRegroupement = null;
          }
        }
      });
    }
  }
  composeCorpsDePage(aEstBilanParMatiere, aNumero) {
    const lHtml = [];
    let lGenrePositionnement,
      lElem = null,
      lExisteRegroupement = false;
    const lIdListeEvaluations =
      this.listeEvaluations +
      (!!aEstBilanParMatiere
        ? "_BilanParMatiere"
        : "_BilanTransversal_" + aNumero);
    if (
      !!this.donnees &&
      !!this.donnees.listeLignes &&
      this.donnees.listeLignes.count()
    ) {
      if (!!aEstBilanParMatiere || (!aEstBilanParMatiere && aNumero === "1")) {
        lHtml.push(
          '<ul id="',
          lIdListeEvaluations,
          '" class="collection with-header bg-white bulletin">',
        );
        for (
          let i = 0, lNbrElem = this.donnees.listeLignes.count();
          i < lNbrElem;
          i++
        ) {
          lElem = this.donnees.listeLignes.get(i);
          if (
            lElem.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
          ) {
            lHtml.push(
              '<li class="collection-header collection-group with-action">',
            );
            lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
            lHtml.push("</li>");
            lExisteRegroupement = true;
          } else if (
            lElem.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_Service
          ) {
            const lEstDansRegroupement = !!lElem.estDansRegroupement;
            lHtml.push(
              '<li class="collection-item with-action  ',
              lEstDansRegroupement
                ? ""
                : !!lExisteRegroupement
                  ? " break-group"
                  : "",
              '" onclick="',
              this.Nom,
              ".ouvrirPanel('",
              lElem.getNumero(),
              "',",
              aEstBilanParMatiere,
              ')" style="',
              lEstDansRegroupement
                ? "padding:3px 0px 3px 12px;"
                : "padding: 3px 0px 3px 16px;",
              '">',
            );
            lHtml.push(
              '<div class="matiere-conteneur bullCompetences" style="border-color:' +
                (!!lElem.couleur && lElem.couleur !== ""
                  ? lElem.couleur
                  : "D4D4D4") +
                ';" >',
            );
            lHtml.push(
              '<div class="libelle">' + lElem.strServiceEtProf + "</div>",
            );
            lHtml.push('<div class="infos-moy-eleve">');
            if (lElem.posLSUNote) {
              lHtml.push('<div class="moyenne-eleve">');
              lHtml.push(lElem.posLSUNote.getNote());
              lHtml.push("</div>");
            }
            if (!!this.donnees.maquette.avecNiveauxPositionnements) {
              if (lElem.posLSUNiveau) {
                lGenrePositionnement =
                  this.donnees.typePositionnement ||
                  TypePositionnement.POS_Echelle;
                lHtml.push('<div class="nivMaitrise-eleve">');
                lHtml.push(
                  EGenreNiveauDAcquisitionUtil.getImagePositionnement({
                    niveauDAcquisition: lElem.posLSUNiveau,
                    genrePositionnement: lGenrePositionnement,
                  }),
                );
                lHtml.push("</div>");
              }
            }
            lHtml.push("</div>");
            lHtml.push("</div>");
            lHtml.push("</li>");
            this.listeServices.addElement(lElem);
          }
        }
        lHtml.push("</ul>");
      } else if (!aEstBilanParMatiere && aNumero === "2") {
        lHtml.push(
          '<ul id="',
          lIdListeEvaluations,
          '" class="collection with-header bg-white bulletin">',
        );
        for (
          let i = 0, lNbrElem = this.donnees.listeLignes.count();
          i < lNbrElem;
          i++
        ) {
          lElem = this.donnees.listeLignes.get(i);
          if (
            lElem.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
          ) {
            lHtml.push(
              '<li class="collection-header collection-group with-action">',
            );
            lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
            lHtml.push("</li>");
            lExisteRegroupement = true;
          } else if (
            lElem.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
            !!lElem.estDansRegroupement
          ) {
            lHtml.push(
              '<li class="collection-item with-action" onclick="',
              this.Nom,
              ".ouvrirPanel('",
              lElem.getNumero(),
              "',",
              aEstBilanParMatiere,
              ')" style="padding:3px 12px;">',
            );
            lHtml.push(this.composeListeNiveauDAqcuisitions(lElem));
            lHtml.push("</li>");
            this.listeServices.addElement(lElem);
          } else if (
            lElem.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
            !lElem.estDansRegroupement
          ) {
            lHtml.push(
              '<li class="collection-item with-action ',
              !!lExisteRegroupement ? " break-group" : "",
              '" onclick="',
              this.Nom,
              ".ouvrirPanel('",
              lElem.getNumero(),
              "',",
              aEstBilanParMatiere,
              ')" style="padding:3px 16px;">',
            );
            lHtml.push(this.composeListeNiveauDAqcuisitions(lElem));
            lHtml.push("</li>");
            this.listeServices.addElement(lElem);
          }
        }
        lHtml.push("</ul>");
      } else {
        lHtml.push(
          '<ul id="',
          lIdListeEvaluations,
          '" class="collection with-header bg-white bulletin">',
        );
        for (
          let i = 0, lNbrElem = this.donnees.listeLignes.count();
          i < lNbrElem;
          i++
        ) {
          lElem = this.donnees.listeLignes.get(i);
          if (
            lElem.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
          ) {
            lHtml.push(
              '<li class="collection-header collection-group with-action">',
            );
            lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
            lHtml.push("</li>");
            lExisteRegroupement = true;
          } else if (
            lElem.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
            !!lElem.estDansRegroupement
          ) {
            lHtml.push(
              '<li class="collection-item with-action" onclick="',
              this.Nom,
              ".ouvrirPanel('",
              lElem.getNumero(),
              "',",
              aEstBilanParMatiere,
              ')" style="padding:3px 12px;">',
            );
            lHtml.push(
              '<div style="border-left: 5px solid ' +
                (!!lElem.couleur && lElem.couleur !== ""
                  ? lElem.couleur
                  : "D4D4D4") +
                '; padding: 10px 5px;">',
            );
            lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
            lHtml.push(this.getImagePastille(lElem, aNumero));
            lHtml.push("</div>");
            lHtml.push("</li>");
            this.listeServices.addElement(lElem);
          } else if (
            lElem.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
            !lElem.estDansRegroupement
          ) {
            lHtml.push(
              '<li class="collection-item with-action ',
              !!lExisteRegroupement ? " break-group" : "",
              '" onclick="',
              this.Nom,
              ".ouvrirPanel('",
              lElem.getNumero(),
              "',",
              aEstBilanParMatiere,
              ')" style="padding:3px 16px;">',
            );
            lHtml.push(
              '<div class="flex-contain" style="border-left: 5px solid ' +
                (!!lElem.couleur && lElem.couleur !== ""
                  ? lElem.couleur
                  : "D4D4D4") +
                '; padding: 10px 5px;">',
            );
            lHtml.push(
              '<div class="fluid-bloc">' + lElem.strServiceEtProf + "</div>",
            );
            lHtml.push(this.getImagePastille(lElem, aNumero));
            lHtml.push("</div>");
            lHtml.push("</li>");
            this.listeServices.addElement(lElem);
          }
        }
        lHtml.push("</ul>");
      }
    }
    return lHtml.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      combo: {
        init(aCombo) {
          aCombo.setDonneesObjetSaisie({});
          const lListe = new ObjetListeElements();
          lListe.add(
            new ObjetElement(
              GTraductions.getValeur("competences.ToutesLesCompetences"),
              "2",
            ),
          );
          if (aInstance.donnees.maquette.avecNiveauxPositionnements) {
            lListe.add(
              new ObjetElement(
                GTraductions.getValeur("competences.PositionnementGeneral"),
                "1",
              ),
            );
          }
          if (
            !!aInstance.donnees.listeLignes &&
            aInstance.donnees.listeLignes.count()
          ) {
            let lElement = false,
              lNbrEleme = aInstance.donnees.listeLignes.count(),
              i = 0;
            while (!lElement & (i < lNbrEleme)) {
              if (
                aInstance.donnees.listeLignes.getGenre(i) ===
                TypeGenreColonneBulletinCompetence.tCBdC_EltPilier
              ) {
                lElement = aInstance.donnees.listeLignes.get(i);
              }
              i++;
            }
            if (
              !!lElement &&
              !!lElement.listeColonnesTransv &&
              lElement.listeColonnesTransv.count()
            ) {
              lElement.listeColonnesTransv.parcourir((aElementCompetence) => {
                lListe.add(aElementCompetence);
              });
            }
          }
          aCombo.setDonnees(lListe, 0);
        },
        event(aParametresCombo) {
          if (
            aParametresCombo &&
            aParametresCombo.estSelectionManuelle &&
            aParametresCombo.element
          ) {
            $("#" + aInstance.corpsDePage.escapeJQ()).html(
              aInstance.composeCorpsDePage(
                aInstance.estBilanParMatiere,
                aParametresCombo.element.getNumero(),
              ),
            );
          }
        },
      },
    });
  }
  composeCombo() {
    const lHtml = [];
    lHtml.push("<div>");
    lHtml.push('<div class="right">');
    lHtml.push(
      tag("ie-combo", {
        "ie-model": "combo",
        class: "combo-mobile m-all large",
      }),
    );
    lHtml.push("</div>");
    lHtml.push('<div class="clear"></div>');
    lHtml.push("</div>");
    return lHtml.join("");
  }
  ouvrirPanel(aNumeroService, aEstBilanParMatiere) {
    const lResult = this.composePanel(aNumeroService, aEstBilanParMatiere);
    GInterface.openPanel(lResult.html, {
      optionsFenetre: {
        titre: GTraductions.getValeur("BulletinEtReleve.DetailsMatiere"),
        avecNavigation: !!lResult.service,
        titreNavigation: () => {
          return this.composeBandeauService(lResult.service);
        },
        callbackNavigation: (aSuivant) => {
          this.surClickProchainElement(
            lResult.service.getNumero(),
            aSuivant,
            aEstBilanParMatiere,
          );
        },
      },
    });
    $("#" + this.eltProg.escapeJQ())
      .children("ul")
      .addClass("browser-default");
  }
  composePanel(aNumeroElement, aEstBilanParMatiere) {
    const lResult = {};
    const lHtml = [];
    let lElemParent, lElem;
    if (!!aEstBilanParMatiere) {
      const lListeElement = new ObjetListeElements();
      for (
        let i = 0, lNbrServices = this.donnees.listeLignes.count();
        i < lNbrServices;
        i++
      ) {
        lElem = this.donnees.listeLignes.get(i);
        if (
          lElem.getNumero() === aNumeroElement &&
          (lElem.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_Competence ||
            lElem.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_EltPilier)
        ) {
          lListeElement.addElement(lElem);
        } else if (
          lElem.getNumero() === aNumeroElement &&
          lElem.getGenre() === TypeGenreElementBulletinCompetence.tEBPM_Service
        ) {
          lResult.service = lElem;
          lElemParent = lElem;
        }
      }
      lHtml.push(
        this.composeListeCompetencesEvaluees(
          lListeElement,
          lElemParent,
          aEstBilanParMatiere,
        ),
      );
      if (!!lElemParent) {
        if (
          (!!lElemParent.strEltProg && lElemParent.hintEltProg !== "") ||
          (!!lElemParent.strEltProg && lElemParent.strEltProg !== "")
        ) {
          lHtml.push('<div style="padding:10px 5px 5px 5px;">');
          const lColonneEltProg = this.donnees.listeColonnes.getElementParGenre(
            TypeGenreColonneBulletinCompetence.tCBdC_EltProg,
          );
          const lLibellelColonneEltProg =
            !!lColonneEltProg && lColonneEltProg.getLibelle() !== ""
              ? lColonneEltProg.getLibelle()
              : "";
          lHtml.push(
            '<div class="left-align color : #616161;">' +
              lLibellelColonneEltProg +
              "</div>",
          );
          lHtml.push('<div id="' + this.eltProg + '" class="Espace">');
          if (!!lElemParent.strEltProg && lElemParent.strEltProg !== "") {
            lHtml.push(lElemParent.strEltProg);
          }
          if (!!lElemParent.hintEltProg && lElemParent.hintEltProg !== "") {
            lHtml.push(lElemParent.hintEltProg);
          }
          lHtml.push("</div>");
          lHtml.push("</div>");
        }
        if (!!lElemParent.appreciationA && lElemParent.appreciationA !== "") {
          const lColonneAppreciationsParMatiere =
            this.donnees.listeColonnes.getElementParGenre(
              TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA,
            );
          const lLibelleAppreciationsParMatiere =
            !!lColonneAppreciationsParMatiere &&
            lColonneAppreciationsParMatiere.getLibelle() !== ""
              ? lColonneAppreciationsParMatiere.getLibelle()
              : "";
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lLibelleAppreciationsParMatiere,
              contenuDAppreciation: lElemParent.appreciationA,
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
        if (!!lElemParent.appreciationB && lElemParent.appreciationB !== "") {
          const lColonneProgressionParMatiere =
            this.donnees.listeColonnes.getElementParGenre(
              TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB,
            );
          const lLibelleProgressionParMatiere =
            !!lColonneProgressionParMatiere &&
            lColonneProgressionParMatiere.getLibelle() !== ""
              ? lColonneProgressionParMatiere.getLibelle()
              : "";
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lLibelleProgressionParMatiere,
              contenuDAppreciation: lElemParent.appreciationB,
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
        if (!!lElemParent.appreciationC && lElemParent.appreciationC !== "") {
          const lColonneConseilParMatiere =
            this.donnees.listeColonnes.getElementParGenre(
              TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC,
            );
          const lLibelleConseilParMatiere =
            !!lColonneConseilParMatiere &&
            lColonneConseilParMatiere.getLibelle() !== ""
              ? lColonneConseilParMatiere.getLibelle()
              : "";
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lLibelleConseilParMatiere,
              contenuDAppreciation: lElemParent.appreciationC,
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
      }
    } else {
      lElem = this.donnees.listeLignes.getElementParNumero(aNumeroElement);
      lResult.service = lElem;
      if (!!lElem.listeColonnesTransv && lElem.listeColonnesTransv.count()) {
        lHtml.push(
          this.composeListeCompetencesEvaluees(
            lElem.listeColonnesTransv,
            null,
            aEstBilanParMatiere,
          ),
        );
      }
      if (!!lElem && !!lElem.appreciationA && lElem.appreciationA !== "") {
        const lColonneAppreciationsTabTransv =
          this.donnees.listeColonnes.getElementParGenre(
            TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA,
          );
        const lLibelleAppreciationsTabTransv =
          !!lColonneAppreciationsTabTransv &&
          lColonneAppreciationsTabTransv.getLibelle() !== ""
            ? lColonneAppreciationsTabTransv.getLibelle()
            : "";
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
            intituleDAppreciation: lLibelleAppreciationsTabTransv,
            contenuDAppreciation: lElem.appreciationA,
            styleBlockIntitule: "color : #616161;",
            styleBlockContenu:
              "border:1px solid #616161; background-color: #F1F1F1;",
          }),
        );
      }
      if (!!lElem && !!lElem.appreciationB && lElem.appreciationB !== "") {
        const lColonneProgressionTabTransv =
          this.donnees.listeColonnes.getElementParGenre(
            TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB,
          );
        const lLibelleProgressionTabTransv =
          !!lColonneProgressionTabTransv &&
          lColonneProgressionTabTransv.getLibelle() !== ""
            ? lColonneProgressionTabTransv.getLibelle()
            : "";
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
            intituleDAppreciation: lLibelleProgressionTabTransv,
            contenuDAppreciation: lElem.appreciationB,
            styleBlockIntitule: "color : #616161;",
            styleBlockContenu:
              "border:1px solid #616161; background-color: #F1F1F1;",
          }),
        );
      }
      if (!!lElem && !!lElem.appreciationC && lElem.appreciationC !== "") {
        const lColonneConseilTabTransv =
          this.donnees.listeColonnes.getElementParGenre(
            TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC,
          );
        const lLibelleConseilTabTransv =
          !!lColonneConseilTabTransv &&
          lColonneConseilTabTransv.getLibelle() !== ""
            ? lColonneConseilTabTransv.getLibelle()
            : "";
        lHtml.push(
          UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
            intituleDAppreciation: lLibelleConseilTabTransv,
            contenuDAppreciation: lElem.appreciationC,
            styleBlockIntitule: "color : #616161;",
            styleBlockContenu:
              "border:1px solid #616161; background-color: #F1F1F1;",
          }),
        );
      }
    }
    lResult.html = lHtml.join("");
    return lResult;
  }
  composeBandeauService(aService) {
    const lHtml = [];
    const lPourcentageReussite = this.donnees.listeColonnes.getElementParGenre(
      TypeGenreColonneBulletinCompetence.tCBdC_Pourcentage,
    );
    lHtml.push("<span>" + aService.strServiceEtProf + "</span>");
    lHtml.push('<div class="sub-titre-contain">');
    if (
      !!aService.pourcentage &&
      aService.pourcentage !== "" &&
      !!lPourcentageReussite &&
      lPourcentageReussite.getLibelle() !== ""
    ) {
      lHtml.push(
        '<div class="per-cent">' +
          GTraductions.getValeur("competences.TauxDeReussite") +
          " " +
          aService.pourcentage +
          "%" +
          "</div>",
      );
    }
    if (!!aService.posLSUNiveau) {
      lHtml.push(
        '<div class="pastille-conteneur">' +
          EGenreNiveauDAcquisitionUtil.getImagePositionnement({
            niveauDAcquisition: aService.posLSUNiveau,
            genrePositionnement:
              this.donnees.typePositionnement || TypePositionnement.POS_Echelle,
          }) +
          "</div>",
      );
    }
    if (!!aService.posLSUNote) {
      lHtml.push("<div>" + aService.posLSUNote.getNote() + "</div>");
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeListeCompetencesEvaluees(
    aListeCompetencesEvaluees,
    aElementParent,
    aEstBilanParMatiere,
  ) {
    const lHtml = [];
    if (
      (!!aListeCompetencesEvaluees && aListeCompetencesEvaluees.count()) ||
      !!aElementParent
    ) {
      lHtml.push(
        '<ul class="collection with-header bg-white bulletin" style="overflow-Y:auto;">',
      );
      if (!!aEstBilanParMatiere) {
        if (!!aElementParent) {
          lHtml.push(this.composeBarreNiveauxDAcquisitions(aElementParent));
        }
        if (!!aListeCompetencesEvaluees && aListeCompetencesEvaluees.count()) {
          for (
            let i = 0,
              lNbrCompetencesEvaluees = aListeCompetencesEvaluees.count();
            i < lNbrCompetencesEvaluees;
            i++
          ) {
            let lCompetence = aListeCompetencesEvaluees.get(i);
            const lPourChronologique = this._estJaugeChronologique();
            const listeNiveaux = lPourChronologique
              ? lCompetence.listeNiveauxChronologique
              : lCompetence.listeNiveaux;
            lHtml.push(
              '<li class="collection-item ',
              !!listeNiveaux ? "with-action" : "",
              '" onclick="' +
                (!!listeNiveaux
                  ? this.Nom +
                    ".surClicJaugeEvaluations(" +
                    lCompetence.Position +
                    ")"
                  : ""),
              '">',
              '    <div class="evaluations-conteneur">',
              '      <div class="description">',
              lCompetence.strElmtCompetence,
              "</div>",
              '      <div class="pastilles">',
            );
            if (!!listeNiveaux && listeNiveaux.count()) {
              for (
                let j = 0, lNbrNiveau = listeNiveaux.count();
                j < lNbrNiveau;
                j++
              ) {
                const lNiveau =
                  GParametres.listeNiveauxDAcquisitions.getElementParElement(
                    listeNiveaux.get(j),
                  );
                const lNbr = listeNiveaux.get(j).nbr;
                if (lNbr !== null && lNbr !== undefined) {
                  if (lNbr !== 0) {
                    lHtml.push('<div class="pastille-nbr-conteneur">');
                    lHtml.push('<div class="nbr">', lNbr, "</div>");
                    lHtml.push(
                      "<div >",
                      EGenreNiveauDAcquisitionUtil.getImage(lNiveau),
                      "</div>",
                    );
                    lHtml.push("</div>");
                  }
                } else {
                  lHtml.push(
                    "<div >",
                    EGenreNiveauDAcquisitionUtil.getImage(lNiveau),
                    "</div>",
                  );
                }
              }
            }
            lHtml.push("</div>");
            lHtml.push("</div>");
            lHtml.push("</li>");
          }
        }
      } else {
        for (
          let i = 0,
            lNbrCompetencesEvaluees = aListeCompetencesEvaluees.count();
          i < lNbrCompetencesEvaluees;
          i++
        ) {
          let lCompetence = aListeCompetencesEvaluees.get(i);
          const lExisteUnNiveauAcqui = !!lCompetence.niveauAcqui,
            lAUnNiveauAcquiSaisi =
              lExisteUnNiveauAcqui && lCompetence.niveauAcqui.existeNumero(),
            lAUnNiveauAcquiCalcule =
              !!lCompetence.niveauAcquiCalc &&
              lCompetence.niveauAcquiCalc.existeNumero();
          lHtml.push(
            '<li class="collection-item" style="padding-left:4px; padding-right:4px;">',
          );
          lHtml.push("<div>", lCompetence.getLibelle(), "</div>");
          if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
            if (lAUnNiveauAcquiSaisi) {
              lHtml.push(
                '<div class="secondary-content">',
                EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcqui),
                "</div>",
              );
            }
            lHtml.push(
              '<div class="secondary-content">',
              " (",
              EGenreNiveauDAcquisitionUtil.getImage(
                lCompetence.niveauAcquiCalc,
              ),
              ")",
              "</div>",
            );
          } else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
            if (lAUnNiveauAcquiSaisi) {
              lHtml.push(
                '<div class="secondary-content">',
                EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcqui),
                "</div>",
              );
            } else {
              lHtml.push(
                '<div class="secondary-content"',
                EGenreNiveauDAcquisitionUtil.getImage(
                  lCompetence.niveauAcquiCalc,
                ),
                "</div>",
              );
            }
          }
          lHtml.push("</li>");
        }
      }
      lHtml.push("</ul>");
    }
    return lHtml.join("");
  }
  composeListeNiveauDAqcuisitions(aElem) {
    const lHtml = [];
    lHtml.push(
      '<div style="border-left: 5px solid ' +
        (!!aElem.couleur && aElem.couleur !== "" ? aElem.couleur : "D4D4D4") +
        '; padding: 10px 5px;">',
    );
    lHtml.push(
      '<div class="InlineBlock AlignementHaut" style="width:64%;">' +
        aElem.strServiceEtProf +
        "</div>",
    );
    if (!!aElem.listeColonnesTransv && aElem.listeColonnesTransv.count()) {
      lHtml.push(
        '<div class="InlineBlock AlignementHaut right-align" style="width:35%;">',
      );
      for (
        let j = 0, lNbrElement = aElem.listeColonnesTransv.count();
        j < lNbrElement;
        j++
      ) {
        const lObjetElementColonneTransv = aElem.listeColonnesTransv.get(j),
          lExisteUnNiveauAcqui = !!lObjetElementColonneTransv.niveauAcqui,
          lAUnNiveauAcquiSaisi =
            lExisteUnNiveauAcqui &&
            lObjetElementColonneTransv.niveauAcqui.existeNumero(),
          lAUnNiveauAcquiCalcule =
            !!lObjetElementColonneTransv.niveauAcquiCalc &&
            lObjetElementColonneTransv.niveauAcquiCalc.existeNumero();
        if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
          if (lAUnNiveauAcquiSaisi) {
            lHtml.push(
              '<div class="InlineBlock" style="',
              !!GParametres.afficherAbbreviationNiveauDAcquisition
                ? "padding:0rem 0.2rem;"
                : "",
              '">',
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcqui,
              ),
              "</div>",
            );
          } else {
            lHtml.push(
              '<div class="InlineBlock" style="width:16px;">&nbsp;</div>',
            );
          }
          lHtml.push(
            '<div class="InlineBlock" style="',
            !!GParametres.afficherAbbreviationNiveauDAcquisition
              ? "padding:0rem 0.2rem;"
              : "",
            '">',
            " (",
            EGenreNiveauDAcquisitionUtil.getImage(
              lObjetElementColonneTransv.niveauAcquiCalc,
            ),
            ")",
            "</div>",
          );
        } else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
          if (lAUnNiveauAcquiSaisi) {
            lHtml.push(
              '<div class="InlineBlock" style="',
              !!GParametres.afficherAbbreviationNiveauDAcquisition
                ? "padding:0rem 0.2rem;"
                : "",
              '">',
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcqui,
              ),
              "</div>",
            );
          } else {
            lHtml.push(
              '<div class="InlineBlock" style="',
              !!GParametres.afficherAbbreviationNiveauDAcquisition
                ? "padding:0rem 0.2rem;"
                : "",
              '">',
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcquiCalc,
              ),
              "</div>",
            );
          }
        }
      }
      lHtml.push("</div>");
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeBarreNiveauxDAcquisitions(aElem) {
    const lHtml = [];
    const lInfos = [];
    let lTotal = 0,
      lElt;
    const lListeNiveauxDAcquisitions = MethodesObjet.dupliquer(
      GParametres.listeNiveauxDAcquisitions,
    );
    let lNiveau,
      lGenre,
      lCouleur,
      lImage,
      lNombre,
      n = lListeNiveauxDAcquisitions.count();
    const lPourChronologique = this._estJaugeChronologique();
    const listeNiveaux = lPourChronologique
      ? aElem.listeNiveauxChronologique
      : aElem.listeNiveaux;
    const avecAbsent =
      !lPourChronologique &&
      aElem.getGenre() === TypeGenreElementBulletinCompetence.tEBPM_EltPilier;
    const hint = aElem.hintNiveaux;
    const pourPastille =
      aElem.getGenre() === TypeGenreElementBulletinCompetence.tEBPM_EltPilier;
    if (!!lPourChronologique && listeNiveaux && listeNiveaux.count()) {
      lHtml.push(
        '<li class="collection-header white valign-wrapper',
        !!listeNiveaux ? " with-action" : "",
        '" style="padding: 0.6rem 0.0rem 0.6rem 0.3rem;" onclick="' +
          (!!listeNiveaux
            ? this.Nom + ".surClicJaugeEvaluations(" + aElem.Position + ")"
            : ""),
        '">',
      );
      const lSeparateur = "";
      for (let i = 0; i < listeNiveaux.count(); i++) {
        lNiveau = lListeNiveauxDAcquisitions.getElementParGenre(
          listeNiveaux.getGenre(i),
        );
        lCouleur = EGenreNiveauDAcquisitionUtil.getCouleur(lNiveau);
        lHtml.push(
          '<div class="InlineBlock" style="width:2rem; height:2rem; border: 1px solid #343434; background-color:',
          lCouleur,
          '">&nbsp;</div>',
        );
      }
      lHtml.push("</li>");
      return lHtml.join(lSeparateur);
    }
    lListeNiveauxDAcquisitions.setTri([ObjetTri.init("positionJauge")]);
    lListeNiveauxDAcquisitions.trier();
    for (let i = 0; i < n; i++) {
      lNiveau = lListeNiveauxDAcquisitions.get(i);
      if (lNiveau.existeNumero()) {
        lGenre = lNiveau.getGenre();
        if (
          avecAbsent ||
          (lGenre !== EGenreNiveauDAcquisition.Absent &&
            lGenre !== EGenreNiveauDAcquisition.NonEvalue)
        ) {
          lCouleur = EGenreNiveauDAcquisitionUtil.getCouleur(lNiveau);
          lImage = EGenreNiveauDAcquisitionUtil.getImage(lNiveau, {
            avecTitle: !hint,
          });
          lNombre =
            listeNiveaux && listeNiveaux.getElementParGenre(lGenre)
              ? listeNiveaux.getElementParGenre(lGenre).nbr
              : 0;
          lTotal += lNombre;
          if (lNombre !== 0) {
            lInfos.push({ nombre: lNombre, couleur: lCouleur, image: lImage });
          }
        }
      }
    }
    if (lInfos.length) {
      lHtml.push(
        '<li class="collection-header with-action jauge-conteneur" onclick="' +
          this.Nom +
          ".surClicJaugeEvaluations(",
        aElem.Position,
        ')">',
      );
      for (let i = 0; i < lInfos.length; i++) {
        lElt = lInfos[i];
        if (pourPastille) {
          lHtml.push(
            '<div class="AlignementDroit EspaceDroit" style="width:',
            100 / (n - 2),
            '%;" >',
          );
          if (!!lElt.nombre) {
            lHtml.push(
              '<div class="InlineBlock" style="margin-right: 5px;">',
              lElt.nombre,
              '</div><div class="InlineBlock">',
              lElt.image,
              "</div></div>",
            );
          } else {
            lHtml.push("&nbsp;");
          }
          lHtml.push("</div>");
        } else {
          if (!!lElt.nombre) {
            lHtml.push(
              '<div class="InlineBlock" style="border:1px solid #343434; background-color:',
              lElt.couleur,
              "; width:",
              (lElt.nombre * 100) / lTotal,
              '%; height: 2rem">&nbsp;</div>',
            );
          }
        }
      }
      lHtml.push("</li>");
    }
    return lHtml.join("");
  }
  _estJaugeChronologique() {
    return (
      this.donnees.maquette.genreJauge ===
      TypeJaugeEvaluationBulletinCompetence.tJBC_Chronologique
    );
  }
  surClickProchainElement(aNumeroElement, aEstSuivant, aEstBilanParMatiere) {
    let lIndiceElementActuel, lIndiceProchainElement, lNumeroProchainElement;
    for (let i = 0, lNbrElem = this.listeServices.count(); i < lNbrElem; i++) {
      if (aNumeroElement === this.listeServices.getNumero(i)) {
        lIndiceElementActuel = i;
        if (!!aEstSuivant) {
          lIndiceProchainElement =
            lIndiceElementActuel + 1 < this.listeServices.count()
              ? lIndiceElementActuel + 1
              : 0;
          lNumeroProchainElement = this.listeServices.getNumero(
            lIndiceProchainElement,
          );
        } else {
          lIndiceProchainElement =
            lIndiceElementActuel === 0
              ? this.listeServices.count() - 1
              : lIndiceElementActuel - 1;
          lNumeroProchainElement = this.listeServices.getNumero(
            lIndiceProchainElement,
          );
        }
      }
    }
    if (!!lNumeroProchainElement) {
      this.ouvrirPanel(lNumeroProchainElement, aEstBilanParMatiere);
    }
  }
  getImagePastille(aElement, aNumero) {
    if (
      !!aElement.listeColonnesTransv &&
      aElement.listeColonnesTransv.count()
    ) {
      const lHtml = [];
      const lCompetence =
          aElement.listeColonnesTransv.getElementParNumero(aNumero),
        lExisteUnNiveauAcqui = !!lCompetence.niveauAcqui,
        lAUnNiveauAcquiSaisi =
          lExisteUnNiveauAcqui && lCompetence.niveauAcqui.existeNumero(),
        lAUnNiveauAcquiCalcule =
          !!lCompetence.niveauAcquiCalc &&
          lCompetence.niveauAcquiCalc.existeNumero();
      if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
        if (lAUnNiveauAcquiSaisi) {
          lHtml.push(
            '<div class="fix-bloc">',
            EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcqui),
            "</div>",
          );
        }
        lHtml.push(
          '<div class="fix-bloc">',
          " (",
          EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcquiCalc),
          ")",
          "</div>",
        );
      } else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
        if (lAUnNiveauAcquiSaisi) {
          lHtml.push(
            '<div class="fix-bloc">',
            EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcqui),
            "</div>",
          );
        } else {
          lHtml.push(
            '<div class="fix-bloc"',
            EGenreNiveauDAcquisitionUtil.getImage(lCompetence.niveauAcquiCalc),
            "</div>",
          );
        }
      }
      return lHtml.join("");
    } else {
      return false;
    }
  }
  surClicJaugeEvaluations(aPositionElement) {
    let lElement;
    for (
      let i = 0, lNbrElem = this.donnees.listeLignes.count();
      i < lNbrElem;
      i++
    ) {
      if (this.donnees.listeLignes.get(i).Position === aPositionElement) {
        lElement = this.donnees.listeLignes.get(i);
      }
    }
    if (
      !!lElement &&
      !!lElement.relationsESI &&
      !!lElement.relationsESI.length
    ) {
      new ObjetRequeteDetailEvaluationsCompetences(
        this,
        _surReponseRequeteDetailEvaluations.bind(this, lElement),
      ).lancerRequete({
        eleve: GEtatUtilisateur.getMembre(),
        periode: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Periode,
        ),
        numRelESI: lElement.relationsESI,
      });
    }
  }
}
function _surReponseRequeteDetailEvaluations(aLigne, aJSON) {
  if (!!aLigne && !!aJSON) {
    const lHtml = [];
    lHtml.push('<ul class="collection with-header  bg-white bulletin">');
    for (let i = 0, lNbrElem = aJSON.listeLignes.count(); i < lNbrElem; i++) {
      const lElement = aJSON.listeLignes.get(i);
      if (lElement.getGenre() === 0 || lElement.getGenre() === 1) {
        lHtml.push(
          '<li class="collection-header" style="border-bottom-color:#d1d1d1; background-color: #FFFFFF;">',
        );
        lHtml.push(
          '<div class="InlineBlock left-align" style="width:80%; vertical-align:top;">',
          lElement.getLibelle(),
          "</div>",
        );
        if (!!lElement.strCoef) {
          lHtml.push(
            '<div class="InlineBlock right-align" style="width:19%; vertical-align:top; padding-right:2px;">' +
              GTraductions.getValeur("competences.colonne.coef") +
              " " +
              lElement.strCoef,
            "</div>",
          );
        }
        lHtml.push("</li>");
      } else {
        const lNiveauAcqui = lElement.niveauAcqu;
        const lNiveauAcquiGlobal =
          GParametres.listeNiveauxDAcquisitions.getElementParGenre(
            lNiveauAcqui.getGenre(),
          );
        lHtml.push(
          '<li class="collection-item">',
          '<div style="padding-right: 2.5rem;">',
          lElement.getLibelle(),
          !!lNiveauAcqui && !!lNiveauAcqui.observation
            ? '<br/><span style="font-style: italic;">' +
                lNiveauAcqui.observation +
                "</span>"
            : "",
          "</div>",
          '<div class="secondary-content" style="width: 2rem; text-align: center;',
          !!GParametres.afficherAbbreviationNiveauDAcquisition
            ? "right:0.9rem"
            : "",
          '" >',
          EGenreNiveauDAcquisitionUtil.getImage(lNiveauAcquiGlobal),
          "</div>",
          "</li>",
        );
      }
    }
    lHtml.push("</ul>");
    ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre,
      { pere: this },
      { titre: aLigne.getLibelle(), fermerFenetreSurClicHorsFenetre: true },
    ).afficher(lHtml.join(""));
  }
}
module.exports = ObjetBulletinCompetences;
