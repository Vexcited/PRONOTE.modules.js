exports._InterfaceRessourcePedagogique = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const InterfacePage_1 = require("InterfacePage");
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class _InterfaceRessourcePedagogique extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.avecDocumentCloud = true;
		this.parametres = {
			avecGenres: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
		};
	}
	jsxModeleCheckboxGenreRessPeda(aGenre) {
		return {
			getValue: () => {
				return this.parametres.avecGenres.contains(aGenre);
			},
			setValue: (aValue) => {
				if (aValue) {
					this.parametres.avecGenres.add(aGenre);
					if (
						!this.avecDocumentCloud &&
						aGenre ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentJoint
					) {
						this.parametres.avecGenres.add(
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentCloud,
						);
					}
				} else {
					this.parametres.avecGenres.remove(aGenre);
					if (
						!this.avecDocumentCloud &&
						aGenre ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentJoint
					) {
						this.parametres.avecGenres.remove(
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentCloud,
						);
					}
				}
				this.etatUtilScoEspace.avecGenresRessourcePedagogique =
					this.parametres.avecGenres;
				this._actualiserAffichage();
			},
			getLibelle: () => {
				return this._getLibelleDeGenre(aGenre);
			},
		};
	}
	composerCBs(aAvecKiosque, aAvecDocumentCloud, aAvecQCMs, aAvecTravauxRendus) {
		const T = [];
		this.avecDocumentCloud = aAvecDocumentCloud;
		T.push('<div class="flex-contain f-wrap flex-center m-x-nega-l m-y-nega">');
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique,
		)) {
			const lGenre =
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique[lKey];
			if (!MethodesObjet_1.MethodesObjet.isFunction(lGenre)) {
				let lVisible = true;
				switch (lGenre) {
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.kiosque:
						lVisible = aAvecKiosque;
						break;
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.documentCloud:
						lVisible = aAvecDocumentCloud;
						break;
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM:
						lVisible = aAvecQCMs;
						break;
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.travailRendu:
						lVisible = aAvecTravauxRendus;
						break;
				}
				if (lVisible) {
					T.push(this._composerCB(lGenre));
				}
			}
		}
		T.push("</div>");
		return T.join("");
	}
	_composerCB(aGenre) {
		if (
			aGenre ===
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque &&
			!this.etatUtilScoEspace.autorisationKiosque
		) {
			return "";
		}
		if (
			aGenre ===
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
					.documentCloud &&
			!this.etatUtilScoEspace.autorisationCloud
		) {
			return "";
		}
		if (
			aGenre ===
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM &&
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionQCM,
			)
		) {
			return "";
		}
		const lClasseIcone =
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.getIcone(
				aGenre,
			);
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("ie-checkbox", {
				"ie-model": this.jsxModeleCheckboxGenreRessPeda.bind(this, aGenre),
				class: "as-chips m-x-l m-y",
				"ie-icon": lClasseIcone,
			}),
		);
		return lHtml.join("");
	}
	_getLibelleDeGenre(aGenre) {
		switch (aGenre) {
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.documentJoint:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.DocJoint",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.site:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.SitesWeb",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.IDevoirs",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.sujet:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.Sujets",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.Corriges",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.travailRendu:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.TravauxRendus",
				);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque:
				return this.parametres.avecLienKiosque
					? ObjetTraduction_1.GTraductions.getValeur(
							"RessourcePedagogique.LiensKiosque",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"RessourcePedagogique.Kiosque",
						);
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.documentCloud:
				return ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.Cloud",
				);
			default:
				return "";
		}
	}
}
exports._InterfaceRessourcePedagogique = _InterfaceRessourcePedagogique;
