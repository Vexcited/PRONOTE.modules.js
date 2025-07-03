exports.TUtilitaireCDT = TUtilitaireCDT;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const ObjetFenetre_Bloc_1 = require("ObjetFenetre_Bloc");
function TUtilitaireCDT() {}
TUtilitaireCDT.strtMatiere = function (aMatiere, aListeGroupes, aPourFiche) {
	const H = [];
	H.push(
		'<div class="color-matiere" aria-hidden="true" style="--couleur-matiere:',
		aMatiere.CouleurFond,
		'"></div>',
		'<div class="libelle-matiere',
		aPourFiche ? " Move" : "",
		'">',
		"<span>",
		aMatiere.getLibelle() ? aMatiere.getLibelle() : "",
		"</span>",
		aListeGroupes
			? " (" + aListeGroupes.getTableauLibelles().join(", ") + ")"
			: "",
		"</div>",
	);
	return H.join("");
};
TUtilitaireCDT.strtDate = function (aDate) {
	const H = [];
	H.push(
		aDate
			? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.le") +
					ObjetDate_1.GDate.formatDate(
						aDate,
						" %JJ %MMMM %AAAA " +
							ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.a") +
							" %hh%sh%mm",
					)
			: "",
	);
	return H.join("");
};
TUtilitaireCDT.afficheFenetreDetail = function (
	aInstance,
	aObjetDonnee,
	aParams,
	aOptions,
) {
	if (aInstance.fenetreCDT) {
		aInstance._coordonneesFenetreCDT = aInstance.fenetreCDT.coordonnees;
		aInstance.fenetreCDT.fermer();
	} else {
		aInstance._coordonneesFenetreCDT = null;
	}
	let lGestionnaireBloc;
	const lParams = { fenetre: true };
	if (aParams) {
		$.extend(lParams, aParams);
	}
	lGestionnaireBloc = ObjetIdentite_1.Identite.creerInstance(
		aObjetDonnee.gestionnaire,
		{
			pere: aInstance,
			evenement: lParams.evenementSurBlocCDT
				? lParams.evenementSurBlocCDT.bind(aInstance, lParams)
				: aInstance.evenementSurBlocCDT.bind(aInstance, lParams),
		},
	);
	const lOptions = {
		avecPastille: false,
		modeAffichage:
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
		formatDate: "%JJJ %JJ %MMM",
		avecZoneAction: false,
		avecBordure: false,
		avecOmbre: false,
		initPlie: false,
		callBackTitre: undefined,
	};
	if (aOptions) {
		$.extend(lOptions, aOptions);
	}
	lGestionnaireBloc.setOptions(lOptions);
	const lObjDonnees = { gestionnaireBloc: lGestionnaireBloc };
	if (aObjetDonnee) {
		lObjDonnees.element = aObjetDonnee;
	}
	if (
		aInstance._coordonneesFenetreCDT &&
		aInstance._coordonneesFenetreCDT.left !== null &&
		aInstance._coordonneesFenetreCDT.top !== null
	) {
		lObjDonnees.coordonnees = aInstance._coordonneesFenetreCDT;
	}
	aInstance.fenetreCDT = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_Bloc_1.ObjetFenetre_Bloc,
		{ pere: aInstance, initialiser: false },
	);
	aInstance.fenetreCDT.setOptionsFenetre({ modale: false });
	aInstance.fenetreCDT.initialiser();
	aInstance.fenetreCDT.setDonnees(lObjDonnees);
};
