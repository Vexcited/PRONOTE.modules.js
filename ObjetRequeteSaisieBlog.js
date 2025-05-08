exports.ObjetRequeteSaisieBlog = exports.TypeSaisieBlog = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const ObjetChaine_1 = require("ObjetChaine");
var TypeSaisieBlog;
(function (TypeSaisieBlog) {
  TypeSaisieBlog["EditionBlog"] = "EditionBlog";
  TypeSaisieBlog["EditionBillet"] = "EditionBillet";
  TypeSaisieBlog["EditionCommentaireBillet"] = "EditionCommentaireBillet";
})(TypeSaisieBlog || (exports.TypeSaisieBlog = TypeSaisieBlog = {}));
class ObjetRequeteSaisieBlog extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
  lancerRequete(aTypeSaisie, aParams) {
    this.JSON.typeSaisie = aTypeSaisie;
    if (this.JSON.typeSaisie === TypeSaisieBlog.EditionBlog) {
      if (aParams.blog) {
        this.JSON.blog = aParams.blog.toJSON();
        this.serialiserBlog(aParams.blog, this.JSON.blog);
      }
    } else if (this.JSON.typeSaisie === TypeSaisieBlog.EditionBillet) {
      if (aParams.blog) {
        this.JSON.blog = aParams.blog.toJSON();
      }
      if (aParams.billetBlog) {
        this.JSON.billetBlog = aParams.billetBlog.toJSON();
        this.serialiserBilletBlog(aParams.billetBlog, this.JSON.billetBlog);
      }
    } else if (
      this.JSON.typeSaisie === TypeSaisieBlog.EditionCommentaireBillet
    ) {
      if (aParams.billetBlog && aParams.billetBlog.listeCommentaires) {
        this.JSON.billetBlog = aParams.billetBlog.toJSON();
        this.JSON.listeCommentaires = aParams.billetBlog.listeCommentaires;
        this.JSON.listeCommentaires.setSerialisateurJSON({
          methodeSerialisation:
            this._serialiserCommentaireBilletBlog.bind(this),
        });
      }
    }
    return this.appelAsynchrone();
  }
  actionApresRequete(aGenreReponse) {
    this.callbackReussite.appel(this.JSONReponse, this.JSONRapportSaisie);
  }
  serialiserBlog(aBlog, aJSON) {
    aJSON.dateFinRedactionBillet = aBlog.dateFinRedactionBillet;
    aJSON.autoriserCommentaires = aBlog.autoriserCommentaires;
    aJSON.listeModerateurs = aBlog.listeModerateurs;
    if (aJSON.listeModerateurs) {
      aJSON.listeModerateurs.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    aJSON.listeRedacteurs = aBlog.listeRedacteurs;
    if (aJSON.listeRedacteurs) {
      aJSON.listeRedacteurs.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    aJSON.listePublics = aBlog.listePublics;
    if (aJSON.listePublics) {
      aJSON.listePublics.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
  }
  serialiserBilletBlog(aBilletBlog, aJSON) {
    aJSON.contenu = new TypeChaineHtml_1.TypeChaineHtml(aBilletBlog.contenu);
    aJSON.listeCoRedacteurs = aBilletBlog.listeCoRedacteurs;
    if (aJSON.listeCoRedacteurs) {
      aJSON.listeCoRedacteurs.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    aJSON.categorie = aBilletBlog.categorie;
    aJSON.estPublie = aBilletBlog.estPublie;
    aJSON.estPublicDuBlog = aBilletBlog.estPublicDuBlog;
    aJSON.listePublics = aBilletBlog.listePublicsBillet;
    if (aJSON.listePublics) {
      aJSON.listePublics.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    aJSON.listeDocuments = aBilletBlog.listeDocuments;
    if (aJSON.listeDocuments) {
      aJSON.listeDocuments.setSerialisateurJSON({
        methodeSerialisation: this._serialiserDocumentBillet.bind(this),
      });
    }
  }
  _serialiserCommentaireBilletBlog(aCommentaire, aJSON) {
    aJSON.etatCommentaire = aCommentaire.etatCommentaire;
  }
  _serialiserDocumentBillet(aDocumentBillet, aJSON) {
    if (aDocumentBillet.documentCasier) {
      aJSON.documentCasier = aDocumentBillet.documentCasier.toJSON();
      aJSON.libelle = aDocumentBillet.libelle;
      this._serialiserDocumentCasier(
        aDocumentBillet.documentCasier,
        aJSON.documentCasier,
      );
    }
  }
  _serialiserDocumentCasier(aDocumentCasier, aJSON) {
    const lIdFichier =
      aDocumentCasier.idFichier !== undefined
        ? aDocumentCasier.idFichier
        : aDocumentCasier.fichier !== undefined
          ? aDocumentCasier.fichier.idFichier
          : null;
    if (lIdFichier !== null) {
      aJSON.idFichier = ObjetChaine_1.GChaine.cardinalToStr(lIdFichier);
    }
    if (aDocumentCasier.url !== null && aDocumentCasier.url !== undefined) {
      aJSON.url = aDocumentCasier.url;
    }
  }
}
exports.ObjetRequeteSaisieBlog = ObjetRequeteSaisieBlog;
CollectionRequetes_1.Requetes.inscrire("SaisieBlog", ObjetRequeteSaisieBlog);
