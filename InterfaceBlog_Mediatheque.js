exports.InterfaceBlog_Mediatheque = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const InterfaceMediatheque_1 = require("InterfaceMediatheque");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteMediathequeBlog_1 = require("ObjetRequeteMediathequeBlog");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_Mediatheques_1 = require("DonneesListe_Mediatheques");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionDossierMediatheque_1 = require("ObjetFenetre_EditionDossierMediatheque");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetFenetre_EditionUrl_1 = require("ObjetFenetre_EditionUrl");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieBlogMediatheque_1 = require("ObjetRequeteSaisieBlogMediatheque");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
class InterfaceBlog_Mediatheque extends ObjetInterfacePageCP_1.InterfacePageCP {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
    this.listeClouds = new ObjetListeElements_1.ObjetListeElements();
  }
  avecDeplacementDocuments() {
    return false;
  }
  construireInstances() {
    this.identListeMediatheques = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementListeMediatheques.bind(this),
      this.initialiserListeMediatheques,
    );
    this.identInterfaceMediatheque = this.add(
      InterfaceMediatheque_1.InterfaceMediatheque,
      this.evenementPageMediatheque.bind(this),
      this.initialiserPageMediatheque,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.avecBandeau = true;
    if (IE.estMobile) {
      this.AddSurZone = [];
      this.AddSurZone.push({
        html: IE.jsx.str("ie-btnselecteur", {
          "ie-model": "btnSelecteurBlogMobile",
          "aria-label": ObjetTraduction_1.GTraductions.getValeur(
            "blog.SelectionnezUnBlog",
          ),
        }),
      });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnSelecteurBlogMobile: {
        event() {
          aInstance.afficherFenetreListeMediatheques();
        },
        getLibelle() {
          let lStrBlogSelectionne = "";
          if (aInstance.mediathequeOuDossierSelectionne) {
            lStrBlogSelectionne =
              aInstance.mediathequeOuDossierSelectionne.getLibelle();
          }
          return (
            lStrBlogSelectionne ||
            ObjetTraduction_1.GTraductions.getValeur(
              "blog.toutesLesMediatheques",
            )
          );
        },
      },
    });
  }
  afficherFenetreListeMediatheques() {
    const lListeMediathequesAvecTous =
      this.getListeMediathequesAvecElementTous();
    const lListeMediathequesAvecDossiers =
      this.formatterListeMediathequesPourListe(lListeMediathequesAvecTous);
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_Liste_1.ObjetFenetre_Liste,
      {
        pere: this,
        evenement: (aNumeroBouton, aIndiceMediathequeSelectionnee) => {
          if (aNumeroBouton === 1) {
            let lMediathequeOuDossierSelectionne = null;
            if (aIndiceMediathequeSelectionnee > 0) {
              lMediathequeOuDossierSelectionne =
                lListeMediathequesAvecDossiers.get(
                  aIndiceMediathequeSelectionnee,
                );
            }
            this.setElementMediathequeSelectionne(
              lMediathequeOuDossierSelectionne,
            );
          }
        },
        initialiser(aFenetre) {
          aFenetre.setOptionsFenetre({
            titre: ObjetTraduction_1.GTraductions.getValeur("blog.ChoixDuBlog"),
          });
          aFenetre.paramsListe = {
            optionsListe: {
              labelWAI:
                ObjetTraduction_1.GTraductions.getValeur("blog.ChoixDuBlog"),
              skin: ObjetListe_1.ObjetListe.skin.flatDesign,
            },
          };
        },
      },
    );
    lFenetre.setDonnees(
      new DonneesListe_Mediatheques_1.DonneesListe_Mediatheques(
        lListeMediathequesAvecDossiers,
      ).setOptions({
        avecEvnt_Selection: true,
        avecTri: false,
        flatDesignMinimal: true,
        avecBoutonActionLigne: false,
      }),
      true,
    );
  }
  recupererDonnees() {
    new ObjetRequeteMediathequeBlog_1.ObjetRequeteMediathequeBlog(
      this,
      this._actionSurRecupererDonnees.bind(this),
    ).lancerRequete();
  }
  _actionSurRecupererDonnees(aDonnees) {
    this.listeMediatheques = aDonnees.listeMediatheques;
    const lListeMediathequesAvecTous =
      this.getListeMediathequesAvecElementTous();
    const lListeMediathequesFormatee = this.formatterListeMediathequesPourListe(
      lListeMediathequesAvecTous,
    );
    let lIndiceSelectionListe = 0;
    if (this.mediathequeOuDossierSelectionne) {
      if (lListeMediathequesFormatee) {
        lIndiceSelectionListe = lListeMediathequesFormatee.getIndiceParElement(
          this.mediathequeOuDossierSelectionne,
        );
      }
    }
    if (!lIndiceSelectionListe) {
      lIndiceSelectionListe = 0;
    }
    if (!IE.estMobile) {
      const lDonneesListe =
        new DonneesListe_Mediatheques_1.DonneesListe_Mediatheques(
          lListeMediathequesFormatee,
          {
            callbackAjouterDossier: this.creerDossierAMediatheque.bind(this),
            callbackRenommerDossier: this.renommerDossierMediatheque.bind(this),
            callbackSupprimerDossier:
              this.supprimerDossierMediatheque.bind(this),
            callbackDropDocument: !this.avecDeplacementDocuments()
              ? null
              : this.callbackDropDocumentSurMediathequeOuDossier.bind(this),
          },
        );
      this.getInstance(this.identListeMediatheques).setDonnees(
        lDonneesListe,
        lIndiceSelectionListe,
      );
    } else {
      const lMediathequeOuDossierASelectionner = lListeMediathequesFormatee.get(
        lIndiceSelectionListe,
      );
      this.setElementMediathequeSelectionne(lMediathequeOuDossierASelectionner);
    }
  }
  creerDossierAMediatheque(aMediatheque) {
    const lDossierMediatheque =
      this.moteur.creerDossierMediatheque(aMediatheque);
    this.ouvrirFenetreEditionDossierMediatheque(lDossierMediatheque);
  }
  renommerDossierMediatheque(aDossier) {
    this.ouvrirFenetreEditionDossierMediatheque(aDossier);
  }
  ouvrirFenetreEditionDossierMediatheque(aDossier) {
    if (aDossier) {
      const lEstCreationDossier =
        aDossier.getEtat() === Enumere_Etat_1.EGenreEtat.Creation;
      const lTitreFenetre = lEstCreationDossier
        ? ObjetTraduction_1.GTraductions.getValeur(
            "blog.creerCategorieMediatheque",
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "blog.creerCategorieMediatheque",
          );
      const lFenetreEditionDossierMediatheque =
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_EditionDossierMediatheque_1.ObjetFenetre_EditionDossierMediatheque,
          {
            pere: this,
            evenement(aNumeroBouton, aCallbackFenetre) {
              if (aNumeroBouton === 1) {
                const lDossierModifie = aCallbackFenetre.dossierMediatheque;
                this.lancerRequeteSaisieDossierMediatheque(lDossierModifie);
              }
            },
            initialiser(aInstance) {
              aInstance.setOptionsFenetre({
                titre: lTitreFenetre,
                listeBoutons: [
                  ObjetTraduction_1.GTraductions.getValeur("Fermer"),
                  {
                    theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
                    libelle:
                      ObjetTraduction_1.GTraductions.getValeur("blog.creer"),
                  },
                ],
              });
            },
          },
        );
      lFenetreEditionDossierMediatheque.setDonnees(aDossier);
    }
  }
  supprimerDossierMediatheque(aDossier) {
    if (aDossier) {
      aDossier.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
      this.lancerRequeteSaisieDossierMediatheque(aDossier);
    }
  }
  callbackDropDocumentSurMediathequeOuDossier(
    aDocumentDeplace,
    aMediathequeOuDossier,
  ) {
    let lMediathequeDestination = null;
    let lDossierDestination = null;
    if (
      aMediathequeOuDossier.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.Mediatheque
    ) {
      lMediathequeDestination = aMediathequeOuDossier;
    } else {
      lDossierDestination = aMediathequeOuDossier;
      lMediathequeDestination = lDossierDestination.mediatheque;
    }
    new ObjetRequeteSaisieBlogMediatheque_1.ObjetRequeteSaisieBlogMediatheque(
      this,
    )
      .lancerRequete(
        ObjetRequeteSaisieBlogMediatheque_1.TypeSaisieMediatheque
          .DeplacerDocuments,
        {
          listeDocuments: new ObjetListeElements_1.ObjetListeElements().add(
            aDocumentDeplace,
          ),
          mediatheque: lMediathequeDestination,
          dossierMediatheque: lDossierDestination,
        },
      )
      .then(() => {
        this.recupererDonnees();
      });
  }
  formatterListeMediathequesPourListe(aListeMediatheques) {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lObjMediatheque of aListeMediatheques) {
      lListe.add(lObjMediatheque);
      if (
        lObjMediatheque.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.Mediatheque
      ) {
        const lMediatheque = lObjMediatheque;
        if (
          lMediatheque.listeDossiers &&
          lMediatheque.listeDossiers.count() > 0
        ) {
          for (const lDossier of lMediatheque.listeDossiers) {
            lDossier.pere = lMediatheque;
            lListe.add(lDossier);
          }
          lMediatheque.estUnDeploiement = true;
        }
      }
    }
    return lListe;
  }
  getListeMediathequesAvecElementTous() {
    const lListeBlogsDeListe = new ObjetListeElements_1.ObjetListeElements();
    lListeBlogsDeListe.add(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur(
          "blog.mediatheque.toutAfficher",
        ),
      ),
    );
    if (this.listeMediatheques) {
      lListeBlogsDeListe.add(this.listeMediatheques);
    }
    return lListeBlogsDeListe;
  }
  getMediathequeDeMediathequeOuDossierSelectionne(aMediathequeOuDossier) {
    let lMediathequeCorrespondante = null;
    if (aMediathequeOuDossier) {
      if (
        aMediathequeOuDossier.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierMediatheque
      ) {
        lMediathequeCorrespondante = aMediathequeOuDossier.mediatheque;
      } else {
        lMediathequeCorrespondante = aMediathequeOuDossier;
      }
    }
    return lMediathequeCorrespondante;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<section class="InterfaceBlogMediatheque">');
    if (!IE.estMobile) {
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str("div", {
            class: "ObjetListeMediatheques",
            id: this.getInstance(this.identListeMediatheques).getNom(),
          }),
        ),
      );
    }
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", {
          class: "ContentPrincipal",
          id: this.getInstance(this.identInterfaceMediatheque).getNom(),
        }),
      ),
    );
    H.push("</section>");
    return H.join("");
  }
  valider() {}
  surResizeInterface() {}
  getListeTousDocuments(aListeMediatheques) {
    const lListeDocuments = new ObjetListeElements_1.ObjetListeElements();
    if (aListeMediatheques) {
      for (const lMediatheque of aListeMediatheques) {
        lListeDocuments.add(lMediatheque.listeDocuments);
      }
    }
    return lListeDocuments;
  }
  getListeDocumentsDeMediathequeOuDossier(aMediathequeOuDossier) {
    const lListeDocuments = new ObjetListeElements_1.ObjetListeElements();
    if (aMediathequeOuDossier) {
      const lMediathequeCorrespondante =
        this.getMediathequeDeMediathequeOuDossierSelectionne(
          aMediathequeOuDossier,
        );
      const lListeDocumentsDeMediatheque =
        lMediathequeCorrespondante.listeDocuments;
      if (
        aMediathequeOuDossier.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierMediatheque
      ) {
        const lDossier = aMediathequeOuDossier;
        for (const lDoc of lListeDocumentsDeMediatheque) {
          if (
            lDoc.dossierMediatheque &&
            lDoc.dossierMediatheque.getNumero() === lDossier.getNumero()
          ) {
            lListeDocuments.add(lDoc);
          }
        }
      } else {
        lListeDocuments.add(lListeDocumentsDeMediatheque);
      }
    }
    return lListeDocuments;
  }
  initialiserListeMediatheques(aInstance) {
    aInstance.setOptionsListe({
      skin: ObjetListe_1.ObjetListe.skin.flatDesign,
      avecOmbreDroite: true,
    });
  }
  evenementListeMediatheques(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
        this.setElementMediathequeSelectionne(aParametres.article);
        break;
    }
  }
  setElementMediathequeSelectionne(aMediatheque) {
    this.mediathequeOuDossierSelectionne = aMediatheque;
    if (aMediatheque && !aMediatheque.existeNumero()) {
      this.mediathequeOuDossierSelectionne = null;
    }
    let lListeDocuments = null;
    if (!this.mediathequeOuDossierSelectionne) {
      lListeDocuments = this.getListeTousDocuments(this.listeMediatheques);
    } else {
      lListeDocuments = this.getListeDocumentsDeMediathequeOuDossier(
        this.mediathequeOuDossierSelectionne,
      );
    }
    this.getInstance(this.identInterfaceMediatheque).setOptions({
      avecEdition: !!this.mediathequeOuDossierSelectionne,
    });
    this.getInstance(this.identInterfaceMediatheque).setDonnees({
      listeMediatheques: this.listeMediatheques,
      listeDocuments: lListeDocuments,
    });
  }
  initialiserPageMediatheque(aInstance) {
    aInstance.setOptions({
      msgMediathequeVide: ObjetTraduction_1.GTraductions.getValeur(
        "blog.aucuneDonneeDansMediatheque",
      ),
      avecDragDrop: !this.avecDeplacementDocuments() ? false : !IE.estMobile,
      avecVignettesPetitFormat: false,
      avecEdition: true,
      avecDeplacementDocuments: this.avecDeplacementDocuments(),
    });
  }
  evenementPageMediatheque(aGenreEvenement, aParametres) {
    switch (aGenreEvenement) {
      case InterfaceMediatheque_1.InterfaceMediatheque.GenreCallback
        .SurClicBoutonNouveau: {
        const lMediathequeOuDossierSelectionne =
          this.mediathequeOuDossierSelectionne;
        if (lMediathequeOuDossierSelectionne) {
          this.afficherFenetreCreationNouveauDocument(
            lMediathequeOuDossierSelectionne,
          );
        } else {
          this.afficherMenuContextuelChoixMediatheque(
            this.listeMediatheques,
            this.afficherFenetreCreationNouveauDocument.bind(this),
          );
        }
        break;
      }
      case InterfaceMediatheque_1.InterfaceMediatheque.GenreCallback
        .DropNouveauFichier: {
        const lMediathequeOuDossierSelectionne =
          this.mediathequeOuDossierSelectionne;
        if (lMediathequeOuDossierSelectionne) {
          this._addFiles(
            lMediathequeOuDossierSelectionne,
            aParametres.parametresSelecFile,
          );
        } else {
          this.afficherMenuContextuelChoixMediatheque(
            this.listeMediatheques,
            this._addFiles.bind(
              this,
              lMediathequeOuDossierSelectionne,
              aParametres.parametresSelecFile,
            ),
          );
        }
        break;
      }
      case InterfaceMediatheque_1.InterfaceMediatheque.GenreCallback
        .SuppressionDocuments: {
        this.lancerRequeteSaisieSuppressionDocuments(
          aParametres.listeDocuments,
        );
        break;
      }
      case InterfaceMediatheque_1.InterfaceMediatheque.GenreCallback
        .dropDeDocSurDossier:
        this.getInstance(this.identInterfaceMediatheque)._saisie(
          new ObjetListeElements_1.ObjetListeElements(),
        );
        break;
      case InterfaceMediatheque_1.InterfaceMediatheque.GenreCallback
        .apresSaisie:
        this.recupererDonnees();
        break;
    }
  }
  afficherMenuContextuelChoixMediatheque(
    aListeMediatheques,
    aCallbackSurChoixMediatheque,
  ) {
    if (
      aListeMediatheques &&
      aListeMediatheques.count() > 0 &&
      aCallbackSurChoixMediatheque
    ) {
      ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
        pere: this,
        initCommandes: (aMenu) => {
          aMenu.addTitre(
            ObjetTraduction_1.GTraductions.getValeur("blog.DansLeBlog") + " :",
          );
          for (const lMediatheque of aListeMediatheques) {
            aMenu.add(lMediatheque.getLibelle(), true, () => {
              aCallbackSurChoixMediatheque(lMediatheque);
            });
          }
        },
      });
    }
  }
  afficherFenetreCreationNouveauDocument(aMediathequeOuDossier) {
    const lActions = [];
    if (this.moteur.avecGestionAppareilPhoto()) {
      lActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "blog.billet.prendrePhoto",
        ),
        icon: "icon_camera",
        event: (aParams) => {
          this._addFiles(aMediathequeOuDossier, aParams);
        },
        optionsSelecFile: {
          title: "",
          maxFiles: 0,
          maxSize: this.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
          ),
          genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
          acceptDragDrop: false,
          capture: "environment",
          accept: "image/*",
        },
        selecFile: true,
        class: "bg-util-marron-claire",
      });
      lActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "blog.billet.ouvrirGalerie",
        ),
        icon: "icon_picture",
        event: (aParams) => {
          this._addFiles(aMediathequeOuDossier, aParams);
        },
        optionsSelecFile: {
          title: "",
          maxFiles: 0,
          maxSize: this.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
          ),
          genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
          multiple: true,
          acceptDragDrop: false,
          accept: "image/*",
        },
        selecFile: true,
        class: "bg-util-marron-claire",
      });
    }
    const lAvecCloud = GEtatUtilisateur.listeCloud.count() > 0;
    lActions.push({
      libelle: IE.estMobile
        ? ObjetTraduction_1.GTraductions.getValeur(
            "blog.billet.ouvrirMesDocuments",
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "blog.billet.depuisMonPoste",
          ),
      icon: "icon_folder_open",
      event: (aParams) => {
        this._addFiles(aMediathequeOuDossier, aParams);
      },
      optionsSelecFile: {
        title: "",
        maxFiles: 0,
        maxSize: this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
        ),
        genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
        multiple: true,
        acceptDragDrop: false,
        avecTransformationFlux_versCloud: lAvecCloud,
      },
      selecFile: true,
      class: "bg-util-marron-claire",
    });
    if (lAvecCloud) {
      const lThis = this;
      lActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "blog.billet.ouvrirCloud",
        ),
        icon: "icon_cloud",
        event() {
          lThis.ouvrirFenetreChoixListeCloud(aMediathequeOuDossier);
        },
        class: "bg-util-marron-claire",
      });
    }
    lActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "blog.billet.nouveauLien",
      ),
      icon: "icon_globe mix-icon_plus",
      event: () => {
        this._ouvrirFenetreEditionSiteWeb(aMediathequeOuDossier);
      },
      class: "bg-util-bleu-claire",
    });
    ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
      lActions,
      { pere: this },
    );
  }
  _addFiles(aMediathequeOuDossier, aParams) {
    const lListeFichiers = aParams.listeFichiers;
    const lMediathequeCorrespondante =
      this.getMediathequeDeMediathequeOuDossierSelectionne(
        aMediathequeOuDossier,
      );
    const lListeFichiersClouds =
      UtilitaireSelecFile_1.UtilitaireSelecFile.extraireListeFichiersCloudsPartage(
        lListeFichiers,
      );
    if (lListeFichiers && lListeFichiers.count() > 0) {
      for (const lFichier of lListeFichiers) {
        if (lFichier) {
          lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
          const lDocumentMediatheque = ObjetElement_1.ObjetElement.create({
            Numero: lFichier.getNumero(),
          });
          lDocumentMediatheque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
          lDocumentMediatheque.documentCasier = lFichier;
          if (
            aMediathequeOuDossier.getGenre() ===
            Enumere_Ressource_1.EGenreRessource.DossierMediatheque
          ) {
            lDocumentMediatheque.dossierMediatheque = aMediathequeOuDossier;
          }
          lMediathequeCorrespondante.listeDocuments.add(lDocumentMediatheque);
          lMediathequeCorrespondante.setEtat(
            Enumere_Etat_1.EGenreEtat.Modification,
          );
        }
      }
    }
    if (lListeFichiersClouds.count() > 0) {
      lListeFichiersClouds.parcourir((aFichier) => {
        this._ajoutFichierCloud({
          eltCloud: aFichier,
          listeDocumentsJoints: this.listeClouds,
        });
      });
    }
    this.lancerRequeteSaisieDocument(
      lMediathequeCorrespondante,
      lListeFichiers,
    );
  }
  ouvrirFenetreChoixListeCloud(aMediathequeOuDossier) {
    const lThis = this;
    let lParams = {
      callbaskEvenement: (aLigne) => {
        if (aLigne >= 0) {
          const lService = GEtatUtilisateur.listeCloud.get(aLigne);
          lThis.moteur.choisirFichierCloud({
            instance: lThis,
            element: null,
            numeroService: lService.getGenre(),
            listeDocumentsJoints: lThis.listeClouds,
            evntSelectFichierCloud: lThis._ajoutFichierCloud.bind(lThis),
            evntValidFichierCloud: (aParam) => {
              const lMediathequeCorrespondante =
                this.getMediathequeDeMediathequeOuDossierSelectionne(
                  aMediathequeOuDossier,
                );
              if (
                aMediathequeOuDossier.getGenre() ===
                Enumere_Ressource_1.EGenreRessource.DossierMediatheque
              ) {
                const lDossier = aMediathequeOuDossier;
                if (aParam.listeDocumentsJoints) {
                  for (const lDocJoint of aParam.listeDocumentsJoints) {
                    lDocJoint.dossierMediatheque = lDossier;
                  }
                }
              }
              this.lancerRequeteSaisieDocument(
                lMediathequeCorrespondante,
                new ObjetListeElements_1.ObjetListeElements(),
                aParam.listeDocumentsJoints,
              );
            },
          });
        }
      },
      modeGestion:
        UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
          .Cloud,
    };
    UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
      lParams,
    );
  }
  _ouvrirFenetreEditionSiteWeb(aMediathequeOuDossier) {
    const lFenetreEditionSiteWeb =
      ObjetFenetre_EditionUrl_1.ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl(
        {
          pere: this,
          evenement: (aNumeroBouton, aParams) => {
            if (aNumeroBouton === 1 && !!aParams.donnee) {
              const lDocCasier = ObjetElement_1.ObjetElement.create({
                Libelle: aParams.donnee.libelle,
                Genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
                url: aParams.donnee.url,
              });
              const lDocumentMediatheque = ObjetElement_1.ObjetElement.create({
                Numero: ObjetElement_1.ObjetElement.getNumeroCreation(),
                Libelle: aParams.donnee.libelle,
              });
              lDocumentMediatheque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
              lDocumentMediatheque.documentCasier = lDocCasier;
              if (
                aMediathequeOuDossier.getGenre() ===
                Enumere_Ressource_1.EGenreRessource.DossierMediatheque
              ) {
                lDocumentMediatheque.dossierMediatheque = aMediathequeOuDossier;
              }
              const lMediathequeCorrespondante =
                this.getMediathequeDeMediathequeOuDossierSelectionne(
                  aMediathequeOuDossier,
                );
              lMediathequeCorrespondante.listeDocuments.add(
                lDocumentMediatheque,
              );
              lMediathequeCorrespondante.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
              this.lancerRequeteSaisieDocument(
                lMediathequeCorrespondante,
                new ObjetListeElements_1.ObjetListeElements(),
              );
            }
          },
        },
      );
    lFenetreEditionSiteWeb.setOptionsFenetreEditionUrl({
      avecCommentaire: false,
    });
    lFenetreEditionSiteWeb.setDonnees({ libelle: "", url: "http://" });
  }
  _ajoutFichierCloud(aParam) {
    const lDocMediatheque = this._getNewDocMediatheque({ libelle: "" });
    const lDocCasier = this._ajouterRessource({
      ressource: aParam.eltCloud,
      genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
      docMediatheque: lDocMediatheque,
    });
    lDocMediatheque.setLibelle(lDocCasier.getLibelle());
    aParam.listeDocumentsJoints.addElement(lDocCasier);
  }
  _ajouterRessource(aParam) {
    const lDocMediatheque = aParam.docMediatheque;
    const lDocCasier = aParam.ressource;
    lDocCasier.Genre = aParam.genreRessource;
    lDocCasier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    lDocMediatheque.documentCasier = lDocCasier;
    return lDocCasier;
  }
  _getNewDocMediatheque(aParam) {
    const lDocMediatheque = ObjetElement_1.ObjetElement.create({
      Numero: ObjetElement_1.ObjetElement.getNumeroCreation(),
      Libelle: aParam.libelle,
    });
    lDocMediatheque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    return lDocMediatheque;
  }
  lancerRequeteSaisieDocument(aMediatheque, aListeFichiers, aListeCloud) {
    const lParamUpload = { listeFichiers: null, listeDJCloud: null };
    if (aListeFichiers && aListeFichiers.count() > 0) {
      lParamUpload.listeFichiers = aListeFichiers;
    }
    if (aListeCloud && aListeCloud.count() > 0) {
      lParamUpload.listeDJCloud = aListeCloud;
    }
    new ObjetRequeteSaisieBlogMediatheque_1.ObjetRequeteSaisieBlogMediatheque(
      this,
    )
      .addUpload(lParamUpload)
      .lancerRequete(
        ObjetRequeteSaisieBlogMediatheque_1.TypeSaisieMediatheque
          .AjouterDocuments,
        { mediatheque: aMediatheque },
      )
      .catch(() => {
        IE.log.addLog("Erreur saisie médiathèque blog");
      })
      .then(() => {
        this.recupererDonnees();
      });
  }
  lancerRequeteSaisieSuppressionDocuments(aListeDocuments) {
    new ObjetRequeteSaisieBlogMediatheque_1.ObjetRequeteSaisieBlogMediatheque(
      this,
    )
      .lancerRequete(
        ObjetRequeteSaisieBlogMediatheque_1.TypeSaisieMediatheque
          .SupprimerDocuments,
        { listeDocuments: aListeDocuments },
      )
      .then(() => {
        this.recupererDonnees();
      });
  }
  lancerRequeteSaisieDossierMediatheque(aDossierMediatheque) {
    new ObjetRequeteSaisieBlogMediatheque_1.ObjetRequeteSaisieBlogMediatheque(
      this,
    )
      .lancerRequete(
        ObjetRequeteSaisieBlogMediatheque_1.TypeSaisieMediatheque.SaisieDossier,
        { dossierMediatheque: aDossierMediatheque },
      )
      .then(() => {
        this.recupererDonnees();
      });
  }
}
exports.InterfaceBlog_Mediatheque = InterfaceBlog_Mediatheque;
