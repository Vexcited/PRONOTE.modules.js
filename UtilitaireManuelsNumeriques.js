const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GImage } = require("ObjetImage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const UtilitaireManuelsNumeriques = {};
UtilitaireManuelsNumeriques.formatDonnees = function (aDonnees, aOptions) {
  const lResult = { liste: new ObjetListeElements(), avecCumulMatiere: false };
  let lMatiere, lNewElm;
  if (aOptions.avecCumulMatiere) {
    for (let i = 0; i < aDonnees.count(); i++) {
      const lRessource = aDonnees.get(i);
      if (lRessource.listeMatieres && lRessource.listeMatieres.count() > 0) {
        for (let j = 0; j < lRessource.listeMatieres.count(); j++) {
          lMatiere = lRessource.listeMatieres.get(j);
          lNewElm = MethodesObjet.dupliquer(lRessource);
          lNewElm.matiere = lMatiere;
          lResult.avecCumulMatiere = true;
          lResult.liste.addElement(lNewElm);
        }
      } else {
        lNewElm = MethodesObjet.dupliquer(lRessource);
        lNewElm.matiere = new ObjetElement(
          GTraductions.getValeur("Kiosque.AutresMatieres"),
          0,
          -1,
        );
        lResult.liste.addElement(lNewElm);
      }
    }
    const lTris = [
      ObjetTri.init((D) => {
        return D.matiere ? !D.matiere.existeNumero() : false;
      }),
      ObjetTri.init((D) => {
        return D.matiere ? D.matiere.getLibelle() : "";
      }),
    ];
    if (!!aOptions.avecNomEditeur) {
      lTris.push(ObjetTri.init("editeur"));
    }
    lTris.push(ObjetTri.init("titre"));
    lResult.liste.setTri(lTris).trier();
  } else {
    lResult.liste = aDonnees;
  }
  return lResult;
};
UtilitaireManuelsNumeriques.composeListeManuelsNumeriquesMobile = function (
  aDonnees,
  aOptions,
  aControleur,
) {
  const lHtml = [];
  const lDonnees = UtilitaireManuelsNumeriques.formatDonnees(
    aDonnees,
    aOptions,
  );
  let lMatiere;
  let lRessource;
  $.extend(aControleur, {
    nodeDescription: function (aDescription) {
      $(this.node).on({
        click: function () {
          if (!!aDescription) {
            GApplication.getMessage().afficher({
              message: GChaine.replaceRCToHTML(
                GChaine.ajouterEntites(aDescription),
              ),
            });
          }
        },
      });
    },
    nodeNonResponsive: function () {
      $(this.node).on({
        click: function () {
          GApplication.getMessage().afficher({
            message: GChaine.toTitle(
              GTraductions.getValeur("Kiosque.ContenuNonResponsive"),
            ),
          });
        },
      });
    },
  });
  lHtml.push('<ul class="collection with-header bg-white">');
  if (!!lDonnees.liste && lDonnees.liste.count() > 0) {
    for (let i = 0; i < lDonnees.liste.count(); i++) {
      lRessource = lDonnees.liste.get(i);
      if (lDonnees.avecCumulMatiere) {
        if (
          !lMatiere ||
          lMatiere.getNumero() !== lRessource.matiere.getNumero()
        ) {
          lMatiere = lRessource.matiere;
          lHtml.push(
            '<li class="collection-header">',
            GChaine.avecEspaceSiVide(lMatiere.getLibelle()),
            "</li>",
          );
        }
      }
      const lHtmlManuel = [];
      lHtml.push('<li class="collection-item with-action">');
      if (aOptions.avecNomEditeur) {
        lHtmlManuel.push('<div class="manuels-titre-contain">');
        if (lRessource.logo) {
          lHtmlManuel.push(
            '<div class="logo" ',
            lRessource.avecLien
              ? ' ie-hint="' +
                  GTraductions.getValeur("CahierDeTexte.avecLien") +
                  '"'
              : "",
            ">",
            GImage.composeImage(lRessource.logo),
            "</div>",
          );
        }
        lHtmlManuel.push(
          '<div class="libelle">',
          GChaine.insecable(lRessource.editeur),
          "</div>",
        );
        lHtmlManuel.push("</div>");
      }
      lHtmlManuel.push('<div class="manuels-description-contain">');
      const lAvecApiRenduTAF =
        !!lRessource &&
        !!lRessource.apiSupport &&
        lRessource.apiSupport.contains(TypeGenreApiKiosque.Api_RenduPJTAF);
      const lAvecApiEnvoiNote =
        !!lRessource &&
        !!lRessource.apiSupport &&
        lRessource.apiSupport.contains(TypeGenreApiKiosque.Api_EnvoiNote);
      if (aOptions.avecDetailsRessources) {
        if (GEtatUtilisateur.activerKiosqueRenduTAF && lAvecApiRenduTAF) {
          lHtmlManuel.push(
            '<div style="float:right; width: 16px;" title="',
            GChaine.toTitle(
              GTraductions.getValeur("FenetrePanierKiosque.hint.ManuelTAF"),
            ),
            '" class="AlignementMilieuVertical ',
            lAvecApiRenduTAF ? "Image_Kiosque_ListeCahierTexte AvecMain" : "",
            '"></div>',
          );
        }
        if (GEtatUtilisateur.activerKiosqueEnvoiNote && lAvecApiEnvoiNote) {
          lHtmlManuel.push(
            '<div style="float:right; width: 16px;" title="',
            GChaine.toTitle(
              GTraductions.getValeur("FenetrePanierKiosque.hint.ManuelDevoir"),
            ),
            '" class="AlignementMilieuVertical ',
            lAvecApiEnvoiNote ? "Image_Kiosque_ListeDevoir AvecMain" : "",
            '"></div>',
          );
        }
      }
      lHtmlManuel.push('<div class="titre">', lRessource.titre);
      if (!!lRessource.description) {
        lHtmlManuel.push(
          '<div class="infos" ',
          GHtml.composeAttr("ie-node", "nodeDescription", [
            lRessource.description,
          ]),
          '><i class="icon_info_sign"></i></div>',
        );
      }
      lHtmlManuel.push("</div></div>");
      if (lRessource.avecUrlAppliMobile) {
        lHtmlManuel.push('<div class="flex-contain flex-center m-bottom">');
        lHtmlManuel.push(
          '<div class="fluid-bloc">',
          GChaine.composerUrlLienExterne({
            documentJoint: lRessource,
            title: lRessource.description,
            libelleEcran: GTraductions.getValeur("Kiosque.OuvrirAppli"),
            libelle: lRessource.titre,
            iconeOverride: "icon_th_large",
            infoSupp: { universalLink: true },
          }),
          "</div>",
        );
        lHtmlManuel.push("</div>");
      }
      lHtmlManuel.push('<div class="manuels-liens-contain">');
      lHtmlManuel.push('<div class="infos" style="width:20px;"');
      if (!lRessource.responsive) {
        lHtmlManuel.push(
          GHtml.composeAttr("ie-node", "nodeNonResponsive"),
          ">",
        );
        lHtmlManuel.push(
          '<i class="icon_exclamation" style="color:',
          GCouleur.rougeClair,
          '"></i>',
        );
      } else {
        lHtmlManuel.push(">");
      }
      lHtmlManuel.push("</div>");
      lHtmlManuel.push(
        "<div>" +
          GChaine.composerUrlLienExterne({
            documentJoint: lRessource,
            title: lRessource.description,
            libelleEcran: GTraductions.getValeur("Kiosque.OuvrirManuel"),
            libelle: lRessource.titre,
            iconeOverride: "icon_book",
          }) +
          "</div>",
      );
      lHtmlManuel.push("</div>");
      lHtml.push(lHtmlManuel.join(""));
      lHtml.push("</li>");
    }
  }
  lHtml.push("</ul>");
  return lHtml.join("");
};
module.exports = { UtilitaireManuelsNumeriques };
