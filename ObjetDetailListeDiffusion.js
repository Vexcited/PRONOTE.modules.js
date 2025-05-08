const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EEvent } = require("Enumere_Event.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenreInternetIndividu } = require("TypeGenreInternetIndividu.js");
const { tag } = require("tag.js");
const { ObjetMenuCtxMixte } = require("ObjetMenuCtxMixte.js");
const { ETypeAffEnModeMixte } = require("Enumere_MenuCtxModeMixte.js");
const { DonneesListe_Diffusion } = require("DonneesListe_Diffusion.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class ObjetDetailListeDiffusion extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.initParametres();
    const lId = GUID.getId();
    this.idMessage = lId + "_vide";
    if (this.avecEventResizeNavigateur()) {
      this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
    }
  }
  surPreResize() {
    if (!this.diffusion) {
      return;
    }
    this.preActualisation();
  }
  surPostResize() {
    this.actualiserAffichage();
  }
  initParametres() {
    this._parametres = {
      nonEditable: false,
      genresRessources: [
        EGenreRessource.Eleve,
        EGenreRessource.Responsable,
        EGenreRessource.MaitreDeStage,
        EGenreRessource.Enseignant,
        EGenreRessource.Personnel,
        EGenreRessource.InspecteurPedagogique,
      ],
      largeur: 400,
      largeurTitrePlus: 8,
      hauteurLigneTitre: 18,
      hauteurLigneContenu: 15,
      couleurFondListe: GCouleur.blanc,
      couleurFond: null,
      couleur: GCouleur,
      callbackAjoutRessource: null,
      callbackSuppressionRessource: null,
    };
  }
  setParametres(aParametres) {
    $.extend(this._parametres, aParametres);
  }
  setDonnees(aDonnees) {
    this.diffusion = aDonnees;
    _actualiser.bind(this)(true);
  }
  actualiserAffichage(aAvecActualisationListes) {
    _actualiser.bind(this)(aAvecActualisationListes);
  }
  preActualisation() {
    GHtml.setHtml(this.Nom, "&nbsp;", { instance: this });
  }
  construireAffichage() {
    if (!this.diffusion) {
      return tag(
        "div",
        { id: this.idMessage, class: "message-vide" },
        tag(
          "div",
          { class: "message" },
          GTraductions.getValeur("listeDiffusion.selectionnezListe"),
        ),
        tag("div", { class: ["Image_No_Data"], "aria-hidden": "true" }),
      );
    }
    const H = [];
    H.push(this.composeDetailListeDiffusion());
    H.push(
      `<section ie-identite="getIdentListeIndividus" class="fluid-bloc"></section>`,
    );
    return H.join("");
  }
  composeDetailListeDiffusion() {
    const H = [];
    H.push(
      tag(
        "div",
        { class: ["odld_sectiondetail"] },
        tag(
          "div",
          { class: ["odld_detail"] },
          tag(
            "div",
            { class: ["odld_titre"] },
            tag(
              "div",
              { class: ["libelle"], "ie-ellipsis": true },
              this.diffusion.getLibelle(),
            ),
            tag("div", { class: ["auteur"] }, this.diffusion.libelleAuteur),
          ),
          this.diffusion.estAuteur
            ? tag("div", {
                class: ["odld_commande"],
                "ie-identite": tag.funcAttr("getCtxMixteBandeauDroite"),
              })
            : "",
        ),
        tag("div", { class: ["odld_partage"], "ie-html": "getInfoPartage" }),
      ),
    );
    return H.join("");
  }
  addCommandesMenuContextuel(aParams) {
    if (aParams.diffusion && aParams.diffusion.estAuteur) {
      if (GApplication.droits.get(TypeDroits.listeDiffusion.avecPublication)) {
        const lTitre = aParams.diffusion.estPublique
          ? GTraductions.getValeur("listeDiffusion.nepaspartager")
          : GTraductions.getValeur("listeDiffusion.partager");
        const lAction = aParams.diffusion.estPublique
          ? DonneesListe_Diffusion.genreAction.departager
          : DonneesListe_Diffusion.genreAction.partager;
        const lIcon = aParams.diffusion.estPublique
          ? "icon_retirer_bibliotheque"
          : "icon_sondage_bibliotheque";
        aParams.menu.add(
          lTitre,
          true,
          (aItemMenu) => {
            if (aItemMenu && aItemMenu.data) {
              aItemMenu.data.estPublique = !aItemMenu.data.estPublique;
              aItemMenu.data.setEtat(EGenreEtat.Modification);
              this.callback.appel(aItemMenu);
            }
          },
          {
            icon: lIcon + " i-small",
            Numero: lAction,
            typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
            data: aParams.diffusion,
          },
        );
      }
      aParams.menu.add(
        GTraductions.getValeur("listeDiffusion.renommer"),
        true,
        (aItemMenu) => {
          this.callback.appel(aItemMenu);
        },
        {
          icon: "icon_pencil",
          Numero: DonneesListe_Diffusion.genreAction.renommer,
          typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
          data: aParams.diffusion,
        },
      );
      aParams.menu.add(
        GTraductions.getValeur("listeDiffusion.ajouterpublic"),
        true,
        (aItemMenu) => {
          this.addPublic(aItemMenu);
        },
        {
          icon: "icon_plus_fin",
          Numero: DonneesListe_Diffusion.genreAction.ajouterpublic,
          typeAffEnModeMixte: ETypeAffEnModeMixte.ellipsis,
          data: aParams.diffusion,
        },
      );
    }
  }
  addPublic(aParams) {
    const lListeRessources = new ObjetListeElements();
    let lPos = 0;
    this._parametres.genresRessources.forEach((aGenre) => {
      lPos++;
      const lListeDeGenre = _getListeParGenre.call(this, aGenre);
      const lLibelle = `${_getLibelleDeGenre(aGenre)} (${lListeDeGenre.getNbrElementsExistes()})`;
      const lElement = new ObjetElement(lLibelle, null, aGenre, lPos);
      lListeRessources.addElement(lElement);
    });
    const lDonneesListe = new DonneesListe_RessourcesPourDiffusion(
      lListeRessources,
    );
    ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_Liste,
      {
        pere: this,
        evenement: (aGenreBouton, aSelection) => {
          if (aGenreBouton !== 1) {
            return;
          }
          if (MethodesObjet.isNumber(aSelection)) {
            const lSelectionRessource = lListeRessources.get(aSelection);
            Object.assign(aParams, {
              genreRessource: lSelectionRessource.getGenre(),
            });
            this.eventAddPublic(aParams);
          }
        },
        initialiser: function (aInstance) {
          aInstance.setOptionsFenetre({
            largeur: 340,
            hauteur: null,
            heightMax_mobile: false,
            listeBoutons: [GTraductions.getValeur("Fermer")],
          });
          aInstance.paramsListe = {
            skin: ObjetListe.skin.flatDesign,
            editable: false,
            optionsListe: {
              hauteurAdapteContenu: true,
              hauteurMaxAdapteContenu: Math.min(GNavigateur.ecranH - 200, 600),
              colonnes: [{ taille: "100%" }],
              skin: ObjetListe.skin.flatDesign,
              avecLigneCreation: false,
              avecEvnt_SelectionClick: true,
            },
          };
        },
      },
      { identConservationCoordonnees: "fenetre_ressource_listediffusion" },
    ).setDonnees(lDonneesListe, true);
  }
  eventAddPublic(aParams) {
    this.callback.appel(aParams);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInfoPartage: function () {
        if (
          aInstance &&
          aInstance.diffusion &&
          aInstance.diffusion.estPublique
        ) {
          const lTexte = IE.estMobile
            ? GTraductions.getValeur("listeDiffusion.hintPartageMobile")
            : GTraductions.getValeur("listeDiffusion.hintpartage");
          return (
            tag("i", {
              class: "icon_sondage_bibliotheque",
              "aria-hidden": "true",
            }) + tag("span", { class: "hint_partage" }, lTexte)
          );
        }
        return "";
      },
      getIdentListeIndividus() {
        return {
          class: ObjetListe,
          pere: aInstance,
          init: function (aInstanceListe) {
            aInstanceListe.setOptionsListe({
              colonnes: [{ taille: "100%" }],
              skin: ObjetListe.skin.flatDesign,
              forcerScrollV_mobile: true,
            });
            aInstance.identListeIndividus = aInstanceListe;
          },
          start: function (aInstanceListe) {
            aInstanceListe.setOptionsListe({
              avecLigneCreation:
                aInstance.diffusion && aInstance.diffusion.estAuteur,
              titreCreation: GTraductions.getValeur(
                "listeDiffusion.ajouterpublic",
              ),
              estBoutonCreationPiedFlottant_mobile: false,
            });
            const lListeIndividusGenre = new ObjetListeElements();
            let I = 0;
            aInstance._parametres.genresRessources.forEach((aGenre) => {
              const lElement = new ObjetElement(_getLibelleDeGenre(aGenre));
              const lListeIndividus = _getListeParGenre.call(aInstance, aGenre);
              const lElementFils = new ObjetElement();
              lElement.nbrIndividus = lListeIndividus.count();
              lElementFils.listeIndividus = lListeIndividus;
              lElementFils.pere = lElement;
              lElement.estUnDeploiement = lListeIndividus.count();
              lElement.estDeploye = false;
              lElement.Position = I++;
              lElementFils.Position = I++;
              lListeIndividusGenre.add(lElement);
              lListeIndividusGenre.add(lElementFils);
            });
            aInstanceListe.setDonnees(
              new DonneesListe_ListeIndividusDiffusion(lListeIndividusGenre),
            );
          },
          evenement: function (aParametres) {
            switch (aParametres.genreEvenement) {
              case EGenreEvenementListe.Creation: {
                const lItem = new ObjetElement(
                  "",
                  DonneesListe_Diffusion.genreAction.ajouterpublic,
                  -1,
                );
                lItem.data = aInstance.diffusion;
                aInstance.addPublic(lItem);
                break;
              }
              default:
                break;
            }
          },
          destroy: function () {
            aInstance.identListeIndividus = null;
          },
        };
      },
      getCtxMixteBandeauDroite: function () {
        return {
          class: ObjetMenuCtxMixte,
          pere: aInstance,
          init: function (aMenuCtxMixte) {
            aInstance.menuCtxMixteBandeauDroite = aMenuCtxMixte;
            aMenuCtxMixte.setOptions({
              callbackAddCommandes: function (aMenu) {
                aInstance.addCommandesMenuContextuel({
                  diffusion: aInstance.diffusion,
                  menu: aMenu,
                });
              },
            });
          },
          destroy: function () {
            aInstance.menuCtxMixteBandeauDroite = null;
          },
        };
      },
      cbResponsables: {
        getValue: function () {
          return this.instance.diffusion &&
            this.instance.diffusion.genresPublicEntite
            ? this.instance.diffusion.genresPublicEntite.contains(
                TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
              ) ||
                this.instance.diffusion.genresPublicEntite.contains(
                  TypeGenreInternetIndividu.InternetIndividu_Parent,
                )
            : false;
        },
        setValue: function (aValue) {
          const lExists1 = this.instance.diffusion.genresPublicEntite.contains(
            TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
          );
          const lExists2 = this.instance.diffusion.genresPublicEntite.contains(
            TypeGenreInternetIndividu.InternetIndividu_Parent,
          );
          if (aValue) {
            if (!lExists1 && !lExists2) {
              this.instance.diffusion.genresPublicEntite.add(
                TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
              );
            }
          } else {
            if (lExists1) {
              this.instance.diffusion.genresPublicEntite.remove(
                TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
              );
            }
            if (lExists2) {
              this.instance.diffusion.genresPublicEntite.remove(
                TypeGenreInternetIndividu.InternetIndividu_Parent,
              );
            }
          }
          this.instance.diffusion.setEtat(EGenreEtat.Modification);
          this.instance.setEtatSaisie(true);
        },
      },
      rbResponsablesGenre: {
        getValue: function (aGenre) {
          return this.instance.diffusion &&
            this.instance.diffusion.genresPublicEntite
            ? this.instance.diffusion.genresPublicEntite.contains(aGenre)
            : false;
        },
        setValue: function (aGenre) {
          const lExists =
            this.instance.diffusion.genresPublicEntite.contains(aGenre);
          const lGenre =
            aGenre === TypeGenreInternetIndividu.InternetIndividu_ParentEleve
              ? TypeGenreInternetIndividu.InternetIndividu_Parent
              : TypeGenreInternetIndividu.InternetIndividu_ParentEleve;
          if (!lExists) {
            this.instance.diffusion.genresPublicEntite.add(aGenre);
            this.instance.diffusion.genresPublicEntite.remove(lGenre);
            this.instance.diffusion.setEtat(EGenreEtat.Modification);
            this.instance.setEtatSaisie(true);
          }
        },
        getDisabled: function () {
          return (
            !this.instance.diffusion ||
            (!this.instance.diffusion.genresPublicEntite.contains(
              TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
            ) &&
              !this.instance.diffusion.genresPublicEntite.contains(
                TypeGenreInternetIndividu.InternetIndividu_Parent,
              ))
          );
        },
      },
    });
  }
}
function _getListes() {
  const lListes = {
    eleve: new ObjetListeElements(),
    responsable: new ObjetListeElements(),
    maitreDeStage: new ObjetListeElements(),
    enseignant: new ObjetListeElements(),
    personnel: new ObjetListeElements(),
    inspecteur: new ObjetListeElements(),
    classe: new ObjetListeElements(),
    groupe: new ObjetListeElements(),
  };
  if (this.diffusion) {
    this.diffusion.listePublicIndividu.parcourir((aElement) => {
      if (
        aElement.existe() &&
        this._parametres.genresRessources.includes(aElement.getGenre())
      ) {
        switch (aElement.getGenre()) {
          case EGenreRessource.Eleve:
            lListes.eleve.addElement(aElement);
            break;
          case EGenreRessource.Responsable:
            lListes.responsable.addElement(aElement);
            break;
          case EGenreRessource.MaitreDeStage:
            lListes.maitreDeStage.addElement(aElement);
            break;
          case EGenreRessource.Enseignant:
            lListes.enseignant.addElement(aElement);
            break;
          case EGenreRessource.Personnel:
            lListes.personnel.addElement(aElement);
            break;
          case EGenreRessource.InspecteurPedagogique:
            lListes.inspecteur.addElement(aElement);
            break;
          default:
            break;
        }
      }
    });
  }
  return lListes;
}
function _actualiser(aAvecActualisationListes) {
  if (aAvecActualisationListes) {
    this.listes = _getListes.call(this);
  }
  this.afficher();
}
function _getLibelleDeGenre(aGenre) {
  switch (aGenre) {
    case EGenreRessource.Eleve:
      return GTraductions.getValeur("actualites.Eleves");
    case EGenreRessource.Responsable:
      return GTraductions.getValeur("actualites.Responsables");
    case EGenreRessource.MaitreDeStage:
      return GTraductions.getValeur("actualites.MaitresDeStage");
    case EGenreRessource.Enseignant:
      return GTraductions.getValeur("actualites.Professeurs");
    case EGenreRessource.Personnel:
      return GTraductions.getValeur("actualites.Personnels");
    case EGenreRessource.InspecteurPedagogique:
      return GTraductions.getValeur("actualites.Inspecteurs");
    default:
      break;
  }
  return "";
}
function _getListeParGenre(aGenre) {
  switch (aGenre) {
    case EGenreRessource.Classe:
      return this.listes.classe;
    case EGenreRessource.Groupe:
      return this.listes.groupe;
    case EGenreRessource.Eleve:
      return this.listes.eleve;
    case EGenreRessource.Responsable:
      return this.listes.responsable;
    case EGenreRessource.MaitreDeStage:
      return this.listes.maitreDeStage;
    case EGenreRessource.Enseignant:
      return this.listes.enseignant;
    case EGenreRessource.Personnel:
      return this.listes.personnel;
    case EGenreRessource.InspecteurPedagogique:
      return this.listes.inspecteur;
    default:
      return;
  }
}
class DonneesListe_ListeIndividusDiffusion extends ObjetDonneesListeFlatDesign {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      avecSelection: false,
      avecFusionLignePereFils: true,
      avecBoutonActionLigne: false,
    });
  }
  getTitreZonePrincipale(aParams) {
    return !aParams.article.pere
      ? aParams.article.getLibelle() +
          ' <span class="odld_strNumber">(' +
          aParams.article.nbrIndividus +
          ")</span>"
      : "";
  }
  getInfosSuppZonePrincipale(aParams) {
    const H = [];
    if (aParams.article.pere) {
      if (aParams.article.listeIndividus.count()) {
        H.push('<ul class="odld_listePublic browser-default">');
        aParams.article.listeIndividus.parcourir((aIndividu) => {
          H.push("<li>", aIndividu.getLibelle(), "</li>");
        });
        H.push("</ul>");
      }
    }
    return H.join("");
  }
  desactiverIndentationParente() {
    return true;
  }
}
class DonneesListe_RessourcesPourDiffusion extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecBoutonActionLigne: false,
      avecEvnt_SelectionClick: true,
      avecEvnt_SelectionDblClick: true,
    });
  }
}
module.exports = { ObjetDetailListeDiffusion };
