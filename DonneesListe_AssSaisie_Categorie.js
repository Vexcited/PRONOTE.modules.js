exports.DonneesListe_AssSaisie_Categorie = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const _ObjetCouleur_1 = require("_ObjetCouleur");
class DonneesListe_AssSaisie_Categorie extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aAvecEtatSaisie) {
		super(aDonnees);
		this.creerIndexUnique([
			function (D) {
				return D.estUnDeploiement || !D.pere
					? D.getLibelle()
					: D.pere.getLibelle();
			},
			function (D) {
				return D.estUnDeploiement || !D.pere ? null : D.getLibelle();
			},
		]);
		this.setOptions({
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecEvnt_ApresCreation: true,
			avecEvnt_Suppression: true,
			avecEvnt_ApresSuppression: true,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie:
				aAvecEtatSaisie !== null && aAvecEtatSaisie !== undefined
					? aAvecEtatSaisie
					: true,
		});
	}
	getCouleurCellule(aParams) {
		let lCouleurCellule;
		if (aParams.article.estUneCategorie) {
			lCouleurCellule =
				ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		} else {
			lCouleurCellule = new _ObjetCouleur_1.ObjectCouleurCellule(
				GCouleur.grisFonce,
				GCouleur.noir,
				GCouleur.fenetre.bordure,
			);
		}
		return lCouleurCellule;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			!!aParams.article &&
			(!aParams.article.estUneCategorie || !aParams.article.Supprimable)
		) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	avecMenuContextuel() {
		return false;
	}
	surCreation(D, V) {
		D.Libelle = V[0];
		D.Editable = true;
		D.Supprimable = true;
		D.listeAppreciations = new ObjetListeElements_1.ObjetListeElements();
		D.estUneCategorie = true;
		D.estUnDeploiement = false;
		D.estDeploye = false;
		D.pere = null;
		D.traiterApresCreation = true;
	}
	avecEdition(aParams) {
		return aParams.article.Editable;
	}
	surEdition(aParams, V) {
		aParams.article.Libelle = V;
	}
	suppressionImpossible(D) {
		return !D.Supprimable;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.MsgSuppressionCategInterdit",
		);
	}
	getMessageSuppressionConfirmation(D) {
		const lNbrAppreciations = D.listeAppreciations.count();
		const lMsg = [];
		if (lNbrAppreciations > 0) {
			if (lNbrAppreciations === 1) {
				lMsg.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"Appreciations.MsgSupprCategAppr",
					),
				);
				lMsg.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"Appreciations.MsgSupprCategApprDetail",
					),
				);
			} else {
				lMsg.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"Appreciations.MsgSupprCategXAppr",
					),
				);
				lMsg.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"Appreciations.MsgSupprCategXApprDetail",
						[lNbrAppreciations],
					),
				);
			}
			lMsg.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.MsgConfirmSuppr",
				),
			);
		} else {
			lMsg.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.MsgConfirmSupprDirect",
				),
			);
		}
		return lMsg.join("\n");
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AssSaisie_Categorie.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init((D) => {
				return D.pere ? D.pere.getLibelle() : D.getLibelle();
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.pere;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
}
exports.DonneesListe_AssSaisie_Categorie = DonneesListe_AssSaisie_Categorie;
(function (DonneesListe_AssSaisie_Categorie) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DL_AssistSaisieCategorie_libelle";
	})(
		(colonnes =
			DonneesListe_AssSaisie_Categorie.colonnes ||
			(DonneesListe_AssSaisie_Categorie.colonnes = {})),
	);
})(
	DonneesListe_AssSaisie_Categorie ||
		(exports.DonneesListe_AssSaisie_Categorie =
			DonneesListe_AssSaisie_Categorie =
				{}),
);
