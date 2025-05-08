const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const {
  ObjetMoteurFormSaisieMobile,
} = require("ObjetMoteurFormSaisieMobile.js");
const { EGenreEvntForm } = require("ObjetMoteurFormSaisieMobile.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreFenetreDocumentJoint } = require("EGenreFenetreDocumentJoint.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { tag } = require("tag.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
class ObjetPanelEditionContenu extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteurCDT = new ObjetMoteurCDT();
    this.moteurFormSaisie = new ObjetMoteurFormSaisieMobile();
    this.ids = {
      panel: GUID.getId(),
      description: GUID.getId(),
      titre: GUID.getId(),
      sitesWeb: GUID.getId(),
      pj: GUID.getId(),
      kiosque: GUID.getId(),
      listeSitesWeb: GUID.getId(),
      listePJ: GUID.getId(),
      listeKiosque: GUID.getId(),
    };
    this.dimensions = {
      hauteurDescription: 60,
      hauteurTitre: 60,
      hauteurCategorie: 60,
      hauteurTheme: 60,
    };
    _instancierSelectCategorie.call(this);
    _instancierMultiSelectTheme.call(this);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      description: {
        getValue: function () {
          return aInstance.data.descriptif;
        },
        setValue: function (aValue) {
          aInstance.data.descriptif = aValue;
          aInstance.data.setEtat(EGenreEtat.Modification);
        },
        fromDisplay(aValue) {
          let lValue = aValue;
          const lJNode = $(tag("div", aValue));
          const lAvec = GHtml.nettoyerEditeurRiche(lJNode);
          if (lAvec) {
            lValue = lJNode.get(0).innerHTML;
            GApplication.getMessage().afficher({
              message: GTraductions.getValeur(
                "CahierDeTexte.MessageSuppressionImage",
              ),
            });
          }
          return GChaine.htmlDOMPurify(lValue);
        },
        getClasseLabel: function () {
          const lData = aInstance.data;
          return !!lData && !!lData.descriptif && lData.descriptif.length > 0
            ? "active"
            : "";
        },
        node: function () {
          $(this.node).on({
            focus: function () {
              $(this).siblings("label").addClass("active");
              return false;
            },
            blur: function () {
              if (!this.innerHTML) {
                $(this).siblings("label").removeClass("active");
              }
            },
          });
          const lThis = this;
          $(this)
            .siblings("label")
            .on("focus", () => {
              lThis.focus();
            });
        },
        getDisabled: function () {
          return false;
        },
        getStyleValeur: function () {
          return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
        },
      },
      titre: {
        getValue: function () {
          return aInstance.data.getLibelle();
        },
        setValue: function (aValue) {
          aInstance.data.setLibelle(aValue);
          aInstance.data.setEtat(EGenreEtat.Modification);
        },
        getClasseLabel: function () {
          const lData = aInstance.data;
          return !!lData &&
            lData.getLibelle() !== null &&
            lData.getLibelle() !== undefined &&
            lData.getLibelle() !== ""
            ? "active"
            : "";
        },
      },
      nodePoubelle: {
        event: function () {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "CahierDeTexte.msgConfirmationSupprimerContenu",
            ),
            callback: function (aGenreBouton) {
              if (aGenreBouton === EGenreAction.Valider) {
                this.data.setEtat(EGenreEtat.Suppression);
                this.callback.appel({
                  commande: EGenreEvntForm.supprimer,
                  data: this.data,
                });
              }
            }.bind(this),
          });
        }.bind(aInstance),
        getDisabled: function () {
          return false;
        },
      },
      modelPJ: { getIcone() {} },
      getNodeGestionPJ: function () {
        $(this.node).on("click", () => {
          _evntSurEditPJ.call(aInstance);
        });
      },
      getNodeGestionSiteWeb: function () {
        $(this.node).on("click", () => {
          surEvenementChoixSiteParmiSitesDejaInseres.call(aInstance);
        });
      },
      getNodeGestionKiosque: function () {},
      getNodeRemoveRessource: function (aGenreRessource, aNumeroRessource) {
        $(this.node).on("click", () => {
          _evntSurRemoveRessource.call(
            aInstance,
            aGenreRessource,
            aNumeroRessource,
          );
        });
      },
      btnSupprChips: {
        eventBtn: function (aGenreRessource, aNumeroRessource) {
          _evntSurRemoveRessource.call(
            aInstance,
            aGenreRessource,
            aNumeroRessource,
          );
        },
      },
    });
  }
  setOptions(aParam) {
    this._options = {
      avecSaisiePJ: false,
      avecSaisieSitesWeb: false,
      avecCloud: false,
      avecKiosque: false,
    };
    $.extend(this._options, aParam);
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    this.donneeOriginale = this.donnees.contenu;
    this.donneeOriginale.matiere = this.donnees.matiere;
    this.data = MethodesObjet.dupliquer(this.donneeOriginale);
    this.listeCategories = aDonnees.listeCategories;
    this.listePeriodes = this.donnees.listePeriodes;
    this.listeDocumentsJoints = this.donnees.listeDocumentsJoints;
    this.dateCoursDeb = this.donnees.dateCoursDeb;
  }
  getHtmlPanel() {
    const lHtml = [];
    lHtml.push(
      '<div class="FormSaisie ofm-design" id="',
      this.ids.panel,
      '">',
      _composeHtmlEdition.call(this),
      "</div>",
    );
    return lHtml.join("");
  }
  updateContent() {
    _updateSelectCategorie.call(this);
    _updateMultiSelectTheme.call(this);
  }
  getOptionsFenetre() {
    const lTitre = `<span class="iconic icon_contenu_cours">${this.donnees.estCreation ? GTraductions.getValeur("CahierDeTexte.CreerContenu") : GTraductions.getValeur("CahierDeTexte.ModifierContenu")}</span>`;
    const lHtmlFooter = !this.donnees.estCreation
      ? `<ie-btnicon class="icon_trash avecFond i-medium" ie-model="nodePoubelle" aria-label=${GTraductions.getValeur("Supprimer")}></ie-btnicon>`
      : "";
    return {
      titre: lTitre,
      htmlFooter: lHtmlFooter,
      avecComposeBasInFooter: true,
      callback: (aNumeroBouton, aParams) => {
        if (aParams.bouton && aParams.bouton.valider) {
          if (this.data.descriptif.replace(/&nbsp;/gi, "").trim() === "") {
            this.data.descriptif = "";
          }
          this.data.setLibelle(this.data.getLibelle().trim());
          if (this.moteurCDT.estContenuVide(this.data)) {
            if (this.donnees.estCreation) {
              this.callback.appel({
                commande: EGenreEvntForm.annuler,
                data: this.donneeOriginale,
                estCreation: this.donnees.estCreation,
              });
            } else {
              this.data.estVide = true;
            }
          } else {
            this.data.estVide = false;
          }
          this.data.setEtat(
            this.donnees.estCreation
              ? EGenreEtat.Creation
              : EGenreEtat.Modification,
          );
          this.callback.appel({
            commande: EGenreEvntForm.valider,
            data: this.data,
            estCreation: this.donnees.estCreation,
          });
        } else {
          _annulerEdition.call(this);
        }
      },
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        { valider: true, libelle: GTraductions.getValeur("Valider") },
      ],
    };
  }
}
function _composeHtmlEdition() {
  const H = [];
  const lModeCreation = this.donnees.estCreation;
  H.push(
    _composeCorps.call(this, {
      modeCreation: lModeCreation,
      devoir: this.devoir,
    }),
  );
  return H.join("");
}
function _composeCorps(aParam) {
  const H = [];
  const lParam = { estCtxEdition: aParam.modeCreation === false };
  H.push(`<div class="Fenetre_Contenu">`);
  H.push(_composeTitre.call(this, lParam));
  H.push(_composeCategorie.call(this, lParam));
  if (GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
    H.push(_composeTheme.call(this, lParam));
  }
  H.push(_composeDescription.call(this, lParam));
  H.push(_composePiecesJointes.call(this, lParam));
  H.push(_composeSitesWeb.call(this, lParam));
  H.push(_composeRessKiosque.call(this, lParam));
  H.push(`</div>`);
  return H.join("");
}
function _composeTitre() {
  return this.moteurFormSaisie.composeFormText({
    id: this.ids.titre,
    model: "titre",
    label: GTraductions.getValeur("CahierDeTexte.titre"),
  });
}
function _composeDescription() {
  return this.moteurFormSaisie.composeFormContenuEditable({
    id: this.ids.description,
    model: "description",
    styleArea: "description.getStyleValeur",
    label: GTraductions.getValeur("CahierDeTexte.DescriptionTAF"),
  });
}
function _composeCategorie() {
  return this.moteurFormSaisie.composeSelecteur({
    id: this.instanceSelectCategorie.getNom(),
    label: GTraductions.getValeur("CahierDeTexte.categorie"),
  });
}
function _instancierSelectCategorie() {
  this.instanceSelectCategorie = this.moteurFormSaisie.instancierSelecteur(
    _evntSelectCategorie.bind(this),
    this,
    {
      avecBoutonsPrecedentSuivant: false,
      labelWAICellule: GTraductions.getValeur("CahierDeTexte.categorie"),
    },
  );
}
function _evntSelectCategorie(aParam) {
  this.data.categorie = aParam.element;
}
function _updateSelectCategorie() {
  this.moteurFormSaisie.updateSelecteur({
    liste: this.listeCategories,
    donnee: this.moteurCDT.estContenuAvecCategorie(this.data)
      ? this.moteurCDT.getCategorieDeContenu(this.data)
      : null,
    instanceSelect: this.instanceSelectCategorie,
  });
}
function _composeTheme() {
  return this.moteurFormSaisie.composeMultiSelecteurTheme({
    id: this.instanceMultiSelectTheme.getNom(),
    label: GTraductions.getValeur("Themes"),
  });
}
function _instancierMultiSelectTheme() {
  this.instanceMultiSelectTheme =
    this.moteurFormSaisie.instancierMultiSelecteurTheme(
      _evtCellMultiSelectionTheme.bind(this),
      this,
    );
}
function _evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
  if (aGenreBouton === 1) {
    this.data.ListeThemes = aListeSelections;
    this.data.setEtat(EGenreEtat.Modification);
  }
}
function _updateMultiSelectTheme() {
  this.instanceMultiSelectTheme.initialiser();
  this.moteurFormSaisie.updateMultiSelectTheme({
    instanceSelect: this.instanceMultiSelectTheme,
    liste: this.data.ListeThemes || new ObjetListeElements(),
    matiere: this.data.matiere,
    libelleCB: this.data.libelleCBTheme,
  });
}
function _getListeRessourcesPJ() {
  const lListeRessFichier = this.moteurCDT.getListeRessourcesDeGenre({
    data: this.data,
    genreRessource: EGenreDocumentJoint.Fichier,
    avecSaisie: this._options.avecSaisiePJ,
  });
  const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
    data: this.data,
    genreRessource: EGenreDocumentJoint.Cloud,
    avecSaisie: false,
  });
  return lListeRessFichier.add(lListeRessCloud);
}
function _composePiecesJointes() {
  return this.moteurFormSaisie.composeFormGestionRessources({
    label: GTraductions.getValeur("AjouterDesPiecesJointes"),
    listeRessources: _getListeRessourcesPJ.call(this),
    id: this.ids.pj,
    icon: "icon_piece_jointe",
    nodeGestion: "getNodeGestionPJ",
    nodeSupprRessource: "getNodeRemoveRessource",
    idListeRessources: this.ids.listePJ,
    avecSaisie: this._options.avecSaisiePJ,
  });
}
function _evntSurEditPJ() {
  if (this._options.avecSaisiePJ) {
    const lAvecCloud = GEtatUtilisateur.avecCloudDisponibles();
    UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes({
      instance: this,
      callbackChoixParmiFichiersExistants: () => {
        surEvenementChoixFichierParmiDocDejaInseres.call(this);
      },
      callbackChoixParmiLiensExistants: null,
      maxSizeNouvellePJ: GApplication.droits.get(
        TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
      ),
      avecUploadMultiple: true,
      callbackUploadNouvellePJ: (aParametresInput) => {
        if (
          aParametresInput &&
          aParametresInput.listeFichiers &&
          aParametresInput.listeFichiers.count() > 0
        ) {
          const lListePJContexte = this.data.ListePieceJointe;
          aParametresInput.listeFichiers.parcourir((aFichier) => {
            const lDocumentJoint = new ObjetElement(
              aFichier.getLibelle(),
              aFichier.getNumero(),
              aFichier.getGenre(),
            );
            lDocumentJoint.url = aFichier.url;
            lDocumentJoint.Fichier = aFichier;
            lDocumentJoint.idFichier = aFichier.idFichier;
            lDocumentJoint.nomOriginal = aFichier.nomOriginal;
            lDocumentJoint.file = aFichier.file;
            lDocumentJoint.setEtat(EGenreEtat.Creation);
            lListePJContexte.addElement(lDocumentJoint);
            this.listeDocumentsJoints.addElement(lDocumentJoint);
          });
          this.data.setEtat(EGenreEtat.Modification);
          this.data.listeFichiersFenetrePJ = lListePJContexte;
          _updateHtmlListeRessources.call(this, EGenreDocumentJoint.Fichier);
        }
      },
      callbackChoixDepuisCloud: lAvecCloud
        ? () => {
            UtilitaireGestionCloudEtPDF.ouvrirFenetreCloud().then(
              (aListeNouveauxDocs) => {
                this.data.ListePieceJointe.add(aListeNouveauxDocs);
                this.listeDocumentsJoints.add(aListeNouveauxDocs);
                this.data.setEtat(EGenreEtat.Modification);
                this.data.listeFichiersFenetrePJ = aListeNouveauxDocs;
                _updateHtmlListeRessources.call(
                  this,
                  EGenreDocumentJoint.Fichier,
                );
              },
            );
          }
        : null,
    });
  }
}
function surEvenementChoixFichierParmiDocDejaInseres() {
  this.moteurFormSaisie.openModaleSelectRessource({
    instance: this,
    element: this.data,
    genre: EGenreDocumentJoint.Fichier,
    genreRessourceDocJoint: EGenreRessource.DocumentJoint,
    listePiecesJointes: this.listeDocumentsJoints,
    listePJContexte: this.data.ListePieceJointe,
    genreFenetrePJ: EGenreFenetreDocumentJoint.CahierDeTextes,
    listePeriodes: this.listePeriodes,
    dateCoursDeb: this.dateCoursDeb,
    validation: function (aParamsFenetre, aListeFichiers, aAvecSaisie) {
      if (aAvecSaisie) {
        this.data.listeFichiersFenetrePJ = aListeFichiers;
      }
      _updateHtmlListeRessources.call(this, EGenreDocumentJoint.Fichier);
    }.bind(this),
  });
}
function _composeSitesWeb() {
  return this.moteurFormSaisie.composeFormGestionRessources({
    label: GTraductions.getValeur("CahierDeTexte.SitesWeb"),
    listeRessources: this.moteurCDT.getListeRessourcesDeGenre({
      data: this.data,
      genreRessource: EGenreDocumentJoint.Url,
      avecSaisie: this._options.avecSaisieSitesWeb,
    }),
    id: this.ids.sitesWeb,
    icon: "icon_link",
    nodeGestion: "getNodeGestionSiteWeb",
    nodeSupprRessource: "getNodeRemoveRessource",
    idListeRessources: this.ids.listeSitesWeb,
    avecSaisie: this._options.avecSaisieSitesWeb,
  });
}
function surEvenementChoixSiteParmiSitesDejaInseres() {
  this.moteurFormSaisie.openModaleSelectRessource({
    instance: this,
    titre: GTraductions.getValeur("selecteurPJ.siteInternet"),
    element: this.data,
    genre: EGenreDocumentJoint.Url,
    genreRessourceDocJoint: EGenreRessource.DocumentJoint,
    listePiecesJointes: this.listeDocumentsJoints,
    listePJContexte: this.data.ListePieceJointe,
    genreFenetrePJ: EGenreFenetreDocumentJoint.CahierDeTextes,
    listePeriodes: this.listePeriodes,
    dateCoursDeb: this.dateCoursDeb,
    validation: function (aParamsFenetre, aListeFichiers, aAvecSaisie) {
      if (aAvecSaisie) {
        _updateHtmlListeRessources.call(this, EGenreDocumentJoint.Url);
      }
    }.bind(this),
  });
}
function _evntSurRemoveRessource(aGenreRessource, aNumeroRessource) {
  if (
    (aGenreRessource !== EGenreDocumentJoint.Fichier ||
      this._options.avecSaisiePJ) &&
    (aGenreRessource !== EGenreDocumentJoint.Cloud ||
      this._options.avecCloud) &&
    (aGenreRessource !== EGenreDocumentJoint.Url ||
      this._options.avecSaisieSitesWeb)
  ) {
    this.moteurCDT.majDataSurRemoveRessource({
      data: this.data,
      numeroRessource: aNumeroRessource,
      genreRessource: aGenreRessource,
    });
    _updateHtmlListeRessources.call(this, aGenreRessource);
  }
}
function _updateHtmlListeRessources(aGenreRessource) {
  let lId, lListe, lAvecSaisie, lStrAucun;
  if (
    aGenreRessource === EGenreDocumentJoint.Fichier ||
    aGenreRessource === EGenreDocumentJoint.Cloud
  ) {
    lId = this.ids.listePJ;
    lListe = _getListeRessourcesPJ.call(this);
    lAvecSaisie = this._options.avecSaisiePJ;
    lStrAucun = GTraductions.getValeur("CahierDeTexte.AucunePJ");
  } else {
    lId = this.ids.listeSitesWeb;
    lListe = this.moteurCDT.getListeRessourcesDeGenre({
      data: this.data,
      genreRessource: aGenreRessource,
      avecSaisie: this._options.avecSaisieSitesWeb,
    });
    lAvecSaisie = this._options.avecSaisieSitesWeb;
    lStrAucun = GTraductions.getValeur("CahierDeTexte.AucunSite");
  }
  this.moteurFormSaisie.updateHtmlListeRessources({
    id: lId,
    listeRessources: lListe,
    nodeSupprRessource: "getNodeRemoveRessource",
    controleur: this.controleur,
    avecSaisie: lAvecSaisie,
    strAucun: lStrAucun,
  });
}
function _composeRessKiosque() {
  const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
    data: this.data,
    genreRessource: EGenreDocumentJoint.LienKiosque,
    avecSaisie: false,
  });
  if (lListeRessCloud.count() > 0) {
    return this.moteurFormSaisie.composeFormGestionRessources({
      label: GTraductions.getValeur("CahierDeTexte.Kiosques"),
      listeRessources: lListeRessCloud,
      id: this.ids.kiosque,
      icon: "icon_external_link",
      nodeGestion: "getNodeGestionKiosque",
      nodeSupprRessource: "getNodeRemoveRessource",
      idListeRessources: this.ids.listeKiosque,
      avecSaisie: false,
    });
  }
}
function _annulerEdition() {
  this.callback.appel({
    commande: EGenreEvntForm.annuler,
    data: this.donneeOriginale,
    estCreation: this.donnees.estCreation,
  });
}
module.exports = ObjetPanelEditionContenu;
