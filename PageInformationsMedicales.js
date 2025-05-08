const { GHtml } = require("ObjetHtml.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_InfoMedicale } = require("ObjetFenetre_InfoMedicale.js");
const {
  UtilitairePageDonneesPersonnelles,
} = require("UtilitairePageDonneesPersonnelles.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EListeIds } = require("Enumere_DonneesPersonnelles.js");
const {
  ObjetRequeteSaisieCompteEnfant,
} = require("ObjetRequeteSaisieCompteEnfant.js");
const { MethodesObjet } = require("MethodesObjet.js");
class PageInformationsMedicales extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = {
      infosMedicales: null,
      listeRestrictionsAlimentaires: null,
    };
    this.mangeALaCantine = false;
    this.donneesRecues = false;
    this.idNom = "ZoneEditNomMedecin";
    this.idCommentaire = "ZoneEditCommentaire";
    this.IdPremierElement = this.idNom;
  }
  construireInstances() {}
  valider() {
    const lInformationsMedicales = this.getDossierMedicalModifie();
    const lInformationsAllergies = this.getAllergiesModifie();
    this.setEtatSaisie(false);
    new ObjetRequeteSaisieCompteEnfant(
      this,
      this.controleur.composeListeAllergies,
    ).lancerRequete({
      informationsMedicales: lInformationsMedicales,
      allergies: lInformationsAllergies,
      restrictionsAlimentaires: this.donnees.listeRestrictionsAlimentaires,
    });
  }
  getControleur(aInstance) {
    const lControleurUtilitairePageDonneesPerso =
      UtilitairePageDonneesPersonnelles.getControleur(aInstance);
    Object.assign(lControleurUtilitairePageDonneesPerso, {
      btnAjouterAllergie: {
        event() {
          aInstance.ouvrirFenetreChoixAllergie();
        },
      },
      composeListeAllergies() {
        let lListeAllergiesActives = null;
        const lListeAllergies = aInstance.getListeAllergies();
        if (lListeAllergies) {
          lListeAllergiesActives = lListeAllergies.getListeElements((D) => {
            return (
              (D.getActif() === true &&
                D.getEtat() !== EGenreEtat.Modification) ||
              (D.getEtat() === EGenreEtat.Modification &&
                D.getActif() === false)
            );
          });
        }
        const H = [];
        const lAvecCroix = aInstance.allergiesModifiables;
        if (lListeAllergiesActives) {
          lListeAllergiesActives.parcourir((aAllergie) => {
            const lIEModel = lAvecCroix
              ? `btnSupprimerAllergie('${aAllergie.getNumero()}')`
              : "";
            H.push(
              `<ie-chips ie-model="${lIEModel}" class="m-all">${aAllergie.getLibelle()}</ie-chips>`,
            );
          });
        }
        return H.join("");
      },
      btnSupprimerAllergie: {
        eventBtn(aNumeroAllergie) {
          const lListeAllergies = aInstance.getListeAllergies();
          let lAuMoinsUneAllergie = false;
          if (lListeAllergies) {
            let lAllergie =
              lListeAllergies.getElementParNumero(aNumeroAllergie);
            if (lAllergie) {
              lAllergie.setActif(false);
              lAllergie.setEtat(EGenreEtat.Modification);
              lListeAllergies.parcourir((aAllergene) => {
                if (aAllergene.getActif() === true) {
                  lAuMoinsUneAllergie = true;
                }
              });
              if (lAuMoinsUneAllergie) {
                aInstance.donnees.allergies.autoriseConsultationAllergies = true;
              }
              aInstance.callback.appel();
            }
          }
        },
      },
      avecZoneRestrictionsAlimentaires() {
        return (
          !!aInstance.mangeALaCantine &&
          aInstance.donnees.listeRestrictionsAlimentairesSauvegarde
        );
      },
      avecZoneAllergies() {
        return aInstance.donnees && aInstance.donnees.allergies;
      },
      btnAjouterRestrictionAlimentaire: {
        event() {
          aInstance.ouvrirFenetreChoixRestrictionAlimentaire();
        },
      },
      composeListeRestrictionsAlim() {
        let lListeRestrictionsActives = null;
        if (aInstance.donnees.listeRestrictionsAlimentaires) {
          lListeRestrictionsActives =
            aInstance.donnees.listeRestrictionsAlimentaires.getListeElements(
              (D) => {
                return D.getActif();
              },
            );
        }
        const H = [];
        const lAvecCroix = aInstance.regimesAlimentairesModifiables;
        if (lListeRestrictionsActives) {
          lListeRestrictionsActives.parcourir((aRestrictionAlim) => {
            const lIEModel = lAvecCroix
              ? `btnSupprimerRestrictionAlim('${aRestrictionAlim.getNumero()}')`
              : "";
            H.push(
              `<ie-chips ie-model="${lIEModel}" class="m-all">${aRestrictionAlim.getLibelle()}</ie-chips>`,
            );
          });
        }
        return H.join("");
      },
      btnSupprimerRestrictionAlim: {
        eventBtn(aNumeroRestrictionAlim) {
          if (aInstance.donnees.listeRestrictionsAlimentaires) {
            let lRestrictionAlim =
              aInstance.donnees.listeRestrictionsAlimentaires.getElementParNumero(
                aNumeroRestrictionAlim,
              );
            if (lRestrictionAlim) {
              lRestrictionAlim.setActif(false);
              lRestrictionAlim.setEtat(EGenreEtat.Modification);
              aInstance.callback.appel();
            }
          }
        },
      },
    });
    return $.extend(
      true,
      super.getControleur(aInstance),
      lControleurUtilitairePageDonneesPerso,
    );
  }
  setDonnees(aParam) {
    this.donnees.infosMedicales = aParam.infosMedicales;
    this.donnees.listeRestrictionsAlimentaires = MethodesObjet.dupliquer(
      aParam.restrictionsAlimentaires,
    );
    this.donnees.listeRestrictionsAlimentairesSauvegarde =
      aParam.restrictionsAlimentaires;
    this.mangeALaCantine = aParam.mangeALaCantine;
    this.donnees.allergies = MethodesObjet.dupliquer(aParam.allergies);
    this.donnees.allergiesSauvegarde = aParam.allergies;
    this.allergiesModifiables = aParam.allergiesModifiables;
    this.regimesAlimentairesModifiables = aParam.regimesAlimentairesModifiables;
    this.largeur = 500;
    this.donneesRecues = true;
    this.hauteur = {};
    this.hauteur.infoRestrictions = 140;
    this.lignesCommentaire = 5;
    this.afficher(this.construireAffichage());
  }
  getListeAllergies() {
    return !!this.donnees.allergies && !!this.donnees.allergies.listeAllergenes
      ? this.donnees.allergies.listeAllergenes
      : null;
  }
  construireAffichage() {
    if (this.donneesRecues) {
      return this.composePage();
    }
    return "";
  }
  composePage() {
    const lHTML = [];
    const lEstPrimaire = GApplication.estPrimaire;
    const lDoitEtreAffiche = !!this.donnees.infosMedicales;
    const lAvecAllergies = this.allergiesModifiables;
    const lAvecRegimes = this.regimesAlimentairesModifiables;
    if (lEstPrimaire) {
      lHTML.push(`<h3>${GTraductions.getValeur("InfosMedicales.Titre")}</h3>`);
    }
    if (lDoitEtreAffiche) {
      lHTML.push(`<div class="item-conteneur">`);
      if (!lEstPrimaire) {
        lHTML.push(
          `<h2>${GTraductions.getValeur("InfosMedicales.Titre")}</h2>`,
        );
      }
      lHTML.push(
        `<div class="valeur-contain ${GApplication.estPrimaire ? "sansMarges" : ""}">`,
      );
      lHTML.push(UtilitairePageDonneesPersonnelles.composeMedecin());
      lHTML.push("</div>");
      lHTML.push("</div>");
      if (lEstPrimaire && this.donnees.allergies) {
        lHTML.push(
          `<h3>${GTraductions.getValeur("InfosMedicales.AllergiesAutres")}</h3>`,
        );
      }
      lHTML.push(`<div class="item-conteneur" ie-if="avecZoneAllergies">`);
      if (!lEstPrimaire) {
        lHTML.push(
          `<h2 id="asLabelIdCommentaire">${GTraductions.getValeur("InfosMedicales.AllergiesAutres")}</h2>`,
        );
      }
      lHTML.push(
        `<div class="valeur-contain ${GApplication.estPrimaire ? "sansMarges" : ""}">`,
      );
      lHTML.push(_composeAutresAllergies.call(this));
      lHTML.push("</div>");
      lHTML.push("</div>");
    }
    lHTML.push(
      `<div class="item-conteneur ${GApplication.estPrimaire ? "sansMarges" : ""}" ie-if="avecZoneAllergies">`,
    );
    lHTML.push(
      `<h2>${GTraductions.getValeur("InfosMedicales.AllergiesRepertoriees")}</h2>`,
    );
    lHTML.push(`<div class="valeur-contain">`);
    lHTML.push(_composeAllergies.call(this, lAvecAllergies));
    lHTML.push("</div>");
    lHTML.push("</div>");
    lHTML.push(
      `<div class="item-conteneur" ie-if="avecZoneRestrictionsAlimentaires">\n                  <h2>${GTraductions.getValeur("PageCompte.PratiquesAlimentaires")}</h2>\n                  <div class="valeur-contain">`,
    );
    lHTML.push(_composeRestrictionsAlimentaires.call(this, lAvecRegimes));
    lHTML.push("</div>");
    lHTML.push("</div>");
    return lHTML.join("");
  }
  ouvrirFenetreChoixAllergie() {
    const lFenetreChoixAllergie = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_InfoMedicale,
      {
        pere: this,
        evenement: function (aBouton) {
          if (aBouton === 1) {
            this.donnees.allergies.listeAllergenes =
              this.copieTravailListeAllergies;
            let lAuMoinsUneAllergie = false;
            this.donnees.allergies.listeAllergenes.parcourir((aAllergene) => {
              if (aAllergene.getActif() === true) {
                lAuMoinsUneAllergie = true;
              }
            });
            if (lAuMoinsUneAllergie) {
              this.donnees.allergies.autoriseConsultationAllergies = true;
            }
            this.callback.appel();
          }
        },
        initialiser: function (aInstance) {
          aInstance.setParametresInfoMedicale(
            GTraductions.getValeur("InfosMedicales.Allergies"),
          );
          aInstance.setOptionsFenetre({
            titre: GTraductions.getValeur(
              "InfosMedicales.SaisieAllergiesRepertoriees",
            ),
            largeur: 450,
            hauteur: 600,
            listeBoutons: [
              GTraductions.getValeur("Annuler"),
              GTraductions.getValeur("Valider"),
            ],
          });
        },
      },
    );
    this.copieTravailListeAllergies = MethodesObjet.dupliquer(
      this.getListeAllergies(),
    );
    lFenetreChoixAllergie.setDonnees(this.copieTravailListeAllergies, true);
  }
  ouvrirFenetreChoixRestrictionAlimentaire() {
    const lFenetreChoixRestrictionAlimentaire =
      ObjetFenetre.creerInstanceFenetre(ObjetFenetre_InfoMedicale, {
        pere: this,
        evenement: function (aBouton) {
          if (aBouton === 1) {
            this.donnees.listeRestrictionsAlimentaires =
              this.copieTravailListeRestrictions;
            this.callback.appel();
          }
        },
        initialiser: function (aInstance) {
          aInstance.setParametresInfoMedicale(
            GTraductions.getValeur("InfosMedicales.Restrictions"),
          );
          aInstance.setOptionsFenetre({
            titre: GTraductions.getValeur("InfosMedicales.SaisieRestrictions"),
            largeur: 300,
            hauteur: 300,
            listeBoutons: [
              GTraductions.getValeur("Annuler"),
              GTraductions.getValeur("Valider"),
            ],
          });
        },
      });
    this.copieTravailListeRestrictions = MethodesObjet.dupliquer(
      this.donnees.listeRestrictionsAlimentaires,
    );
    lFenetreChoixRestrictionAlimentaire.setDonnees(
      this.copieTravailListeRestrictions,
    );
  }
  setValidation(aID) {
    switch (aID) {
      case this.idNom:
        this.donnees.infosMedicales.nomMedecin = GHtml.getValue(this.idNom);
        break;
      case this.idCommentaire:
        this.donnees.infosMedicales.commentaire = GHtml.getValue(
          this.idCommentaire,
        );
        break;
      default:
        break;
    }
    this.callback.appel();
  }
  getDossierMedicalModifie() {
    return this.donnees.infosMedicales;
  }
  getAllergiesModifie() {
    return this.donnees.allergies;
  }
  getAlimentationModifie() {
    return this.donnees.listeRestrictionsAlimentaires;
  }
}
function _composeAllergies(aAvecSaisie) {
  const lHTML = [];
  lHTML.push(
    `<p class="m-top m-bottom-l">${GTraductions.getValeur("infosperso.infosImperieusesTitre")}</p>`,
  );
  lHTML.push(
    `<p class="m-top m-bottom-l">${GTraductions.getValeur("infosperso.infosImperieusesAllergiesComplement")}</p>`,
  );
  if (aAvecSaisie) {
    lHTML.push(
      `<ie-bouton ie-model="btnAjouterAllergie" class="themeBoutonNeutre" title="${GTraductions.getValeur("InfosMedicales.AjouterAllergie")}">${GTraductions.getValeur("Ajouter")}</ie-bouton>`,
    );
  }
  lHTML.push('<div class="liste-chips" ie-html="composeListeAllergies"></div>');
  lHTML.push(
    '<div class="switch-contain">',
    UtilitairePageDonneesPersonnelles.composerSwitch(
      EListeIds.cbAutoriserAllergies,
      GTraductions.getValeur("infosperso.infosAllergiesConsultables"),
      "autoriseConsultationAllergies",
    ),
    "</div>",
  );
  return lHTML.join("");
}
function _composeRestrictionsAlimentaires(aAvecSaisie) {
  const lHTML = [];
  if (aAvecSaisie) {
    lHTML.push(
      `<ie-bouton ie-model="btnAjouterRestrictionAlimentaire" class="themeBoutonNeutre" title="${GTraductions.getValeur("InfosMedicales.AjouterRestriction")}">${GTraductions.getValeur("Ajouter")}</ie-bouton>`,
    );
  }
  lHTML.push(
    '<div class="liste-chips" ie-html="composeListeRestrictionsAlim"></div>',
  );
  return lHTML.join("");
}
function _composeAutresAllergies() {
  const lHTML = [];
  const lLignes =
    this.lignesCommentaire +
    (this.mangeALaCantine
      ? 0
      : Math.floor(this.hauteur.infoRestrictions / (2 * 12)));
  lHTML.push(
    `<div class="item-contain">\n  <textarea maxlength="1000" aria-labelledby="asLabelIdCommentaire" tabindex="0" id="${this.idCommentaire}" name="${this.idCommentaire}" onchange="${this.Nom}.setValidation (id)" class="round-style" rows="${lLignes}" style="width:100%;height:${this.mangeALaCantine ? 50 : 120}px;">\n  ${this.donnees.infosMedicales.commentaire ? this.donnees.infosMedicales.commentaire : ``}</textarea>\n  </div>`,
  );
  lHTML.push(
    `<p class="m-top m-bottom">${GTraductions.getValeur("infosperso.infosMedicalesTitre")}</p>`,
  );
  lHTML.push(
    '<div class="switch-contain">',
    UtilitairePageDonneesPersonnelles.composerSwitch(
      EListeIds.cbExposerDossierMedical,
      GTraductions.getValeur("infosperso.infosMedicalesConsultables"),
      "estConsultable",
    ),
    "</div>",
  );
  return lHTML.join("");
}
module.exports = { PageInformationsMedicales };
