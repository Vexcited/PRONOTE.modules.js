exports.UtilitaireFicheEleve = UtilitaireFicheEleve;
exports.UtilitairePhotoEleve = UtilitairePhotoEleve;
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetFenetre_FicheEleve_1 = require("ObjetFenetre_FicheEleve");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MultiObjetFichePhotos = require("ObjetFichePhotos");
const AccessApp_1 = require("AccessApp");
function UtilitaireFicheEleve() {}
UtilitaireFicheEleve.getHtmlBtnAfficherFicheEleve = function (aInstance) {
	const lModelBtn = () => {
		return {
			event() {
				_afficherFicheEleve(aInstance);
			},
			getSelection() {
				const lFenetre = aInstance.getInstance(
					aInstance.identFenetreFicheEleve,
				);
				return lFenetre && lFenetre.estAffiche();
			},
			getTitle() {
				return ObjetTraduction_1.GTraductions.getValeur("FicheRenseignement");
			},
			getDisabled() {
				return !estBtnActif(aInstance);
			},
		};
	};
	return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherFicheEleve(
		lModelBtn,
	);
};
UtilitaireFicheEleve.initFicheEleve = function (aFiche) {
	aFiche.setOptionsFenetre({
		modale: false,
		titre: "",
		largeur: 850,
		hauteur: 750,
		listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
	});
	aFiche.setOngletsVisibles({ projets: false, attestations: false });
};
function _afficherFicheEleve(aInstance) {
	const lFenetre = aInstance.getInstance(aInstance.identFenetreFicheEleve);
	if (lFenetre) {
		lFenetre.setDonnees();
	}
}
UtilitaireFicheEleve.avecFicheEleve = function () {
	return (
		!!ObjetFenetre_FicheEleve_1.ObjetFenetre_FicheEleve &&
		((0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
		) ||
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			))
	);
};
function estBtnActif(aInstance) {
	return (
		aInstance.estBoutonsFicheEleveActif !== false &&
		!!(0, AccessApp_1.getApp)()
			.getEtatUtilisateur()
			.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve)
	);
}
function UtilitairePhotoEleve() {}
UtilitairePhotoEleve.getHtmlBtnAfficherPhotoEleve = function (aInstance) {
	const lModelBtn = () => {
		return {
			event() {
				UtilitairePhotoEleve.afficherPhotoEleve(aInstance, false);
			},
			getSelection() {
				const lFenetre = aInstance.getInstance(aInstance.identFichePhoto);
				return lFenetre && lFenetre.estAffiche();
			},
			getTitle() {
				return ObjetTraduction_1.GTraductions.getValeur("VoirPhotoEleve");
			},
			getDisabled() {
				return !estBtnActif(aInstance);
			},
		};
	};
	return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherPhotoEleve(
		lModelBtn,
	);
};
UtilitairePhotoEleve.getClassFichePhotoEeve = function () {
	return MultiObjetFichePhotos === null || MultiObjetFichePhotos === void 0
		? void 0
		: MultiObjetFichePhotos.ObjetFichePhotos;
};
UtilitairePhotoEleve.estPhotoEleveAffiche = function (aInstance) {
	const lFenetrePhoto = aInstance.getInstance(aInstance.identFichePhoto);
	return lFenetrePhoto && lFenetrePhoto.estAffiche();
};
UtilitairePhotoEleve.fermerPhotoEleve = function (aInstance) {
	const lFenetrePhoto = aInstance.getInstance(aInstance.identFichePhoto);
	if (lFenetrePhoto) {
		lFenetrePhoto.fermer();
	}
};
UtilitairePhotoEleve.afficherPhotoEleve = function (aInstance, aBloquerFocus) {
	const lFenetrePhoto = aInstance.getInstance(aInstance.identFichePhoto);
	if (lFenetrePhoto) {
		const lRessource = (0, AccessApp_1.getApp)()
			.getEtatUtilisateur()
			.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve);
		if (!!lRessource && lRessource.existeNumero()) {
			const lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lRessource, {
				libelle: "photo.jpg",
			});
			lFenetrePhoto.setDonnees(
				null,
				lUrl,
				null,
				aBloquerFocus,
				null,
				ObjetTraduction_1.GTraductions.getValeur(
					"PhotoDe_S",
					lRessource.getLibelle(),
				),
			);
		} else {
			lFenetrePhoto.setDonnees(null, "", null, aBloquerFocus);
		}
	}
};
UtilitairePhotoEleve.avecPhotoEleve = function () {
	return (
		UtilitaireFicheEleve.avecFicheEleve() &&
		(0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
		)
	);
};
