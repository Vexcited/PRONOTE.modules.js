exports.ObjetVSListeDetails = void 0;
const ObjetWAI_1 = require("ObjetWAI");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const GUID_1 = require("GUID");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DetailCommission_1 = require("ObjetFenetre_DetailCommission");
const jsx_1 = require("jsx");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
class ObjetVSListeDetails extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.cbAvecInteractionUtilisateur = false;
    this.estEspaceParent = [
      Enumere_Espace_1.EGenreEspace.Parent,
      Enumere_Espace_1.EGenreEspace.PrimParent,
      Enumere_Espace_1.EGenreEspace.Mobile_Parent,
      Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
    ].includes(GEtatUtilisateur.GenreEspace);
    this.idMessage = GUID_1.GUID.getId();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getIdentListe() {
        return {
          class: ObjetListe_1.ObjetListe,
          pere: aInstance,
          init(aInstanceListe) {
            const lBoutons = [];
            if (
              aInstance.estEspaceParent &&
              [
                Enumere_Ressource_1.EGenreRessource.Absence,
                Enumere_Ressource_1.EGenreRessource.Retard,
                Enumere_Ressource_1.EGenreRessource.Dispense,
              ].includes(aInstance.objDonneesDuRecap.genre)
            ) {
              lBoutons.push({
                html: IE.jsx.str(
                  "ie-checkbox",
                  { "ie-model": "cbAvecInteractionUtilisateur" },
                  ObjetTraduction_1.GTraductions.getValeur(
                    "AbsenceVS.UniquementLesEvtNecessiteAction",
                  ),
                ),
                controleur: {
                  cbAvecInteractionUtilisateur: {
                    getValue: function () {
                      return aInstance.cbAvecInteractionUtilisateur;
                    },
                    setValue: function (aValue) {
                      aInstance.cbAvecInteractionUtilisateur = aValue;
                      aInstanceListe.setDonnees(
                        aInstance._construireListeAbsences(),
                      );
                    },
                  },
                },
              });
            }
            aInstanceListe.setOptionsListe({
              colonnes: [{ taille: "100%" }],
              skin: ObjetListe_1.ObjetListe.skin.flatDesign,
              forcerScrollV_mobile: true,
              boutons: lBoutons,
            });
            aInstance.identListe = aInstanceListe;
          },
          start(aInstanceListe) {
            switch (aInstance.objDonneesDuRecap.genre) {
              case Enumere_Ressource_1.EGenreRessource.Absence:
              case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
              case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
              case Enumere_Ressource_1.EGenreRessource.Dispense:
              case Enumere_Ressource_1.EGenreRessource.Retard:
                aInstanceListe.setDonnees(aInstance._construireListeAbsences());
                break;
              case Enumere_Ressource_1.EGenreRessource.Commission: {
                const lDonneesListe = aInstance._construireListeCommissions();
                aInstanceListe.setDonnees(lDonneesListe);
                break;
              }
            }
          },
          evenement(aParametres) {
            switch (aInstance.objDonneesDuRecap.genre) {
              case Enumere_Ressource_1.EGenreRessource.Commission:
                aInstance._evenementCommission(aParametres);
                break;
            }
          },
          destroy() {
            if (aInstance.identListe) {
              aInstance.identListe.free();
              aInstance.identListe = null;
            }
          },
        };
      },
      selectionDetail(aEvenement, aNumeroElement) {
        $(this.node).eventValidation(function (aEvent) {
          aEvent.stopPropagation();
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          aInstance.callback.appel({
            element: lElement,
            evenement: aEvenement,
          });
          $(this).siblings().removeClass("detail-selected");
          $(this).addClass("detail-selected");
        });
      },
      suisInformee: {
        getValue(aNumeroElement) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          return lElement.estLue;
        },
        setValue(aNumeroElement, aValue) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          if (aValue) {
            aInstance.callback.appel({
              element: lElement,
              evenement: ObjetVSListeDetails.evenement.validationObservation,
            });
          }
        },
        getDisabled(aNumeroElement) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          return lElement && lElement.estLue;
        },
      },
      ARPunition: {
        getValue(aNumeroElement) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          return lElement.parentAAccuseDeReception;
        },
        setValue(aNumeroElement, aValue) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          if (aValue) {
            aInstance.callback.appel({
              element: lElement,
              evenement: ObjetVSListeDetails.evenement.validationARPunition,
            });
          }
        },
        getDisabled(aNumeroElement) {
          const lElement =
            aInstance.objDonneesDuRecap.donnees.getElementParNumero(
              aNumeroElement,
            );
          return lElement && lElement.parentAAccuseDeReception;
        },
      },
      hintPJ(aNumeroElement) {
        const lElement =
          aInstance.objDonneesDuRecap.donnees.getElementParNumero(
            aNumeroElement,
          );
        const lResult = [];
        for (let i = 0; i < lElement.documents.count(); i++) {
          const lDocument = lElement.documents.get(i);
          if (lDocument.existe()) {
            lResult.push(lDocument.hint);
          }
        }
        return lResult.join("<br />");
      },
      hintCommentaire(aNumeroElement) {
        const lElement =
          aInstance.objDonneesDuRecap.donnees.getElementParNumero(
            aNumeroElement,
          );
        let lHint = "";
        if (lElement && lElement.html && lElement.html.commentaire) {
          lHint = lElement.html.commentaire.replace(/\n/g, "<br />");
        }
        return lHint;
      },
    });
  }
  construireAffichage() {
    const lHtml = [];
    if (this.objDonneesDuRecap) {
      if (
        [
          Enumere_Ressource_1.EGenreRessource.Commission,
          Enumere_Ressource_1.EGenreRessource.Absence,
          Enumere_Ressource_1.EGenreRessource.AbsenceInternat,
          Enumere_Ressource_1.EGenreRessource.AbsenceRepas,
          Enumere_Ressource_1.EGenreRessource.Dispense,
          Enumere_Ressource_1.EGenreRessource.Retard,
        ].includes(this.objDonneesDuRecap.genre)
      ) {
        lHtml.push(
          '<div ie-identite="getIdentListe" class="full-size ObjetVSListeDetails"></div>',
        );
      } else {
        lHtml.push(
          "<ul ",
          ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.List),
          ' class="liste-clickable ObjetVSListeDetails">',
        );
        if (
          this.objDonneesDuRecap.genre ===
          Enumere_Ressource_1.EGenreRessource.Aucune
        ) {
          lHtml.push(this._composeTotaux(this.objDonneesDuRecap));
        } else {
          lHtml.push(this._composeListeDetails(this.objDonneesDuRecap));
        }
        lHtml.push("</ul>");
      }
    } else {
      lHtml.push(
        '<div id="',
        this.idMessage,
        '" class="message-vide ObjetVSListeDetails_message">',
        this._getHtmlMessageVide(
          ObjetTraduction_1.GTraductions.getValeur(
            "RecapAbsenceEleve.SelectionnerUnRecap",
          ),
        ),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  setHtmlMessageVide(aMessage) {
    ObjetHtml_1.GHtml.setHtml(
      this.idMessage,
      this._getHtmlMessageVide(aMessage),
    );
  }
  setDonnees(aDonnees) {
    this.objDonneesDuRecap = aDonnees;
    this.afficher();
  }
  _getHtmlMessageVide(aMessage) {
    return [
      '<span class="message" >',
      aMessage,
      '</span><div class="Image_No_Data" aria-hidden="true"></div>',
    ].join("");
  }
  _getPlacesEnDuree(aPlaces) {
    return aPlaces >= 0
      ? ObjetDate_1.GDate.formatDureeEnMillisecondes(
          aPlaces * 1000,
          "%xh%sh%mm",
        )
      : "";
  }
  _composeTotaux(aObjDonnees) {
    const lHtml = [];
    if (aObjDonnees.totaux) {
      lHtml.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "li",
            { tabindex: "0", class: "listeHeures total" },
            IE.jsx.str(
              "h2",
              null,
              ObjetTraduction_1.GTraductions.getValeur(
                "RecapAbsenceEleve.ToutesLesMatieres",
              ),
            ),
            IE.jsx.str(
              "div",
              null,
              IE.jsx.str(
                "section",
                null,
                IE.jsx.str(
                  "div",
                  null,
                  IE.jsx.str(
                    "span",
                    { class: "total" },
                    this._getPlacesEnDuree(aObjDonnees.totaux.absence),
                  ),
                  "\u00A0",
                  IE.jsx.str(
                    "span",
                    null,
                    ObjetTraduction_1.GTraductions.getValeur(
                      "RecapAbsenceEleve.Absences",
                    ),
                  ),
                ),
                IE.jsx.str(
                  "div",
                  null,
                  IE.jsx.str(
                    "span",
                    { class: "total" },
                    this._getPlacesEnDuree(aObjDonnees.totaux.excluCours),
                  ),
                  "\u00A0",
                  IE.jsx.str(
                    "span",
                    null,
                    ObjetTraduction_1.GTraductions.getValeur(
                      "RecapAbsenceEleve.ExclusionCours",
                    ),
                  ),
                ),
                IE.jsx.str(
                  "div",
                  null,
                  IE.jsx.str(
                    "span",
                    { class: "total" },
                    this._getPlacesEnDuree(aObjDonnees.totaux.excluEtab),
                  ),
                  "\u00A0",
                  IE.jsx.str(
                    "span",
                    null,
                    ObjetTraduction_1.GTraductions.getValeur(
                      "RecapAbsenceEleve.ExclusionEtablissement",
                    ),
                  ),
                ),
              ),
              IE.jsx.str(
                "aside",
                null,
                IE.jsx.str(
                  "span",
                  null,
                  IE.jsx.str(
                    "span",
                    { class: "total" },
                    this._getPlacesEnDuree(aObjDonnees.totaux.total),
                  ),
                  IE.jsx.str("span", { style: "padding: 0 0.1rem;" }, "/"),
                ),
                IE.jsx.str(
                  "span",
                  null,
                  this._getPlacesEnDuree(aObjDonnees.totaux.suivi),
                ),
              ),
            ),
          ),
        ),
      );
    }
    if (aObjDonnees.donnees) {
      for (let i = 0; i < aObjDonnees.donnees.count(); i++) {
        const lElm = aObjDonnees.donnees.get(i);
        const lClass = ["listeHeures"];
        if (lElm.dansRegroupement > 0) {
          lClass.push("estItemDUnRegroupement");
        }
        if (lElm.estUnDeploiement) {
          lClass.push("estUnRegroupement");
        }
        if (lElm.total > 0) {
          lHtml.push('<li tabindex="0" class="', lClass.join(" "), '">');
          lHtml.push("<h2>" + lElm.getLibelle() + "</h2>");
          lHtml.push("<div>");
          lHtml.push("<section>");
          if (lElm.absence > 0) {
            lHtml.push(
              "<div>",
              '<span class="nombre">',
              this._getPlacesEnDuree(lElm.absence),
              "</span>",
              "<span> : ",
              ObjetTraduction_1.GTraductions.getValeur(
                "RecapAbsenceEleve.Absences",
              ),
              "</span>",
              "</div>",
            );
          }
          if (lElm.excluCours > 0) {
            lHtml.push(
              "<div>",
              '<span class="nombre">',
              this._getPlacesEnDuree(lElm.excluCours),
              "</span>",
              "<span> : ",
              ObjetTraduction_1.GTraductions.getValeur(
                "RecapAbsenceEleve.ExclusionCours",
              ),
              "</span>",
              "</div>",
            );
          }
          if (lElm.excluEtab > 0) {
            lHtml.push(
              "<div>",
              '<span class="nombre">',
              this._getPlacesEnDuree(lElm.excluEtab),
              "</span>",
              "<span> : ",
              ObjetTraduction_1.GTraductions.getValeur(
                "RecapAbsenceEleve.ExclusionEtablissement",
              ),
              "</span>",
              "</div>",
            );
          }
          lHtml.push("</section>");
          lHtml.push(
            "<aside>",
            '<span><span class="nombre">',
            this._getPlacesEnDuree(lElm.total),
            '</span><span style="padding: 0 0.1rem;">/</span></span><span>',
            this._getPlacesEnDuree(lElm.suivi),
            "</span>",
            "</aside>",
          );
          lHtml.push("</div>");
          lHtml.push("</li>");
        }
      }
    }
    return lHtml.join("");
  }
  _composeListeDetails(aObjDonnees) {
    const lHtml = [];
    let lRegroupement = "";
    if (aObjDonnees.donnees) {
      for (let i = 0; i < aObjDonnees.donnees.count(); i++) {
        const lElement = aObjDonnees.donnees.get(i);
        switch (aObjDonnees.genre) {
          case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
            if (
              aObjDonnees.recapitulatif.genreObservation ===
                TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres &&
              lElement.getLibelle() !== lRegroupement
            ) {
              lRegroupement = lElement.getLibelle();
              lElement.estPremier = true;
              lHtml.push(
                '<li class="listeDetails VSRegroupement"><h2>',
                lRegroupement,
                "</h2></li>",
              );
            }
            lHtml.push(this._composeObservations(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Absence:
            lHtml.push(this._composeAbsences(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
            lHtml.push(this._composeAbsences(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
            lHtml.push(this._composeAbsences(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Infirmerie:
            lHtml.push(this._composeAutre(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Retard:
            lHtml.push(this._composeAbsences(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Incident:
            lHtml.push(this._composeIncident(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Punition:
            lHtml.push(this._composePunition(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.Sanction:
            lHtml.push(this._composeAutre(lElement, aObjDonnees));
            break;
          case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
            lHtml.push(this._composeAutre(lElement, aObjDonnees));
            break;
          default:
            break;
        }
      }
    }
    return lHtml.join("");
  }
  _composeObservations(aElement, aObjDonnees) {
    const lAvecEvenement = this.estEspaceParent && aElement.avecARObservation;
    aObjDonnees.utilitaireAbsence.remplirContentHtml({
      element: aElement,
      genre: aObjDonnees.genre,
      genreObservation: aObjDonnees.recapitulatif.genreObservation,
      node: lAvecEvenement
        ? ObjetHtml_1.GHtml.composeAttr("ie-node", "selectionDetail", [
            ObjetVSListeDetails.evenement.selection,
            aElement.getNumero(),
          ])
        : null,
      model: lAvecEvenement
        ? ObjetHtml_1.GHtml.composeAttr("ie-model", "suisInformee", [
            aElement.getNumero(),
          ])
        : null,
    });
    return this._composeHtml(aElement.html);
  }
  _composePunition(aElement, aObjDonnees) {
    const lAvecEvenement =
      aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition &&
      aElement.nature &&
      aElement.nature.estAvecARParent &&
      this.estEspaceParent;
    aObjDonnees.utilitaireAbsence.remplirContentHtml({
      element: aElement,
      genre: aObjDonnees.genre,
      model: lAvecEvenement
        ? ObjetHtml_1.GHtml.composeAttr("ie-model", "ARPunition", [
            aElement.getNumero(),
          ])
        : null,
    });
    return this._composeHtml(aElement.html);
  }
  _composeIncident(aElement, aObjDonnees) {
    const lAvecEvenement =
      aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident &&
      aElement.estAvecARParent &&
      this.estEspaceParent;
    aObjDonnees.utilitaireAbsence.remplirContentHtml({
      element: aElement,
      genre: aObjDonnees.genre,
      model: lAvecEvenement
        ? ObjetHtml_1.GHtml.composeAttr("ie-model", "ARPunition", [
            aElement.getNumero(),
          ])
        : null,
    });
    return this._composeHtml(aElement.html);
  }
  _composeAutre(aElement, aObjDonnees) {
    aObjDonnees.utilitaireAbsence.remplirContentHtml({
      element: aElement,
      genre: aObjDonnees.genre,
    });
    return this._composeHtml(aElement.html);
  }
  _composeHtml(aInfos) {
    const lHtml = [];
    lHtml.push(
      '<li tabindex="0" ',
      aInfos.node,
      ' class="',
      aInfos.class.join(" "),
      '" ',
      ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Listitem),
      aInfos.aria
        ? ObjetWAI_1.GObjetWAI.composeAttribut({
            genre: ObjetWAI_1.EGenreAttribut.label,
            valeur: aInfos.aria,
          })
        : "",
      ">",
    );
    if (aInfos.icon) {
      lHtml.push(aInfos.icon);
    }
    lHtml.push('<div class="detail-vs-item">');
    lHtml.push('<div class="detail-titre">');
    lHtml.push("<h2>", aInfos.titre, "</h2>");
    lHtml.push("</div>");
    const lClass =
      aInfos.classSection && aInfos.classSection.length > 0
        ? ' class="' + aInfos.classSection.join(" ") + '"'
        : "";
    lHtml.push("<section", lClass, ">");
    lHtml.push(aInfos.content.join(""));
    lHtml.push("</section>");
    lHtml.push("</div>");
    lHtml.push("</li>");
    return lHtml.join("");
  }
  _composeAbsences(aElement, aObjDonnees) {
    const lPourSaisieParent =
      this.estEspaceParent && aObjDonnees.recapitulatif.avecAutorisation;
    let lEvenement = ObjetVSListeDetails.evenement.selection;
    const lGenreAvecDetailEdition =
      aObjDonnees.genre === Enumere_Ressource_1.EGenreRessource.Absence ||
      aObjDonnees.genre === Enumere_Ressource_1.EGenreRessource.Retard;
    let lNode = null;
    if (this.estEspaceParent) {
      if (
        lPourSaisieParent &&
        lGenreAvecDetailEdition &&
        this.options.avecBascule
      ) {
        lEvenement = ObjetVSListeDetails.evenement.editionMotifParent;
      }
      lNode = ObjetHtml_1.GHtml.composeAttr("ie-node", "selectionDetail", [
        lEvenement,
        aElement.getNumero(),
      ]);
    }
    aObjDonnees.utilitaireAbsence.remplirContentHtml({
      element: aElement,
      genre: aObjDonnees.genre,
      pourParent: this.estEspaceParent,
      avecBascule: this.options.avecBascule,
      avecSaisie: lPourSaisieParent,
      node: lNode,
      nodeEdition: ObjetHtml_1.GHtml.composeAttr("ie-node", "selectionDetail", [
        ObjetVSListeDetails.evenement.editionMotifParent,
        aElement.getNumero(),
      ]),
      ieHintPJ: ObjetHtml_1.GHtml.composeAttr("ie-hint", "hintPJ", [
        aElement.getNumero(),
      ]),
      ieHintCommentaire: ObjetHtml_1.GHtml.composeAttr(
        "ie-hint",
        "hintCommentaire",
        [aElement.getNumero()],
      ),
    });
    return this._composeHtml(aElement.html);
  }
  _construireListeAbsences() {
    let lListe = new ObjetListeElements_1.ObjetListeElements();
    if (
      this.cbAvecInteractionUtilisateur &&
      [
        Enumere_Ressource_1.EGenreRessource.Absence,
        Enumere_Ressource_1.EGenreRessource.Retard,
        Enumere_Ressource_1.EGenreRessource.Dispense,
      ].includes(this.objDonneesDuRecap.genre)
    ) {
      this.objDonneesDuRecap.donnees.parcourir((aElement) => {
        if (aElement.avecSaisie) {
          lListe.add(aElement);
        }
      });
    } else {
      lListe = this.objDonneesDuRecap.donnees;
    }
    return new DonneesListe_Absences(
      lListe,
      this.objDonneesDuRecap,
      this._evenementAbsence.bind(this),
    );
  }
  _evenementAbsence(aParametres) {
    this.callback.appel(aParametres);
  }
  _construireListeCommissions() {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    this.objDonneesDuRecap.donnees.parcourir((aCommission) => {
      const lCommission = new ObjetElement_1.ObjetElement(
        aCommission.nature.getLibelle(),
        aCommission.getNumero(),
        aCommission.getGenre(),
        aCommission.Position,
      );
      lCommission.date = aCommission.dateDebut;
      lCommission.nbrReponsesEducatives =
        aCommission.listeReponsesEducatives.count();
      let lNbrSuivi = 0;
      if (lCommission.nbrReponsesEducatives > 0) {
        aCommission.listeReponsesEducatives.parcourir((aRepEduc) => {
          lNbrSuivi += aRepEduc.listeSuivisReponseEducative.count();
        });
      }
      lCommission.nbrSuivi = lNbrSuivi;
      lListe.add(lCommission);
    });
    return new DonneesListe_Commission(lListe);
  }
  _evenementCommission(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_DetailCommission_1.ObjetFenetre_DetailCommission,
          { pere: this },
        ).setDonnees(
          this.objDonneesDuRecap.donnees.getElementParNumero(
            aParametres.article.getNumero(),
          ),
        );
        break;
    }
  }
}
exports.ObjetVSListeDetails = ObjetVSListeDetails;
(function (ObjetVSListeDetails) {
  let evenement;
  (function (evenement) {
    evenement["selection"] = "VSDetail_selection";
    evenement["validationObservation"] = "VSDetail_validationObservation";
    evenement["editionMotifParent"] = "VDetail_editionMotifParent";
    evenement["editionDispenseParent"] = "VDetail_editionDispenseParent";
    evenement["validationARPunition"] = "VDetail_validationARPunition";
  })(
    (evenement =
      ObjetVSListeDetails.evenement || (ObjetVSListeDetails.evenement = {})),
  );
})(
  ObjetVSListeDetails ||
    (exports.ObjetVSListeDetails = ObjetVSListeDetails = {}),
);
class DonneesListe_Absences extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aListeAbsences, aObjDonneesDuRecap, aCallbackEdition) {
    super(aListeAbsences);
    this.etatUtilisateurSco = GApplication.getEtatUtilisateur();
    this.objDonneesDuRecap = aObjDonneesDuRecap;
    this.utilitaireAbsence = this.objDonneesDuRecap.utilitaireAbsence;
    this.callbackEdition = aCallbackEdition;
    this.pourSaisieParent =
      GEtatUtilisateur.getUtilisateur().getGenre() ===
        Enumere_Ressource_1.EGenreRessource.Responsable &&
      this.objDonneesDuRecap.recapitulatif.avecAutorisation;
    this.setOptions({
      avecBoutonActionLigne: false,
      avecEvnt_SelectionClick: false,
      avecSelection: false,
      avecEllipsis: false,
    });
  }
  getControleur(aInstance, aInstanceListe) {
    return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
      hintPJ(aNumeroElement) {
        const lElement = aInstance.Donnees.getElementParNumero(aNumeroElement);
        const lResult = [];
        for (let i = 0; i < lElement.documents.count(); i++) {
          const lDocument = lElement.documents.get(i);
          if (lDocument.existe()) {
            lResult.push(lDocument.hint);
          }
        }
        return lResult.join("<br />");
      },
      hintCommentaire(aNumeroElement) {
        const lElement = aInstance.Donnees.getElementParNumero(aNumeroElement);
        let lHint = "";
        if (lElement) {
          lHint = aInstance.utilitaireAbsence
            .getCommentaireDAbsence(
              lElement,
              GEtatUtilisateur.getUtilisateur().getGenre() ===
                Enumere_Ressource_1.EGenreRessource.Responsable,
            )
            .replace(/\n/g, "<br />");
        }
        return lHint;
      },
      editionEvenement: {
        event(aEvenement, aNumeroElement) {
          const lElement =
            aInstance.Donnees.getElementParNumero(aNumeroElement);
          aInstance.callbackEdition({
            element: lElement,
            evenement: aEvenement,
          });
        },
      },
    });
  }
  getZoneGauche(aParams) {
    return IE.jsx.str(
      "div",
      { class: "listeDetails Absence" },
      IE.jsx.str("i", {
        "aria-hidden": "true",
        class:
          "iconVSDetail " +
          this.utilitaireAbsence.getIconAbsence(aParams.article),
      }),
    );
  }
  getTitreZonePrincipale(aParams) {
    aParams.article.infosDate = this.utilitaireAbsence.getInfosDate({
      element: aParams.article,
      sansChaineAujourdhui: true,
    });
    return aParams.article.infosDate.strDate();
  }
  getInfosSuppZonePrincipale(aParams) {
    if (!IE.estMobile) {
      return this.getInfosAbsence(aParams);
    }
  }
  getZoneMessage(aParams) {
    const H = [];
    if (IE.estMobile) {
      H.push(this.getInfosAbsence(aParams));
    }
    let lStrAffichee = "";
    let lStrAuteur = "";
    let lClassCss = ["p-top-l"];
    if (
      aParams.article.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence
    ) {
      if (aParams.article.auteur) {
        lStrAuteur =
          ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.prevuePar", [
            aParams.article.auteur.getLibelle(),
          ]) + " - ";
      }
      if (aParams.article.estUneCreationParent && aParams.article.message) {
        lStrAffichee = aParams.article.message;
      } else if (aParams.article.aRegulariser) {
        H.push(
          IE.jsx.str(
            "p",
            { class: lClassCss },
            ObjetTraduction_1.GTraductions.getValeur(
              "AbsenceVS.absenceAJustifier",
            ).ucfirst(),
          ),
        );
        if (aParams.article.reglee) {
          lStrAffichee =
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.acceptee");
          lClassCss.push("ie-sous-titre");
          H.push(
            IE.jsx.str("div", { class: lClassCss }, lStrAuteur, lStrAffichee),
          );
        }
        return H.join("");
      } else if (!aParams.article.enAttente || aParams.article.reglee) {
        if (aParams.article.justifie) {
          lStrAffichee =
            lStrAuteur.length > 0
              ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.acceptee")
              : "";
          lStrAuteur =
            (aParams.article.justifie
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "AbsenceVS.absenceCoursJust",
                )
              : "") +
            ((lStrAuteur.length > 0 && " - ") || "") +
            lStrAuteur;
        } else {
          lStrAffichee = ObjetTraduction_1.GTraductions.getValeur(
            "AbsenceVS.absenceCoursNonJust",
          ).ucfirst();
        }
      }
      lClassCss.push("ie-sous-titre");
      H.push(IE.jsx.str("div", { class: lClassCss }, lStrAuteur, lStrAffichee));
    }
    if (
      aParams.article.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard
    ) {
      if (aParams.article.aRegulariser) {
        lStrAffichee = ObjetTraduction_1.GTraductions.getValeur(
          "AbsenceVS.retardAJustifier",
        );
        if (aParams.article.avecSaisie && this.pourSaisieParent) {
          H.push(IE.jsx.str("p", { class: lClassCss }, lStrAffichee));
          return H.join("");
        }
      } else if (!aParams.article.enAttente || aParams.article.reglee) {
        lStrAffichee = aParams.article.justifie
          ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardJust")
          : ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardNonJust");
      }
      lClassCss.push("ie-sous-titre");
      H.push(IE.jsx.str("div", { class: lClassCss }, lStrAffichee));
    }
    if (
      aParams.article.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.Dispense
    ) {
      if (aParams.article.auteur) {
        lStrAffichee =
          ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeePar", [
            aParams.article.auteur.getLibelle(),
          ]) +
          " - " +
          aParams.article.message;
      } else {
        lStrAffichee = aParams.article.message;
      }
      lClassCss.push("ie-sous-titre");
      H.push(IE.jsx.str("div", { class: lClassCss }, lStrAffichee));
    }
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    if (
      [
        Enumere_Ressource_1.EGenreRessource.Absence,
        Enumere_Ressource_1.EGenreRessource.Retard,
        Enumere_Ressource_1.EGenreRessource.Dispense,
      ].includes(aParams.article.getGenre())
    ) {
      const H = [];
      const lAvecDocs =
        aParams.article.documents &&
        aParams.article.documents.getNbrElementsExistes() > 0;
      const lAvecCommentaire = !!this.utilitaireAbsence.getCommentaireDAbsence(
        aParams.article,
        GEtatUtilisateur.getUtilisateur().getGenre() ===
          Enumere_Ressource_1.EGenreRessource.Responsable,
      );
      let lBtnLabel = ObjetTraduction_1.GTraductions.getValeur("Justifier");
      let lThemeBouton = Type_ThemeBouton_1.TypeThemeBouton.primaire;
      if (
        lAvecDocs ||
        lAvecCommentaire ||
        (aParams.article.motifParent &&
          aParams.article.motifParent.existeNumero() &&
          !aParams.article.aRegulariser)
      ) {
        lBtnLabel = ObjetTraduction_1.GTraductions.getValeur("Modifier");
        lThemeBouton = Type_ThemeBouton_1.TypeThemeBouton.secondaire;
      }
      const lGenreEvenement =
        aParams.article.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.Dispense
          ? ObjetVSListeDetails.evenement.editionDispenseParent
          : ObjetVSListeDetails.evenement.editionMotifParent;
      if (
        lAvecDocs ||
        lAvecCommentaire ||
        (aParams.article.avecSaisie && this.pourSaisieParent)
      ) {
        H.push(
          IE.jsx.str(
            "div",
            { class: "flex-contain" },
            (lAvecDocs || lAvecCommentaire) &&
              IE.jsx.str(
                "div",
                { class: "sectionVSIcones" },
                lAvecDocs &&
                  IE.jsx.str(
                    "div",
                    { class: "iconVSAbsence" },
                    IE.jsx.str("i", {
                      class: "icon_piece_jointe",
                      "ie-hint": (0, jsx_1.jsxFuncAttr)("hintPJ", [
                        aParams.article.getNumero(),
                      ]),
                    }),
                  ),
                lAvecCommentaire &&
                  IE.jsx.str(
                    "div",
                    { class: "iconVSAbsence" },
                    IE.jsx.str("i", {
                      class: "icon_nouvelle_conversation",
                      "ie-hint": (0, jsx_1.jsxFuncAttr)("hintCommentaire", [
                        aParams.article.getNumero(),
                      ]),
                    }),
                  ),
              ),
            aParams.article.avecSaisie &&
              this.pourSaisieParent &&
              IE.jsx.str(
                "div",
                { class: "sectionVSEdition m-bottom" },
                IE.jsx.str(
                  "ie-bouton",
                  {
                    class: lThemeBouton,
                    "ie-model": (0, jsx_1.jsxFuncAttr)("editionEvenement", [
                      lGenreEvenement,
                      aParams.article.getNumero(),
                    ]),
                  },
                  lBtnLabel,
                ),
              ),
          ),
        );
      }
      return H.join("");
    }
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (
      aZone ===
      ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
        .ZoneCelluleFlatDesign.zoneComplementaire
    ) {
      return false;
    }
  }
  getInfosAbsence(aParams) {
    var _a;
    const H = [];
    if (
      aParams.article.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.Dispense
    ) {
      H.push(
        IE.jsx.str(
          "div",
          null,
          aParams.article.matiere.getLibelle(),
          " - ",
          aParams.article.strGenreDispense,
        ),
      );
    } else {
      if (
        aParams.article.NbrHeures &&
        !this.etatUtilisateurSco.pourPrimaire()
      ) {
        H.push(
          IE.jsx.str(
            "div",
            null,
            this.utilitaireAbsence.getHeuresCoursManquees(
              aParams.article,
              true,
            ),
          ),
        );
      }
      if (!!aParams.article.duree) {
        H.push(
          IE.jsx.str(
            "div",
            null,
            aParams.article.duree +
              " " +
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.minutes"),
          ),
        );
      }
      aParams.article.infosMotif =
        this.utilitaireAbsence.getInfosMotifAbsenceVS({
          donnee: aParams.article,
          pourSaisieParent: this.pourSaisieParent,
        });
      if (
        (_a = aParams.article.infosMotif) === null || _a === void 0
          ? void 0
          : _a.existe()
      ) {
        H.push(
          IE.jsx.str(
            "div",
            null,
            aParams.article.infosMotif.label,
            " ",
            IE.jsx.str(
              "span",
              { class: "theme_color_foncee" },
              aParams.article.infosMotif.texte,
            ),
          ),
        );
      }
      if (
        !!aParams.article.message &&
        !aParams.article.estUneCreationParent &&
        !aParams.article.confirmee
      ) {
        H.push(
          IE.jsx.str(
            "div",
            { class: "m-top-l ie-sous-titre" },
            aParams.article.message,
          ),
        );
      }
    }
    return H.join("");
  }
}
class DonneesListe_Commission extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aListeCommissions) {
    super(aListeCommissions);
    this.setOptions({
      avecBoutonActionLigne: false,
      avecEvnt_SelectionClick: true,
    });
  }
  getZoneGauche(aParams) {
    return IE.jsx.str(
      "time",
      {
        class: "date-contain",
        datetime: ObjetDate_1.GDate.formatDate(aParams.article.date, "%MM-%JJ"),
      },
      ObjetDate_1.GDate.formatDate(aParams.article.date, "%JJ %MMM"),
    );
  }
  getInfosSuppZonePrincipale(aParams) {
    return ObjetTraduction_1.GTraductions.getValeur(
      "Commissions.nbrReponsesEducEtSuivis",
      [aParams.article.nbrReponsesEducatives, aParams.article.nbrSuivi],
    );
  }
}
