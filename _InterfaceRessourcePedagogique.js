const { MethodesObjet } = require("MethodesObjet.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const {
	EGenreRessourcePedagogique,
	EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const { InterfacePage } = require("InterfacePage.js");
const { tag } = require("tag.js");
class _InterfaceRessourcePedagogique extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.avecDocumentCloud = true;
		this.parametres = { avecGenres: new TypeEnsembleNombre() };
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cb: {
				getValue: function (aGenre) {
					return aInstance.parametres.avecGenres.contains(aGenre);
				},
				setValue: function (aGenre, aValue) {
					if (aValue) {
						aInstance.parametres.avecGenres.add(aGenre);
						if (
							!aInstance.avecDocumentCloud &&
							aGenre === EGenreRessourcePedagogique.documentJoint
						) {
							aInstance.parametres.avecGenres.add(
								EGenreRessourcePedagogique.documentCloud,
							);
						}
					} else {
						aInstance.parametres.avecGenres.remove(aGenre);
						if (
							!aInstance.avecDocumentCloud &&
							aGenre === EGenreRessourcePedagogique.documentJoint
						) {
							aInstance.parametres.avecGenres.remove(
								EGenreRessourcePedagogique.documentCloud,
							);
						}
					}
					GEtatUtilisateur.Navigation.avecGenresRessourcePedagogique =
						aInstance.parametres.avecGenres;
					aInstance._actualiserAffichage();
				},
				getLibelle: function (aGenre) {
					return _getLibelleDeGenre.call(aInstance, aGenre);
				},
			},
		});
	}
	composerCBs(aAvecKiosque, aAvecDocumentCloud, aAvecQCMs, aAvecTravauxRendus) {
		const T = [];
		this.avecDocumentCloud = aAvecDocumentCloud;
		T.push('<div class="flex-contain f-wrap flex-center m-x-nega-l m-y-nega">');
		for (const lKey of MethodesObjet.enumKeys(EGenreRessourcePedagogique)) {
			const lGenre = EGenreRessourcePedagogique[lKey];
			if (!MethodesObjet.isFunction(lGenre)) {
				let lVisible = true;
				switch (lGenre) {
					case EGenreRessourcePedagogique.kiosque:
						lVisible = aAvecKiosque;
						break;
					case EGenreRessourcePedagogique.documentCloud:
						lVisible = aAvecDocumentCloud;
						break;
					case EGenreRessourcePedagogique.QCM:
						lVisible = aAvecQCMs;
						break;
					case EGenreRessourcePedagogique.travailRendu:
						lVisible = aAvecTravauxRendus;
						break;
				}
				if (lVisible) {
					T.push(_composerCB.call(this, lGenre));
				}
			}
		}
		T.push("</div>");
		return T.join("");
	}
}
function _composerCB(aGenre) {
	if (
		aGenre === EGenreRessourcePedagogique.kiosque &&
		!GEtatUtilisateur.autorisationKiosque
	) {
		return "";
	}
	if (
		aGenre === EGenreRessourcePedagogique.documentCloud &&
		!GEtatUtilisateur.autorisationCloud
	) {
		return "";
	}
	const lHtml = [];
	const lClasseIcone = EGenreRessourcePedagogiqueUtil.getIcone(aGenre);
	lHtml.push(
		tag("ie-checkbox", {
			"ie-model": tag.funcAttr("cb", aGenre),
			class: ["as-chips m-x-l m-y"],
			"ie-icon": lClasseIcone,
		}),
	);
	return lHtml.join("");
}
function _getLibelleDeGenre(aGenre) {
	switch (aGenre) {
		case EGenreRessourcePedagogique.documentJoint:
			return GTraductions.getValeur("RessourcePedagogique.DocJoint");
		case EGenreRessourcePedagogique.site:
			return GTraductions.getValeur("RessourcePedagogique.SitesWeb");
		case EGenreRessourcePedagogique.QCM:
			return GTraductions.getValeur("RessourcePedagogique.IDevoirs");
		case EGenreRessourcePedagogique.sujet:
			return GTraductions.getValeur("RessourcePedagogique.Sujets");
		case EGenreRessourcePedagogique.corrige:
			return GTraductions.getValeur("RessourcePedagogique.Corriges");
		case EGenreRessourcePedagogique.travailRendu:
			return GTraductions.getValeur("RessourcePedagogique.TravauxRendus");
		case EGenreRessourcePedagogique.kiosque:
			return this.parametres.avecLienKiosque
				? GTraductions.getValeur("RessourcePedagogique.LiensKiosque")
				: GTraductions.getValeur("RessourcePedagogique.Kiosque");
		case EGenreRessourcePedagogique.documentCloud:
			return GTraductions.getValeur("RessourcePedagogique.Cloud");
		default:
			return "";
	}
}
module.exports = { _InterfaceRessourcePedagogique };
