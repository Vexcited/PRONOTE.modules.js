const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
  TypeBoutonCreationMessagerie,
} = require("TypeBoutonCreationMessagerie.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
function UtilitaireCarnetLiaison() {}
UtilitaireCarnetLiaison.creerDiscussion = function (
  aListeDestinataires,
  aGenreDestinataire,
  aEleveConcerne,
  aCallback,
  aAvecChoixResponsable2 = false,
) {
  if (!aEleveConcerne) {
    return;
  }
  const lFenetreMessage = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_Message,
    {
      pere: this,
      evenement: function (aNumeroBouton) {
        if (aNumeroBouton === 1) {
          if (!!aCallback) {
            aCallback({ eleve: aEleveConcerne });
          }
        }
      },
    },
    { avecChoixResponsable2: aAvecChoixResponsable2 },
  );
  let lTitreFenetre;
  let lLegende = "";
  if (GEtatUtilisateur.GenreEspace === EGenreEspace.PrimParent) {
    lLegende = GTraductions.getValeur(
      "MessagerieCarnetLiaison.AvertissementMessagesPublics",
    );
  }
  if (
    GEtatUtilisateur.GenreEspace === EGenreEspace.PrimParent &&
    !aEleveConcerne
  ) {
    lTitreFenetre = GTraductions.getValeur(
      "MessagerieCarnetLiaison.TitreFenetreNouveauPourVotreEnfant",
    );
  } else {
    lTitreFenetre = GTraductions.getValeur(
      "MessagerieCarnetLiaison.TitreFenetreNouveauPourLEleve",
      [aEleveConcerne.getLibelle()],
    );
  }
  const lCopyListeDestinataires = aListeDestinataires.getListeElements();
  lFenetreMessage.setOptionsFenetre({ titre: lTitreFenetre });
  lFenetreMessage.setDonnees({
    ListeRessources: lCopyListeDestinataires,
    listeSelectionnee: lCopyListeDestinataires,
    genreRessource: aGenreDestinataire,
    message: {
      legende: lLegende,
      estCreationCarnetLiaison: true,
      eleveCarnetLiaison: aEleveConcerne,
      avecControleNbDest: false,
    },
  });
};
UtilitaireCarnetLiaison.creerDiscussionRaccourciParent = () => {
  const lMembre = GEtatUtilisateur.getMembre();
  UtilitaireCarnetLiaison.creerDiscussion(
    UtilitaireMessagerie.getListeDestCarnetLiaisonDElevePrimParent(
      lMembre.getNumero(),
    ),
    EGenreRessource.Enseignant,
    lMembre,
    null,
    true,
  );
};
UtilitaireCarnetLiaison.ouvreFenetreDiscussions = function (
  aClasseFenetreDiscussion,
  aEleve,
  aCallback,
) {
  const lFenetreDiscussions = ObjetFenetre.creerInstanceFenetre(
    aClasseFenetreDiscussion,
    {
      pere: this,
      evenement: function () {
        if (aCallback) {
          aCallback();
        }
      },
      initialiser: function (aInstance) {
        aInstance.setOptions({
          avecListeDiscussions: true,
          avecBoutonCreation: true,
          typeBoutonCreation: TypeBoutonCreationMessagerie.CarnetLiaison,
        });
        aInstance.setOptionsFenetre({
          titre: "",
          largeur: 550 + 400,
          hauteur: 600,
          listeBoutons: [GTraductions.getValeur("Fermer")],
        });
      },
    },
  );
  lFenetreDiscussions.setDonnees({
    titreFenetre: GTraductions.getValeur(
      "MessagerieCarnetLiaison.TitreFenetreDiscussions",
      [aEleve.getLibelle()],
    ),
    messagesCommunsEntreLesRessources: false,
    avecSelectionPremiereDiscussion: true,
    eleveCarnetLiaison: aEleve,
  });
};
module.exports = UtilitaireCarnetLiaison;
