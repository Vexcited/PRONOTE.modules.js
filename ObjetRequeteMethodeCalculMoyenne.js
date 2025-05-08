exports.ObjetRequeteMethodeCalculMoyenne = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
class ObjetRequeteMethodeCalculMoyenne extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = {
			eleve: new ObjetElement_1.ObjetElement(null, aParametres.numeroEleve),
			classe: new ObjetElement_1.ObjetElement(null, aParametres.numeroClasse),
			service: new ObjetElement_1.ObjetElement(
				null,
				aParametres.numeroServiceNotation,
			),
			pourMoyenneNette: aParametres.pourMoyenneNette,
			ordreChronologique: aParametres.ordreChronologique,
			moyenneTrimestrielle: aParametres.moyenneTrimestrielle,
			avecCorrection: aParametres.avecCorrection,
			avecCorrectionAnnuelle: aParametres.avecCorrectionAnnuelle,
			genreNotation: aParametres.genreNotation,
			module: aParametres.module,
			periode: aParametres.estUnCalendrier
				? null
				: new ObjetElement_1.ObjetElement(
						null,
						aParametres.numeroPeriodeNotation,
						aParametres.genreChoixNotation,
					),
			calendrier: aParametres.estUnCalendrier
				? new ObjetElement_1.ObjetElement(
						null,
						aParametres.numeroPeriodeNotation,
						aParametres.genreChoixNotation,
					)
				: null,
		};
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteMethodeCalculMoyenne = ObjetRequeteMethodeCalculMoyenne;
CollectionRequetes_1.Requetes.inscrire(
	"MethodeCalculMoyenne",
	ObjetRequeteMethodeCalculMoyenne,
);
