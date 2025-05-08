const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Identite } = require("ObjetIdentite.js");
const {
  ObjetRequetePageOrientations,
} = require("ObjetRequetePageOrientations.js");
const {
  ObjetRequeteSaisieOrientations,
} = require("ObjetRequeteSaisieOrientations.js");
const {
  ObjetFenetre_RessourceOrientation,
} = require("ObjetFenetre_RessourceOrientation.js");
const { ObjetOrientation_Mobile } = require("ObjetOrientation_Mobile.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
const { EGenreVoeux } = require("UtilitaireOrientation.js");
const { EModeAffichage } = require("UtilitaireOrientation.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { TUtilitaireOrientation } = require("UtilitaireOrientation.js");
const { Type3Etats } = require("Type3Etats.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
class InterfacePageOrientation extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.idDivGenerale = GUID.getId();
    this.idFooter = GUID.getId();
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentOrientationsIntentions = [];
    this.IdentOrientationsDefinitif = [];
    this.listeOrientationsSupprimees = new ObjetListeElements();
    this.moteurSelectionContexte = new MoteurSelectionContexte();
    this.avecSelectionEleve =
      GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur;
  }
  construireInstances() {
    this.identComboClasse = this.add(
      ObjetSelection,
      _evntSelecteur.bind(this, {
        genreSelecteur: EGenreRessource.Classe,
        genreSelecteurSuivant: EGenreRessource.Eleve,
        estDernierSelecteur: false,
      }),
      _initSelecteur.bind(this, EGenreRessource.Classe),
    );
    this.identComboEleve = this.add(
      ObjetSelection,
      _evntSelecteur.bind(this, {
        genreSelecteur: EGenreRessource.Eleve,
        genreSelecteurSuivant: null,
        estDernierSelecteur: true,
      }),
      _initSelecteur.bind(this, EGenreRessource.Eleve),
    );
    this.identComboRubrique = this.add(
      ObjetSelection,
      _evntSelecteurRubrique.bind(this),
      _initSelecteur.bind(this, EGenreRessource.Aucune),
    );
    this.AddSurZone = [
      this.identComboClasse,
      this.identComboEleve,
      this.identComboRubrique,
    ];
    this.identComboOrientationAR = this.add(
      ObjetSelection,
      this.evenementSurCombo,
      this.initialiserCombo,
    );
  }
  getControleur(aInstance) {
    return $.extend(
      true,
      TUtilitaireOrientation.getControleurGeneral(aInstance),
      {
        message: {
          surClickItem: function () {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Information,
              message: aInstance.TexteInformatif,
            });
          },
        },
        btnValider: {
          event: function () {
            aInstance.valider();
          },
          getDisabled: function () {
            return !aInstance.getEtatSaisie();
          },
        },
        cbARAvisConseil: {
          getValue: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            return !!lDonnesAR
              ? lDonnesAR.estAccuse === Type3Etats.TE_Oui
              : false;
          },
          setValue: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              lDonnesAR.estAccuse = Type3Etats.TE_Oui;
              aInstance.setEtatSaisie(true);
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              return (
                lDonnesAR.estAccuse === Type3Etats.TE_Oui ||
                !lDonnesAR.estEditable
              );
            }
          },
        },
        radioARStage: {
          getValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            return !!lDonnesAR
              ? lDonnesAR.reponseStagePasserelle === aChoix
              : false;
          },
          setValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              lDonnesAR.reponseStagePasserelle = aChoix;
              aInstance.setEtatSaisie(true);
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              return !lDonnesAR.estEditable;
            }
          },
        },
        radioARProposition: {
          getValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            return !!lDonnesAR ? lDonnesAR.estAccuse === aChoix : false;
          },
          setValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            if (!!lDonnesAR) {
              aInstance.setEtatSaisie(true);
              lDonnesAR.estAccuse = aChoix;
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            if (!!lDonnesAR) {
              return !lDonnesAR.estEditable;
            }
          },
        },
      },
    );
  }
  getDonnesARDeRubriqueDeGenre(aGenre) {
    let lRubrique = null;
    if (!!this.donnees.listeRubriques) {
      lRubrique = this.donnees.listeRubriques.getElementParGenre(aGenre);
    }
    return !!lRubrique ? lRubrique.donneesAR : null;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="Espace">');
    H.push(
      '<div class="EspaceHaut InterfacePageOrientation" id="',
      this.idDivGenerale,
      '"></div>',
    );
    H.push(
      '<footer id="',
      this.idFooter,
      '" class="page-footer InterfacePageOrientation" style="display:none; z-index:10;">',
      '<div class="IPO_Footer">',
      '<span ie-model="message" ie-event="click->surClickItem()" ></span>',
      "</div>",
      "</footer>",
    );
    H.push("</div>");
    return H.join("");
  }
  recupererDonnees() {
    if (!this.Pere.EnConstruction) {
      if (GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur) {
        if (this.numeroClasse && this.eleve) {
          new ObjetRequetePageOrientations(
            this,
            this.actionSurRecupererDonnees,
          ).lancerRequete({ eleve: this.eleve, classe: this.numeroClasse });
        } else {
          this.moteurSelectionContexte.getListeClasses({
            pere: this,
            clbck: function (aParam) {
              this.moteurSelectionContexte.remplirSelecteur(
                $.extend({}, aParam, {
                  instance: this.getInstance(this.identComboClasse),
                  genreRessource: EGenreRessource.Classe,
                  pere: this,
                  clbck: this.afficherMessage.bind(this),
                }),
              );
            }.bind(this),
          });
        }
      } else {
        this.eleve = GEtatUtilisateur.getMembre()
          ? GEtatUtilisateur.getMembre()
          : 0;
        new ObjetRequetePageOrientations(
          this,
          this.actionSurRecupererDonnees,
        ).lancerRequete();
      }
    }
  }
  afficherTexteInformatif() {}
  afficherMessage(AMessage) {
    GHtml.setHtml(
      this.getInstance(this.identPage).getNom(),
      '<div class="Texte12 Gras AlignementMilieu"><br>' + AMessage + "</div>",
    );
  }
  actionSurRecupererDonnees(aParam) {
    this.donnees = aParam;
    this.setEtatSaisie(false);
    if (!!aParam.TexteNiveau) {
      this.LibelleBouton = aParam.TexteNiveau.LibelleBouton;
      this.TexteInformatif = aParam.TexteNiveau.TexteInformatif;
    }
    if (aParam.listeRubriques) {
      const lListeSelecteur = new ObjetListeElements();
      let lIndexParDefaut = 0;
      aParam.listeRubriques.parcourir((aRubrique) => {
        if (
          [
            TypeRubriqueOrientation.RO_IntentionFamille,
            TypeRubriqueOrientation.RO_VoeuDefinitif,
            TypeRubriqueOrientation.RO_DecisionRetenue,
          ].includes(aRubrique.getGenre())
        ) {
          if (
            aRubrique.getGenre() ===
              TypeRubriqueOrientation.RO_DecisionRetenue &&
            !aRubrique.estPublie
          ) {
            return;
          }
          const lElement = new ObjetElement(
            aRubrique.titre,
            -1,
            aRubrique.getGenre(),
          );
          lElement.donnees = aRubrique;
          if (aRubrique.avecSaisie) {
            lElement.libelleHtmlTitre = `${aRubrique.titre} <br> <span>${GTraductions.getValeur("Orientation.ASaisirJusqau", [GDate.formatDate(aRubrique.dateFinRubrique, "%JJ/%MM/%AAAA")])}</span>`;
          }
          lListeSelecteur.addElement(lElement);
          if (!!aRubrique.avecSaisie) {
            lIndexParDefaut = lListeSelecteur.count() - 1;
          }
        }
      });
      if (
        aParam.rubriqueLV &&
        (aParam.rubriqueLV.estPublie || aParam.rubriqueLV.avecSaisie)
      ) {
        this.rubriqueLV = aParam.rubriqueLV;
        const lElement = new ObjetElement(
          GTraductions.getValeur("Orientation.LanguesOptions.titre"),
          -1,
          -1,
        );
        lElement.donnees = aParam.rubriqueLV;
        if (aParam.rubriqueLV.avecSaisie && aParam.rubriqueLV.dateFinRubrique) {
          lElement.libelleHtmlTitre =
            GTraductions.getValeur("Orientation.LanguesOptions.titre") +
            "<br>" +
            GTraductions.getValeur("Orientation.ASaisirJusqau", [
              GDate.formatDate(
                aParam.rubriqueLV.dateFinRubrique,
                "%JJ/%MM/%AAAA",
              ),
            ]);
        }
        lListeSelecteur.addElement(lElement);
      }
      if (this.rubriqueSelectionnee) {
        lIndexParDefaut = lListeSelecteur.getIndiceExisteParElement(
          this.rubriqueSelectionnee,
        );
      }
      this.getInstance(this.identComboRubrique).setDonnees(
        lListeSelecteur,
        lIndexParDefaut,
      );
    } else if (aParam.Message) {
      this.composeMessage(aParam.Message);
    }
  }
  afficherPage() {
    this.IdentOrientationsIntentions = [];
    this.IdentOrientationsDefinitif = [];
    const aInstance = this;
    const lRubrique = this.rubriqueSelectionnee;
    const lHtml = [];
    lRubrique.listeObjetInterface = [];
    if (!lRubrique.estPublie && lRubrique.dateMsgPublication) {
      const orientation = Identite.creerInstance(ObjetOrientation_Mobile, {
        pere: aInstance,
      });
      orientation.setDonnees({
        rubrique: lRubrique,
        genre: lRubrique.getGenre(),
        editable: false,
      });
      lHtml.push('<div id="' + orientation.getNom() + '"></div>');
      lRubrique.listeObjetInterface.push(orientation);
    } else {
      lRubrique.listeVoeux.setTri(
        ObjetTri.init((a) => {
          return a.rang;
        }),
      );
      lRubrique.listeVoeux.trier();
      lRubrique.listeVoeux.parcourir((aVoeux) => {
        if (aVoeux.orientation && aVoeux.orientation.existe()) {
          const lOrientationModele =
            aInstance.donnees.listeOrientations.getElementParNumero(
              aVoeux.orientation.getNumero(),
            );
          if (lOrientationModele) {
            $.extend(aVoeux.orientation, lOrientationModele);
          }
        }
        const orientation = Identite.creerInstance(ObjetOrientation_Mobile, {
          pere: aInstance,
          evenement: aInstance._surEvntInput,
        });
        let lModeSaisie = lRubrique.avecSaisie
          ? EModeAffichage.saisie
          : EModeAffichage.consultation;
        if (!!lRubrique.estConseilPublie || !!aVoeux.avecAvisSaisie) {
          lModeSaisie = EModeAffichage.consultation;
        }
        let lDateMsg;
        if (
          aVoeux.avecAvisSaisie &&
          lRubrique.avecSaisie &&
          aVoeux.dateMsgPublication
        ) {
          lDateMsg = aVoeux.dateMsgPublication;
        } else if (lRubrique.dateMsgPublication) {
          lDateMsg = lRubrique.dateMsgPublication;
        }
        const lMessage = !!lDateMsg
          ? GTraductions.getValeur("Orientation.PublieLe", [
              GDate.formatDate(lDateMsg, "%JJ/%MM/%AAAA"),
            ])
          : "";
        orientation.setDonnees({
          voeux: aVoeux,
          rubrique: lRubrique,
          maquette: lRubrique.maquette,
          modeSaisie: lModeSaisie,
          message: lMessage,
          genre: lRubrique.getGenre(),
          editable: true,
        });
        lHtml.push('<div id="' + orientation.getNom() + '"></div>');
        lRubrique.listeObjetInterface.push(orientation);
        if (
          lRubrique.getGenre() === TypeRubriqueOrientation.RO_IntentionFamille
        ) {
          aInstance.IdentOrientationsIntentions.push(orientation);
        } else if (
          lRubrique.getGenre() === TypeRubriqueOrientation.RO_VoeuDefinitif
        ) {
          aInstance.IdentOrientationsDefinitif.push(orientation);
        }
      });
      let lRubriqueConseilAAjouter;
      if (
        lRubrique.getGenre() === TypeRubriqueOrientation.RO_IntentionFamille
      ) {
        lRubriqueConseilAAjouter = [
          TypeRubriqueOrientation.RO_AutreRecommandationConseil,
        ];
      } else if (
        lRubrique.getGenre() === TypeRubriqueOrientation.RO_VoeuDefinitif
      ) {
        lRubriqueConseilAAjouter = [
          TypeRubriqueOrientation.RO_AutrePropositionConseil,
        ];
      }
      if (!!lRubriqueConseilAAjouter) {
        lRubriqueConseilAAjouter.forEach((aTypeRubrique) => {
          const rubriqueConseil =
            aInstance.donnees.listeRubriques.getElementParGenre(aTypeRubrique);
          if (
            !!rubriqueConseil &&
            (!!rubriqueConseil.listeVoeux ||
              !!rubriqueConseil.dateMsgPublication)
          ) {
            const orientationConseil = Identite.creerInstance(
              ObjetOrientation_Mobile,
              { pere: aInstance },
            );
            const lVoeux =
              rubriqueConseil.listeVoeux && rubriqueConseil.listeVoeux.count()
                ? rubriqueConseil.listeVoeux.get(0)
                : undefined;
            const lMessage = rubriqueConseil.dateMsgPublication
              ? GDate.formatDate(
                  rubriqueConseil.dateMsgPublication,
                  "%JJ/%MM/%AAAA",
                )
              : "";
            orientationConseil.setDonnees({
              voeux: lVoeux,
              rubrique: lRubrique,
              modeSaisie: EModeAffichage.simplifie,
              message: lMessage,
              genre: rubriqueConseil.getGenre(),
              editable: false,
            });
            if (lMessage) {
              lHtml.unshift(
                '<div id="' + orientationConseil.getNom() + '"></div>',
              );
            } else {
              lHtml.push(
                '<div id="' + orientationConseil.getNom() + '"></div>',
              );
            }
            lRubrique.listeObjetInterface.push(orientationConseil);
          }
          if (!!rubriqueConseil && !!rubriqueConseil.donneesAR) {
            lRubrique.avecAccuseReception = rubriqueConseil.avecAccuseReception;
            lRubrique.donneesAR = rubriqueConseil.donneesAR;
            lRubrique.auMoinsUnAvisFavorable =
              rubriqueConseil.auMoinsUnAvisFavorable;
          }
        });
      }
    }
    if (lRubrique.avecSaisie && !lRubrique.estConseilPublie) {
      const lLibelle =
        lRubrique.getGenre() === TypeRubriqueOrientation.RO_IntentionFamille
          ? GTraductions.getValeur("Orientation.Bouton.IntentionsOrientation")
          : GTraductions.getValeur("Orientation.Bouton.ChoixDefinitifs");
      lHtml.push(
        '<div class="IPO_BoutonValider"><ie-bouton ie-model="btnValider" class="themeBoutonPrimaire" >',
        lLibelle,
        "</ie-bouton></div>",
      );
    }
    if (
      !!lRubrique.avecAccuseReception &&
      !!lRubrique.donneesAR &&
      !!lRubrique.auMoinsUnAvisFavorable
    ) {
      lHtml.push(
        TUtilitaireOrientation.construireAR({
          instance: this,
          rubrique: lRubrique,
          idCombo: this.getZoneId(this.identComboOrientationAR),
          estMobile: true,
        }),
      );
    }
    if (lHtml.length === 0) {
      GHtml.setHtml(
        this.idDivGenerale,
        this.composeAucuneDonnee(
          GTraductions.getValeur("Orientation.AucuneOrientation"),
        ),
      );
    } else {
      GHtml.setHtml(this.idDivGenerale, lHtml.join(""), { instance: this });
    }
    lRubrique.listeObjetInterface.forEach((aOrientation) => {
      aOrientation.initialiser();
    });
    if (
      !!this.identComboOrientationAR &&
      lRubrique.getGenre() === TypeRubriqueOrientation.RO_VoeuDefinitif
    ) {
      const lCombo = this.getInstance(this.identComboOrientationAR);
      if (!!lRubrique.donneesAR && !!lRubrique.donneesAR.listeOrientations) {
        let lIndiceDecision = 0;
        if (lRubrique.donneesAR.estAccuse === Type3Etats.TE_Oui) {
          lIndiceDecision =
            !!lRubrique.donneesAR.decisionRetenue &&
            lRubrique.donneesAR.decisionRetenue.existeNumero()
              ? lRubrique.donneesAR.listeOrientations.getIndiceParLibelle(
                  lRubrique.donneesAR.decisionRetenue.getLibelle(),
                )
              : 0;
        }
        lCombo.setDonnees(
          lRubrique.donneesAR.listeOrientations,
          lIndiceDecision,
          false,
        );
        const lActif =
          lRubrique.donneesAR.estEditable &&
          lRubrique.donneesAR.estAccuse === Type3Etats.TE_Oui;
        lCombo.setActif(lActif);
      }
    }
  }
  afficherPageLangueVivante() {
    const lHtml = [];
    if (this.rubriqueSelectionnee) {
      if (this.rubriqueSelectionnee.estPublie) {
        lHtml.push(
          TUtilitaireOrientation.getHtmlLangueEtOption(
            this.rubriqueSelectionnee,
            true,
          ),
        );
      } else if (this.rubriqueSelectionnee.dateMsgPublication) {
        lHtml.push(
          this.composeAucuneDonnee(
            GTraductions.getValeur(
              "Orientation.Ressources.MessageSaisieIndisponible",
              [
                GDate.formatDate(
                  this.rubriqueSelectionnee.dateMsgPublication,
                  "%JJ/%MM/%AAAA",
                ),
              ],
            ),
          ),
        );
      }
    }
    GHtml.setHtml(this.idDivGenerale, lHtml.join(""), { instance: this });
  }
  _surEvntInput(aElement, aParam) {
    let lListeRessources;
    let lFiltrerRessource = true;
    switch (aParam.genreEvent) {
      case EGenreEvnt.orientation:
        lListeRessources =
          TUtilitaireOrientation.formatterDonneesPourRegroupements(
            this,
            this.donnees.listeOrientations,
          );
        lFiltrerRessource = false;
        break;
      case EGenreEvnt.specialite:
        lListeRessources = aParam.orientation.listeSpecialites;
        break;
      case EGenreEvnt.option:
        lListeRessources = aParam.orientation.listeOptions;
        break;
      case EGenreEvnt.supprimer: {
        this.setEtatSaisie(true);
        let lRangModifie = aElement.donnees.rang;
        let lListeOrientations =
          aElement.Genre === EGenreVoeux.intention
            ? this.IdentOrientationsIntentions
            : this.IdentOrientationsDefinitif;
        for (; lRangModifie < lListeOrientations.length; lRangModifie++) {
          lListeOrientations[lRangModifie].donnees.rang--;
        }
        aElement.donnees.rang = lRangModifie;
        if (
          !this.listeOrientationsSupprimees.getElementParNumero(
            aElement.donnees.getNumero(),
          )
        ) {
          const lElemSupprime = MethodesObjet.dupliquer(aElement.donnees);
          this.listeOrientationsSupprimees.addElement(lElemSupprime);
          aElement.donnees.setNumero(0);
        }
        const lIdJQ = "#" + aElement.Nom.escapeJQ();
        const objetHtml = $(lIdJQ);
        objetHtml.insertBefore(".IPO_BoutonValider");
        lListeOrientations.sort((a, b) => {
          return a.donnees.rang - b.donnees.rang;
        });
        this.actualiserListeObjet(lListeOrientations);
        break;
      }
      case EGenreEvnt.actualiser: {
        let lListeOrientations =
          aElement.Genre === EGenreVoeux.intention
            ? this.IdentOrientationsIntentions
            : this.IdentOrientationsDefinitif;
        if (aParam.index <= lListeOrientations.length) {
          const lElement = lListeOrientations[aParam.index];
          if (lElement) {
            lElement.setEditable(aElement.estEditable());
          }
        }
        this.setEtatSaisie(true);
        break;
      }
      case EGenreEvnt.lv1:
        lFiltrerRessource = false;
        lListeRessources = aElement.listeLV1;
        break;
      case EGenreEvnt.lv2:
        lFiltrerRessource = false;
        lListeRessources = aElement.listeLV2;
        break;
      case EGenreEvnt.lvautre:
        lListeRessources = aElement.listeLVAutres;
        break;
    }
    if (lListeRessources) {
      if (lFiltrerRessource) {
        lListeRessources = TUtilitaireOrientation.filtrerRessources(
          this,
          aElement,
          lListeRessources,
          aParam.genreEvent,
        );
      }
      this.afficherFenetreRessource({
        genre: aParam.genreEvent,
        listeRessource: lListeRessources,
        element: aElement,
        index: aParam.index,
        estMultiNiveau: this.donnees.estMultiNiveau,
        estNiveauPremiere: this.donnees.estNiveauPremiere,
      });
    }
  }
  composeMessage(aMessage) {
    const lHtml = [];
    lHtml.push(
      '<div style="width:1px;height:1px;"></div><div class="card card-nodata"><div class="card-content">',
      aMessage,
      "</div></div>",
    );
    GHtml.setHtml(this.idDivGenerale, lHtml.join(""), { instance: this });
  }
  actualiserListeObjet(aListe) {
    if (!!aListe) {
      let lEditable = true;
      aListe.forEach((aObjet) => {
        aObjet.setEditable(lEditable);
        lEditable = aObjet.estEditable();
      });
    }
  }
  valider() {
    if (!this.getEtatSaisie()) {
      return;
    }
    _saisie.call(this);
  }
  actionSurValidation() {
    this.setEtatSaisie(false);
    TUtilitaireOrientation.afficherMessageValidation();
    this.recupererDonnees();
  }
  initialiserCombo(aInstance) {
    aInstance.setParametres({ avecBoutonsPrecedentSuivant: false });
  }
  evenementSurCombo(aParam) {
    if (aParam.element) {
      const lDonneesAR = this.getDonnesARDeRubriqueDeGenre(
        TypeRubriqueOrientation.RO_AutrePropositionConseil,
      );
      if (
        !!lDonneesAR &&
        !!lDonneesAR.decisionRetenue &&
        lDonneesAR.decisionRetenue.getLibelle() === aParam.element.getLibelle()
      ) {
        return;
      }
      if (!!lDonneesAR && lDonneesAR.estAccuse === Type3Etats.TE_Oui) {
        lDonneesAR.decisionRetenue = aParam.element;
        _saisie.call(this, lDonneesAR);
      }
    }
  }
  getListeOrientationSaisie() {
    const lListeOrientations = new ObjetListeElements();
    this.IdentOrientationsIntentions.forEach((aElement) => {
      lListeOrientations.addElement(aElement.donnees);
    });
    this.IdentOrientationsDefinitif.forEach((aElement) => {
      lListeOrientations.addElement(aElement.donnees);
    });
    this.listeOrientationsSupprimees.parcourir((aElement) => {
      aElement.setEtat(EGenreEtat.Suppression);
      lListeOrientations.addElement(aElement);
    });
    return lListeOrientations;
  }
  afficherFenetreRessource(aParam) {
    let lCleTraduction;
    switch (aParam.genre) {
      case EGenreEvnt.orientation:
        lCleTraduction = "Orientation.TitreListe";
        break;
      case EGenreEvnt.specialite:
        lCleTraduction = "Orientation.Specialites.TitreListe";
        break;
      case EGenreEvnt.option:
        lCleTraduction = "Orientation.Options.TitreListe";
        break;
      case EGenreEvnt.lv1:
        lCleTraduction = "Orientation.LanguesOptions.TitreListeLV1";
        break;
      case EGenreEvnt.lv2:
        lCleTraduction = "Orientation.LanguesOptions.TitreListeLV2";
        break;
      case EGenreEvnt.lvautre:
        lCleTraduction = "Orientation.Options.TitreListe";
        break;
      default:
        break;
    }
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_RessourceOrientation, {
      pere: this,
      evenement: function (aParam) {
        const lLV1 =
          aParam.genre === EGenreEvnt.lv1
            ? aParam.element
            : this.rubriqueLV.LV1;
        const lLV2 =
          aParam.genre === EGenreEvnt.lv2
            ? aParam.element
            : this.rubriqueLV.LV2;
        this.verificationDonnees({ lv1: lLV1, lv2: lLV2 });
      },
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur(lCleTraduction),
          largeur: "80%",
          hauteur: 80,
          listeBoutons: [GTraductions.getValeur("Fermer")],
        });
      },
    }).setDonnees(aParam);
  }
  verificationDonnees(aDonnees) {
    if (
      aDonnees &&
      aDonnees.lv1 &&
      aDonnees.lv1.existeNumero() &&
      aDonnees.lv2 &&
      aDonnees.lv2.existeNumero()
    ) {
      Requetes.inscrire("VerificationOrientations", ObjetRequeteConsultation);
      Requetes(
        "VerificationOrientations",
        this,
        _apresRequeteVerification.bind(this, aDonnees),
      ).lancerRequete({ LV1: aDonnees.lv1, LV2: aDonnees.lv2 });
    } else {
      this.rubriqueLV.LV1 = aDonnees.lv1;
      this.rubriqueLV.LV2 = aDonnees.lv2;
      this.setEtatSaisie(true);
    }
  }
}
function _apresRequeteVerification(aDonneesSaisies, aDonneesRecues) {
  if (aDonneesRecues.message) {
    GApplication.getMessage().afficher({
      titre: GTraductions.getValeur(
        "Orientation.LanguesOptions.titreMsgErreur",
      ),
      type: EGenreBoiteMessage.Information,
      message: aDonneesRecues.message,
    });
  } else {
    this.rubriqueLV.LV1 = aDonneesSaisies.lv1;
    this.rubriqueLV.LV2 = aDonneesSaisies.lv2;
    this.setEtatSaisie(true);
  }
}
function _initSelecteur(aGenre, aInstance) {
  let lLabel = "";
  switch (aGenre) {
    case EGenreRessource.Classe:
      lLabel = GTraductions.getValeur("WAI.ListeSelectionClasse");
      break;
    case EGenreRessource.Eleve:
      lLabel = GTraductions.getValeur("WAI.ListeSelectionEleve");
      break;
    case EGenreRessource.Aucune:
      lLabel = GTraductions.getValeur("WAI.SelectionRubrique");
      break;
  }
  aInstance.setParametres({
    avecBoutonsPrecedentSuivant: true,
    icone: null,
    labelWAICellule: lLabel,
  });
}
function _evntSelecteurRubrique(aParam) {
  this.rubriqueSelectionnee = aParam.element.donnees;
  if (aParam.element.getGenre() > -1) {
    this.afficherPage();
  } else {
    this.afficherPageLangueVivante();
  }
  if (!!this.LibelleBouton && !!this.TexteInformatif) {
    $("#" + this.idFooter.escapeJQ()).show();
    $("#" + this.idFooter.escapeJQ())
      .find("span")
      .html(this.LibelleBouton);
  }
}
function _saisie(aDonneesAR) {
  let lListeOrientations = new ObjetListeElements();
  let lDonneesAR = null;
  let lRubriqueLV;
  if (!!aDonneesAR) {
    lDonneesAR = aDonneesAR;
  } else {
    lListeOrientations = this.getListeOrientationSaisie();
    lRubriqueLV = this.rubriqueLV;
  }
  new ObjetRequeteSaisieOrientations(
    this,
    this.actionSurValidation,
  ).lancerRequete({
    listeOrientations: lListeOrientations,
    donneesAR: lDonneesAR,
    rubriqueLV: lRubriqueLV,
    eleve: this.eleve,
  });
}
function _evntSelecteur(aContexte, aParam) {
  if (!aContexte.estDernierSelecteur) {
    this.numeroClasse = !!aParam.element ? aParam.element : 0;
    this.moteurSelectionContexte.getListeEleves({
      classe: aParam.element,
      pere: this,
      clbck: function (aParam) {
        this.moteurSelectionContexte.remplirSelecteur(
          $.extend({}, aParam, {
            instance: this.getInstance(this.identComboEleve),
            genreRessource: EGenreRessource.Eleve,
            pere: this,
            clbck: this.afficherMessage.bind(this),
          }),
        );
      }.bind(this),
    });
  } else {
    this.eleve = !!aParam.element ? aParam.element : 0;
    this.recupererDonnees();
  }
}
module.exports = InterfacePageOrientation;
