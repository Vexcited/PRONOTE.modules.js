const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
class PageEntreprise extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.hauteurs = {};
    this.hauteurs.libelle = 20;
    this.largeurs = {};
    this.largeurs.libelle = 160;
    this.largeurs.combo = 70;
    this.largeurs.field = 375;
    this.largeurs.indicatif = 40;
    this.id = {};
    this.id.nomContact = this.Nom + "_nomContact";
    this.id.prenomContact = this.Nom + "_prenomContact";
    this.id.emailContact = this.Nom + "_emailContact";
    this.id.fonctionContact = this.Nom + "_fonctionContact";
    this.id.estResponsable = this.Nom + "_estResponsable";
    this.classFloatPere = GUID.getClassCss();
    this.classFloatInfo = GUID.getClassCss();
    this.typeZoneSaisie = {
      fax: 1,
      siret: 2,
      urssaf: 3,
      nomResp: 4,
      prenomResp: 5,
      eMailResp: 8,
      siteWeb: 12,
    };
    this.comboCivilite = new ObjetSaisie(
      this.Nom + ".comboCivilite",
      null,
      this,
      this.evenementSurComboCivilite,
    );
    this.comboContact = new ObjetSaisie(
      this.Nom + ".comboContact",
      null,
      this,
      this.evenementSurComboContact,
    );
  }
  initialiserObjetsGraphique() {
    this.comboCivilite.setOptionsObjetSaisie({
      longueur: this.largeurs.combo,
      hauteur: this.hauteurs.libelle - 2,
      controlerNbrElements: null,
      classTexte: "",
    });
    this.comboCivilite.setOptionsObjetSaisie({
      largeurTexteEdit: this.largeurs.libelle,
    });
    this.comboCivilite.initialiser();
    const lIndice = this.contact
      ? this.entrepriseSaisie.civilites.getIndiceParElement(
          this.contact.civilite,
        )
      : 0;
    this.comboCivilite.setDonnees(
      this.entrepriseSaisie.civilites,
      lIndice ? lIndice : 0,
    );
    this.comboContact.setOptionsObjetSaisie({
      longueur: 200,
      hauteur: this.hauteurs.libelle - 2,
      controlerNbrElements: null,
      classTexte: "",
    });
    this.comboContact.setOptionsObjetSaisie({
      largeurTexteEdit: this.largeurs.libelle,
    });
    this.comboContact.initialiser();
    this.comboContact.setDonnees(
      this.entrepriseSaisie.contacts,
      this.indexContactCourant ? this.indexContactCourant : 0,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      TelEntreprise: {
        getValue: function (aChamp) {
          return aInstance.entrepriseSaisie[aChamp];
        },
        setValue: function (aChamp, aValue) {
          aInstance.entrepriseSaisie[aChamp] = aValue;
        },
        getDisabled: function () {
          return !aInstance.autorisations.avecSaisie;
        },
      },
      TelResp: {
        getValue: function (aChamp) {
          return aInstance.entrepriseSaisie.contacts.get(
            aInstance.indexContactCourant,
          )[aChamp];
        },
        setValue: function (aChamp, aValue) {
          const lContact = aInstance.entrepriseSaisie.contacts.get(
            aInstance.indexContactCourant,
          );
          lContact[aChamp] = aValue;
          lContact.setEtat(EGenreEtat.Modification);
        },
        getDisabled: function () {
          return !aInstance.autorisations.avecSaisie;
        },
      },
    });
  }
  setParametres() {}
  setDonnees(aEntreprise, aAutorisations, aContactSelectionne) {
    this.entreprise = aEntreprise;
    this.autorisations = aAutorisations;
    this.entrepriseSaisie = MethodesObjet.dupliquer(aEntreprise);
    this.indexContactCourant = aContactSelectionne ? aContactSelectionne : 0;
    this.DonneesRecues = true;
    this.actualiserAffichage();
  }
  actualiserAffichage(aSurResize) {
    if (!this.DonneesRecues) {
      return;
    }
    if (aSurResize) {
      $("#" + this.Nom.escapeJQ() + " ." + this.classFloatPere).css({
        width: 375 + "px",
      });
      $("#" + this.Nom.escapeJQ() + " ." + this.classFloatInfo).css({
        width: 375 - this.largeurs.libelle - 7 + "px",
      });
    }
    const lWidth =
      Math.floor(($("#" + this.Nom.escapeJQ()).width() - 10) / 2) - 27;
    this.largeurs.field = Math.max(lWidth, 375);
    if (!aSurResize) {
      GHtml.setHtml(this.Nom, this.construireAffichage(), {
        controleur: this.controleur,
      });
      this.initialiserObjetsGraphique();
    } else {
      $("#" + this.Nom.escapeJQ() + " ." + this.classFloatPere).css({
        width: this.largeurs.field + "px",
      });
      $("#" + this.Nom.escapeJQ() + " ." + this.classFloatInfo).css({
        width: this.largeurs.field - this.largeurs.libelle - 7 + "px",
      });
    }
    if (
      !this.entrepriseSaisie.contacts ||
      this.entrepriseSaisie.contacts.count() < 2
    ) {
      $("#" + (this.Nom + ".comboContact").escapeJQ()).hide();
    }
  }
  construireAffichage() {
    if (!this.DonneesRecues) {
      return "";
    }
    const lHtml = [];
    lHtml.push('<div class="page-entreprise-conteneur">');
    lHtml.push(
      '<div class="bloc-infos">',
      "  <h4>",
      GTraductions.getValeur("entreprise.titreEntreprise"),
      "</h4>",
      "  <fieldset>",
      this.composeEntreprise(),
      "</fieldset>",
      "</div>",
    );
    if (
      this.entrepriseSaisie.contacts &&
      this.entrepriseSaisie.contacts.count() > 0
    ) {
      lHtml.push(
        '<div class="bloc-infos">',
        "  <h4>",
        GTraductions.getValeur("entreprise.titreResponsable"),
        "</h4>",
        "  <fieldset>",
        this.composeResponsable(),
        "</fieldset>",
        "</div>",
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeEntreprise() {
    const lHtml = [];
    lHtml.push(
      '<div class="rs-contain">',
      this.composeRaisonSociale(),
      this.composeSecteur(),
      this.composeAdresse(),
      "</div>",
      this.composeTelephoneFixe(),
      this.composeTelephonePort(),
      this.composeFax(),
      this.composeSIRET(),
      this.composeURSSAF(),
      this.composeSiteWeb(),
    );
    return lHtml.join("");
  }
  composeResponsable() {
    this.contact = this.entrepriseSaisie.contacts.get(this.indexContactCourant);
    const lHtml = [];
    lHtml.push(
      '<div id="',
      this.Nom + '.comboContact" class="m-bottom"></div>',
      this.composeNomResponsable(),
      this.composePrenomResponsable(),
      '<div id="',
      this.id.fonctionContact,
      '">',
      this.composeFonction(),
      "</div>",
      '<div id="',
      this.id.estResponsable,
      '">',
      this.composeEstResponsableMaitreDeStage(),
      "</div>",
      this.composeTelFixeResp(),
      this.composeTelPortResp(),
      this.composeFaxResp(),
      this.composeEmailResp(),
    );
    return lHtml.join("");
  }
  composeNomResponsable() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        '<label class="resp-name"><span>',
        GTraductions.getValeur("entreprise.nom"),
        '</span><div id="',
        this.Nom + '.comboCivilite"></div>',
        "</label>",
        '<input id="',
        this.id.nomContact,
        '" class="round-style" type="text" value="',
        this.contact.nom,
        '" size="30" title="',
        GTraductions.getValeur("entreprise.infoNom"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.nomResp,
        ', this)">',
        "</div>",
      );
    } else {
      if (this.contact.nom) {
        lHtml.push(
          '<div class="field-contain">',
          "<label>",
          GTraductions.getValeur("entreprise.nom"),
          "</label>",
          "<label>",
          this.contact.nom,
          "</label>",
          "</div>",
        );
      }
    }
    return lHtml.join("");
  }
  composePrenomResponsable() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        "<label>",
        GTraductions.getValeur("entreprise.prenom"),
        "</label>",
        '<input id="',
        this.id.prenomContact,
        '" class="round-style" type="text" value="',
        this.contact.prenoms,
        '" size="30" title="',
        GTraductions.getValeur("entreprise.infoPrenom"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.prenomResp,
        ', this)">',
        "</div>",
      );
    } else {
      if (this.contact.prenoms) {
        lHtml.push(
          '<div class="field-contain">',
          "<label>",
          GTraductions.getValeur("entreprise.nom"),
          "</label>",
          "<label>",
          this.contact.prenoms,
          "</label>",
          "</div>",
        );
      }
    }
    return lHtml.join("");
  }
  composeFonction() {
    const lHtml = [];
    if (
      this.contact &&
      this.contact.fonction &&
      this.contact.fonction.existeNumero()
    ) {
      lHtml.push(
        '<div class="field-contain">',
        "<label></label>",
        "<label>",
        this.contact.fonction.getLibelle(),
        "</label>",
        "</div>",
      );
    }
    return lHtml.join("");
  }
  composeEstResponsableMaitreDeStage() {
    const lHtml = [];
    let lLibelle = "";
    if (this.contact.estResponsable) {
      lLibelle += GTraductions.getValeur(
        "entreprise.responsableEntreprise",
      ).toLowerCase();
    }
    if (this.contact.estMaitreDeStage) {
      lLibelle +=
        (lLibelle ? " " + GTraductions.getValeur("Et") + " " : "") +
        GTraductions.getValeur("entreprise.maitreDeStage").toLowerCase();
    }
    if (lLibelle) {
      lHtml.push(
        '<div class="field-contain">',
        "<label></label>",
        "<label>",
        lLibelle.ucfirst(),
        "</label>",
        "</div>",
      );
    }
    return lHtml.join("");
  }
  composeTelFixeResp() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.telephoneFixe"),
      "</label>",
      '<input ie-model="TelResp(\'indicatifFixe\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelResp(\'fixe\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.responsable", [
        GTraductions.getValeur("entreprise.infoTelephoneFixe"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeTelPortResp() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.telephonePortable"),
      "</label>",
      '<input ie-model="TelResp(\'indicatifPort\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelResp(\'portable\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.responsable", [
        GTraductions.getValeur("entreprise.infoPortable"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeFaxResp() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.fax"),
      "</label>",
      '<input ie-model="TelResp(\'indicatifFax\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelResp(\'fax\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.responsable", [
        GTraductions.getValeur("entreprise.infoFax"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeEmailResp() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        "<label>",
        GTraductions.getValeur("entreprise.email"),
        "</label>",
        '<input id="',
        this.id.emailContact,
        '" class="round-style" type="text" value="',
        this.contact.email,
        '" size="30" title="',
        GTraductions.getValeur("entreprise.infoEmail"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.eMailResp,
        ', this)">',
        "</div>",
      );
    } else {
      lHtml.push(
        this.contact.email
          ? ('<div class="field-contain">',
            "<label>",
            GTraductions.getValeur("entreprise.siret"),
            "</label>",
            "<label>",
            this.contact.email,
            "</label>",
            "</div>")
          : "",
      );
    }
    return lHtml.join("");
  }
  composeRaisonSociale() {
    const lHtml = [];
    const lAvecRaisonSocial = !!this.entrepriseSaisie.raisonSociale;
    const lAvecNomCommercial = !!this.entrepriseSaisie.nomCommercial;
    if (lAvecRaisonSocial && lAvecNomCommercial) {
      lHtml.push(
        '<label class="raison-sociale">',
        this.entrepriseSaisie.raisonSociale,
        "</label><label>",
        this.entrepriseSaisie.nomCommercial,
        "</label>",
      );
    } else if (lAvecRaisonSocial) {
      lHtml.push(
        '<label class="raison-sociale">',
        this.entrepriseSaisie.raisonSociale,
        "</label>",
      );
    } else if (lAvecNomCommercial) {
      lHtml.push(
        '<label class="raison-sociale">',
        this.entrepriseSaisie.nomCommercial,
        "</label>",
      );
    } else {
      return "";
    }
    return lHtml.join("");
  }
  composeSecteur() {
    const lHtml = [];
    lHtml.push(
      '<label class="secteur">',
      this.entrepriseSaisie.secteurActivite
        ? this.entrepriseSaisie.secteurActivite
        : "",
      "</label>",
    );
    return lHtml.join("");
  }
  composeAdresse() {
    const lHtml = [];
    lHtml.push(
      '<div class="adresses">',
      "<label>",
      this.entrepriseSaisie.adresse1 ? this.entrepriseSaisie.adresse1 : "",
      "</label>",
      "<label>",
      this.entrepriseSaisie.adresse2 ? this.entrepriseSaisie.adresse2 : "",
      "</label>",
      "<label>",
      this.entrepriseSaisie.adresse3 ? this.entrepriseSaisie.adresse3 : "",
      "</label>",
      "<label>",
      this.entrepriseSaisie.adresse4 ? this.entrepriseSaisie.adresse4 : "",
      "</label>",
      '<label class="cp">',
      this.entrepriseSaisie.codePostal || this.entrepriseSaisie.ville
        ? this.entrepriseSaisie.codePostal + " " + this.entrepriseSaisie.ville
        : "",
      "</label>",
      "<label>",
      this.entrepriseSaisie.province
        ? "<br/>" + this.entrepriseSaisie.province
        : "",
      "<label>",
      "<label>",
      this.entrepriseSaisie.pays ? "<br/>" + this.entrepriseSaisie.pays : "",
      "</label>",
      "</div>",
    );
    return lHtml.join("");
  }
  composeTelephoneFixe() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.telephoneFixe"),
      "</label>",
      '<input ie-model="TelEntreprise(\'indicatifFixe\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelEntreprise(\'fixe\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.etablissement", [
        GTraductions.getValeur("entreprise.infoTelephoneFixe"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeTelephonePort() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.telephonePortable"),
      "</label>",
      '<input ie-model="TelEntreprise(\'indicatifPort\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelEntreprise(\'portable\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.etablissement", [
        GTraductions.getValeur("entreprise.infoPortable"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeFax() {
    const lHtml = [];
    lHtml.push(
      '<div class="field-contain">',
      "<label>",
      GTraductions.getValeur("entreprise.fax"),
      "</label>",
      '<input ie-model="TelEntreprise(\'indicatifFax\')" ie-indicatiftel ie-etatsaisie class="round-style" type="text" tabindex="0" />',
      '<input ie-model="TelEntreprise(\'fax\')" ie-telephone ie-etatsaisie class="round-style"',
      ' title="',
      GTraductions.getValeur("entreprise.etablissement", [
        GTraductions.getValeur("entreprise.infoFax"),
      ]),
      '"',
      'type="text" tabindex="0"/>',
      "</div>",
    );
    return lHtml.join("");
  }
  composeSIRET() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        "<label>",
        GTraductions.getValeur("entreprise.siret"),
        "</label>",
        '<input class="round-style social-num" type="text" value="',
        this.entrepriseSaisie.siret,
        '" size="15" title="',
        GTraductions.getValeur("entreprise.infoSIRET"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.siret,
        ', this)">',
        "</div>",
      );
    } else {
      lHtml.push(
        this.entrepriseSaisie.siret
          ? ('<div class="field-contain">',
            "<label>",
            GTraductions.getValeur("entreprise.siret"),
            "</label>",
            "<label>",
            this.entrepriseSaisie.siret,
            "</label>",
            "</div>")
          : "",
      );
    }
    return lHtml.join("");
  }
  composeURSSAF() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        "<label>",
        GTraductions.getValeur("entreprise.urssaf"),
        "</label>",
        '<input class="round-style social-num" type="text" value="',
        this.entrepriseSaisie.urssaf,
        '" size="15" title="',
        GTraductions.getValeur("entreprise.infoURSSAF"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.urssaf,
        ', this)">',
        "</div>",
      );
    } else {
      lHtml.push(
        this.entrepriseSaisie.urssaf
          ? ('<div class="field-contain">',
            "<label>",
            GTraductions.getValeur("entreprise.urssaf"),
            "</label>",
            "<label>",
            this.entrepriseSaisie.urssaf,
            "</label>",
            "</div>")
          : "",
      );
    }
    return lHtml.join("");
  }
  composeSiteWeb() {
    const lHtml = [];
    if (this.autorisations.avecSaisie) {
      lHtml.push(
        '<div class="field-contain">',
        "<label>",
        GTraductions.getValeur("entreprise.siteWeb"),
        "</label>",
        '<input class="round-style" type="text" value="',
        this.entrepriseSaisie.siteWeb,
        '" size="45" title="',
        GTraductions.getValeur("entreprise.infoSiteWeb"),
        '" ',
        ' tabindex="0" onchange="',
        this.Nom,
        ".evenementSurZone(",
        this.typeZoneSaisie.siteWeb,
        ', this)">',
        "</div>",
      );
    } else {
      lHtml.push(
        this.entrepriseSaisie.siteWeb
          ? ('<div class="field-contain">',
            "<label>",
            GTraductions.getValeur("entreprise.siteWeb"),
            "</label>",
            '<a href="' +
              this.entrepriseSaisie.siteWeb +
              '">' +
              GChaine.replaceRCToHTML(this.entrepriseSaisie.siteWeb) +
              "</a>",
            "</div>")
          : "",
      );
    }
    return lHtml.join("");
  }
  _getValeurTelephone(aElement) {
    return GChaine.supprimerEspaces($(aElement).val().replace(/_/g, ""));
  }
  evenementSurZone(aTypeSaisie, aElement) {
    this.setEtatSaisie(true);
    switch (aTypeSaisie) {
      case this.typeZoneSaisie.fax:
        this.entrepriseSaisie.fax = this._getValeurTelephone(aElement);
        break;
      case this.typeZoneSaisie.siret:
        this.entrepriseSaisie.siret = GHtml.getValue(aElement);
        break;
      case this.typeZoneSaisie.urssaf:
        this.entrepriseSaisie.urssaf = GHtml.getValue(aElement);
        break;
      case this.typeZoneSaisie.siteWeb:
        this.entrepriseSaisie.siteWeb = GHtml.getValue(aElement);
        break;
      case this.typeZoneSaisie.nomResp:
        this.contact.nom = GHtml.getValue(aElement);
        break;
      case this.typeZoneSaisie.prenomResp:
        this.contact.prenoms = GHtml.getValue(aElement);
        break;
      case this.typeZoneSaisie.eMailResp:
        this.contact.email = GHtml.getValue(aElement);
        break;
    }
    this.contact.setEtat(EGenreEtat.Modification);
  }
  surValidation() {
    this.callback.appel(0, this.entrepriseSaisie);
    this.setEtatSaisie(false);
  }
  evenementSurComboCivilite(aParams) {
    if (!aParams.element) {
      return;
    }
    if (this.contact.civilite.getNumero() !== aParams.element.getNumero()) {
      this.contact.civilite = aParams.element;
      this.contact.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
    }
  }
  evenementSurComboContact(aParams) {
    if (!aParams.element) {
      return;
    }
    if (this.indexContactCourant !== aParams.indice) {
      this.indexContactCourant = aParams.indice;
      this.contact = this.entrepriseSaisie.contacts.get(
        this.indexContactCourant,
      );
      GHtml.setValue(this.id.nomContact, this.contact.nom);
      GHtml.setValue(this.id.prenomContact, this.contact.prenoms);
      GHtml.setValue(this.id.emailContact, this.contact.email);
      GHtml.setHtml(this.id.fonctionContact, this.composeFonction(), {
        controleur: this.controleur,
      });
      GHtml.setHtml(
        this.id.estResponsable,
        this.composeEstResponsableMaitreDeStage(),
        { controleur: this.controleur },
      );
      const lIndice = this.contact
        ? this.entrepriseSaisie.civilites.getIndiceParElement(
            this.contact.civilite,
          )
        : 0;
      this.comboCivilite.setSelection(lIndice ? lIndice : 0);
      this.$refreshSelf();
    }
  }
}
module.exports = PageEntreprise;
