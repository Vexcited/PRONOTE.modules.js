exports.TUtilitairePlaces = void 0;
const ObjetDate_1 = require("ObjetDate");
exports.TUtilitairePlaces = {
	placeAnnuelleEnDate(aPlaceAnnuelle) {
		return ObjetDate_1.GDate.getJourSuivant(
			IE.Cycles.dateDebutPremierCycle(),
			Math.floor(aPlaceAnnuelle / GParametres.PlacesParJour),
		);
	},
	placeAnnuelleEnPlaceCycle(aPlaceAnnuelle) {
		const lDate = exports.TUtilitairePlaces.placeAnnuelleEnDate(aPlaceAnnuelle);
		const lResult = IE.Cycles.dateEnCycleEtJourCycle(lDate, null);
		if (lResult.trouve) {
			lResult.place =
				lResult.indice * GParametres.PlacesParJour +
				(aPlaceAnnuelle % GParametres.PlacesParJour);
		} else {
			lResult.place = -1;
		}
		return lResult;
	},
};
