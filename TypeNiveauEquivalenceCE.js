exports.TypeNiveauEquivalenceCEUtil = exports.TypeNiveauEquivalenceCE = void 0;
var TypeNiveauEquivalenceCE;
(function (TypeNiveauEquivalenceCE) {
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Aucun"] = 0)] =
		"TNECE_Aucun";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau1"] = 1)] =
		"TNECE_Niveau1";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau2"] = 2)] =
		"TNECE_Niveau2";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau3"] = 3)] =
		"TNECE_Niveau3";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau4"] = 4)] =
		"TNECE_Niveau4";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau5"] = 5)] =
		"TNECE_Niveau5";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau6"] = 6)] =
		"TNECE_Niveau6";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau7"] = 7)] =
		"TNECE_Niveau7";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau8"] = 8)] =
		"TNECE_Niveau8";
	TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau1Plus"] = 9)] =
		"TNECE_Niveau1Plus";
})(
	TypeNiveauEquivalenceCE ||
		(exports.TypeNiveauEquivalenceCE = TypeNiveauEquivalenceCE = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TradTypeNiveauEquivalenceCE =
	ObjetTraduction_1.TraductionsModule.getModule("TypeNiveauEquivalenceCE", {
		NiveauX: "",
		LVE: {
			NiveauAucun: "",
			Niveau1: "",
			Niveau1Plus: "",
			Niveau2: "",
			Niveau3: "",
			Niveau4: "",
			Niveau5: "",
			Niveau6: "",
			Niveau7: "",
			Niveau8: "",
		},
		CN: {
			NiveauAucun: "",
			Niveau1: "",
			Niveau2: "",
			Niveau3: "",
			Niveau4: "",
			Niveau5: "",
			Niveau6: "",
			Niveau7: "",
			Niveau8: "",
		},
	});
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeNiveauEquivalenceCEUtil = {
	_toListe(aModeLVE, aAvecLibelleLong = false) {
		let lTypesConcernes = [];
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Aucun);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau1);
		if (aModeLVE) {
			lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau1Plus);
		}
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau2);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau3);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau4);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau5);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau6);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau7);
		lTypesConcernes.push(TypeNiveauEquivalenceCE.TNECE_Niveau8);
		let lPosition = 1;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lTypeNiveau of lTypesConcernes) {
			const lElement = new ObjetElement_1.ObjetElement(
				TypeNiveauEquivalenceCEUtil.getLibelle(
					aModeLVE,
					aAvecLibelleLong,
					lTypeNiveau,
				),
				undefined,
				lTypeNiveau,
				lPosition,
			);
			lListe.addElement(lElement);
			lPosition++;
		}
		return lListe;
	},
	getLibelle(aModeLVE, aLibelleLong, aTypeNiveau) {
		let lLibelleCourt;
		if (aModeLVE) {
			switch (aTypeNiveau) {
				case TypeNiveauEquivalenceCE.TNECE_Aucun:
					return TradTypeNiveauEquivalenceCE.LVE.NiveauAucun;
				case TypeNiveauEquivalenceCE.TNECE_Niveau1:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau1;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau1Plus:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau1Plus;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau2:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau2;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau3:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau3;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau4:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau4;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau5:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau5;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau6:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau6;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau7:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau7;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau8:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.LVE.Niveau8;
					break;
			}
		} else {
			switch (aTypeNiveau) {
				case TypeNiveauEquivalenceCE.TNECE_Aucun:
					return TradTypeNiveauEquivalenceCE.CN.NiveauAucun;
				case TypeNiveauEquivalenceCE.TNECE_Niveau1:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau1;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau2:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau2;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau3:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau3;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau4:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau4;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau5:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau5;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau6:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau6;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau7:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau7;
					break;
				case TypeNiveauEquivalenceCE.TNECE_Niveau8:
					lLibelleCourt = TradTypeNiveauEquivalenceCE.CN.Niveau8;
					break;
			}
		}
		return aLibelleLong
			? TradTypeNiveauEquivalenceCE.NiveauX.format(lLibelleCourt)
			: lLibelleCourt;
	},
	getType(aModeLVE, aEstLibelleLong, aLibelle) {
		let lType = TypeNiveauEquivalenceCE.TNECE_Aucun;
		if (aLibelle) {
			const lListeNiveaux = TypeNiveauEquivalenceCEUtil._toListe(
				aModeLVE,
				aEstLibelleLong,
			);
			lListeNiveaux.parcourir((D) => {
				if (D.getLibelle() === aLibelle) {
					lType = D.getGenre();
					return false;
				}
			});
		}
		return lType;
	},
	getTypeParRaccourci(aModeLVE, aRaccourci) {
		let lType = null;
		if (!!aRaccourci) {
			const lListeNiveaux = TypeNiveauEquivalenceCEUtil._toListe(
				aModeLVE,
				true,
			);
			lListeNiveaux.parcourir((D) => {
				if (D.getGenre().toString() === aRaccourci) {
					lType = D;
					return false;
				}
			});
		}
		return lType;
	},
	getListeNiveauxEquivalenceLVE(aAvecLibelleLong) {
		return TypeNiveauEquivalenceCEUtil._toListe(true, aAvecLibelleLong);
	},
	getListeNiveauxEquivalenceCN(aAvecLibelleLong) {
		return TypeNiveauEquivalenceCEUtil._toListe(false, aAvecLibelleLong);
	},
};
exports.TypeNiveauEquivalenceCEUtil = TypeNiveauEquivalenceCEUtil;
