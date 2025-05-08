const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteFicheEleve } = require("ObjetRequeteFicheEleve.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GUID } = require("GUID.js");
const {
  UtilitaireProjetAccompagnement,
} = require("UtilitaireProjetAccompagnement.js");
const { DonneesListe_MemosEleves } = require("DonneesListe_MemosEleves.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre_Attestation } = require("ObjetFenetre_Attestation.js");
const {
  ObjetFenetre_ProjetAccompagnement,
} = require("ObjetFenetre_ProjetAccompagnement.js");
const { ObjetFenetre_MemoEleve } = require("ObjetFenetre_MemoEleve.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  ObjetRequeteSaisieMemoEleve,
} = require("ObjetRequeteSaisieMemoEleve.js");
const { MethodesObjet } = require("MethodesObjet.js");
const {
  ObjetFenetre_DetailsPIEleve,
} = require("ObjetFenetre_DetailsPIEleve.js");
class InterfaceFicheEleve extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
    this.sansFocusPolling = null;
    const lNom = GUID.getId();
    this.idDivScrollResp = this.Nom + "_divScrollResp_";
    this.idIdentite = GUID.getId();
    this.idScolarite = GUID.getId();
    this.idResponsables = GUID.getId();
    this.idContenuOnglet = lNom + "_contenuOnglets";
    this.idDivScrollResp = lNom + "_divScrollResp_";
    this.hauteurTabOnglets = 36;
    this.mapMotifNbReferences = {};
    this.aut = {
      identiteEleve: GApplication.droits.get(
        TypeDroits.eleves.consulterIdentiteEleve,
      ),
      saisieAttestations: GApplication.droits.get(
        TypeDroits.eleves.avecSaisieAttestations,
      ),
      ficheResponsables: GApplication.droits.get(
        TypeDroits.eleves.consulterFichesResponsables,
      ),
      photoEleve: GApplication.droits.get(
        TypeDroits.eleves.consulterPhotosEleves,
      ),
      memos:
        [
          EGenreEspace.PrimProfesseur,
          EGenreEspace.Mobile_PrimProfesseur,
          EGenreEspace.Professeur,
          EGenreEspace.Mobile_Professeur,
          EGenreEspace.Etablissement,
          EGenreEspace.Mobile_Etablissement,
          EGenreEspace.PrimDirection,
          EGenreEspace.Mobile_PrimDirection,
        ].includes(GEtatUtilisateur.GenreEspace) &&
        GApplication.droits.get(TypeDroits.dossierVS.consulterMemosEleve),
      attestationEtendue: GApplication.droits.get(
        TypeDroits.fonctionnalites.attestationEtendue,
      ),
      estPeriscolaire:
        GEtatUtilisateur.pourPrimaire() &&
        [
          EGenreEspace.PrimPeriscolaire,
          EGenreEspace.Mobile_PrimPeriscolaire,
        ].includes(GEtatUtilisateur.GenreEspace),
    };
    this.ongletActif = [this.aut.identiteEleve, this.aut.ficheResponsables];
  }
  construireInstances() {
    this.identTabs = this.add(
      ObjetTabOnglets,
      this.evenementSurTab,
      this.initialiserTabs,
    );
    this.identListeMemosEleves = this.add(
      ObjetListe,
      _evenementListeMemo.bind(this),
      this.initialiserListeMemos,
    );
  }
  initialiserListeMemos(aInstance) {
    aInstance.setOptionsListe({
      colonnes: [{ taille: "100%" }],
      avecLigneCreation: GApplication.droits.get(
        TypeDroits.dossierVS.saisirMemos,
      ),
      titreCreation: GTraductions.getValeur("AbsenceVS.CreerUnMemo"),
      skin: ObjetListe.skin.flatDesign,
      forcerOmbreScrollBottom: true,
      nonEditableSurModeExclusif: true,
      messageContenuVide: GTraductions.getValeur("AbsenceVS.aucunMemo"),
    });
  }
  setOptions(aParam) {
    this.ongletsAffiches = {
      identite: true,
      responsables: true,
      memos: true,
      attestations: true,
      projets: true,
    };
    $.extend(this.ongletsAffiches, aParam);
  }
  verifierExistence(aElement) {
    let existe = false;
    for (let i = 0; i < this.scolariteEleve.listeProjets.count(); i++) {
      const elt = this.scolariteEleve.listeProjets.get(i);
      if (
        elt.projetIndividuel.getLibelle() ===
        this.listeTypes.get(aElement).getLibelle()
      ) {
        existe = !!elt.debut
          ? GDate.estDateEgale(elt.debut, GDate.premiereDate)
          : true;
        break;
      }
    }
    return existe;
  }
  setDonnees(aParams) {
    if (
      !MethodesObjet.isNumeric(aParams.onglet) &&
      MethodesObjet.isNumeric(GEtatUtilisateur.ongletSelectionneFicheEleve)
    ) {
      aParams.onglet = GEtatUtilisateur.ongletSelectionneFicheEleve;
    }
    if (aParams.onglet !== undefined && aParams.onglet !== null) {
      this.getInstance(this.identTabs).ongletSelectionne = aParams.onglet;
    }
    if (
      aParams.formatTitrePrimaire !== undefined &&
      aParams.formatTitrePrimaire !== null
    ) {
      this.formatTitrePrimaire = aParams.formatTitrePrimaire;
    } else {
      this.formatTitrePrimaire = false;
    }
    this.sansFocusPolling = aParams.sansFocusPolling;
    this.eleve = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    this.eleve.avecPhoto = true;
    if (!this.eleve || !this.eleve.existeNumero()) {
      if (this.fermer) {
        this.fermer();
      }
      return;
    }
    this.actualiser();
  }
  actualiser() {
    const lParam = {
      numeroEleve: this.eleve.getNumero(),
      avecEleve: this.aut.identiteEleve,
      avecResponsables: this.aut.ficheResponsables,
    };
    new ObjetRequeteFicheEleve(this, this.actionSurReponseRequete)
      .setOptions({ sansBlocageInterface: this.sansFocusPolling })
      .lancerRequete(lParam);
  }
  actionSurReponseRequete(
    aIdentite,
    aScolarite,
    aListeTypes,
    aListeMotifs,
    aListeAttestations,
    aListeResponsables,
    aListeMemos,
  ) {
    this.scolariteEleve = aScolarite;
    this.identiteEleve = aIdentite;
    this.listeTypes = aListeTypes;
    this.listeAttestations = aListeAttestations;
    this.listeMotifs = aListeMotifs;
    this.listeResponsables = aListeResponsables;
    this.listeMemosEleves = aListeMemos;
    this.estValorisation = false;
    this.donneesRecues = true;
    this.initialiserTabs(this.getInstance(this.identTabs));
    const ancienOnglet = this.getInstance(this.identTabs).ongletSelectionne;
    this.getInstance(this.identTabs).ongletSelectionne = 0;
    const lSelect = ancienOnglet;
    let positionOnglet = 0;
    for (let i = 0; i < this.listeOnglets.count(); i++) {
      if (this.listeOnglets.get(i).Genre === lSelect) {
        positionOnglet = i;
      }
    }
    this.getInstance(this.identTabs).selectOnglet(positionOnglet);
    if (!!this.Pere.setOptionsFenetre) {
      let lParams = {};
      if (IE.estMobile) {
        lParams = {
          titreNavigation: this.composeTitreFenetre(),
          titre: GTraductions.getValeur("FicheEleve.titrePanelMobile"),
        };
      } else {
        lParams = { titre: this.composeTitreFenetre() };
      }
      this.Pere.setOptionsFenetre(lParams);
    }
  }
  initialiserTabs(aInstance) {
    this.ongletsAffiches = {
      identite: true,
      scolarite: true,
      responsables: true,
      memos: true,
      attestations: true,
      projets: true,
    };
    $.extend(this.ongletsAffiches, this.Pere.listeOnglets);
    this.listeOnglets = new ObjetListeElements();
    if (this.aut.identiteEleve && this.ongletsAffiches.identite) {
      this.listeOnglets.addElement(
        new ObjetElement(
          GTraductions.getValeur("FicheEleve.identite"),
          0,
          InterfaceFicheEleve.genreOnglet.Identite,
        ),
      );
    }
    if (this.aut.identiteEleve && this.ongletsAffiches.scolarite) {
      this.listeOnglets.addElement(
        new ObjetElement(
          GTraductions.getValeur("FicheEleve.scolarite"),
          0,
          InterfaceFicheEleve.genreOnglet.Scolarite,
        ),
      );
    }
    if (this.aut.ficheResponsables && this.ongletsAffiches.responsables) {
      this.listeOnglets.addElement(
        new ObjetElement(
          GTraductions.getValeur("FicheEleve.responsables"),
          0,
          InterfaceFicheEleve.genreOnglet.Responsables,
        ),
      );
    }
    if (this.aut.memos && this.ongletsAffiches.memos) {
      let lLibelleTabMemo = GEtatUtilisateur.pourPrimaire()
        ? GTraductions.getValeur("FicheEleve.memoInterne")
        : GTraductions.getValeur("FicheEleve.memoVS");
      this.listeOnglets.addElement(
        new ObjetElement(
          lLibelleTabMemo,
          0,
          InterfaceFicheEleve.genreOnglet.Memos,
        ),
      );
    }
    aInstance.setParametres(
      this.listeOnglets,
      false,
      this.Pere.optionsFenetre.largeur,
      this.hauteurTabOnglets,
      0,
    );
    this.nbOngletsAffiches = this.listeOnglets.count();
  }
  construireStructureAffichage() {
    const T = [];
    T.push(
      `<div class="menu-tabs-wrapper" id="${this.getInstance(this.identTabs).Nom}"></div>`,
    );
    T.push(
      `<div id="${this.idContenuOnglet}" class="content-wrapper" style="overflow:auto;">\n              <div id="${this.idIdentite}"></div>\n              <div id="${this.idScolarite}"></div>\n              <div id="${this.idResponsables}"></div>\n              <div id="${this.getInstance(this.identListeMemosEleves).getNom()}" style="height:100%" ></div>\n            </div>`,
    );
    return T.join("");
  }
  composeTitreFenetre() {
    return (
      this.identiteEleve.prenom +
      " " +
      this.identiteEleve.nom +
      "<br/>" +
      this.scolariteEleve.classe
    );
  }
  composeOnglet(aGenreOnglet) {
    const lGenreOnglet = aGenreOnglet
      ? aGenreOnglet
      : this.getGenreOngletSelectionne();
    switch (lGenreOnglet) {
      case InterfaceFicheEleve.genreOnglet.Identite:
        $("#" + this.idIdentite.escapeJQ())
          .show()
          .siblings()
          .hide();
        GHtml.setHtml(this.idIdentite, this.composeIdentiteEleve(), {
          controleur: this.controleur,
        });
        break;
      case InterfaceFicheEleve.genreOnglet.Scolarite:
        $("#" + this.idScolarite.escapeJQ())
          .show()
          .siblings()
          .hide();
        GHtml.setHtml(this.idScolarite, this.composeScolarite(), {
          controleur: this.controleur,
        });
        break;
      case InterfaceFicheEleve.genreOnglet.Responsables:
        $("#" + this.idResponsables.escapeJQ())
          .show()
          .siblings()
          .hide();
        GHtml.setHtml(
          this.idResponsables,
          this.composeResponsablesEleve(
            InterfaceFicheEleve.genreOnglet.Responsables,
          ),
        );
        break;
      case InterfaceFicheEleve.genreOnglet.Memos:
        $(
          "#" +
            this.getInstance(this.identListeMemosEleves).getNom().escapeJQ(),
        )
          .show()
          .siblings()
          .hide();
        _actualiserListeMemo.call(this);
        break;
      default:
        break;
    }
  }
  actionApresSaisieDocument() {
    this.actualiserListe();
  }
  avecInfosCoordonnees() {
    const t = this.identiteEleve;
    this.avecInfosAdresse =
      t.adresse1 ||
      t.adresse2 ||
      t.adresse3 ||
      t.adresse4 ||
      t.CP ||
      t.ville ||
      t.pays;
    this.avecInfosMedia = t.telPort || t.email;
    return this.avecInfosAdresse || this.avecInfosMedia;
  }
  evenementSurTab(aElement) {
    if (aElement) {
      this.tabSelectionne = aElement;
      GEtatUtilisateur.ongletSelectionneFicheEleve =
        this.tabSelectionne.getGenre();
    }
    this.composeOnglet();
  }
  surValidation(ANumeroBouton) {
    this.Pere.fermer();
    this.scolariteEleve.listeTypes = this.listeTypes;
    this.Pere.callback.appel(
      ANumeroBouton,
      this.eleve,
      this.scolariteEleve,
      this.listeFichiersUpload,
    );
  }
  setOngletActif(aGenreOnglet) {
    if (MethodesObjet.isNumeric(aGenreOnglet)) {
      this.ongletActif[aGenreOnglet] = true;
    }
  }
  setOngletParDefaut(aGenreOnglet) {
    this.ongletParDefaut = aGenreOnglet;
  }
  getGenreOngletSelectionne() {
    return this.tabSelectionne ? this.tabSelectionne.getGenre() : null;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodePhoto: function () {
        $(this.node).on("error", () => {
          aInstance.eleve.avecPhoto = false;
        });
      },
      btnCreerAttestation: {
        event: function () {
          _ouvrirFenetreAttestation.call(aInstance);
        },
        getDisabled: function () {
          return (
            aInstance.scolariteEleve.listeAttestations &&
            aInstance.listeAttestations &&
            aInstance.scolariteEleve.listeAttestations.getNbrElementsExistes() ===
              aInstance.listeAttestations.getNbrElementsExistes()
          );
        },
      },
      btnEditAttestation: {
        event: function (aNumero) {
          let lAttestation;
          if (
            aInstance.scolariteEleve &&
            aInstance.scolariteEleve.listeAttestations
          ) {
            lAttestation =
              aInstance.scolariteEleve.listeAttestations.getElementParNumero(
                aNumero,
              );
          }
          _ouvrirFenetreAttestation.call(aInstance, lAttestation);
        },
      },
      btnCreerProjetAccompagnement: {
        event: function () {
          _ouvrirFenetreProjetAccompagnement.call(aInstance);
        },
        getDisabled: function () {
          return (
            aInstance.scolariteEleve.listeProjets &&
            aInstance.listeProjets &&
            aInstance.scolariteEleve.listeProjets.count() ===
              aInstance.listeProjets.count()
          );
        },
      },
      btnEditProjetAccompagnement: {
        event: function (aNumero) {
          let lProjet;
          if (
            aInstance.scolariteEleve &&
            aInstance.scolariteEleve.listeProjets
          ) {
            lProjet =
              aInstance.scolariteEleve.listeProjets.getElementParNumero(
                aNumero,
              );
          }
          _ouvrirFenetreProjetAccompagnement.call(aInstance, lProjet);
        },
      },
      afficherFenetreDetailsPIEleve: {
        event(aNumero) {
          if (
            aInstance.scolariteEleve &&
            aInstance.scolariteEleve.listeProjets
          ) {
            const lProjet =
              aInstance.scolariteEleve.listeProjets.getElementParNumero(
                aNumero,
              );
            _ouvrirFenetreDetailsPIEleve.call(aInstance, lProjet);
          }
        },
      },
      getHtmlAttestation: function () {
        return aInstance.composeAttestations();
      },
      getHtmlProjetAccompagnement: function () {
        return _composeProjetsAccompagnement.call(aInstance);
      },
    });
  }
  composeIdentiteEleve() {
    const T = [];
    T.push(`<div class="identite-wrapper">\n            ${this.aut.photoEleve ? this.composePhoto() : ""}\n            <div class="identite-contain">\n            ${this.composeNoms()}
            ${this.identiteEleve.localisationLieu || this.identiteEleve.localisationProf ? this.composelocalisationEleve() : ""}
            ${this.composeAutorisationSortie()}
            ${this.scolariteEleve.useTransport ? `${this.composeUsagerTransports()}` : ""}\n            </div>\n          </div>`);
    T.push(`<div class="infos-contain">\n            ${this.identiteEleve.ine ? this.composeInformationINE() : ""}
            ${this.composeNaissance()}
            ${
              this.avecInfosCoordonnees()
                ? `${this.avecInfosAdresse ? this.composeAdresse(this.identiteEleve) : ""}
             ${this.avecInfosMedia ? this.composeTelephonesMail(this.identiteEleve) : ""}`
                : ""
            }
             ${this.identiteEleve.listeAllergiesAlimentaire && this.identiteEleve.listeAllergiesAlimentaire.count() ? this.composeAllergies(this.identiteEleve.listeAllergiesAlimentaire, true) : ""}
             ${this.identiteEleve.listeAutresAllergies && this.identiteEleve.listeAutresAllergies.count() ? this.composeAllergies(this.identiteEleve.listeAutresAllergies, false) : ""}
             ${this.composeAutorisationsCommunications(this.identiteEleve)}
          </div>`);
    return T.join("");
  }
  composePhoto() {
    const T = [];
    let lSrcPhoto;
    if (this.eleve.avecPhoto) {
      lSrcPhoto = GChaine.composeUrlImgPhotoIndividu(this.eleve);
    } else {
      lSrcPhoto = "";
    }
    T.push(
      `<div class="photo-contain">\n                <img ie-load-src="${lSrcPhoto}" class="img-portrait" ie-imgviewer ${GHtml.composeAttr("ie-node", "nodePhoto", this.eleve.getNumero())} aria-hidden="true" />\n             </div>`,
    );
    return T.join("");
  }
  composeNoms() {
    const T = [];
    const lGenre =
      this.identiteEleve.sexe === 0
        ? GTraductions.getValeur("FicheEleve.sexeMasculin")
        : this.identiteEleve.sexe === 1
          ? GTraductions.getValeur("FicheEleve.sexeFeminin")
          : GTraductions.getValeur("FicheEleve.sexeNeutre");
    T.push(
      `<div class="nom-prenom"> ${this.identiteEleve.nom} ${this.identiteEleve.prenom ? this.identiteEleve.prenom : ""}</div>\n              <div class="item">\n                <label>${GTraductions.getValeur("FicheEleve.sexe")} :</label>\n                <p>${lGenre}</p>\n              </div>`,
    );
    return T.join("");
  }
  composelocalisationEleve() {
    const T = [];
    T.push(
      `<div class="item">\n              <label class="icon_map_marker"></label>\n              <p> ${this.identiteEleve.localisationLieu}</p>\n              <p>(${this.identiteEleve.localisationProf})</p>\n            </div>`,
    );
    return T.join("");
  }
  composeAutorisationSortie() {
    const T = [];
    if (GEtatUtilisateur.pourPrimaire()) {
      if (this.scolariteEleve.autoriseSortirSeul) {
        T.push(
          `<div class="item">`,
          `<i class="icon_user mix-icon_ok i-top theme-foncee m-right" title="${GTraductions.getValeur("FicheEleve.autorisationSortie")}"></i><p>${GTraductions.getValeur("FicheEleve.lEleveEstAutoriseASortirSeul")}</p>`,
          `</div>`,
        );
      }
    } else {
      if (!!this.scolariteEleve.autorisationSortie) {
        T.push(
          `<div class="item">`,
          `<label class="multi-lignes">${GTraductions.getValeur("FicheEleve.autorisationSortie")} :</label>\n                   <p>${this.scolariteEleve.autorisationSortie.getLibelle()}</p>`,
          `</div>`,
        );
      }
    }
    return T.join("");
  }
  composeUsagerTransports() {
    const T = [];
    if (GEtatUtilisateur.pourPrimaire()) {
      T.push(
        `<div class="item flex-center">`,
        `<i class="icon_bus m-right-l theme-foncee" aria-hidden="true"></i><p>${GTraductions.getValeur("FicheEleve.utiliseTransportPrim")}</p>`,
        `</div>`,
      );
    } else {
      T.push(
        `<div class="item flex-center">`,
        `<i class="icon_bus m-right theme-foncee" aria-hidden="true"></i><p>${GTraductions.getValeur("FicheEleve.utiliseTransport")}</p>`,
        `</div>`,
      );
    }
    return T.join("");
  }
  composeInformationINE() {
    const T = [];
    T.push(
      `<div class="item">\n               <label>${GTraductions.getValeur("FicheEleve.INELong")}:</label>\n               <p> ${this.identiteEleve.ine}</p>\n              </div>`,
    );
    return T.join("");
  }
  composeNaissance() {
    const T = [];
    T.push(`<div class="item">`);
    if (
      !this.aut.estPeriscolaire &&
      (this.identiteEleve.dateNaiss || this.identiteEleve.villeNaiss)
    ) {
      T.push(`<label>${GTraductions.getValeur("FicheEleve.ne")}:</label>`);
      T.push(
        `${this.identiteEleve.dateNaiss ? `<p>${GTraductions.getValeur("FicheEleve.le")} ${this.identiteEleve.dateNaiss}</p> ` : ""}`,
      );
      T.push(
        `${this.identiteEleve.villeNaiss ? `<p>${GTraductions.getValeur("FicheEleve.a")} ${this.identiteEleve.villeNaiss}</p> ` : ""}`,
      );
      T.push(
        `${this.identiteEleve.estMajeur ? `<p class="gris p-left">(${GTraductions.getValeur("FicheEleve.majeur")})</p>` : ""}`,
      );
    } else {
      T.push(
        `${this.identiteEleve.age ? `<p class="libelle">${GTraductions.getValeur("FicheEleve.AgeDe")}:</p><p>${this.identiteEleve.age}</p> ` : ""}`,
      );
    }
    T.push(`</div>`);
    return T.join("");
  }
  composeAdresse(aPersonne) {
    const T = [];
    T.push(
      `<div class="item">\n                <label>${GTraductions.getValeur("FicheEleve.adresse")}:</label><p>${aPersonne.adresse2 ? ` ${aPersonne.adresse2} ` : ""} ${aPersonne.adresse3 ? ` ${aPersonne.adresse3} ` : ""} ${aPersonne.adresse1 ? ` ${aPersonne.adresse1}` : ""} ${aPersonne.adresse4 ? ` ${aPersonne.adresse4} ` : ""} <br> ${aPersonne.CP} ${aPersonne.ville} ${aPersonne.pays ? ` - ${aPersonne.pays}` : ``}\n                </p>\n           </div>`,
    );
    return T.join("");
  }
  composeTelephonesMail(aPersonne) {
    const T = [];
    T.push(`<div class="item coordonnees">`);
    if (aPersonne.telPort) {
      const lIndicatif = aPersonne.indPort ? `(+${aPersonne.indPort})` : "";
      T.push(
        `<div class="lien-communication tel-mobile">\n           <a href="tel:${GChaine.formatTelephoneAvecIndicatif(aPersonne.indPort, aPersonne.telPort)}" title="${GTraductions.getValeur("FicheEleve.TelPort")}"> ${lIndicatif}  ${_geStrTelephoneAvecEspaces(aPersonne.telPort)}</a>\n        </div>`,
      );
    }
    if (aPersonne.telFixe) {
      T.push(
        `<div class="lien-communication">\n           <a href="tel:${aPersonne.telFixe}" title="${GTraductions.getValeur("FicheEleve.TelFixe")}"> ${_geStrTelephoneAvecEspaces(aPersonne.telFixe)}</a>\n        </div>`,
      );
    }
    if (aPersonne.telAutre) {
      T.push(
        `<div class="lien-communication tel-autre">\n           <a href="tel:${aPersonne.telAutre}" title="${GTraductions.getValeur("FicheEleve.TelFixe")}"> ${_geStrTelephoneAvecEspaces(aPersonne.telAutre)}</a>\n        </div>`,
      );
    }
    if (aPersonne.email) {
      T.push(
        '<div class="lien-communication">',
        GChaine.composerEmail(aPersonne.email),
        "</div>",
      );
    }
    T.push("</div>");
    return T.join("");
  }
  composeScolarite() {
    const T = [];
    if (this.scolariteEleve.profPrincipal || this.scolariteEleve.tuteur) {
      T.push(`<div class="infos-wrapper profs">\n                  ${this.composeIdentiteProfs()}
              </div>`);
    }
    T.push(`<div class="infos-wrapper">\n\n              ${this.composeRegime()}
              ${this.scolariteEleve.engagements ? `${this.composeEngagements()}` : ""}
              ${this.scolariteEleve.options ? this.composeOptions() : ""}
              ${!this.aut.estPeriscolaire && this.identiteEleve.accompagnant ? this.composeAccompagnant() : ""}\n            </div>\n\n            <div class="infos-wrapper">\n              <div ie-html="getHtmlProjetAccompagnement"></div>\n            </div>\n\n              <div class="infos-wrapper">\n                  <div ie-html="getHtmlAttestation"></div>\n                  ${this.composeServicePeriscolaire()}
            </div>`);
    return T.join("");
  }
  composeIdentiteProfs() {
    const T = [];
    T.push(`<div class="item">\n              <label class="multi-lignes">${!this.aut.estPeriscolaire ? GTraductions.getValeur("FicheEleve.profPrincipal") : GTraductions.getValeur("Profs")} </label><p>${this.scolariteEleve.profPrincipal}</p>\n            </div>\n            ${!this.aut.estPeriscolaire && this.scolariteEleve.tuteur ? `<div class="item">\n            <label>${GTraductions.getValeur("FicheEleve.tuteur")}</label><p>${this.scolariteEleve.tuteur}</p>\n          </div>` : ""}
            `);
    return T.join("");
  }
  composeRegime() {
    const T = [];
    if (
      this.scolariteEleve.midi ||
      this.scolariteEleve.soir ||
      this.scolariteEleve.internat
    ) {
      T.push(
        `<div class="item regime">\n\n              <label class="icon_food multi-lignes" aria-hidden="true"></label>\n              <div class="m-left">\n              <label class="gris">${GTraductions.getValeur("FicheEleve.regime")} : ${this.scolariteEleve.regime} </label>`,
      );
      T.push(`    <ul>`);
      if (this.scolariteEleve.midi) {
        T.push(
          `    <li><span class="wrapper">${GTraductions.getValeur("FicheEleve.midi")} (${this.scolariteEleve.nombreSelectionnesMidi}/${this.scolariteEleve.nombreJoursSelectionnables}): ${this.scolariteEleve.midi}</span></li>`,
        );
      }
      if (this.scolariteEleve.soir) {
        T.push(
          `    <li><span class="wrapper">${GTraductions.getValeur("FicheEleve.soir")} (${this.scolariteEleve.nombreSelectionnesSoir}/${this.scolariteEleve.nombreJoursSelectionnables}): ${this.scolariteEleve.soir}</span></li>`,
        );
      }
      if (this.scolariteEleve.internat) {
        T.push(
          `    <li class="m-bottom"><span class="wrapper">${GTraductions.getValeur("FicheEleve.internat")} (${this.scolariteEleve.nombreSelectionnesInternat}/${this.scolariteEleve.nombreJoursSelectionnables}): ${this.scolariteEleve.internat}</span></li>`,
        );
        if (this.scolariteEleve.numeroChambre) {
          T.push(
            `    <li><span class="gris">${GTraductions.getValeur("FicheEleve.numeroChambre")} :</span> ${this.scolariteEleve.numeroChambre}</li>`,
          );
        }
        if (this.scolariteEleve.dortoir) {
          T.push(
            `    <li><span class="gris">${GTraductions.getValeur("FicheEleve.dortoir")} :</span> ${this.scolariteEleve.dortoir}</li>`,
          );
        }
      }
      if (this.scolariteEleve.numeroSelf) {
        T.push(
          `    <li><span class="gris">${GTraductions.getValeur("FicheEleve.numeroSelf")} :</span> ${this.scolariteEleve.numeroSelf}</li>`,
        );
      }
      if (this.scolariteEleve.numeroCasier) {
        T.push(
          `    <li><span class="gris">${GTraductions.getValeur("FicheEleve.numeroCasier")} :</span> ${this.scolariteEleve.numeroCasier}</li>`,
        );
      }
      T.push(`    </ul>\n              </div>\n        </div>`);
    }
    return T.join("");
  }
  composeEngagements() {
    const T = [];
    const lClassesIcone = [];
    const lEstDelegueClasse =
      !!this.scolariteEleve.delegue &&
      !!this.scolariteEleve.delegue.estDelegueClasse;
    const lEstDelegueEco =
      !!this.scolariteEleve.delegue &&
      !!this.scolariteEleve.delegue.estDelegueEco;
    const lEstDelegueAutre =
      !!this.scolariteEleve.delegue &&
      !!this.scolariteEleve.delegue.estDelegueAutre;
    const lEstPlusieursCategories =
      (lEstDelegueClasse && (lEstDelegueEco || lEstDelegueAutre)) ||
      (lEstDelegueEco && lEstDelegueAutre);
    if (lEstPlusieursCategories) {
      lClassesIcone.push("mix-icon_plus");
    } else if (lEstDelegueClasse) {
      lClassesIcone.push("mix-icon_rond i-orange");
    } else if (lEstDelegueEco) {
      lClassesIcone.push("mix-icon_rond i-green");
    }
    lClassesIcone.join(" ");
    T.push(
      `<div class="item flex-center">\n              <label class="has-text flex-contain flex-center"><i class="icon_engagement ${lClassesIcone}" aria-hidden="true"></i>${GTraductions.getValeur("FicheEleve.engagements")} : </label>\n              <p>${this.scolariteEleve.engagements}</p>\n          </div>`,
    );
    return T.join("");
  }
  composeOptions() {
    const T = [];
    T.push(
      `<div class="item flex-center">\n              <label class="flex-contain flex-center"><i class="icon_list" aria-hidden="true"></i>${GTraductions.getValeur("FicheEleve.options")} : </label>\n              <p>${this.scolariteEleve.options}</p>\n          </div>`,
    );
    return T.join("");
  }
  composeAccompagnant() {
    const T = [];
    T.push(
      `<div class="item flex-center">\n              <label class="flex-contain flex-center"><i class="icon_accompagnant" aria-hidden="true"></i>${GTraductions.getValeur("FicheEleve.accompagnant")} : </label>\n              <p>${this.identiteEleve.accompagnant}</p>\n          </div>`,
    );
    return T.join("");
  }
  composeAttestations() {
    const T = [];
    if (this.scolariteEleve.listeAttestations === undefined) {
      return "";
    }
    const lAttestations = [];
    if (
      this.scolariteEleve.listeAttestations &&
      this.listeAttestations &&
      this.scolariteEleve.listeAttestations.count() ===
        this.listeAttestations.count()
    ) {
      lAttestations.push(
        `<div class="item-wrapper">${GTraductions.getValeur("Attestation.aucuneAttestationDisponible")}</div>`,
      );
    }
    if (this.scolariteEleve.listeAttestations.count() === 0) {
      lAttestations.push(
        `<div class="item-wrapper">${GTraductions.getValeur("Attestation.aucuneAttestationRenseignee")}</div>`,
      );
    }
    this.scolariteEleve.listeAttestations.parcourir((aAttestation) => {
      if (aAttestation.existe()) {
        const lDelivree = aAttestation.delivree
          ? GTraductions.getValeur("FicheEleve.DelivreLe") +
            " " +
            GDate.formatDate(aAttestation.date, "%JJJJ %JJ %MMMM %AAAA")
          : GTraductions.getValeur("Attestation.nonDelivree");
        const lBoutonEditer = this.aut.saisieAttestations
          ? `<ie-btnicon class="icon icon_edit avecFond" role="button" title="${GTraductions.getValeur("Modifier")}" ie-model="btnEditAttestation('${aAttestation.getNumero()}')"></ie-btnicon>`
          : "";
        lAttestations.push(`<div class="item-wrapper">\n        <label title ="${aAttestation.getLibelle()}">${aAttestation.abbreviation}</label>\n        <span class="p-right">${lDelivree}</span>\n        ${lBoutonEditer}
        </div>`);
      }
    });
    const lBoutonCreer = this.aut.saisieAttestations
      ? `<ie-btnicon class="icon_plus_fin avecFond m-right" role="button" ie-model="btnCreerAttestation" title="${GTraductions.getValeur("Attestation.titre")}"></ie-btnicon>`
      : "";
    T.push(`<div class="item attestations">\n                <div class="head-contain">\n                  <h2>${GTraductions.getValeur("FicheEleve.Attestations")}</h2>\n                  ${lBoutonCreer}\n                </div>\n                ${lAttestations.join("")}
              </div>`);
    return T.join("");
  }
  composeServicePeriscolaire() {
    const T = [];
    if (
      this.scolariteEleve.listeServicesAnnexes &&
      this.scolariteEleve.listeServicesAnnexes.count() > 0
    ) {
      T.push(
        `<div class="item"><label>${GTraductions.getValeur("FicheEleve.servicePeriscolaire")} :</label>\n      <span>${this.scolariteEleve.listeServicesAnnexes.getTableauLibelles().join(", ")}</span></div>`,
      );
    }
    return T.join("");
  }
  composeAllergies(aListeAllergies, aEstAlimentaire) {
    const T = [];
    T.push('<div class="item allergies">');
    T.push(
      `<h2>${aEstAlimentaire ? GTraductions.getValeur("FicheEleve.AllergiesAlimentaires") : GTraductions.getValeur("FicheEleve.AutresAllergies")} :</h2>`,
    );
    T.push("<ul>");
    aListeAllergies.parcourir((aAllergie) => {
      T.push(`<li>${aAllergie.getLibelle()}</li>`);
    });
    T.push("</ul>");
    T.push("</div>");
    return T.join("");
  }
  composeAutorisationsCommunications(aPersonne) {
    const T = [];
    const AutorisationCommunicationExiste =
      aPersonne.autoriseEmail ||
      aPersonne.autoriseSMS ||
      aPersonne.autoriseCourrier ||
      aPersonne.autoriseDiscussion;
    if (AutorisationCommunicationExiste) {
      T.push(
        `<div class="item autorisations">\n                <h2>${GTraductions.getValeur("FicheEleve.AutorisationCommunication")} :</h2>\n                  <ul>`,
      );
      T.push(
        `${aPersonne.telPort === "" ? `<li class="com-ko">${GTraductions.getValeur("FicheEleve.SMSImpossible")}</li>` : aPersonne.autoriseSMS ? `<li class="com-ok">${GTraductions.getValeur("FicheEleve.SMSOK")}</li>` : `<li class="com-ko">${GTraductions.getValeur("FicheEleve.SMSKO")}</li>`}`,
      );
      T.push(
        `${aPersonne.email && aPersonne.autoriseEmail ? `<li class="com-ok">${GTraductions.getValeur("FicheEleve.EmailOK")}</li>` : `<li class="com-ko">${GTraductions.getValeur("FicheEleve.EmailKO")}</li>`}`,
      );
      T.push(
        `${aPersonne.adresse1 === "" && aPersonne.adresse2 === "" && aPersonne.adresse3 === "" && aPersonne.adresse4 === "" ? `<li class="com-ko">${GTraductions.getValeur("FicheEleve.CourrierImpossible")}</li>` : aPersonne.autoriseCourrier ? `<li class="com-ok">${GTraductions.getValeur("FicheEleve.CourrierOK")}</li>` : `<li class="com-ko">${GTraductions.getValeur("FicheEleve.CourrierKO")}</li>`}`,
      );
      T.push(
        `${aPersonne.autoriseDiscussion ? `<li class="com-ok">${GTraductions.getValeur("FicheEleve.DiscussionsOK")}</li>` : `<li class="com-ko">${GTraductions.getValeur("FicheEleve.DiscussionsKO")}</li>`}`,
      );
      T.push("</ul>", "</div>");
    }
    return T.join("");
  }
  composeResponsablesEleve(aGenreOnglet) {
    const lListeResponsables = this.listeResponsables;
    const T = [];
    if (this.aut.ficheResponsables) {
      const lNbrResp = lListeResponsables.count();
      if (lNbrResp > 0) {
        T.push(
          `<div class="liste-individus" id="${this.idDivScrollResp + aGenreOnglet}">`,
        );
        for (let i = 0; i < lNbrResp; i++) {
          T.push(this.composeResponsable(lListeResponsables.get(i)));
        }
        T.push("</div>");
      } else {
        T.push(GTraductions.getValeur("FicheEleve.aucunAutreContact"));
      }
    }
    return T.join("");
  }
  composeResponsable(aResp) {
    const T = [];
    const InfosAdresse =
      aResp.adresse1 ||
      aResp.adresse2 ||
      aResp.adresse3 ||
      aResp.adresse4 ||
      aResp.CP ||
      aResp.ville ||
      aResp.pays;
    if (this.aut.ficheResponsables) {
      T.push(`<div class="infos-wrapper individu">\n                <div class="infos-contain">\n                  <div class="item responsabilite-contain">\n                    <div class="nom-prenom"> ${aResp.nom} ${aResp.lienParente ? `<span class="gris m-left"> (${aResp.lienParente})</span>` : ""}</div>\n                    ${aResp.niveauResponsabilite ? `<ie-chips tabindex=0 class="tag-style" >${aResp.niveauResponsabilite}</ie-chips>` : ""}\n                  </div>\n                    ${aResp.profession ? `<div class="item"><label>${GTraductions.getValeur("FicheEleve.Profession")} :</label><p>${aResp.profession}</p></div>` : ""}
                    ${aResp.situation ? `<div class="item"><label>${GTraductions.getValeur("FicheEleve.SituationProfessionnelle")} :</label><p>${aResp.situation}</p></div>` : ""}\n\n\n                    ${InfosAdresse ? this.composeAdresse(aResp) : ""}
                    ${this.composeTelephonesMail(aResp)}
                    ${this.composeContact(aResp)}
                    ${this.composeAutorisationsCommunications(aResp)}\n\n                    ${aResp.delegueClasse ? `<div class="item"><label>${GTraductions.getValeur("FicheEleve.deleguePE")} : </label><p> ${aResp.delegueClasse}</p></div>` : ""}
                    ${aResp.membreCA ? `<div class="item"><p>${GTraductions.getValeur("FicheEleve.membreConseilAdmin")}</p></div>` : ""}\n                </div>\n\n              </div>`);
    }
    return T.join("");
  }
  composeContact(aResp) {
    const T = [];
    if (
      [
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Mobile_PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.Mobile_PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      if (aResp.contactUrgence) {
        T.push(
          `<div class="item">\n                  <label class="icon_tel_urgence"></label>\n                  <p>${GTraductions.getValeur("FicheEleve.contactUrgence")}</p>\n                </div>`,
        );
      }
      if (aResp.autoriseRecupererEnfant) {
        T.push(
          `<div class="item">\n                  <label class="icon_tel_personne_autorise"></label>\n                  <p>${GTraductions.getValeur("FicheEleve.autoriseRecuperer")}</p>\n                </div>`,
        );
      }
    }
    return T.join("");
  }
}
InterfaceFicheEleve.genreOnglet = {
  Identite: 0,
  Scolarite: 1,
  Responsables: 2,
  Memos: 3,
};
function _geStrTelephoneAvecEspaces(aNumeroTelephone) {
  if (!aNumeroTelephone || !aNumeroTelephone.length) {
    return "";
  }
  let lResult = "";
  let lCompteur = 0;
  for (let i = aNumeroTelephone.length - 1; i >= 0; i--) {
    if (lCompteur % 2 === 0) {
      lResult = " " + lResult;
    }
    lResult = aNumeroTelephone.charAt(i) + lResult;
    lCompteur++;
  }
  return lResult.trim();
}
function _ouvrirFenetreAttestation(aAttestation) {
  const lListeAttestation = this.listeAttestations.getListeElements(
    (aElement) => {
      aElement.setActif(
        !(
          this.scolariteEleve.listeAttestations &&
          !!this.scolariteEleve.listeAttestations.getElementParElement(
            aElement,
            true,
          )
        ),
      );
      return aElement;
    },
  );
  const lTitre = aAttestation
    ? "Attestation.titreModifier"
    : "Attestation.titre";
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Attestation, {
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({ titre: GTraductions.getValeur(lTitre) });
    },
    pere: this,
    evenement: function (aNumeroBouton, aAttestation) {
      if (aNumeroBouton === 1) {
        if (this.scolariteEleve && this.scolariteEleve.listeAttestations) {
          const lIndiceAncien =
            this.scolariteEleve.listeAttestations.getIndiceParElement(
              aAttestation,
              false,
            );
          if (lIndiceAncien > -1) {
            this.scolariteEleve.listeAttestations.addElement(
              aAttestation,
              lIndiceAncien,
            );
          } else {
            this.scolariteEleve.listeAttestations.add(aAttestation);
          }
        }
      }
    },
  }).setDonnees({
    listeTypes: lListeAttestation,
    eleve: this.eleve,
    attestation: aAttestation,
  });
}
function _evenementListeMemo(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Creation:
      _ouvrirFenetreMemo.call(this);
      break;
    case EGenreEvenementListe.Edition:
      _ouvrirFenetreMemo.call(this, aParametres.article);
      break;
    case EGenreEvenementListe.Suppression: {
      const lListeMemo = new ObjetListeElements();
      lListeMemo.add(aParametres.article);
      new ObjetRequeteSaisieMemoEleve(this).lancerRequete({
        eleve: this.eleve,
        listeMemos: lListeMemo,
        estValorisation: this.festValorisation,
      });
      _actualiserListeMemo.call(this);
      break;
    }
  }
}
function _ouvrirFenetreProjetAccompagnement(aProjet) {
  this.scolariteEleve.listeProjets.parcourir((aProjet) => {
    const lType = this.listeTypes.getElementParElement(
      aProjet.projetIndividuel,
    );
    if (lType && !(!!aProjet.dateDebut || !!aProjet.dateFin)) {
      lType.setActif(false);
    }
  });
  const lTitre = aProjet
    ? "FicheEleve.modifierProjetAccompagnement"
    : "FicheEleve.nouveauProjetAccompagnement";
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ProjetAccompagnement, {
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({ titre: GTraductions.getValeur(lTitre) });
    },
    pere: this,
    evenement: function (aNumeroBouton) {
      if (aNumeroBouton === 1) {
        if (this.scolariteEleve && this.scolariteEleve.listeProjets) {
          this.actualiser();
        }
      }
    },
  }).setDonnees({
    listeTypes: this.listeTypes,
    listeMotifs: this.listeMotifs,
    eleve: this.eleve,
    projetAccompagnement: aProjet,
  });
}
function _composeProjetsAccompagnement() {
  const T = [];
  const lAvecSaisie =
    ![
      EGenreEspace.PrimPeriscolaire,
      EGenreEspace.Mobile_PrimPeriscolaire,
    ].includes(GEtatUtilisateur.GenreEspace) &&
    GApplication.droits.get(TypeDroits.eleves.avecSaisieProjetIndividuel);
  const lBoutonCreer = lAvecSaisie
    ? ` <ie-btnicon class="icon_plus_fin avecFond m-right" role="button" ie-model="btnCreerProjetAccompagnement" title="${GTraductions.getValeur("FicheEleve.nouveauProjetAccompagnement")}"></ie-btnicon>`
    : "";
  T.push(
    `<div class="item projets">\n            <div class="head-contain">\n              <h2>${GTraductions.getValeur("PageCompte.ProjetsAccompagnement")}</h2>\n              ${lBoutonCreer}\n            </div>\n        <div class="projets-wrapper">\n          ${UtilitaireProjetAccompagnement.composeListeProjetsAccompagnement(this.scolariteEleve.listeProjets, { avecEdition: lAvecSaisie })}\n        </div>\n  </div>`,
  );
  return T.join("");
}
function _actualiserListeMemo() {
  this.getInstance(this.identListeMemosEleves).setDonnees(
    new DonneesListe_MemosEleves(this.listeMemosEleves, {
      estValorisation: false,
    }),
  );
}
function _ouvrirFenetreMemo(aMemo) {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_MemoEleve, {
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("AbsenceVS.memo"),
      });
    },
    pere: this,
    evenement: function (aGenreBouton, aMemo) {
      if (aGenreBouton === 1) {
        if (aMemo.getEtat() === EGenreEtat.Creation) {
          this.listeMemosEleves.add(aMemo);
        }
        this.actualiser();
      }
    },
  }).setDonnees({ memo: aMemo, eleve: this.eleve, estValorisation: false });
}
function _ouvrirFenetreDetailsPIEleve(aProjet) {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsPIEleve, {
    pere: this,
  }).setDonnees({ eleve: this.eleve, projet: aProjet });
}
module.exports = { InterfaceFicheEleve };
