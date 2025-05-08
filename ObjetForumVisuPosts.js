exports.ObjetForumVisuPosts = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const tag_1 = require("tag");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetHtml_1 = require("ObjetHtml");
const MethodesObjet_1 = require("MethodesObjet");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const ObjetPosition_1 = require("ObjetPosition");
const c_Commande_MenuCntext = -1;
const u_optionsSession = {
  consigneVisibleVisiteur: true,
  modeVisuMembre: false,
  visuUniquementEnAttente: false,
};
class ObjetForumVisuPosts extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.moteurForum = null;
    this.setOptions({ surBasculeEcran: null, visuModerateurPossible: true });
    this.donnees = {};
    this.visuPostVisible = true;
  }
  init(aMoteurForum) {
    this.moteurForum = aMoteurForum;
  }
  setSujet(aSujet, aParams) {
    const lParams = Object.assign(
      {
        forcerChangementSujet: false,
        avecBasculeEcran: false,
        typeSaisiePost: null,
      },
      aParams,
    );
    const lAvecBasculeEcranDisponible =
      !!this.moteurForum.getOptions().surBasculeEcran;
    const lAvecAffichage =
      !lAvecBasculeEcranDisponible || !!(lParams.avecBasculeEcran && aSujet);
    const lEstSujetModifie =
      (this.donnees.sujet && !aSujet) ||
      (!this.donnees.sujet && aSujet) ||
      (this.donnees.sujet &&
        aSujet &&
        this.donnees.sujet.getNumero() !== aSujet.getNumero());
    if (lEstSujetModifie) {
      u_optionsSession.modeVisuMembre = false;
    }
    let lSurChangementSujet = false;
    if (lParams.forcerChangementSujet || lEstSujetModifie) {
      lSurChangementSujet = true;
    }
    return Promise.resolve()
      .then(() => {
        if (!lAvecBasculeEcranDisponible && (lSurChangementSujet || !aSujet)) {
          return this.moteurForum.requetePostsLu({
            ancienSujet: this.donnees.sujet,
            listePosts: this.donnees.listePosts,
            nouveauSujet: aSujet,
          });
        }
      })
      .then((aResult) => {
        if (aResult === true) {
          return;
        }
        if (
          lAvecBasculeEcranDisponible &&
          !lAvecAffichage &&
          !this.visuPostVisible
        ) {
          this.donnees = {};
          this.afficher(this._construireAffichage());
        } else {
          this.moteurForum.setIndicePostLu(-1);
          return this._actualiserListePostsPromise({
            sujet: aSujet,
            avecSujet: true,
            surChangementSujet: lSurChangementSujet,
            avecAffichage: lAvecAffichage,
            typeSaisiePost: lParams.typeSaisiePost,
          });
        }
      });
  }
  free() {
    this.moteurForum.requetePostsLu({
      ancienSujet: this.donnees.sujet,
      listePosts: this.donnees.listePosts,
      sansActualisation: true,
    });
    super.free();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeNavMobile() {
        $(this.node).eventValidation(() => {
          aInstance.moteurForum
            .requetePostsLu({
              ancienSujet: aInstance.donnees.sujet,
              listePosts: aInstance.donnees.listePosts,
            })
            .then(() => {
              aInstance.visuPostVisible = false;
              aInstance.setSujet(null);
              aInstance.moteurForum.getOptions().surBasculeEcran(false);
            });
        });
      },
      btnVisuConsigne: {
        event() {
          if (aInstance._estVisiteurDuSujet()) {
            u_optionsSession.consigneVisibleVisiteur =
              !u_optionsSession.consigneVisibleVisiteur;
          } else {
            aInstance.donnees.sujet.consigneVisible =
              !aInstance.donnees.sujet.consigneVisible;
            aInstance.moteurForum.requeteConsigneVisible(
              aInstance.donnees.sujet,
              aInstance.donnees.sujet.consigneVisible,
            );
          }
        },
        getClass() {
          return aInstance._estConsigneVisible()
            ? "icon_chevron_up"
            : "icon_chevron_down";
        },
        getTitle() {
          return aInstance._estConsigneVisible()
            ? ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.CacherConsigne",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.AfficherConsigne",
              );
        },
      },
      btnModeVisuMembre: {
        event() {
          u_optionsSession.modeVisuMembre = !u_optionsSession.modeVisuMembre;
          aInstance.setSujet(aInstance.donnees.sujet, {
            forcerChangementSujet: true,
          });
        },
        getClass() {
          return u_optionsSession.modeVisuMembre
            ? "icon_eye_close"
            : "icon_eye_open";
        },
        getTitle() {
          return u_optionsSession.modeVisuMembre
            ? ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.DesactiverVisuMembre",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.ActiverVisuMembre",
              );
        },
      },
      btnEditerSujet: {
        event() {
          aInstance.moteurForum.editerSujet(aInstance.donnees.sujet);
        },
        getDisabled() {
          return aInstance.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.estEnConsultation,
          );
        },
      },
      getHtmlVisuPost() {
        if (!aInstance._estConsigneVisible()) {
          return "";
        }
        const H = [
          IE.jsx.str(
            "div",
            { class: "tiny-view" },
            aInstance.donnees.sujet.htmlPost,
          ),
        ];
        if (
          aInstance.donnees.sujet.listeFichiers &&
          aInstance.donnees.sujet.listeFichiers.count() > 0
        ) {
          H.push(
            IE.jsx.str(
              "div",
              { class: "post-pj" },
              UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
                aInstance.donnees.sujet.listeFichiers,
              ),
            ),
          );
        }
        return H.join("");
      },
      btnParticip: {
        event() {
          aInstance._feneterEditionContenu(
            TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Creer,
            null,
          );
        },
        getDisabled() {
          return !aInstance._peutPoster();
        },
      },
      getNodeBtnParticipMobile() {
        $(this.node).eventValidation(() => {
          aInstance._feneterEditionContenu(
            TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Creer,
            null,
          );
        });
      },
      cbFiltreModeration: {
        getValue() {
          return u_optionsSession.visuUniquementEnAttente;
        },
        setValue(aValue) {
          u_optionsSession.visuUniquementEnAttente = aValue;
          aInstance.setSujet(aInstance.donnees.sujet, {
            forcerChangementSujet: true,
          });
        },
      },
      getIdentiteBtnParticip() {
        return {
          class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
          pere: aInstance,
          init: function (aBtn) {
            aBtn.setOptionsBouton({
              listeBoutons: [
                {
                  primaire: true,
                  icone: "icon_plus_fin large",
                  callback() {
                    aInstance._feneterEditionContenu(
                      TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
                        .fpcs_Post_Creer,
                      null,
                    );
                  },
                },
              ],
            });
          },
        };
      },
      btnActionPost: {
        event(aNumeroPost, aGenreAction) {
          const lPost =
            aInstance.donnees.listePosts.getElementParNumero(aNumeroPost);
          if (lPost) {
            aInstance._surCommandePost(lPost, aGenreAction);
          }
        },
        getDisabled(aNumeroPost, aGenreAction) {
          const lPost =
            aInstance.donnees.listePosts.getElementParNumero(aNumeroPost);
          if (
            !lPost ||
            aInstance.applicationSco.droits.get(
              ObjetDroitsPN_1.TypeDroits.estEnConsultation,
            )
          ) {
            return true;
          }
          switch (aGenreAction) {
            case TypesForumPedagogique_1.TypeActionPost.AP_Accepter:
            case TypesForumPedagogique_1.TypeActionPost.AP_Refuser:
              return !lPost.actions.contains(aGenreAction);
          }
          return false;
        },
      },
      nodePostVisibility(aIndicePost, aVisible) {
        if (aVisible) {
          aInstance.ensemblePostsVisibles.add(aIndicePost);
        } else {
          aInstance.ensemblePostsVisibles.remove(aIndicePost);
        }
      },
      nodePostVisibilityNonLu(aNumeroPost, aVisible) {
        if (aVisible) {
          const lListe = aInstance.donnees.listePosts;
          const lIndice = lListe.getIndiceParNumeroEtGenre(aNumeroPost);
          const lPost = lListe.get(lIndice);
          if (lPost) {
            aInstance.moteurForum.setIndicePostLu(lIndice);
          }
          return false;
        }
      },
      nodeLoaderVisibility(aTypeLoader, aVisible) {
        if (aVisible) {
          aInstance._actualiserListePostsPromise({
            sujet: aInstance.donnees.sujet,
            avecSujet: false,
            typeLoader: aTypeLoader,
          });
          return false;
        }
      },
    });
  }
  _surCommandePost(aPost, aGenreAction) {
    const lActifME = !this.applicationSco.droits.get(
      ObjetDroitsPN_1.TypeDroits.estEnConsultation,
    );
    switch (aGenreAction) {
      case c_Commande_MenuCntext: {
        ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
          pere: this,
          initCommandes(aMenu) {
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_Editer,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_Editer",
                ),
                lActifME,
                () => {
                  this._feneterEditionContenu(
                    TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
                      .fpcs_Post_Editer,
                    aPost,
                  );
                },
                { icon: "icon_pencil" },
              );
            }
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_Repondre,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_Repondre",
                ),
                lActifME,
                () => {
                  this._feneterEditionContenu(
                    TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
                      .fpcs_Post_Creer,
                    aPost,
                  );
                },
                { icon: "icon_reply" },
              );
            }
            const lAvecImportant = aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_Important,
            );
            if (
              lAvecImportant ||
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_NonImportant,
              )
            ) {
              aMenu.add(
                lAvecImportant
                  ? ObjetTraduction_1.GTraductions.getValeur(
                      "ForumPeda.MenuAction_Important",
                    )
                  : ObjetTraduction_1.GTraductions.getValeur(
                      "ForumPeda.MenuAction_NonImportant",
                    ),
                lActifME,
                () => {
                  this._surCommandePost(
                    aPost,
                    lAvecImportant
                      ? TypesForumPedagogique_1.TypeActionPost.AP_Important
                      : TypesForumPedagogique_1.TypeActionPost.AP_NonImportant,
                  );
                },
                { icon: "icon_bookmark" },
              );
            }
            aMenu.avecSeparateurSurSuivant();
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_ExclureAuteur,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_ExclureAuteur",
                ),
                lActifME,
                () => {
                  this._surCommandePost(
                    aPost,
                    TypesForumPedagogique_1.TypeActionPost.AP_ExclureAuteur,
                  );
                },
                { icon: "icon_user mix-icon_ne_pas_deranger i-red" },
              );
            }
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_SignalerModeration,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_SignalerModeration",
                ),
                lActifME,
                () => {
                  this._surCommandePost(
                    aPost,
                    TypesForumPedagogique_1.TypeActionPost
                      .AP_SignalerModeration,
                  );
                },
                { icon: "icon_warning_sign" },
              );
            }
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost.AP_SignalerSPR,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_SignalerSPR",
                ),
                lActifME,
                () => {
                  this._surCommandePost(
                    aPost,
                    TypesForumPedagogique_1.TypeActionPost.AP_SignalerSPR,
                  );
                },
                { icon: "icon_warning_sign" },
              );
            }
            if (
              aPost.actions.contains(
                TypesForumPedagogique_1.TypeActionPost
                  .AP_SupprimerDefinitivement,
              )
            ) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_SupprimerDefinitivement",
                ),
                lActifME,
                () => {
                  this._surCommandePost(
                    aPost,
                    TypesForumPedagogique_1.TypeActionPost
                      .AP_SupprimerDefinitivement,
                  );
                },
                { icon: "icon_trash" },
              );
            }
          },
        });
        break;
      }
      default: {
        return this._saisieCommandePost({
          type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
            .fpcs_Post_Action,
          action: aGenreAction,
          post: aPost,
        });
      }
    }
  }
  _feneterEditionContenu(aType, aPost) {
    const H = [];
    if (
      aType ===
        TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Creer &&
      aPost
    ) {
      H.push(
        IE.jsx.str(
          "div",
          { class: "quotation" },
          IE.jsx.str("label", null, aPost.strAuteur),
          IE.jsx.str("div", null, aPost.contenu),
        ),
      );
    }
    const lTitre =
      aType ===
      TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Editer
        ? ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ModifierPost")
        : aPost
          ? ObjetTraduction_1.GTraductions.getValeur("ForumPeda.RepondrePost")
          : ObjetTraduction_1.GTraductions.getValeur("ForumPeda.NouveauPost");
    H.push(
      IE.jsx.str("ie-textareamax", {
        "ie-model": "textarea",
        class: "post-saisie",
        maxlength: "10000",
        "aria-label": lTitre,
      }),
    );
    let lContenu =
      aType ===
        TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Editer &&
      aPost
        ? aPost.contenu || ""
        : "";
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_1.ObjetFenetre,
      {
        pere: this,
        initialiser(aFenetre) {
          aFenetre.setOptionsFenetre({
            titre: lTitre,
            largeur: 500,
            listeBoutons: [
              ObjetTraduction_1.GTraductions.getValeur("Annuler"),
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
                valider: true,
              },
            ],
            cssFenetre: "ObjetForumVisuPosts-fenetrePost",
          });
          if (!IE.estMobile) {
            aFenetre.focusSurPremierElement = function () {
              $(`#${this.getNom().escapeJQ()} textarea`).focus();
            };
          }
          $.extend(true, aFenetre.controleur, {
            textarea: {
              getValue() {
                return lContenu;
              },
              setValue(aValue) {
                lContenu = aValue;
              },
            },
            fenetreBtn: {
              getDisabled: function (aBoutonRepeat) {
                if (aBoutonRepeat.element.valider) {
                  return lContenu === "";
                }
                return false;
              },
            },
          });
        },
      },
    )
      .afficher(H.join(""))
      .then((aParams) => {
        if (aParams.bouton && aParams.bouton.valider) {
          this._saisieCommandePost({
            type: aType,
            post: aPost,
            sujet:
              aType ===
              TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
                .fpcs_Post_Creer
                ? this.donnees.sujet
                : null,
            contenu: lContenu,
          });
        }
      });
  }
  _saisieCommandePost(aParams) {
    this.moteurForum.saisieCommandePost(aParams, this.donnees.sujet);
  }
  _construireHeaderSujet() {
    const H = [];
    const lAvecBasculeEcran = !!this.moteurForum.getOptions().surBasculeEcran;
    const lSujet = this.donnees.sujet;
    let lTitre = lSujet.titre;
    if (
      lSujet.listeThemes &&
      lSujet.listeThemes.count() > 0 &&
      this.moteurForum.avecGestionThemes()
    ) {
      lTitre += ` - ${ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Theme")} : ${lSujet.listeThemes.trier().getTableauLibelles().join(", ")}`;
    }
    H.push(
      lAvecBasculeEcran
        ? (0, tag_1.tag)(
            "div",
            {
              "ie-node": "getNodeNavMobile",
              tabindex: 0,
              class: "nav-page-profonde-container",
            },
            (0, tag_1.tag)("ie-btnicon", {
              class: "fleche-nav icon_retour_mobile",
            }),
            (0, tag_1.tag)("div", { class: "label" }, lTitre),
          )
        : "",
      (0, tag_1.tag)(
        "div",
        { class: "titre" },
        (0, tag_1.tag)(
          "div",
          { class: "titre-texte" },
          lAvecBasculeEcran
            ? ""
            : (0, tag_1.tag)(
                "h2",
                { class: "ie-titre", "ie-ellipsis": true },
                lTitre,
              ),
          (0, tag_1.tag)("div", { class: "sous-titre" }, () => {
            return (
              lSujet.strAuteur +
              (lAvecBasculeEcran ? (0, tag_1.tag)("br") : " - ") +
              this.moteurForum.getStrNbParticipantsSujet(lSujet)
            );
          }),
        ),
        (0, tag_1.tag)(
          "div",
          { class: "titre-boutons" },
          (0, tag_1.tag)("ie-btnicon", {
            class: "bt-activable bt-large",
            "ie-model": "btnVisuConsigne",
            "ie-class": "getClass",
          }),
          lSujet.roles.contains(
            TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
          )
            ? (0, tag_1.tag)("ie-btnicon", {
                class: "icon_pencil bt-activable bt-large",
                "ie-model": "btnEditerSujet",
                title: ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.Menu_Modifier",
                ),
              })
            : "",
          lSujet.roles.contains(
            TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
          )
            ? (0, tag_1.tag)("ie-btnicon", {
                class: "bt-activable bt-large",
                "ie-model": "btnModeVisuMembre",
                "ie-class": "getClass",
              })
            : "",
        ),
      ),
    );
    const lTabLigneSupp = [];
    if (!IE.estMobile && !this._estVisiteurDuSujet()) {
      lTabLigneSupp.push(
        (0, tag_1.tag)(
          "ie-bouton",
          { class: "btn-particip", "ie-model": "btnParticip" },
          ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Poster"),
        ),
      );
    }
    if (this._modeVisuModerateur(lSujet)) {
      lTabLigneSupp.push(
        (0, tag_1.tag)("div", { class: "ecart" }),
        (0, tag_1.tag)(
          "ie-checkbox",
          { class: "cbFiltreModeration", "ie-model": "cbFiltreModeration" },
          ObjetTraduction_1.GTraductions.getValeur(
            "ForumPeda.FiltreModeration",
          ),
        ),
      );
    }
    if (lTabLigneSupp.length > 0) {
      H.push(
        (0, tag_1.tag)("div", { class: "ligne-supp" }, lTabLigneSupp.join("")),
      );
    }
    H.push(this._construireMessageInformatifDeSujet(lSujet));
    H.push(
      IE.jsx.str("div", { class: "visu-post", "ie-html": "getHtmlVisuPost" }),
    );
    return H.join("");
  }
  _construireMessageInformatifDeSujet(aSujet) {
    let H = [];
    switch (aSujet.etatPub) {
      case TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu: {
        H.push(
          aSujet.roles.contains(
            TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
          )
            ? ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.SujetSuspenduPourModeration",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.SujetSuspenduConsult",
              ),
        );
        break;
      }
      case TypesForumPedagogique_1.TypeEtatPub.EP_Verrou: {
        H.push(
          ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ForumVerrouille"),
        );
        break;
      }
      case TypesForumPedagogique_1.TypeEtatPub.EP_Ferme: {
        let lMsgPartFermee =
          this.moteurForum.getStrMessageParticipationFermee(aSujet);
        if (lMsgPartFermee) {
          H.push(
            (0, tag_1.tag)(
              "span",
              {
                class: [
                  "ferme-horaire",
                  aSujet.roles.contains(
                    TypesForumPedagogique_1.TypeRoleIndividuSujet
                      .RIS_Moderateur,
                  )
                    ? "moderateur"
                    : "",
                ],
              },
              lMsgPartFermee,
            ),
          );
        }
        break;
      }
    }
    if (aSujet.estExclu) {
      H.push(
        ObjetTraduction_1.GTraductions.getValeur(
          "ForumPeda.ParticipationBloque",
        ),
      );
    }
    if (H.length > 0) {
      return (0, tag_1.tag)(
        "div",
        { class: ["message-sujet"] },
        H.join((0, tag_1.tag)("br")),
      );
    }
    return "";
  }
  _modeVisuModerateur(aSujet) {
    return (
      aSujet.roles.contains(
        TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
      ) &&
      !u_optionsSession.modeVisuMembre &&
      this.options.visuModerateurPossible
    );
  }
  _construireTitreEtatPost(aPost) {
    const H = [];
    if (
      aPost.etatHeader !== TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_Aucun
    ) {
      H.push((0, tag_1.tag)("i", { class: ["icon-etat", aPost.etatHeader] }));
      H.push(
        (0, tag_1.tag)("div", { class: "etat" }, () => {
          let lStrImportant = "";
          let lStrSignalementSPR = "";
          let lStrEtat = "";
          let lStrSignalementModEnCours = aPost.strSignMOD;
          let lStrSignalementMod = "";
          if (aPost.estImportant) {
            lStrImportant = ObjetTraduction_1.GTraductions.getValeur(
              "ForumPeda.MisEnAvant",
            );
          }
          if (aPost.strSignSPR) {
            lStrSignalementSPR = (0, tag_1.tag)(
              "label",
              { class: "sign-spr" },
              aPost.strSignSPR,
            );
          }
          if (aPost.strSign) {
            lStrSignalementMod = (0, tag_1.tag)(
              "label",
              { class: "signale" },
              aPost.strSign,
            );
          }
          switch (aPost.etatHeader) {
            case TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_Publie:
              lStrEtat =
                ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Publie");
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_Refuse:
              lStrEtat =
                ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Refuse");
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_Important:
              lStrEtat = lStrImportant;
              lStrImportant = "";
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_SupprimeAuteur:
              lStrEtat = ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.SupprimeAuteur",
              );
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost
              .HEP_AttenteValidation:
              lStrEtat = ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.AttenteValidation",
              );
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost
              .HEP_SignaleModEnCours:
              lStrEtat = lStrSignalementModEnCours;
              lStrSignalementModEnCours = "";
              break;
            case TypesForumPedagogique_1.TypeHeaderEtatPost.HEP_SignaleMod:
              lStrEtat = lStrSignalementMod;
              lStrSignalementMod = "";
              break;
          }
          let H = [];
          if (lStrEtat) {
            H.push(lStrEtat);
          }
          if (lStrSignalementModEnCours) {
            H.push(lStrSignalementModEnCours);
          }
          if (lStrImportant) {
            H.push(lStrImportant);
          }
          if (lStrSignalementMod) {
            H.push(lStrSignalementMod);
          }
          if (lStrSignalementSPR) {
            H.push(lStrSignalementSPR);
          }
          return H.join(" - ");
        }),
      );
    }
    return H.join("");
  }
  _construireTitreCommandesrPost(aPost) {
    const H = [];
    const lSujet = this.donnees.sujet;
    const lModeVisuModerateur = this._modeVisuModerateur(lSujet);
    H.push(
      (0, tag_1.tag)("div", { class: "commandes" }, (H) => {
        if (
          lSujet.roles.contains(
            TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
          ) &&
          !aPost.estAuteur &&
          lModeVisuModerateur
        ) {
          let lActionAccepter =
            TypesForumPedagogique_1.TypeActionPost.AP_Accepter;
          if (
            !aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_Accepter,
            ) &&
            aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_TraiterSignalement,
            )
          ) {
            lActionAccepter =
              TypesForumPedagogique_1.TypeActionPost.AP_TraiterSignalement;
          }
          H.push(
            (0, tag_1.tag)("ie-btnicon", {
              class: "icon_check_fin bt-activable bt-large",
              "ie-model": tag_1.tag.funcAttr("btnActionPost", [
                aPost.getNumero(),
                lActionAccepter,
              ]),
              title: ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.MenuAction_Accepter",
              ),
            }),
          );
          let lActionRefuser =
            TypesForumPedagogique_1.TypeActionPost.AP_Refuser;
          if (
            !aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_Refuser,
            ) &&
            aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_Supprimer,
            )
          ) {
            lActionRefuser =
              TypesForumPedagogique_1.TypeActionPost.AP_Supprimer;
          }
          H.push(
            (0, tag_1.tag)("ie-btnicon", {
              class: "icon_fermeture_widget bt-activable bt-large",
              "ie-model": tag_1.tag.funcAttr("btnActionPost", [
                aPost.getNumero(),
                lActionRefuser,
              ]),
              title: ObjetTraduction_1.GTraductions.getValeur(
                "ForumPeda.MenuAction_Refuser",
              ),
            }),
          );
        }
        if (aPost.actions.count() > 0) {
          if (
            aPost.estAuteur &&
            aPost.actions.contains(
              TypesForumPedagogique_1.TypeActionPost.AP_Supprimer,
            )
          ) {
            H.push(
              (0, tag_1.tag)("ie-btnicon", {
                class: "icon_trash bt-activable bt-large",
                "ie-model": tag_1.tag.funcAttr("btnActionPost", [
                  aPost.getNumero(),
                  TypesForumPedagogique_1.TypeActionPost.AP_Supprimer,
                ]),
                title: ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.MenuAction_Supprimer",
                ),
              }),
            );
          }
          H.push(
            (0, tag_1.tag)("ie-btnicon", {
              class: "icon_ellipsis_vertical",
              "ie-model": tag_1.tag.funcAttr("btnActionPost", [
                aPost.getNumero(),
                c_Commande_MenuCntext,
              ]),
              title:
                ObjetTraduction_1.GTraductions.getValeur("liste.BtnAction"),
            }),
          );
        } else {
          H.push((0, tag_1.tag)("div", { class: "gabarit-icon" }));
        }
      }),
    );
    return H.join(" ");
  }
  _construireTitreAuteurPost(aPost) {
    return (0, tag_1.tag)("div", { class: "titre-auteur" }, () => {
      const H = [];
      H.push((0, tag_1.tag)("label", { class: "auteur" }, aPost.strAuteur));
      if (aPost.exclu) {
        H.push(
          "(" + (0, tag_1.tag)("i", { class: "icon_ne_pas_deranger exclu" }),
          (0, tag_1.tag)(
            "label",
            ObjetTraduction_1.GTraductions.getValeur("ForumPeda.EleveExclu"),
          ) + ")",
        );
      }
      if (aPost.excluPerso) {
        H.push(
          "(" + (0, tag_1.tag)("i", { class: "icon_ne_pas_deranger exclu" }),
          (0, tag_1.tag)(
            "label",
            ObjetTraduction_1.GTraductions.getValeur(
              "ForumPeda.VousAvezEteExclu",
            ),
          ) + ")",
        );
      }
      H.push((0, tag_1.tag)("label", { class: "date" }, aPost.strDate));
      if (aPost.editeAuteur || aPost.editeModeration) {
        H.push(
          (0, tag_1.tag)(
            "label",
            { class: "edite" },
            `(${aPost.editeAuteur ? ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ModifieAuteur") : ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ModifieModeration")})`,
          ),
        );
      }
      return H.join(" ");
    });
  }
  _construireTitrePost(aPost) {
    const lEtat = this._construireTitreEtatPost(aPost);
    const lCommandes = this._construireTitreCommandesrPost(aPost);
    const lTitreAuteur = this._construireTitreAuteurPost(aPost);
    if (lEtat) {
      return (
        (0, tag_1.tag)("div", { class: "principal" }, lEtat, lCommandes) +
        (0, tag_1.tag)("div", { class: "secondaire" }, lTitreAuteur)
      );
    }
    return (0, tag_1.tag)(
      "div",
      { class: "principal" },
      lTitreAuteur,
      lCommandes,
    );
  }
  _construireListePosts() {
    const lListePosts = this.donnees.listePosts;
    if (lListePosts.count() === 0) {
      return this._construireMessageVide(false);
    }
    const H = [];
    let lSeparateurNonLu = false;
    if (this.donnees.loaderPostBefore) {
      H.push(
        (0, tag_1.tag)(
          "div",
          {
            class: "posts-load",
            "ie-visibility-observer": tag_1.tag.funcAttr(
              "nodeLoaderVisibility",
              "before",
            ),
          },
          ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ChargementPosts"),
        ),
      );
    }
    this.ensemblePostsVisibles = new TypeEnsembleNombre_1.TypeEnsembleNombre();
    lListePosts.parcourir((aPost, aIndex) => {
      if (!lSeparateurNonLu && aPost.nonLu) {
        lSeparateurNonLu = true;
        H.push(
          IE.jsx.str(
            "h3",
            { class: "sep-nonLu" },
            ObjetTraduction_1.GTraductions.getValeur("ForumPeda.NouveauxPosts"),
          ),
        );
      }
      H.push(
        (0, tag_1.tag)(
          "article",
          {
            class: ["post", aPost.estAuteur ? "auteur" : "", aPost.etatHeader],
            "ie-visibility-observer": tag_1.tag.funcAttr("nodePostVisibility", [
              aIndex,
            ]),
            id: `post_${aPost.getNumero()}`,
            tabindex: 0,
          },
          aPost.nonLu
            ? (0, tag_1.tag)("div", {
                class: "pastille-nonLu",
                title: ObjetTraduction_1.GTraductions.getValeur(
                  "ForumPeda.HintNouveauxPosts",
                ),
              })
            : "",
          (0, tag_1.tag)(
            "div",
            { class: "titre" },
            this._construireTitrePost(aPost),
          ),
          aPost.contenuSource
            ? (0, tag_1.tag)(
                "div",
                { class: "quotation" },
                (0, tag_1.tag)("label", aPost.strAuteurSource),
                (0, tag_1.tag)("div", aPost.contenuSource),
              )
            : "",
          (0, tag_1.tag)(
            "div",
            { class: "contenu" },
            aPost.contenu.replaceRCToHTML(),
          ),
          aPost.nonLu
            ? (0, tag_1.tag)("div", {
                "ie-visibility-observer": tag_1.tag.funcAttr(
                  "nodePostVisibilityNonLu",
                  [aPost.getNumero()],
                ),
              })
            : "",
        ),
      );
    });
    if (this.donnees.loaderPostAfter) {
      H.push(
        (0, tag_1.tag)(
          "div",
          {
            class: "posts-load",
            "ie-visibility-observer": tag_1.tag.funcAttr(
              "nodeLoaderVisibility",
              "after",
            ),
          },
          ObjetTraduction_1.GTraductions.getValeur("ForumPeda.ChargementPosts"),
        ),
      );
    }
    return H.join("");
  }
  _construirePosts() {
    const H = [];
    H.push(
      (0, tag_1.tag)("header", this._construireHeaderSujet()),
      (0, tag_1.tag)(
        "section",
        (0, tag_1.tag)(
          "div",
          { class: "scroll-posts" },
          this._construireListePosts(),
          (H) => {
            if (IE.estMobile && this._peutPoster()) {
              H.push(
                (0, tag_1.tag)("div", { class: "ecart-btn-creation" }),
                (0, tag_1.tag)("div", {
                  class: "is-sticky btn-plus",
                  "ie-identite": "getIdentiteBtnParticip",
                }),
              );
            }
          },
        ),
      ),
    );
    return H.join("");
  }
  _construireMessageVide(aPourSujet) {
    return (0, tag_1.tag)(
      "div",
      { class: "message-vide card card-nodata" },
      (0, tag_1.tag)(
        "div",
        { class: "message card-content" },
        aPourSujet
          ? ObjetTraduction_1.GTraductions.getValeur(
              "ForumPeda.SelectionnerUnSujet",
            )
          : ObjetTraduction_1.GTraductions.getValeur("ForumPeda.AucunPost"),
      ),
      (0, tag_1.tag)("div", {
        class: ["Image_No_Data"],
        "aria-hidden": "true",
      }),
    );
  }
  _construireAffichage() {
    const H = [];
    H.push(
      (0, tag_1.tag)("div", { class: "ObjetForumVisuPosts" }, () => {
        if (this.donnees.sujet) {
          return this._construirePosts();
        }
        return IE.estMobile ? "" : this._construireMessageVide(true);
      }),
    );
    return H.join("");
  }
  _peutPoster() {
    return (
      this.donnees.sujet &&
      this.donnees.sujet.peutPoster &&
      !this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.estEnConsultation,
      )
    );
  }
  _actualiserListePostsPromise(aParams) {
    const lParams = Object.assign(
      {
        sujet: null,
        avecSujet: false,
        typeLoader: null,
        surChangementSujet: false,
        avecAffichage: false,
        typeSaisiePost: null,
      },
      aParams,
    );
    const lForcerBasListePosts =
      lParams.typeSaisiePost ===
      TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Creer;
    let lPostMarqueur;
    let lScrollArticle = null;
    if (
      !lParams.surChangementSujet &&
      !lForcerBasListePosts &&
      !lParams.typeLoader &&
      this.donnees.listePosts &&
      this.ensemblePostsVisibles &&
      this.ensemblePostsVisibles.count() > 0
    ) {
      lPostMarqueur = this.donnees.listePosts.get(
        this.ensemblePostsVisibles.items()[0],
      );
      const lIdNodeArticle = `post_${lPostMarqueur.getNumero()}`;
      const lNodeArticle = ObjetHtml_1.GHtml.getElement(lIdNodeArticle);
      if (lNodeArticle) {
        lScrollArticle = {
          id: lIdNodeArticle,
          rect: ObjetPosition_1.GPosition.getClientRect(lNodeArticle),
        };
      }
    }
    const lModeVisuMembre =
      u_optionsSession.modeVisuMembre || !this.options.visuModerateurPossible;
    const lParamsJSON = {
      sujet: lParams.sujet,
      avecSujet: lParams.avecSujet,
      modeVisuMembre: lModeVisuMembre,
      uniquementModeration:
        this.options.visuModerateurPossible &&
        u_optionsSession.visuUniquementEnAttente,
    };
    if (lParams.typeLoader === "before" && this.donnees.loaderPostBefore) {
      Object.assign(lParamsJSON, {
        postMarqueur: this.donnees.loaderPostBefore,
        marqueur: lParams.typeLoader,
      });
    } else if (lParams.typeLoader === "after" && this.donnees.loaderPostAfter) {
      Object.assign(lParamsJSON, {
        postMarqueur: this.donnees.loaderPostAfter,
        marqueur: lParams.typeLoader,
      });
    } else if (lPostMarqueur) {
      Object.assign(lParamsJSON, {
        postMarqueur: lPostMarqueur,
        marqueur: "current",
      });
    } else if (lParams.surChangementSujet) {
      lParamsJSON.marqueur = "nonLu";
    }
    this.ensemblePostsVisibles = new TypeEnsembleNombre_1.TypeEnsembleNombre();
    return this.moteurForum.requeteListePosts(lParamsJSON).then((aDonnees) => {
      if (!aDonnees) {
        this.donnees = {};
      } else {
        if (aDonnees.sujet) {
          this.donnees.sujet = aDonnees.sujet;
        }
        if (aDonnees.listePosts) {
          if (aDonnees.before) {
            this.donnees.listePosts = aDonnees.listePosts.add(
              this.donnees.listePosts,
            );
          } else if (aDonnees.after) {
            this.donnees.listePosts.add(aDonnees.listePosts);
          } else {
            this.donnees.listePosts = aDonnees.listePosts;
          }
        }
        if (!aDonnees.after) {
          this.donnees.loaderPostBefore = aDonnees.loaderPostBefore;
        }
        if (!aDonnees.before) {
          this.donnees.loaderPostAfter = aDonnees.loaderPostAfter;
        }
      }
      if (aDonnees === false) {
        this.visuPostVisible = false;
        this.moteurForum.getOptions().surBasculeEcran(false);
        return false;
      }
      const lBackupScroll = this._getBackupScrollEtFocus(
        !lParams.surChangementSujet,
        aDonnees && aDonnees.before,
      );
      lBackupScroll.scrollArticle = lScrollArticle;
      if (lForcerBasListePosts) {
        lBackupScroll.forcerScrollMax = true;
      }
      this.afficher(this._construireAffichage());
      if (
        !!this.moteurForum.getOptions().surBasculeEcran &&
        lParams.avecAffichage
      ) {
        this.moteurForum.getOptions().surBasculeEcran(true);
        this.visuPostVisible = true;
      }
      this._positionnerScrollEtFocus(lBackupScroll);
    });
  }
  _getBackupScrollEtFocus(aConserverPosScroll, aSurLoadingPostsAvant) {
    let lBackupScroll = {};
    const lJScroll = $(`#${this.Nom.escapeJQ()} .scroll-posts`);
    if (lJScroll.length > 0) {
      const lScroll = lJScroll.get(0);
      if (aSurLoadingPostsAvant) {
        lBackupScroll.scrollTopInverse =
          lScroll.scrollHeight - lScroll.scrollTop;
      } else if (aConserverPosScroll) {
        lBackupScroll.scrollTop = lScroll.scrollTop;
      }
    }
    try {
      const lElementFocus = document.activeElement;
      if (lElementFocus && lElementFocus.closest) {
        const lArticleFocus = lElementFocus.closest(
          `#${this.Nom.escapeJQ()}  article.post`,
        );
        if (lArticleFocus) {
          lBackupScroll.idFocusArticle = lArticleFocus.id;
        }
      }
    } catch (e) {}
    return lBackupScroll;
  }
  _positionnerScrollEtFocus(aBackupScroll) {
    if (!aBackupScroll) {
      return;
    }
    const lJScroll = $(`#${this.Nom.escapeJQ()} .scroll-posts`);
    if (lJScroll.length === 0) {
      return;
    }
    const lScroll = lJScroll.get(0);
    if (this.visuPostVisible) {
      if (aBackupScroll.idFocusArticle) {
        ObjetHtml_1.GHtml.setFocus(aBackupScroll.idFocusArticle);
      }
    }
    if (!aBackupScroll.forcerScrollMax) {
      if (
        aBackupScroll.scrollArticle &&
        ObjetHtml_1.GHtml.elementExiste(aBackupScroll.scrollArticle.id)
      ) {
        const lRectArticle = ObjetPosition_1.GPosition.getClientRect(
          aBackupScroll.scrollArticle.id,
        );
        if (!lRectArticle.erreur) {
          lScroll.scrollTop =
            lScroll.scrollTop +
            (lRectArticle.top - aBackupScroll.scrollArticle.rect.top);
          return;
        }
      }
      if (
        MethodesObjet_1.MethodesObjet.isNumber(aBackupScroll.scrollTopInverse)
      ) {
        lScroll.scrollTop =
          lScroll.scrollHeight - aBackupScroll.scrollTopInverse;
        return;
      }
      if (MethodesObjet_1.MethodesObjet.isNumber(aBackupScroll.scrollTop)) {
        lScroll.scrollTop = aBackupScroll.scrollTop;
        return;
      }
      const lJNonLu = lJScroll.find(".sep-nonLu");
      if (lJNonLu.length >= 1) {
        const lPosition = lJNonLu.eq(0).position();
        if (lPosition) {
          lScroll.scrollTop = Math.max(0, lPosition.top - 8);
          return;
        }
      }
    }
    lScroll.scrollTop = lScroll.scrollHeight;
  }
  _estVisiteurDuSujet() {
    return (
      this.donnees.sujet.roles.count() === 1 &&
      this.donnees.sujet.roles.contains(
        TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur,
      )
    );
  }
  _estConsigneVisible() {
    return this._estVisiteurDuSujet()
      ? u_optionsSession.consigneVisibleVisiteur
      : this.donnees.sujet.consigneVisible;
  }
}
exports.ObjetForumVisuPosts = ObjetForumVisuPosts;
