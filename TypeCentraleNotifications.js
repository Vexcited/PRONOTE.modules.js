exports.TypeModaliteAffichage =
	exports.TypeActionBoutonNotif =
	exports.TypeNotification =
		void 0;
var TypeNotification;
(function (TypeNotification) {
	TypeNotification[(TypeNotification["nOrpheline"] = 0)] = "nOrpheline";
	TypeNotification[(TypeNotification["nUnique"] = 1)] = "nUnique";
	TypeNotification[(TypeNotification["nCompteur"] = 2)] = "nCompteur";
	TypeNotification[(TypeNotification["nRouleau"] = 3)] = "nRouleau";
})(TypeNotification || (exports.TypeNotification = TypeNotification = {}));
var TypeActionBoutonNotif;
(function (TypeActionBoutonNotif) {
	TypeActionBoutonNotif[(TypeActionBoutonNotif["abnLu"] = 0)] = "abnLu";
	TypeActionBoutonNotif[(TypeActionBoutonNotif["abnFermer"] = 1)] = "abnFermer";
	TypeActionBoutonNotif[(TypeActionBoutonNotif["abnLien"] = 2)] = "abnLien";
	TypeActionBoutonNotif[(TypeActionBoutonNotif["abnNoAction"] = 3)] =
		"abnNoAction";
})(
	TypeActionBoutonNotif ||
		(exports.TypeActionBoutonNotif = TypeActionBoutonNotif = {}),
);
var TypeModaliteAffichage;
(function (TypeModaliteAffichage) {
	TypeModaliteAffichage[(TypeModaliteAffichage["affZone"] = 0)] = "affZone";
	TypeModaliteAffichage[(TypeModaliteAffichage["affHistorique"] = 1)] =
		"affHistorique";
	TypeModaliteAffichage[(TypeModaliteAffichage["affModale"] = 2)] = "affModale";
	TypeModaliteAffichage[(TypeModaliteAffichage["affPopup"] = 3)] = "affPopup";
})(
	TypeModaliteAffichage ||
		(exports.TypeModaliteAffichage = TypeModaliteAffichage = {}),
);
