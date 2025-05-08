const { GTraductions } = require("ObjetTraduction.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GChaine } = require("ObjetChaine.js");
const {
  ObjetRequeteAssistantSaisie,
} = require("ObjetRequeteAssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const {
  ObjetRequeteSaisieAssistantSaisie,
} = require("ObjetRequeteSaisieAssistantSaisie.js");
class ObjetMoteurAssistantSaisie {
  constructor() {
    this.moteurPdB = new ObjetMoteurPiedDeBulletin();
  }
  avecAssistantSaisie(aParam) {
    if (aParam.estCtxApprGenerale === true) {
      return GApplication.droits.get(TypeDroits.assistantSaisieAppreciations);
    }
    if (aParam.estCtxPied === true) {
      return this.avecAssistantSaisiePdB(aParam);
    }
    switch (aParam.typeReleveBulletin) {
      case TypeReleveBulletin.BulletinNotes:
      case TypeReleveBulletin.ReleveDeNotes:
      case TypeReleveBulletin.BulletinCompetences:
      case TypeReleveBulletin.AppreciationsBulletinParEleve:
      case TypeReleveBulletin.AppreciationsBulletinProfesseur:
      case TypeReleveBulletin.AppreciationsReleveProfesseur:
        return GApplication.droits.get(TypeDroits.assistantSaisieAppreciations);
      case TypeReleveBulletin.LivretScolaire:
        return (
          GApplication.droits.get(TypeDroits.assistantSaisieAppreciations) &&
          (GEtatUtilisateur.getGenreOnglet() ===
            EGenreOnglet.LivretScolaire_Appreciations ||
            (GEtatUtilisateur.getGenreOnglet() ===
              EGenreOnglet.LivretScolaire_Fiche &&
              !GEtatUtilisateur.estModeAccessible())) &&
          GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
        );
      case TypeReleveBulletin.AvisProfesseur:
      case TypeReleveBulletin.AvisParcoursup:
        return false;
      default:
    }
  }
  avecAssistantSaisiePdB(aParam) {
    if (this.moteurPdB.estAppreciationGenerale(aParam)) {
      return aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes;
    } else if (
      this.moteurPdB.estAppreciationCPE(aParam) ||
      this.moteurPdB.estAppreciationConseilDeClasse(aParam)
    ) {
      if (this.moteurPdB.estMention(aParam)) {
        return false;
      } else {
        if (
          aParam.typeReleveBulletin === TypeReleveBulletin.ReleveCompetences
        ) {
          return false;
        } else {
          return (
            aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes ||
            aParam.contexte !== TypeContexteBulletin.CB_Classe
          );
        }
      }
    }
    return true;
  }
  avecAssistantSaisieActif(aParam) {
    return (
      this.avecAssistantSaisie(aParam) && GEtatUtilisateur.assistantSaisieActif
    );
  }
  getTitleBoutonAssistantSaisie() {
    return GEtatUtilisateur.assistantSaisieActif
      ? GTraductions.getValeur("Appreciations.DesactiverAssistantSaisie")
      : GTraductions.getValeur("Appreciations.ActiverAssistantSaisie");
  }
  evntBtnAssistant(aParam) {
    GEtatUtilisateur.inverserEtatAssistantSaisie();
    aParam.instanceListe.actualiser(true);
    if (
      aParam.instancePied !== null &&
      aParam.instancePied !== undefined &&
      aParam.instancePied.evenementSurAssistant
    ) {
      aParam.instancePied.evenementSurAssistant();
    }
  }
  initialiserFenetreAssistantSaisie(aInstance) {
    aInstance.setOptionsFenetre({
      largeur: 700,
      hauteur: 400,
      modale: true,
      avecScroll: false,
    });
  }
  getListeTypesAppreciations(aParam) {
    if (this.avecAssistantSaisie(aParam)) {
      new ObjetRequeteAssistantSaisie(this, (aListeTypesAppreciations) => {
        if (aParam && aParam.clbck) {
          aParam.clbck(aListeTypesAppreciations);
        }
      }).lancerRequete();
    } else {
      if (aParam && aParam.clbck) {
        aParam.clbck(new ObjetListeElements());
      }
    }
  }
  evenementOuvrirAssistantSaisie(aParam) {
    const lFenetre = aParam.instanceFenetreAssistantSaisie;
    const lParam = { tailleMaxAppreciation: aParam.tailleMaxAppreciation };
    if (
      aParam.rangAppreciations !== null &&
      aParam.rangAppreciations !== undefined
    ) {
      $.extend(lParam, { rangAppreciations: aParam.rangAppreciations });
    }
    const lAvecEtatSaisie =
      aParam.avecEtatSaisie !== null && aParam.avecEtatSaisie !== undefined
        ? aParam.avecEtatSaisie
        : true;
    $.extend(lParam, { avecEtatSaisie: lAvecEtatSaisie });
    lFenetre.setParametres(lParam);
    const lListeElementsTypeAppreciation = new ObjetListeElements();
    for (let i = 0, lNbr = aParam.tabTypeAppreciation.length; i < lNbr; i++) {
      const lElementTypeAppreciation =
        aParam.listeTypesAppreciations.getElementParGenre(
          aParam.tabTypeAppreciation[i],
        );
      lListeElementsTypeAppreciation.addElement(lElementTypeAppreciation);
    }
    lFenetre.setDonnees(lListeElementsTypeAppreciation);
  }
  evenementAssistantSaisie(aNumeroBouton, aParam) {
    const lFenetre = aParam.instanceFenetreAssistantSaisie;
    let lEstClbckOk = false;
    switch (aNumeroBouton) {
      case EBoutonFenetreAssistantSaisie.Valider: {
        const lElmtSelectionne = lFenetre.getAppreciationSelectionnee();
        const lTailleMax = lFenetre.getTailleMaxAppreciation();
        const lControle = GChaine.controleTailleTexte({
          chaine: lElmtSelectionne.getLibelle(),
          tailleTexteMax: lTailleMax,
        });
        if (lControle.controleOK) {
          if (aParam.evntClbck) {
            lEstClbckOk = true;
            aParam.evntClbck({
              cmd: aNumeroBouton,
              eltSelectionne: lElmtSelectionne,
              estAssistantModifie: lFenetre.estAssistantModifie,
              rangAppr: lFenetre.getRangAppreciations(),
            });
          }
        } else {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Information,
            titre: GTraductions.getValeur(
              "Appreciations.titreMsgDepasseTailleMax",
            ),
            message: GTraductions.getValeur(
              "Appreciations.msgDepasseTailleMax",
              [lTailleMax],
            ),
          });
        }
        break;
      }
      case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
        if (aParam.evntClbck) {
          lEstClbckOk = true;
          aParam.evntClbck({
            cmd: aNumeroBouton,
            estAssistantModifie: lFenetre.estAssistantModifie,
            rangAppr: lFenetre.getRangAppreciations(),
          });
        }
        break;
      case EBoutonFenetreAssistantSaisie.Fermer: {
        lEstClbckOk = true;
        aParam.evntClbck({
          cmd: aNumeroBouton,
          estAssistantModifie: lFenetre.estAssistantModifie,
        });
        break;
      }
    }
    const lNePasUtiliserAssistantActif =
      lFenetre.getEtatCbNePasUtiliserAssistant();
    const lUtiliserAssistantActif = !lNePasUtiliserAssistantActif;
    const lAvecModifAssistantActif =
      GEtatUtilisateur.assistantSaisieActif !== lUtiliserAssistantActif;
    if (lAvecModifAssistantActif) {
      GEtatUtilisateur.assistantSaisieActif = lUtiliserAssistantActif;
      if (
        aParam.eventChangementUtiliserAssSaisie &&
        aNumeroBouton === EBoutonFenetreAssistantSaisie.Fermer
      ) {
        aParam.eventChangementUtiliserAssSaisie();
      }
    }
    if (
      aParam.evntFinallyClbck !== null &&
      aParam.evntFinallyClbck !== undefined &&
      lEstClbckOk
    ) {
      aParam.evntFinallyClbck({ cmd: aNumeroBouton });
    }
  }
  passerEnSaisiePre() {
    let lChangementActiviteAssistantSaisie = false;
    if (GEtatUtilisateur.assistantSaisieActif) {
      GEtatUtilisateur.inverserEtatAssistantSaisie();
      lChangementActiviteAssistantSaisie = true;
    }
    return lChangementActiviteAssistantSaisie;
  }
  passerEnSaisiePost(aParam) {
    if (aParam.changementActiviteAssistantSaisie) {
      GEtatUtilisateur.inverserEtatAssistantSaisie();
    }
  }
  passerEnSaisie(aParam) {
    const lChangementActiviteAssistantSaisie = this.passerEnSaisiePre();
    const lInstanceListe = aParam.instanceListe;
    const lIdColonneAppreciation = aParam.idColonne;
    const lIndexColonneAppreciation = lInstanceListe
      .getDonneesListe()
      .getNumeroColonneDId(lIdColonneAppreciation);
    lInstanceListe.demarrerEditionSurCellule(
      aParam.ligneCell !== null && aParam.ligneCell !== undefined
        ? aParam.ligneCell
        : lInstanceListe.getSelection(),
      lIndexColonneAppreciation,
    );
    this.passerEnSaisiePost({
      changementActiviteAssistantSaisie: lChangementActiviteAssistantSaisie,
    });
  }
  validerDonneesSurValider(aParam) {
    aParam.article.setEtat(EGenreEtat.Modification);
    const lElmtSelectionne = aParam.eltSelectionne;
    if (lElmtSelectionne && lElmtSelectionne.existeNumero()) {
      aParam.appreciation.setEtat(EGenreEtat.Modification);
      aParam.appreciation.setLibelle(lElmtSelectionne.getLibelle());
    }
  }
  saisirModifAssSaisieAvantTraitement(aParam) {
    if (aParam.estAssistantModifie) {
      return new ObjetRequeteSaisieAssistantSaisie(aParam.pere)
        .lancerRequete({
          listeTypesAppreciations: aParam.pere.listeTypesAppreciations,
        })
        .then(() => {
          aParam.pere.getListeTypesAppreciations();
        })
        .then(() => {
          if (aParam.clbck !== null && aParam.clbck !== undefined) {
            aParam.clbck();
          }
        });
    } else {
      if (aParam.clbck !== null && aParam.clbck !== undefined) {
        aParam.clbck();
      }
    }
  }
}
module.exports = { ObjetMoteurAssistantSaisie };
