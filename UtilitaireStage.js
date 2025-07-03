exports.UtilitaireStage = UtilitaireStage;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
function UtilitaireStage() {}
UtilitaireStage.composeLibelleDatePeriodes = function (aPeriodes) {
	const lLibelle = [];
	if (aPeriodes) {
		for (let i = 0; i < aPeriodes.count(); i++) {
			const lPeriode = aPeriodes.get(i);
			lLibelle.push(_composeLibelleDatePeriode(lPeriode));
		}
	}
	return lLibelle.join(" - ");
};
UtilitaireStage.composeLibelleDatePeriodesEntreLe = function (aPeriodes) {
	const lLibelle = [];
	if (aPeriodes) {
		for (let i = 0; i < aPeriodes.count(); i++) {
			const lPeriode = aPeriodes.get(i);
			const lStr = _composeLibelleDatePeriodeEntreLe(lPeriode);
			if (!!lStr.libelle) {
				lLibelle.push(lStr.libelle);
			}
		}
	}
	if (lLibelle.length > 0) {
		return (
			ObjetTraduction_1.GTraductions.getValeur("OffreStage.entre") +
			" " +
			lLibelle.join(" " + ObjetTraduction_1.GTraductions.getValeur("ou") + " ")
		);
	}
	return "";
};
UtilitaireStage.composeLibelleDatePeriode = function (aPeriode) {
	return _composeLibelleDatePeriode(aPeriode);
};
function _composeLibelleDatePeriode(aPeriode) {
	let lLibelle = "";
	if (
		!!aPeriode &&
		aPeriode.existe() &&
		aPeriode.dateDebut &&
		aPeriode.dateDebut.getTime() > 0
	) {
		if (ObjetDate_1.GDate.estDateEgale(aPeriode.dateDebut, aPeriode.dateFin)) {
			lLibelle =
				ObjetTraduction_1.GTraductions.getValeur("Le") +
				" " +
				ObjetDate_1.GDate.formatDate(aPeriode.dateDebut, "%JJ/%MM/%AA");
		} else {
			lLibelle =
				ObjetTraduction_1.GTraductions.getValeur("Du") +
				" " +
				ObjetDate_1.GDate.formatDate(aPeriode.dateDebut, "%JJ/%MM/%AA");
			lLibelle +=
				" " +
				ObjetTraduction_1.GTraductions.getValeur("Au") +
				" " +
				ObjetDate_1.GDate.formatDate(aPeriode.dateFin, "%JJ/%MM/%AA");
		}
	}
	return lLibelle;
}
UtilitaireStage.composeLibelleDatePeriodeEntreLe = function (aPeriode) {
	const lResult = _composeLibelleDatePeriodeEntreLe(aPeriode);
	return lResult.libelle
		? (lResult.avecEntreLe
				? ObjetTraduction_1.GTraductions.getValeur("OffreStage.entre") + " "
				: "") + lResult.libelle
		: "";
};
function _composeLibelleDatePeriodeEntreLe(aPeriode) {
	const lResult = { libelle: "", avecEntreLe: false };
	if (
		!!aPeriode &&
		aPeriode.existe() &&
		aPeriode.dateDebut &&
		aPeriode.dateDebut.getTime() > 0
	) {
		if (ObjetDate_1.GDate.estDateEgale(aPeriode.dateDebut, aPeriode.dateFin)) {
			lResult.libelle =
				ObjetTraduction_1.GTraductions.getValeur("Le") +
				" " +
				ObjetDate_1.GDate.formatDate(aPeriode.dateDebut, "%JJ/%MM/%AA");
		} else {
			lResult.libelle = ObjetTraduction_1.GTraductions.getValeur(
				"OffreStage.entreLeXEtLeX",
				[
					ObjetDate_1.GDate.formatDate(aPeriode.dateDebut, "%JJ/%MM/%AA"),
					ObjetDate_1.GDate.formatDate(aPeriode.dateFin, "%JJ/%MM/%AA"),
				],
			);
			lResult.avecEntreLe = true;
		}
	}
	return lResult;
}
