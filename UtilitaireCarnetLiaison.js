exports.UtilitaireCarnetLiaison = UtilitaireCarnetLiaison;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeBoutonCreationMessagerie_1 = require("TypeBoutonCreationMessagerie");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const Enumere_Ressource_1 = require("Enumere_Ressource");
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
	const lFenetreMessage = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_Message_1.ObjetFenetre_Message,
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
	if (
		GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.PrimParent
	) {
		lLegende = ObjetTraduction_1.GTraductions.getValeur(
			"MessagerieCarnetLiaison.AvertissementMessagesPublics",
		);
	}
	if (
		GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.PrimParent &&
		!aEleveConcerne
	) {
		lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
			"MessagerieCarnetLiaison.TitreFenetreNouveauPourVotreEnfant",
		);
	} else {
		lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
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
		UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestCarnetLiaisonDElevePrimParent(
			lMembre.getNumero(),
		),
		Enumere_Ressource_1.EGenreRessource.Enseignant,
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
	const lFenetreDiscussions = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
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
					typeBoutonCreation:
						TypeBoutonCreationMessagerie_1.TypeBoutonCreationMessagerie
							.CarnetLiaison,
				});
				aInstance.setOptionsFenetre({
					titre: "",
					largeur: 550 + 400,
					hauteur: 600,
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
				});
			},
		},
	);
	lFenetreDiscussions.setDonnees({
		titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
			"MessagerieCarnetLiaison.TitreFenetreDiscussions",
			[aEleve.getLibelle()],
		),
		messagesCommunsEntreLesRessources: false,
		avecSelectionPremiereDiscussion: true,
		eleveCarnetLiaison: aEleve,
	});
};
