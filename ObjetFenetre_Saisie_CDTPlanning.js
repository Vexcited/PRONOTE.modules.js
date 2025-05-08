exports.ObjetFenetre_Saisie_CDTPlanning = void 0;
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const ObjetFenetre_PanierRessourceKiosque_1 = require("ObjetFenetre_PanierRessourceKiosque");
const InterfaceContenuCahierDeTextes_1 = require("InterfaceContenuCahierDeTextes");
const InterfaceTAFCahierDeTextes_1 = require("InterfaceTAFCahierDeTextes");
class ObjetFenetre_Saisie_CDTPlanning extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
    this.setOptionsFenetre({
      largeur: 800,
      avecTailleSelonContenu: true,
      hauteurTiny: 300,
      addParametresValidation: (aParams) => {
        if (this.donnees.surCreation && aParams.bouton.valider) {
          this._addElementCourantDansCDT();
        }
        return {
          element: this.donnees.contenu,
          listeCategories: this.donnees.listeCategories,
          avecSaisie: this.avecSaisie,
        };
      },
    });
    this.avecDocumentJoint = [];
    this.avecDocumentJoint[
      Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
    ] = this.applicationSco.droits.get(
      ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
    );
    this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Url] =
      this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
      );
    this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud] =
      this.etatUtilisateur.listeCloud.count() > 0;
    this.avecDocumentJoint[
      Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque
    ] = this.etatUtilisateur.avecKiosque();
    this.avecSaisie = false;
  }
  setDonnees(aParams) {
    this.donnees = Object.assign(
      {
        contenu: null,
        pourTAF: false,
        cdt: null,
        listeCategories: null,
        verrouille: true,
        cours: null,
        avecDocumentJoint: this.avecDocumentJoint,
        saisieCDT: null,
      },
      aParams,
    );
    this.donnees.surCreation =
      !this.donnees.contenu || this.donnees.contenu.estVide;
    const lListeBoutons = [];
    if (this.donnees.surCreation) {
      lListeBoutons.push(ObjetTraduction_1.GTraductions.getValeur("Annuler"));
    }
    lListeBoutons.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
      valider: true,
    });
    this.setOptionsFenetre({ listeBoutons: lListeBoutons });
    if (this.donnees.surCreation) {
      if (this.donnees.pourTAF) {
        this.donnees.contenu = new ObjetElement_1.ObjetElement("");
        this.donnees.contenu.Matiere = this.donnees.cours.Matiere;
        UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initTAF(
          this.donnees.contenu,
          this.donnees.saisieCDT.dateCoursSuivantTAF ||
            this.donnees.saisieCDT.DateTravailAFaire,
        );
        this.donnees.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
        this.donnees.contenu.estVide = true;
      } else {
        this.donnees.contenu =
          UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.createContenu();
      }
    }
    this._creerInstance();
    this.listeCategories = this.donnees.listeCategories;
    this.afficher('<div id="' + this.instanceContenu.getNom() + '"></div>');
    this.instanceContenu.initialiser();
    this._actualiserContenu();
    this.positionnerFenetre();
  }
  setEtatSaisie(aEtatSaisie) {
    if (aEtatSaisie) {
      this.avecSaisie = true;
    }
  }
  _addElementCourantDansCDT() {
    if (
      this.donnees.pourTAF &&
      !UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.estTAFVide(
        this.donnees.contenu,
      )
    ) {
      this.donnees.cdt.ListeTravailAFaire.addElement(this.donnees.contenu);
      this.avecSaisie = true;
    } else if (
      !this.donnees.pourTAF &&
      !UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.estContenuVide(
        this.donnees.contenu,
      )
    ) {
      this.donnees.cdt.listeContenus.addElement(this.donnees.contenu);
      this.avecSaisie = true;
    }
  }
  _evenement(
    aGenreEvenement,
    aElement,
    aGenreDocJoint,
    aDonneesSupplementaires,
  ) {
    switch (aGenreEvenement) {
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.supprimer:
        this.applicationSco
          .getMessage()
          .afficher({
            type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
            message: ObjetTraduction_1.GTraductions.getValeur(
              "CahierDeTexte.msgConfirmationSupprimerContenu",
            ),
          })
          .then((aGenreAction) => {
            if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
              this.avecSaisie = true;
              aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initContenu(aElement);
              this._actualiserContenu();
            }
          });
        break;
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.fenetreCategorie:
        UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetreEditionCategorie(
          {
            instance: this,
            listeCategories: this.listeCategories,
            callback: (aParams) => {
              let lAvecSaisie = aParams.avecSaisie;
              if (lAvecSaisie) {
                this.listeCategories = aParams.listeCategories;
                this.donnees.listeCategories = this.listeCategories;
              }
              if (aParams.valider) {
                const lElement = this.listeCategories.getElementParNumero(
                  aParams.numeroCategorie,
                );
                if (
                  lElement &&
                  aElement.categorie.getNumero() !== lElement.getNumero()
                ) {
                  lAvecSaisie = true;
                  aElement.categorie = lElement;
                  aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                }
              }
              if (lAvecSaisie) {
                this.avecSaisie = true;
                this._actualiserContenu();
              }
            },
          },
        );
        break;
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionTitre:
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionCategorie:
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionParcoursEducatif:
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionDescriptif:
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.suppressionDocument:
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionTheme:
        this.avecSaisie = true;
        break;
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint: {
        let lListeFichiers;
        if (
          aGenreDocJoint === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
        ) {
          const lNouvelleUrl = aDonneesSupplementaires;
          lListeFichiers =
            new ObjetListeElements_1.ObjetListeElements().addElement(
              lNouvelleUrl,
            );
        } else {
          const lElementFichierUploade = aDonneesSupplementaires;
          lListeFichiers = lElementFichierUploade
            ? lElementFichierUploade.listeFichiers
            : null;
        }
        let lAvecSaisie = false;
        const lPJsCloud =
          UtilitaireSelecFile_1.UtilitaireSelecFile.extraireListeFichiersCloudsPartage(
            lListeFichiers,
          );
        if (lListeFichiers && lListeFichiers.count() > 0) {
          lAvecSaisie = true;
          const lListeFichiersFenetrePJ =
            new ObjetListeElements_1.ObjetListeElements();
          aElement.listeFichiersFenetrePJ = lListeFichiersFenetrePJ;
          lListeFichiers.parcourir((aFichier) => {
            lListeFichiersFenetrePJ.addElement(aFichier);
            aFichier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            const lNouveauDocJoint = new ObjetElement_1.ObjetElement(
              aFichier.getLibelle(),
            );
            lNouveauDocJoint.Genre = aGenreDocJoint;
            lNouveauDocJoint.Fichier = aFichier;
            lNouveauDocJoint.url =
              lNouveauDocJoint.getLibelle() || aFichier.url;
            lNouveauDocJoint.idFichier = aFichier.idFichier;
            lNouveauDocJoint.nomOriginal = aFichier.nomOriginal;
            lNouveauDocJoint.file = aFichier.file;
            lNouveauDocJoint.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            this.donnees.saisieCDT.ListeDocumentsJoints.addElement(
              lNouveauDocJoint,
            );
            aElement.ListePieceJointe.addElement(lNouveauDocJoint);
          });
        }
        if (lPJsCloud.count() > 0) {
          lAvecSaisie = true;
          lPJsCloud.parcourir((aFichier) => {
            aElement.ListePieceJointe.addElement(aFichier);
            aElement.estVide = false;
            this.donnees.saisieCDT.ListeDocumentsJoints.add(aFichier);
          });
        }
        if (lAvecSaisie) {
          aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          this.avecSaisie = true;
          this._actualiserContenu();
        }
        break;
      }
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.editionDocumentJoint:
        if (
          aGenreDocJoint !== Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
        ) {
          UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetrePJ({
            instance: this,
            element: aElement,
            genrePJ: aGenreDocJoint,
            nodeFocus: null,
            listePJTot: this.donnees.saisieCDT.ListeDocumentsJoints,
            listePJContexte: aElement.ListePieceJointe,
            dateCours: this.donnees.cours.date,
            validation: (aParamsFenetre, aListeFichiers, aAvecSaisie) => {
              if (aAvecSaisie) {
                this.avecSaisie = true;
                if (
                  aGenreDocJoint ===
                  Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
                ) {
                  aElement.listeFichiersFenetrePJ = aListeFichiers;
                }
                this._actualiserContenu();
              }
            },
          });
        } else {
          const lTypeServiceCloud = aDonneesSupplementaires;
          UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirFichierCloud({
            instance: this,
            element: aElement,
            numeroService: lTypeServiceCloud.getGenre(),
            listeDocumentsJoints: this.donnees.saisieCDT.ListeDocumentsJoints,
          }).then(() => {
            this.avecSaisie = true;
            this._actualiserContenu();
          });
        }
        break;
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.ajoutQCM:
        UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirQCM({
          instance: this,
          donneesSupplementaire: { contexteAppel: "contenu" },
          element: aElement,
          pourTAF: false,
        }).then((aParams) => {
          if (aParams.valider) {
            this.avecSaisie = true;
            this._actualiserContenu();
          }
        });
        break;
      case EGenreEvenementContenuCahierDeTextes_1
        .EGenreEvenementContenuCahierDeTextes.ajouterLienKiosque:
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
          {
            pere: this,
            evenement: (aParams) => {
              if (
                aParams.genreBouton === 1 &&
                !!aParams.selection &&
                aParams.selection.count() > 0
              ) {
                for (let i = 0; i < aParams.selection.count(); i++) {
                  const lElement = aParams.selection.get(i);
                  if (lElement && lElement.ressource) {
                    const lLienKiosque = new ObjetElement_1.ObjetElement(
                      lElement.ressource.getLibelle(),
                      null,
                      Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque,
                    );
                    lLienKiosque.ressource = lElement.ressource;
                    lLienKiosque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
                    if (
                      !UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ(
                        lLienKiosque,
                        aElement.ListePieceJointe,
                      )
                    ) {
                      this.donnees.saisieCDT.ListeDocumentsJoints.addElement(
                        lLienKiosque,
                      );
                      aElement.ListePieceJointe.addElement(lLienKiosque);
                      aElement.estVide = false;
                      aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                      this.avecSaisie = true;
                      this._actualiserContenu();
                    }
                  }
                }
              }
            },
          },
          { avecMultiSelection: true },
        ).afficherFenetre();
        break;
      default:
    }
  }
  _actualiserContenu() {
    if (!this.donnees.pourTAF) {
      this.instanceContenu.actualiserContenu(
        this.donnees.contenu,
        this.donnees.verrouille,
        this.avecDocumentJoint,
        false,
        Object.assign(
          UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.getOptionsContenuMenuMagique(
            { cdt: this.donnees.cdt, listeCDTsPrecedents: null },
          ),
          { uniquementSupprimerSurContenuVide: true },
        ),
      );
    } else {
      this.instanceContenu.actualiserTAF();
    }
  }
  _creerInstance() {
    if (!this.donnees.pourTAF) {
      this.instanceContenu = ObjetIdentite_1.Identite.creerInstance(
        InterfaceContenuCahierDeTextes_1.InterfaceContenuCahierDeTextes,
        { pere: this, evenement: this._evenement },
      );
    } else {
      this.instanceContenu = ObjetIdentite_1.Identite.creerInstance(
        InterfaceTAFCahierDeTextes_1.InterfaceTAFCahierDeTextes,
        { pere: this, evenement: this._evenement },
      );
      this.instanceContenu.setParams(this.donnees);
    }
    const lParamsAffichage = {
      avecBoutonEditeurHtml: false,
      autoresize: false,
      height: [this.optionsFenetre.hauteurTiny],
      position: [undefined],
    };
    this.instanceContenu.setParametresAffichage(lParamsAffichage);
  }
}
exports.ObjetFenetre_Saisie_CDTPlanning = ObjetFenetre_Saisie_CDTPlanning;
