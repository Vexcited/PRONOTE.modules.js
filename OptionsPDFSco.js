exports.OptionsPDFSco = void 0;
const OptionsPDF_1 = require("OptionsPDF");
var OptionsPDFSco;
(function (OptionsPDFSco) {
	OptionsPDFSco.defaut = OptionsPDF_1._OptionsPDF.defaut;
	OptionsPDFSco.EDT = Object.assign(
		{ estEDTAnnuel: true },
		OptionsPDF_1._OptionsPDF.EDT,
	);
	OptionsPDFSco.LivretScolaire = Object.assign(
		{ avecGraphe: false, portrait: false },
		OptionsPDFSco.defaut,
	);
	OptionsPDFSco.Bulletin = Object.assign(OptionsPDF_1._OptionsPDF.Bulletin, {
		piedMonobloc: true,
		gererRectoVerso: false,
		desEleves: false,
	});
	OptionsPDFSco.ReleveDeNotes = Object.assign(
		{ avecPolices: true, libelleGroupePolices: "" },
		OptionsPDF_1._OptionsPDF.BulletinReleve,
	);
	OptionsPDFSco.BulletinDeCompetences = Object.assign(
		{
			gererRectoVerso: false,
			adapterHauteur: false,
			avecGraphe: false,
			desEleves: false,
			taillePoliceMin: 5,
			taillePolicePied: 6.5,
			taillePolicePiedMin: 5,
		},
		OptionsPDF_1._OptionsPDF.BulletinReleve,
	);
	OptionsPDFSco.ReleveDeCompetences = Object.assign(
		{ desEleves: false },
		OptionsPDFSco.defaut,
	);
	OptionsPDFSco.RecapitulatifMensuelAbsences = Object.assign(
		{ avecDetailMotifs: true, portrait: false },
		OptionsPDFSco.defaut,
	);
})(OptionsPDFSco || (exports.OptionsPDFSco = OptionsPDFSco = {}));
