const { MethodesObjet } = require("MethodesObjet.js");
const { Identite } = require("ObjetIdentite.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GestionnaireBlocDeBase } = require("GestionnaireBloc.js");
const { ObjetBlocPN } = require("GestionnaireBlocPN.js");
const { ObjetChampFormulaire } = require("ObjetChampFormulaire.js");
const { EGenreTypeChampForm } = require("ObjetChampFormulaire.js");
const { EGenreTypeTel } = require("ObjetChampFormulaire.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GUID } = require("GUID.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GPosition } = require("ObjetPosition.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_DetailsAutreContact,
} = require("ObjetFenetre_DetailsAutreContact.js");
const EGenreEvntSaisieAutreContact = { suppression: 1, validation: 2 };
const EGenreErreurFormAutresContacts = { auMoinsUnTel: 1, nomObligatoire: 2 };
class ObjetCompte_AutresContacts extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
    this.param = {
      listeAutresContacts: new ObjetListeElements(),
      listeLiensParente: new ObjetListeElements(),
      listeContactsAutresEnfants: new ObjetListeElements(),
    };
    const lGuid = GUID.getId();
    this.idConteneurFiches = lGuid + "_conteneurFichesContact";
    this.idBoutonRecup = lGuid + "_btnRecup";
    this.gestionnaireBlocsAutresContacts = Identite.creerInstance(
      GestionnaireBlocAutresContacts,
      { pere: this, evenement: this._surEvntGestionnaireAutresContacts },
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnCreerContact: {
        event() {
          _evntBtnCreerContact.call(aInstance);
        },
      },
      avecBoutonRecupererContact() {
        const lListeContactsRecuperables =
          _getListeContactsRecuperables.call(aInstance);
        return (
          lListeContactsRecuperables && lListeContactsRecuperables.count() > 0
        );
      },
      btnRecupererContact: {
        event() {
          const lElt = this.node;
          _evntBtnRecupContact.call(aInstance, { id: lElt.id });
        },
      },
      btnSupprimer: {
        event(aIndice) {
          const lListe = aInstance.param.listeAutresContacts;
          const lElt = lListe.get(aIndice);
          const lMsgConfirmSuppression = GTraductions.getValeur(
            "InfosEnfantPrim.autresContacts.msgConfirmSuppression",
          );
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: lMsgConfirmSuppression,
            callback: function (aGenreAction) {
              _evntSuppressionContactElt.call(aInstance, lElt, aGenreAction);
            },
          });
        },
      },
      btnDetails: {
        event(aIndice) {
          const lListe = aInstance.param.listeAutresContacts;
          const lElt = lListe.get(aIndice);
          const lCopie = lElt;
          if (aInstance.fenetreDatailAutreContact) {
            aInstance.fenetreDatailAutreContact.fermer();
          }
          aInstance.fenetreDatailAutreContact =
            ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_DetailsAutreContact,
              {
                pere: this,
                initialiser: function (aInstanceFenetre) {
                  aInstanceFenetre.setOptionsFenetre({
                    titre: lElt.getLibelle(),
                    largeur: 500,
                  });
                },
              },
            );
          aInstance.fenetreDatailAutreContact.setDonnees(
            _composeBlocContact.call(aInstance, lCopie),
          );
          aInstance.gestionnaireBlocsAutresContacts.refreshInstance(
            lElt.indiceInstanceMetier,
          );
          aInstance.fenetreDatailAutreContact.afficher();
        },
      },
    });
  }
  avecContactVideUniquement() {
    let lResult = false;
    const lNbrElement = this.param.listeAutresContacts.count();
    if (lNbrElement > 0) {
      const lElt = this.param.listeAutresContacts.get(lNbrElement - 1);
      lResult = estEltAutreContactVide.call(this, lElt);
    }
    return lResult;
  }
  setDonnees(aParam) {
    $.extend(true, this.param, aParam);
    const lEltAucun = new ObjetElement(
      GTraductions.getValeur("Aucun"),
      0,
      null,
      0,
    );
    this.param.listeLiensParente.insererElement(lEltAucun, 0);
    this.gestionnaireBlocsAutresContacts.setOptions({
      listeLiensParente: this.param.listeLiensParente,
    });
    this.donneesRecues = true;
    GHtml.setHtml(this.Nom, this.construireAffichage(), {
      controleur: this.controleur,
    });
    this.gestionnaireBlocsAutresContacts.refresh();
  }
  construireAffichage() {
    return _compose.call(this);
  }
  getTitre() {
    return GTraductions.getValeur(
      "InfosEnfantPrim.autresContacts.titreRubrique",
    );
  }
  _surEvntGestionnaireAutresContacts(aElt, aGenreEvnt) {
    switch (aGenreEvnt) {
      case EGenreEvntSaisieAutreContact.suppression:
        _supprimerContact.call(this, aElt, { avecFicheVideParDefaut: true });
        break;
      case EGenreEvntSaisieAutreContact.validation:
        _validerContact.call(this, aElt);
        this.fenetreDatailAutreContact.fermer();
        break;
    }
  }
  declencherCallback(aParam) {
    if (this.Pere && this.Evenement) {
      this.callback.appel(aParam);
    }
  }
}
function _getListeContactsRecuperables() {
  const lListe = new ObjetListeElements();
  const lNbr = this.param.listeContactsAutresEnfants.count();
  for (let i = 0; i < lNbr; i++) {
    const lElt = this.param.listeContactsAutresEnfants.get(i);
    const lIndice = this.param.listeAutresContacts.getIndiceElementParFiltre(
      (D) => {
        return lElt.getNumero() === D.getNumero();
      },
    );
    if (lIndice === -1) {
      lListe.addElement(lElt);
    }
  }
  lListe.setTri([ObjetTri.init("Libelle")]);
  lListe.trier();
  return lListe;
}
function _compose() {
  if (this.donneesRecues) {
    return _composeAutresContacts.call(this);
  } else {
    return "";
  }
}
function _composeAutresContacts() {
  const H = [];
  const lListe = this.param.listeAutresContacts;
  H.push(
    '<div id="',
    this.idConteneurFiches,
    '" class="FlexContainer_AutresContacts">',
  );
  let lElt;
  if (!this.avecContactVideUniquement()) {
    for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
      lElt = lListe.get(i);
      H.push(`<div tabindex="0" class="contact-line">`);
      const lStrLienParente = lElt.lienParente
        ? lElt.lienParente.getLibelle()
        : "";
      H.push('<div class="fluid-bloc contact-contain icon_uniF2BD">');
      H.push('<div class="fluid-bloc flex-contain cols">');
      H.push('<div class="name">', lElt.getLibelle());
      if (lStrLienParente) {
        H.push(" <span>(", lStrLienParente, ")</span>");
      }
      H.push("</div>");
      H.push('<div class="tel">', lElt.telMobile, "</div>");
      H.push("</div>");
      H.push("</div>");
      H.push('<div class="flex-contain flex-center fix-bloc flex-gap">');
      H.push(
        '  <ie-bouton ie-model="btnDetails(',
        i,
        ')" title="',
        GTraductions.getValeur("PageCompte.Details"),
        '">',
        GTraductions.getValeur("PageCompte.Details"),
        "</ie-bouton>",
      );
      H.push(
        '  <ie-btnicon ie-model="btnSupprimer(',
        i,
        ')" class="avecFond icon_trash" title="',
        GTraductions.getValeur("Supprimer"),
        '"></ie-btnicon>',
      );
      H.push("  </div>");
      H.push("</div>");
    }
  }
  H.push(
    '<div class="flex-contain flex-center flex-wrap flex-gap justify-end m-top-l">',
  );
  H.push(
    '<ie-bouton ie-model="btnCreerContact" ie-icon="icon_user" class="themeBoutonNeutre">',
    GTraductions.getValeur("InfosEnfantPrim.autresContacts.ajouterContact"),
    "</ie-bouton>",
  );
  H.push(
    '<ie-bouton ie-if="avecBoutonRecupererContact" id="',
    this.idBoutonRecup,
    '" ie-model="btnRecupererContact" ie-icon="icon_copier_liste" class="themeBoutonNeutre m-left-l">',
    GTraductions.getValeur("InfosEnfantPrim.autresContacts.recupererContact"),
    "</ie-bouton>",
  );
  H.push("</div>");
  H.push("</div>");
  return H.join("");
}
function _composeBlocContact(aElt) {
  const H = [];
  const lBloc = this.gestionnaireBlocsAutresContacts.composeBloc(aElt);
  H.push('<div class="FlexItem_AutresContacts">');
  H.push(lBloc.html);
  H.push("</div>");
  return { html: H.join(""), controleur: lBloc.controleur };
}
function _ajouterFichePourElt(aElt) {
  this.param.listeAutresContacts.addElement(aElt);
  const lNewBloc = _composeBlocContact.call(this, aElt);
  if (this.fenetreDatailAutreContact) {
    this.fenetreDatailAutreContact.fermer();
  }
  this.fenetreDatailAutreContact = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_DetailsAutreContact,
    {
      pere: this,
      initialiser: function (aInstanceFenetre) {
        aInstanceFenetre.setOptionsFenetre({
          titre: GTraductions.getValeur(
            "InfosEnfantPrim.autresContacts.ajouterContact",
          ),
          largeur: 500,
        });
      },
    },
  );
  this.fenetreDatailAutreContact.setDonnees(lNewBloc);
  this.gestionnaireBlocsAutresContacts.refreshInstance(
    aElt.indiceInstanceMetier,
  );
  this.fenetreDatailAutreContact.afficher();
}
function _evntBtnCreerContact() {
  const lElt = getEltAutreContactVide.call(this);
  _ajouterFichePourElt.call(this, lElt);
}
function _evntBtnRecupContact(aParam) {
  ObjetMenuContextuel.afficher({
    pere: this,
    initCommandes: function (aMenu) {
      const lListeContactsRecuperables =
        _getListeContactsRecuperables.call(this);
      if (lListeContactsRecuperables) {
        lListeContactsRecuperables.parcourir((D) => {
          aMenu.add(D.getLibelle(), true, function () {
            if (this.avecContactVideUniquement()) {
              const lEltFicheVide = this.param.listeAutresContacts.get(0);
              lEltFicheVide.setEtat(EGenreEtat.Suppression);
              _supprimerContact.call(this, lEltFicheVide, {
                avecFicheVideParDefaut: false,
              });
            }
            _ajouterFichePourElt.call(this, D);
          });
        });
      }
    },
    id: {
      x: GPosition.getLeft(aParam.id),
      y: IE.estMobile
        ? GPosition.getTop(aParam.id)
        : GPosition.getTop(aParam.id) + GPosition.getHeight(aParam.id) + 2,
    },
  });
}
function getEltAutreContactVide() {
  const lContactVide = new ObjetElement();
  lContactVide.nom = "";
  lContactVide.prenom = "";
  lContactVide.indMobile = "";
  lContactVide.indDomicile = "";
  lContactVide.indTravail = "";
  lContactVide.telMobile = "";
  lContactVide.telDomicile = "";
  lContactVide.telTravail = "";
  lContactVide.appelSiUrgent = true;
  lContactVide.autoriseARecuperer = true;
  lContactVide.lienParente =
    this.param.listeLiensParente.getElementParNumero(0);
  lContactVide.setEtat(EGenreEtat.Creation);
  return lContactVide;
}
function estEltAutreContactVide(aElt) {
  return (
    aElt.getEtat() === EGenreEtat.Creation &&
    aElt.nom === "" &&
    aElt.prenom === "" &&
    aElt.indMobile === "" &&
    aElt.indDomicile === "" &&
    aElt.indTravail === "" &&
    aElt.telMobile === "" &&
    aElt.telDomicile === "" &&
    aElt.telTravail === "" &&
    aElt.appelSiUrgent === true &&
    aElt.autoriseARecuperer === true &&
    aElt.lienParente &&
    aElt.lienParente.getNumero() === 0
  );
}
function _supprimerContact(aElt, aParam) {
  const lIndiceInstance = aElt.indiceInstanceMetier;
  const lNomZone =
    this.gestionnaireBlocsAutresContacts.reInitInstance(lIndiceInstance);
  $("#" + lNomZone.escapeJQ())
    .parent()
    .removeClass("FlexItem_AutresContacts");
  const lIndice = this.param.listeAutresContacts.getIndiceParElement(aElt);
  if (lIndice >= 0 && MethodesObjet.isNumber(lIndice)) {
    this.param.listeAutresContacts.remove(lIndice);
  }
  if (
    aParam.avecFicheVideParDefaut === true &&
    this.param.listeAutresContacts.count() === 0
  ) {
    _evntBtnCreerContact.call(this);
  }
  if (aElt.pourValidation()) {
    const lListeSaisie = new ObjetListeElements();
    lListeSaisie.addElement(aElt);
    this.declencherCallback({ listeSaisie: lListeSaisie });
  }
}
function _validerContact(aElt) {
  const lListeSaisie = new ObjetListeElements();
  lListeSaisie.addElement(aElt);
  this.declencherCallback({ listeSaisie: lListeSaisie });
}
class GestionnaireBlocAutresContacts extends GestionnaireBlocDeBase {
  constructor(...aParams) {
    super(...aParams);
  }
  composeBloc(aDataBloc) {
    this.instanceMetier = this.getInstanceObjetMetier(
      aDataBloc,
      ObjetSaisieAutreContact,
    );
    return {
      html: this.composeZoneInstance(this.instanceMetier),
      controleur: this.instanceMetier.controleur,
    };
  }
}
class ObjetSaisieAutreContact extends ObjetBlocPN {
  constructor(...aParams) {
    super(...aParams);
    this.param = {};
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      cbAppelerSiUrgent: {
        getValue: function () {
          return !!aInstance.donnee && !!aInstance.donnee.appelSiUrgent;
        },
        setValue: function (aValeur) {
          if (!!aInstance.donnee) {
            aInstance.donnee.appelSiUrgent = aValeur;
            aInstance.donnee.setEtat(EGenreEtat.Modification);
          }
        },
      },
      cbAutoriserARecuperer: {
        getValue: function () {
          return !!aInstance.donnee && !!aInstance.donnee.autoriseARecuperer;
        },
        setValue: function (aValeur) {
          if (!!aInstance.donnee) {
            aInstance.donnee.autoriseARecuperer = aValeur;
            aInstance.donnee.setEtat(EGenreEtat.Modification);
          }
        },
      },
      btnValiderFen: {
        event: function () {
          const lValidation = validerDonneesCorrectes.call(aInstance);
          if (lValidation.succes) {
            _evntValiderContact.call(aInstance);
          } else {
            _surErreurValidation.call(aInstance, lValidation);
          }
        },
        getDisabled: function () {
          const lValidation = validerDonneesCorrectes.call(aInstance);
          return !lValidation.succes;
        },
      },
      btnSupprimer: {
        event: function () {
          const lMsgConfirmSuppression = GTraductions.getValeur(
            "InfosEnfantPrim.autresContacts.msgConfirmSuppression",
          );
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: lMsgConfirmSuppression,
            callback: function (aGenreAction) {
              _evntSuppressionContact.call(aInstance, aGenreAction);
            },
          });
        },
      },
    });
  }
  setParametres(aElement, aOptions) {
    super.setParametres(aElement, aOptions);
    this.options = aOptions;
  }
  construireInstances() {
    this.identNom = this.add(
      ObjetChampFormulaire,
      _evntNom.bind(this),
      _initChmpTexte.bind(this, {
        label: {
          str: GTraductions.getValeur("InfosEnfantPrim.autresContacts.nom"),
        },
      }),
    );
    this.identPrenom = this.add(
      ObjetChampFormulaire,
      _evntPrenom.bind(this),
      _initChmpTexte.bind(this, {
        label: {
          str: GTraductions.getValeur("InfosEnfantPrim.autresContacts.prenom"),
        },
      }),
    );
    this.identLienParente = this.add(
      ObjetChampFormulaire,
      _evntLienParente.bind(this),
      _initChmpCombo.bind(this, {
        label: {
          str: GTraductions.getValeur("InfosEnfantPrim.autresContacts.parente"),
        },
      }),
    );
    this.identTelDom = this.add(
      ObjetChampFormulaire,
      _evntTel.bind(this, EGenreTypeTel.domicile),
      _initChmpTel.bind(this, { typeTel: EGenreTypeTel.domicile }),
    );
    this.identTelMob = this.add(
      ObjetChampFormulaire,
      _evntTel.bind(this, EGenreTypeTel.mobile),
      _initChmpTel.bind(this, { typeTel: EGenreTypeTel.mobile }),
    );
    this.identTelPro = this.add(
      ObjetChampFormulaire,
      _evntTel.bind(this, EGenreTypeTel.professionnel),
      _initChmpTel.bind(this, { typeTel: EGenreTypeTel.professionnel }),
    );
  }
  construireStructureAffichage() {
    const H = [];
    if (this.donneesRecues) {
      H.push('<div class="SaisieContact_Fiche">');
      H.push(
        '<div class="switch-contain" onclick="event.stopPropagation();">',
        '<ie-switch ie-model="cbAppelerSiUrgent">',
        GTraductions.getValeur("InfosEnfantPrim.autresContacts.cbAAppeler"),
        "</ie-switch>",
        "</div>",
      );
      H.push(
        '<div class="switch-contain" onclick="event.stopPropagation();">',
        '<ie-switch ie-model="cbAutoriserARecuperer">',
        GTraductions.getValeur(
          "InfosEnfantPrim.autresContacts.cbAutoriseARecuperer",
        ),
        "</ie-switch>",
        "</div>",
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identNom),
        '"></div>',
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identPrenom),
        '"></div>',
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identLienParente),
        '"></div>',
      );
      H.push(
        '<div class="message-tel">',
        GTraductions.getValeur(
          "InfosEnfantPrim.autresContacts.infoTelObligatoire",
        ),
        "</div>",
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identTelMob),
        '"></div>',
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identTelDom),
        '"></div>',
      );
      H.push(
        '<div class="champ-contact" id="',
        this.getNomInstance(this.identTelPro),
        '"></div>',
      );
      H.push('<div class="GrandEspaceHaut FlexItem_BtnContact">');
      H.push(
        '<ie-bouton ie-model="btnValiderFen" class="' +
          TypeThemeBouton.primaire +
          '">',
        GTraductions.getValeur("Valider"),
        "</ie-bouton>",
      );
      H.push("</div>");
      H.push("</div>");
    }
    return H.join("");
  }
  recupererDonnees() {
    if (this.donneesRecues === true) {
      this.getInstance(this.identNom).setDonnees({ valeur: this.donnee.nom });
      this.getInstance(this.identPrenom).setDonnees({
        valeur: this.donnee.prenom,
      });
      this.getInstance(this.identLienParente).setDonnees({
        liste: this.options.listeLiensParente,
        selection: this.donnee.lienParente,
      });
      this.getInstance(this.identTelDom).setDonnees({
        valeur: { ind: this.donnee.indDomicile, tel: this.donnee.telDomicile },
      });
      this.getInstance(this.identTelMob).setDonnees({
        valeur: { ind: this.donnee.indMobile, tel: this.donnee.telMobile },
      });
      this.getInstance(this.identTelPro).setDonnees({
        valeur: { ind: this.donnee.indTravail, tel: this.donnee.telTravail },
      });
    }
  }
  declencherCallback(aParam) {
    if (this.Pere && this.Evenement) {
      this.callback.appel(aParam.donnee, aParam.genreEvnt);
    }
  }
}
function _evntSurSaisieChampTel() {
  const lChmpTel = this.getInstance(this.identTelMob);
  const lResult = validerAuMoinsUnTel.call(this);
  if (lResult.succes) {
    lChmpTel.setMsgErreur({ msg: "" });
  } else {
    _surErreurValidation.call(this, lResult);
  }
}
function _evntSurSaisieChampNom() {
  const lChmp = this.getInstance(this.identNom);
  if (lChmp.avecMsgErreur()) {
    const lResult = validerNom.call(this);
    if (lResult.succes) {
      lChmp.setMsgErreur({ msg: "" });
    }
  }
}
function _initChmpTexte(aParam, aInstance) {
  const lParam = $.extend(
    true,
    {
      typeChamp: EGenreTypeChampForm.texte,
      maxLength: 100,
      estOptionnel: false,
      label: { avecOption: true },
    },
    aParam,
  );
  aInstance.setParametres(lParam);
}
function _initChmpCombo(aParam, aInstance) {
  const lParam = $.extend(
    true,
    {
      typeChamp: EGenreTypeChampForm.combo,
      estOptionnel: false,
      maxLength: 100,
      label: { avecOption: true },
    },
    aParam,
  );
  aInstance.setParametres(lParam);
}
function _initChmpTel(aParam, aInstance) {
  const lParam = $.extend(
    true,
    {
      typeChamp: EGenreTypeChampForm.tel,
      placeholder: { avecOption: true, str: "TODO Optionnel" },
    },
    aParam,
  );
  aInstance.setParametres(lParam);
}
function _evntNom(aParam) {
  this.donnee.nom = aParam.valeur;
  this.donnee.setEtat(EGenreEtat.Modification);
  _evntSurSaisieChampNom.call(this);
}
function _evntPrenom(aParam) {
  this.donnee.prenom = aParam.valeur;
  this.donnee.setEtat(EGenreEtat.Modification);
}
function _evntLienParente(aParam) {
  this.donnee.lienParente = aParam.valeur;
}
function _evntTel(aGenreTel, aParam) {
  switch (aGenreTel) {
    case EGenreTypeTel.domicile:
      this.donnee.indDomicile = aParam.valeur.ind;
      this.donnee.telDomicile = aParam.valeur.tel;
      break;
    case EGenreTypeTel.mobile:
      this.donnee.indMobile = aParam.valeur.ind;
      this.donnee.telMobile = aParam.valeur.tel;
      break;
    case EGenreTypeTel.professionnel:
      this.donnee.indTravail = aParam.valeur.ind;
      this.donnee.telTravail = aParam.valeur.tel;
      break;
  }
  this.donnee.setEtat(EGenreEtat.Modification);
  _evntSurSaisieChampTel.call(this);
}
function _evntValiderContact() {
  this.donnee.setEtat(EGenreEtat.Modification);
  this.declencherCallback({
    donnee: this.donnee,
    genreEvnt: EGenreEvntSaisieAutreContact.validation,
  });
}
function _evntSuppressionContact(aGenreAction) {
  if (aGenreAction !== EGenreAction.Valider) {
    return;
  }
  if (this.donnee.getEtat() !== EGenreEtat.Suppression) {
    this.donnee.setEtat(EGenreEtat.Suppression);
    this.declencherCallback({
      donnee: this.donnee,
      genreEvnt: EGenreEvntSaisieAutreContact.suppression,
    });
  }
}
function _evntSuppressionContactElt(aElt, aGenreAction) {
  if (aGenreAction !== EGenreAction.Valider) {
    return;
  }
  if (aElt.getEtat() !== EGenreEtat.Suppression) {
    aElt.setEtat(EGenreEtat.Suppression);
    const lListeSaisie = new ObjetListeElements();
    lListeSaisie.addElement(aElt);
    this.declencherCallback({
      listeSaisie: lListeSaisie,
      genreEvnt: EGenreEvntSaisieAutreContact.suppression,
    });
  }
}
function validerDonneesCorrectes() {
  let lResult = { succes: false, genreErreur: null };
  lResult = validerNom.call(this);
  if (lResult.succes === true) {
    lResult = validerAuMoinsUnTel.call(this);
  }
  return lResult;
}
function validerAuMoinsUnTel() {
  let lTypeErreur = null;
  const lSucces =
    this.donnee.telDomicile !== "" ||
    this.donnee.telMobile !== "" ||
    this.donnee.telTravail !== "";
  if (!lSucces) {
    lTypeErreur = EGenreErreurFormAutresContacts.auMoinsUnTel;
  }
  return { succes: lSucces, genreErreur: lTypeErreur };
}
function validerNom() {
  let lTypeErreur = null;
  const lSucces = this.donnee.nom !== "";
  if (!lSucces) {
    lTypeErreur = EGenreErreurFormAutresContacts.nomObligatoire;
  }
  return { succes: lSucces, genreErreur: lTypeErreur };
}
function _surErreurValidation(aParam) {
  switch (aParam.genreErreur) {
    case EGenreErreurFormAutresContacts.auMoinsUnTel:
      this.getInstance(this.identTelMob).setMsgErreur({
        msg: GTraductions.getValeur(
          "InfosEnfantPrim.autresContacts.msgAuMoinsUnTel",
        ),
      });
      break;
    case EGenreErreurFormAutresContacts.nomObligatoire:
      this.getInstance(this.identNom).setMsgErreur({
        msg: GTraductions.getValeur(
          "InfosEnfantPrim.autresContacts.msgNomObligatoire",
        ),
      });
      break;
    default:
      break;
  }
}
module.exports = { ObjetCompte_AutresContacts };
