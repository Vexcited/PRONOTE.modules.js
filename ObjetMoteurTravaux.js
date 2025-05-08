const {
  TypeOrigineCreationAvanceeTravaux,
} = require("TypeOrigineCreationAvanceeTravaux.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  TypeDestinationDemandeTravauxUtil,
} = require("TypeDestinationDemandeTravaux.js");
const { TypeGenreTravauxIntendance } = require("TypeGenreTravauxIntendance.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
class ObjetMoteurTravaux {
  constructor(aParam) {
    this.param = aParam;
  }
  estIdentificationEditable(aDemande) {
    return (
      this.avecDroitExecutant() &&
      aDemande.etat.getGenre() ===
        TypeOrigineCreationAvanceeTravaux.OCAT_EnAttente &&
      this.estDemandeur(aDemande)
    );
  }
  estEditable(aDemande, aChamps) {
    if (!aChamps || !aDemande) {
      return false;
    }
    return (
      aDemande.colonnesEditables && aDemande.colonnesEditables.includes(aChamps)
    );
  }
  avecDroitDemandeur() {
    return this.param.droits.avecDemandeTravaux;
  }
  avecDroitExecutant() {
    return this.param.droits.avecExecutionTravaux;
  }
  estDemandeur(aDemande) {
    return ObjetMoteurTravaux.estDemandeur(aDemande);
  }
  avecDroitGestion() {
    return this.param.droits.avecGestionTravaux;
  }
  estExecutant(aDemande) {
    return ObjetMoteurTravaux.estExecutant(aDemande);
  }
  estRealisable(aDemande) {
    return ObjetMoteurTravaux.estRealisable(aDemande);
  }
  estReceptionnable(aDemande) {
    return (
      aDemande.etat.getGenre() !==
        TypeOrigineCreationAvanceeTravaux.OCAT_Realise &&
      aDemande.etat.getGenre() !== TypeOrigineCreationAvanceeTravaux.OCAT_Refuse
    );
  }
  static estExecutant(aDemande) {
    if (
      [
        EGenreEspace.PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.Mobile_PrimDirection,
        EGenreEspace.Mobile_PrimProfesseur,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      return !!aDemande.mAEteAttribue;
    }
    const lNumUserConnecte = GEtatUtilisateur.getUtilisateur().getNumero();
    const lEstPersonnel = [
      EGenreEspace.Etablissement,
      EGenreEspace.Mobile_Etablissement,
      EGenreEspace.Administrateur,
      EGenreEspace.Mobile_Etablissement,
      EGenreEspace.Mobile_Administrateur,
      EGenreEspace.Professeur,
      EGenreEspace.Mobile_Professeur,
      EGenreEspace.PrimProfesseur,
      EGenreEspace.PrimDirection,
      EGenreEspace.Mobile_PrimDirection,
      EGenreEspace.Mobile_PrimProfesseur,
      EGenreEspace.PrimMairie,
      EGenreEspace.Mobile_PrimMairie,
    ].includes(GEtatUtilisateur.GenreEspace);
    return (
      lEstPersonnel &&
      !!aDemande.listeExecutants &&
      aDemande.listeExecutants.getIndiceParNumeroEtGenre(lNumUserConnecte) !==
        undefined
    );
  }
  static estRealisee(aDemande) {
    return (
      aDemande.etat.getGenre() ===
      TypeOrigineCreationAvanceeTravaux.OCAT_Realise
    );
  }
  static estDemandeur(aDemande) {
    const lNumUserConnecte = GEtatUtilisateur.getUtilisateur().getNumero();
    if (aDemande.demandeur) {
      return lNumUserConnecte === aDemande.demandeur.getNumero();
    } else {
      return false;
    }
  }
  static estRealisable(aDemande) {
    return (
      this.estExecutant(aDemande) &&
      aDemande.etat.getGenre() !==
        TypeOrigineCreationAvanceeTravaux.OCAT_EnAttente &&
      aDemande.etat.getGenre() !==
        TypeOrigineCreationAvanceeTravaux.OCAT_Realise &&
      aDemande.etat.getGenre() !== TypeOrigineCreationAvanceeTravaux.OCAT_Refuse
    );
  }
  static creerCumulEtat(
    aListeAvecCumul,
    aListeDemandes,
    aPourPrimaire = false,
  ) {
    const lLibelleCumuls = {
      realisee: "",
      aRealiser: "",
      demandesEnvoyees: GTraductions.getValeur(
        "TvxIntendance.ComboDemandesEnvoyees",
      ),
      autres: GTraductions.getValeur("TvxIntendance.ComboAutres"),
    };
    const lAjouterCumul = (aListe) => {
      aListe.addElement(
        ObjetElement.create({
          Libelle: lLibelleCumuls.aRealiser,
          libellePere: 0,
        }),
      );
      aListe.addElement(
        ObjetElement.create({
          Libelle: lLibelleCumuls.realisee,
          libellePere: 1,
        }),
      );
      aListe.addElement(
        ObjetElement.create({
          Libelle: lLibelleCumuls.demandesEnvoyees,
          libellePere: 2,
        }),
      );
      aListe.addElement(
        ObjetElement.create({ Libelle: lLibelleCumuls.autres, libellePere: 3 }),
      );
    };
    switch (GEtatUtilisateur.getGenreOnglet()) {
      case EGenreOnglet.Intendance_SaisieDemandesInformatique:
      case EGenreOnglet.Intendance_SaisieDemandesTravaux:
        lLibelleCumuls.realisee = GTraductions.getValeur(
          "TvxIntendance.ComboMissionsRealisees",
        );
        lLibelleCumuls.aRealiser = GTraductions.getValeur(
          "TvxIntendance.ComboMissionsARealiser",
        );
        break;
      case EGenreOnglet.Intendance_SaisieSecretariat:
        lLibelleCumuls.realisee = GTraductions.getValeur(
          "TvxIntendance.ComboTachesRealisees",
        );
        lLibelleCumuls.aRealiser = GTraductions.getValeur(
          "TvxIntendance.ComboTachesARealiser",
        );
        break;
      case EGenreOnglet.Intendance_SaisieCommandes:
        lLibelleCumuls.realisee = GTraductions.getValeur(
          "TvxIntendance.ComboCommandesRealisees",
        );
        lLibelleCumuls.aRealiser = GTraductions.getValeur(
          "TvxIntendance.ComboCommandesARealiser",
        );
        break;
    }
    if (aPourPrimaire) {
      const lListeDestination = TypeDestinationDemandeTravauxUtil.toListe();
      lListeDestination.parcourir((aCumulDestination) => {
        aCumulDestination.estDestination = true;
        aCumulDestination.destination = aCumulDestination.getGenre();
        aListeAvecCumul.addElement(aCumulDestination);
        lAjouterCumul(aListeAvecCumul);
        aListeAvecCumul.parcourir((aLigneCumul) => {
          aLigneCumul.estUnDeploiement = true;
          aLigneCumul.estDeploye = true;
          if (!aLigneCumul.estDestination && !aLigneCumul.pere) {
            aLigneCumul.pere = aCumulDestination;
            aLigneCumul.destination = aCumulDestination.getGenre();
          }
        });
      });
    } else {
      lAjouterCumul(aListeAvecCumul);
    }
    aListeAvecCumul.parcourir((aLigneCumul) => {
      aLigneCumul.estUnDeploiement = true;
      aLigneCumul.estDeploye = true;
    });
    const lListeDemandes = aListeDemandes;
    lListeDemandes.parcourir((aLigne) => {
      ObjetMoteurTravaux.affectationPereDemande(
        aLigne,
        aListeAvecCumul,
        lLibelleCumuls,
        aPourPrimaire,
      );
    });
    return aListeAvecCumul;
  }
  static affectationPereDemande(
    aDemande,
    aListeCumuls,
    aLibelleCumuls,
    aPourPrimaire,
  ) {
    const composePere = (aLibelle) => {
      aDemande.pere = aListeCumuls.getElementParFiltre((aLigneCumul) => {
        let lResult = true;
        if (aPourPrimaire) {
          lResult = aLigneCumul.destination === aDemande.destination;
        }
        lResult = lResult && aLigneCumul.getLibelle() === aLibelle;
        return lResult;
      });
      aDemande.pere.estDeploye = true;
      aDemande.pere.estUnDeploiement = true;
      aListeCumuls.addElement(aDemande);
    };
    if (
      ObjetMoteurTravaux.estExecutant(aDemande) &&
      ObjetMoteurTravaux.estRealisee(aDemande)
    ) {
      composePere(aLibelleCumuls.realisee);
    } else if (ObjetMoteurTravaux.estRealisable(aDemande)) {
      composePere(aLibelleCumuls.aRealiser);
    } else if (ObjetMoteurTravaux.estDemandeur(aDemande)) {
      composePere(aLibelleCumuls.demandesEnvoyees);
    } else {
      aDemande.seulementConsult = true;
      composePere(aLibelleCumuls.autres);
    }
  }
  static getDroits(aGenre) {
    let lResult;
    switch (aGenre) {
      case TypeGenreTravauxIntendance.GTI_Maintenance:
        lResult = {
          avecDemandeTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecDemandeTravauxIntendance,
          ),
          uniquementMesDemandesTravaux: GApplication.droits.get(
            TypeDroits.intendance.uniquementMesTravauxIntendance,
          ),
          avecExecutionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecExecutionTravauxIntendance,
          ),
          avecGestionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecGestionTravauxIntendance,
          ),
          avecTransfert: [
            EGenreEspace.Administrateur,
            EGenreEspace.Mobile_Administrateur,
            EGenreEspace.PrimDirection,
            EGenreEspace.Mobile_PrimDirection,
          ].includes(GEtatUtilisateur.GenreEspace),
        };
        break;
      case TypeGenreTravauxIntendance.GTI_Secretariat:
        lResult = {
          avecDemandeTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecDemandeTachesSecretariat,
          ),
          uniquementMesDemandesTravaux: GApplication.droits.get(
            TypeDroits.intendance.uniquementMesTachesSecretariat,
          ),
          avecExecutionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecExecutionTachesSecretariat,
          ),
          avecGestionTravaux: [
            EGenreEspace.Administrateur,
            EGenreEspace.Mobile_Administrateur,
          ].includes(GEtatUtilisateur.GenreEspace),
          avecTransfert: false,
        };
        break;
      case TypeGenreTravauxIntendance.GTI_Informatique:
        lResult = {
          avecDemandeTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecDemandeTachesInformatique,
          ),
          uniquementMesDemandesTravaux: GApplication.droits.get(
            TypeDroits.intendance.uniquementMesTachesInformatique,
          ),
          avecExecutionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecExecutionTachesInformatique,
          ),
          avecGestionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecGestionTachesInformatique,
          ),
          avecTransfert: [
            EGenreEspace.Administrateur,
            EGenreEspace.Mobile_Administrateur,
            EGenreEspace.PrimDirection,
            EGenreEspace.Mobile_PrimDirection,
          ].includes(GEtatUtilisateur.GenreEspace),
        };
        break;
      case TypeGenreTravauxIntendance.GTI_Commande:
        lResult = {
          avecDemandeTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecDemandeCommandes,
          ),
          uniquementMesDemandesTravaux: GApplication.droits.get(
            TypeDroits.intendance.uniquementMesCommandes,
          ),
          avecExecutionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecExecutionCommandes,
          ),
          avecGestionTravaux: GApplication.droits.get(
            TypeDroits.intendance.avecGestionCommandes,
          ),
          avecTransfert: false,
        };
        break;
      default:
        break;
    }
    return lResult;
  }
  static formaterListe(aListe) {
    let lListeDonnees = new ObjetListeElements();
    if (aListe.count() > 0) {
      lListeDonnees = ObjetMoteurTravaux.creerCumulEtat(
        lListeDonnees,
        aListe,
        GEtatUtilisateur.pourPrimaire(),
      );
    }
    if (GEtatUtilisateur.pourPrimaire()) {
      lListeDonnees.setTri(
        ObjetTri.initRecursif("pere", [
          ObjetTri.init("destination"),
          ObjetTri.init("libellePere"),
        ]),
      );
    } else {
      lListeDonnees.setTri([
        ObjetTri.initRecursif("pere", [ObjetTri.init("libellePere")]),
      ]);
    }
    lListeDonnees.trier();
    return lListeDonnees;
  }
  static getGenreTraveauxIntendance() {
    switch (GEtatUtilisateur.getGenreOnglet()) {
      case EGenreOnglet.Intendance_SaisieDemandesTravaux:
        return TypeGenreTravauxIntendance.GTI_Maintenance;
      case EGenreOnglet.Intendance_SaisieSecretariat:
        return TypeGenreTravauxIntendance.GTI_Secretariat;
      case EGenreOnglet.Intendance_SaisieDemandesInformatique:
        return TypeGenreTravauxIntendance.GTI_Informatique;
      case EGenreOnglet.Intendance_SaisieCommandes:
        return TypeGenreTravauxIntendance.GTI_Commande;
      default:
    }
  }
  static getListeJours() {
    return ObjetMoteurTravaux._getListeParTaille(32);
  }
  static getListeHeures() {
    return ObjetMoteurTravaux._getListeParTaille(24);
  }
  static getListeMinutes() {
    return ObjetMoteurTravaux._getListeParTaille(60);
  }
  static _getListeParTaille(ataille) {
    const lListe = new ObjetListeElements();
    Array.from({ length: ataille }, (v, i) => i.toString()).forEach((v) => {
      lListe.add(new ObjetElement(v));
    });
    return lListe;
  }
  static getTitreFenetre(
    aEtat,
    aGenreTravauxIntendance,
    aDateCreation = null,
    aSeulementConsult = false,
  ) {
    switch (aEtat) {
      case EGenreEtat.Creation: {
        const lDateCouranteFormat = GDate.formatDate(
          GDate.getDateCourante(),
          "%JJ/%MM/%AAAA",
        );
        switch (aGenreTravauxIntendance) {
          case TypeGenreTravauxIntendance.GTI_Maintenance:
            return GTraductions.getValeur(
              "TvxIntendance.TitreCreationTravaux",
              [lDateCouranteFormat],
            );
          case TypeGenreTravauxIntendance.GTI_Commande:
            return GTraductions.getValeur(
              "TvxIntendance.TitreCreationCommandes",
              [lDateCouranteFormat],
            );
          case TypeGenreTravauxIntendance.GTI_Secretariat:
          case TypeGenreTravauxIntendance.GTI_Informatique:
            return GTraductions.getValeur("TvxIntendance.TitreCreationTaches", [
              lDateCouranteFormat,
            ]);
        }
        break;
      }
      case EGenreEtat.Modification: {
        let lDateModificationFormat = "";
        if (!!aDateCreation) {
          lDateModificationFormat = GDate.formatDate(
            aDateCreation,
            "%JJ/%MM/%AAAA",
          );
        }
        switch (aGenreTravauxIntendance) {
          case TypeGenreTravauxIntendance.GTI_Maintenance:
            return aSeulementConsult
              ? GTraductions.getValeur("TvxIntendance.TitreDemandeTravaux", [
                  lDateModificationFormat,
                ])
              : GTraductions.getValeur(
                  "TvxIntendance.TitreModificationTravaux",
                  [lDateModificationFormat],
                );
          case TypeGenreTravauxIntendance.GTI_Commande:
            return aSeulementConsult
              ? GTraductions.getValeur("TvxIntendance.TitreDemandeCommande", [
                  lDateModificationFormat,
                ])
              : GTraductions.getValeur(
                  "TvxIntendance.TitreModificationCommande",
                  [lDateModificationFormat],
                );
          case TypeGenreTravauxIntendance.GTI_Secretariat:
          case TypeGenreTravauxIntendance.GTI_Informatique:
            return aSeulementConsult
              ? GTraductions.getValeur("TvxIntendance.TitreDemandeTaches", [
                  lDateModificationFormat,
                ])
              : GTraductions.getValeur(
                  "TvxIntendance.TitreModificationTaches",
                  [lDateModificationFormat],
                );
        }
      }
    }
    return "";
  }
  static surTransfertMission(aArticle) {
    aArticle.setEtat(EGenreEtat.Modification);
    const lNouvelOnglet =
      aArticle.getGenre() === TypeGenreTravauxIntendance.GTI_Maintenance
        ? EGenreOnglet.Intendance_SaisieDemandesTravaux
        : EGenreOnglet.Intendance_SaisieDemandesInformatique;
    this.listeDemandesTvx = new ObjetListeElements();
    this.listeDemandesTvx.addElement(aArticle);
    return lNouvelOnglet;
  }
  static getMessageSuppresion() {
    return GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Confirmation,
      message:
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.Intendance_SaisieCommandes
          ? GTraductions.getValeur("TvxIntendance.Message.SupprimerCommande")
          : GTraductions.getValeur("TvxIntendance.Message.SupprimerDemande"),
    });
  }
}
ObjetMoteurTravaux.colonnes = {
  dateCreation: "dateCreation",
  description: "description",
  lieu: "lieu",
  demandeur: "demandeur",
  listePJ: "listePJ",
  etatAvancement: "etatAvancement",
  commentaire: "commentaire",
  nature: "nature",
  executants: "executants",
  dateRealisee: "dateRealisee",
  remarque: "remarque",
  echeance: "echeance",
  niveauDUrgence: "niveauDUrgence",
  dureeIntervention: "dureeIntervention",
};
module.exports = { ObjetMoteurTravaux };
