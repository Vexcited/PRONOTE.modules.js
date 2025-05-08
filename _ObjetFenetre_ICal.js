exports._ObjetFenetre_ICal = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const ObjetHtml_1 = require("ObjetHtml");
const Toast_1 = require("Toast");
const TypeGenreICal_1 = require("TypeGenreICal");
class _ObjetFenetre_ICal extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idHrefICal = this.Nom + "_lien";
    this.idSemainesPubliees = this.Nom + "_SemainesPubliees";
    this.idLienPermanent = this.idHrefICal + "_permanent";
    this.idQRCode = this.idHrefICal + "_qrcode";
    this.genreICal = TypeGenreICal_1.TypeGenreICal.ICal_EDT;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      copierURL: {
        event() {
          const lElementLienPermanent = ObjetHtml_1.GHtml.getElement(
            aInstance.idLienPermanent,
          );
          const lLien = lElementLienPermanent.value;
          if (
            lLien &&
            navigator &&
            navigator.clipboard &&
            navigator.clipboard.writeText
          ) {
            navigator.clipboard.writeText(lLien).then(
              () => {
                Toast_1.Toast.afficher({
                  msg: ObjetTraduction_1.GTraductions.getValeur(
                    "iCal.fenetre.btnCopierSucces",
                  ),
                  type: Toast_1.ETypeToast.succes,
                  dureeAffichage: 3000,
                });
              },
              () => {
                Toast_1.Toast.afficher({
                  msg: ObjetTraduction_1.GTraductions.getValeur(
                    "iCal.fenetre.btnCopierEchec",
                  ),
                  type: Toast_1.ETypeToast.erreur,
                  dureeAffichage: 3000,
                });
              },
            );
          }
        },
      },
      avecBtnCopier() {
        return (
          !!ObjetHtml_1.GHtml.getValue(aInstance.idLienPermanent) &&
          !!navigator &&
          !!navigator.clipboard &&
          !!navigator.clipboard.writeText
        );
      },
    });
  }
  setGenreICal(aGenre) {
    this.genreICal = aGenre;
  }
  setDonnees(
    aElement,
    aParametreExportICal,
    aGenreRessource,
    aDomaine,
    aFiltre,
    aSansRessource,
  ) {
    this.element = aElement;
    this.ParametreExportICal = aParametreExportICal;
    this.genreRessource = aGenreRessource;
    this.domaine = aDomaine !== null && aDomaine !== undefined ? aDomaine : 0;
    this.filtre = aFiltre;
    this.semainesPubliees = true;
    this.fuseauHoraire = this.getValeurFuseauHoraireParDefaut();
    this.setLien(aSansRessource);
    this.afficher();
  }
  getValeurFuseauHoraireParDefaut() {
    return 1;
  }
  setSemainesPubliees(aLibelle) {
    ObjetHtml_1.GHtml.setHtml(this.idSemainesPubliees, aLibelle);
  }
  composeContenu() {
    const T = [];
    T.push(
      `<section>`,
      `<article id="${this.idSemainesPubliees}" class="Gras">${ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.semainesPubliees")}</article>`,
      `<article class="m-top-xl">${this.getTraductionsSousTitre2()}</article>`,
      `</section>`,
    );
    T.push(
      `<section class="m-top-l">`,
      `<article class="Gras">${this.getTraductionsRecupererFichier()}</article>`,
      `<article>${this.getTraductionsRecupererSousTitreFichier()}</article>`,
      `<article class="text-center m-top"><a id="${this.idHrefICal}" target="_blank" href="${this.href}" ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: this.getTraductionsRecupererSousTitreFichier() + " " + this.getTraductionsICalExporter() })}>${this.getTraductionsICalExporter()}</a></article>`,
      `</section>`,
    );
    T.push(
      `<section class="m-top-l">`,
      `<article class="Gras">${this.getTraductionsSynchroniser()}</article>`,
      `<article>${this.getTraductionsSynchroniserSousTitre()}</article>`,
      `<article>${!IE.estMobile ? ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.copiezAdresseOuQRCode") : ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.copiezAdresse")}</article>`,
      `<article class="m-top"><input type="text" class="Fenetre_Bordure Texte10" style="width:100%; height: 18px; margin:0px; padding-left: 3px; padding-right: 3px;" ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.copiezAdresse") })} id="${this.idLienPermanent}" onclick="this.select()" value="${this.href ? ObjetChaine_1.GChaine.encoderUrl(this.href) : ""}" readonly="readonly"/></article>`,
      `<article ie-if="avecBtnCopier" class="m-top-l text-center"><ie-bouton class="small-bt themeBoutonNeutre" ie-model="copierURL">${ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.btnCopier")}</ie-bouton></article>`,
      `</section>`,
    );
    if (!IE.estMobile) {
      T.push(
        `<section class="m-top">`,
        `<article style="width:175px; height: 175px; margin:0px auto; background-color:#fff;" id="${this.idQRCode}"></article>`,
        `</section>`,
      );
    }
    return T.join("");
  }
  getTraductionsSousTitre2() {
    return ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.sousTitre2");
  }
  getTraductionsRecupererFichier() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "iCal.fenetre.recupererFichier",
    );
  }
  getTraductionsRecupererSousTitreFichier() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "iCal.fenetre.recupererSousTitreFichier",
    );
  }
  getTraductionsSynchroniser() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "iCal.fenetre.synchroniser",
    );
  }
  getTraductionsSynchroniserSousTitre() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "iCal.fenetre.synchroniserSousTitre",
    );
  }
  getTraductionsICalExporter() {
    return ObjetTraduction_1.GTraductions.getValeur("iCal.hint");
  }
}
exports._ObjetFenetre_ICal = _ObjetFenetre_ICal;
