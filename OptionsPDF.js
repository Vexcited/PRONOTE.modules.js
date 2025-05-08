exports._OptionsPDF = exports.EGenreCouleurTexte_EDT = void 0;
const TypeGestionRenvoisImp_1 = require("TypeGestionRenvoisImp");
var EGenreCouleurTexte_EDT;
(function (EGenreCouleurTexte_EDT) {
	EGenreCouleurTexte_EDT[(EGenreCouleurTexte_EDT["aucune"] = 0)] = "aucune";
	EGenreCouleurTexte_EDT[(EGenreCouleurTexte_EDT["fond"] = 1)] = "fond";
	EGenreCouleurTexte_EDT[(EGenreCouleurTexte_EDT["texte"] = 2)] = "texte";
})(
	EGenreCouleurTexte_EDT ||
		(exports.EGenreCouleurTexte_EDT = EGenreCouleurTexte_EDT = {}),
);
exports._OptionsPDF = {
	defaut: { portrait: true, taillePolice: 8 },
	EDT: {
		portrait: false,
		taillePolice: 8,
		taillePoliceMin: 3,
		couleur: EGenreCouleurTexte_EDT.fond,
		renvoi: TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisAucun,
		uneGrilleParSemaine: false,
		inversionGrille: false,
		ignorerLesPlagesSansCours: false,
	},
	BulletinReleve: {
		portrait: true,
		taillePolice: 6.5,
		taillePoliceMin: 5,
		taillePolicePied: 6.5,
		taillePolicePiedMin: 5,
		hauteurServiceMin: 10,
		hauteurServiceMax: 15,
	},
	Bulletin: null,
};
exports._OptionsPDF.Bulletin = Object.assign(
	{ adapterHauteurService: false },
	exports._OptionsPDF.BulletinReleve,
);
