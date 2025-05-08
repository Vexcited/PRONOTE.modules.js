exports.ETypeAppreciationUtil = exports.ETypeAppreciation = void 0;
var ETypeAppreciation;
(function (ETypeAppreciation) {
	ETypeAppreciation[(ETypeAppreciation["Appreciations"] = 0)] = "Appreciations";
	ETypeAppreciation[(ETypeAppreciation["Progression"] = 1)] = "Progression";
	ETypeAppreciation[(ETypeAppreciation["Conseil"] = 2)] = "Conseil";
	ETypeAppreciation[(ETypeAppreciation["Assiduite"] = 3)] = "Assiduite";
	ETypeAppreciation[(ETypeAppreciation["Autonomie"] = 4)] = "Autonomie";
	ETypeAppreciation[(ETypeAppreciation["Globale"] = 5)] = "Globale";
	ETypeAppreciation[(ETypeAppreciation["Commentaire1"] = 6)] = "Commentaire1";
	ETypeAppreciation[(ETypeAppreciation["Commentaire2"] = 7)] = "Commentaire2";
	ETypeAppreciation[(ETypeAppreciation["Commentaire3"] = 8)] = "Commentaire3";
	ETypeAppreciation[(ETypeAppreciation["CPE"] = 9)] = "CPE";
	ETypeAppreciation[(ETypeAppreciation["FG_Annuelle"] = 10)] = "FG_Annuelle";
})(ETypeAppreciation || (exports.ETypeAppreciation = ETypeAppreciation = {}));
const Enumere_AppreciationGenerale_1 = require("Enumere_AppreciationGenerale");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ETypeAppreciationUtil = {
	getTypeAppreciation(aGenreOnglet, aAppreciation, aAppreciationGenerale) {
		const lTabTypeAppreciation = [];
		switch (aGenreOnglet) {
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche:
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations:
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences:
			case Enumere_Onglet_1.EGenreOnglet.FicheBrevet:
				lTabTypeAppreciation.push(ETypeAppreciation.FG_Annuelle);
				break;
			case Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse:
				lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
				lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
				lTabTypeAppreciation.push(ETypeAppreciation.Globale);
				break;
			case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsReleve:
				lTabTypeAppreciation.push(ETypeAppreciation.Appreciations);
				lTabTypeAppreciation.push(ETypeAppreciation.Progression);
				lTabTypeAppreciation.push(ETypeAppreciation.Conseil);
				break;
			case Enumere_Onglet_1.EGenreOnglet.Releve:
				if (aAppreciationGenerale) {
					lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
					lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
					lTabTypeAppreciation.push(ETypeAppreciation.Globale);
				} else {
					lTabTypeAppreciation.push(ETypeAppreciation.Appreciations);
					lTabTypeAppreciation.push(ETypeAppreciation.Progression);
					lTabTypeAppreciation.push(ETypeAppreciation.Conseil);
				}
				break;
			case Enumere_Onglet_1.EGenreOnglet.SaisieApprGeneralesReleve:
				lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
				lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
				lTabTypeAppreciation.push(ETypeAppreciation.Globale);
				break;
			case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales:
			case Enumere_Onglet_1.EGenreOnglet
				.SaisieAppreciationsGenerales_Competences:
				switch (aAppreciation.getGenre()) {
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Assiduite:
						lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Autonomie:
						lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Globale:
						lTabTypeAppreciation.push(ETypeAppreciation.Globale);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Commentaire1:
						lTabTypeAppreciation.push(ETypeAppreciation.Commentaire1);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Commentaire2:
						lTabTypeAppreciation.push(ETypeAppreciation.Commentaire2);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
						.AG_Commentaire3:
						lTabTypeAppreciation.push(ETypeAppreciation.Commentaire3);
						break;
					case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_CPE:
						lTabTypeAppreciation.push(ETypeAppreciation.CPE);
						break;
				}
				break;
			case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin:
				switch (aAppreciation.getGenre()) {
					case 1:
						lTabTypeAppreciation.push(ETypeAppreciation.Appreciations);
						break;
					case 2:
						lTabTypeAppreciation.push(ETypeAppreciation.Progression);
						break;
					case 3:
						lTabTypeAppreciation.push(ETypeAppreciation.Conseil);
						break;
				}
				break;
			case Enumere_Onglet_1.EGenreOnglet.Bulletins:
				if (aAppreciationGenerale) {
					switch (aAppreciation.getGenre()) {
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Assiduite:
							lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Autonomie:
							lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Globale:
							lTabTypeAppreciation.push(ETypeAppreciation.Globale);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire1:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire1);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire2:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire2);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire3:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire3);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_CPE:
							lTabTypeAppreciation.push(ETypeAppreciation.CPE);
							break;
					}
				} else {
					switch (aAppreciation.getGenre()) {
						case 1:
							lTabTypeAppreciation.push(ETypeAppreciation.Appreciations);
							break;
						case 2:
							lTabTypeAppreciation.push(ETypeAppreciation.Progression);
							break;
						case 3:
							lTabTypeAppreciation.push(ETypeAppreciation.Conseil);
							break;
						case 9:
							lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
							lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
							lTabTypeAppreciation.push(ETypeAppreciation.Globale);
							break;
					}
				}
				break;
			case Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences:
			case Enumere_Onglet_1.EGenreOnglet.BulletinCompetences:
			case Enumere_Onglet_1.EGenreOnglet.AppreciationsBulletinParEleve:
				if (aAppreciationGenerale) {
					switch (aAppreciation.getGenre()) {
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Assiduite:
							lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Autonomie:
							lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Globale:
							lTabTypeAppreciation.push(ETypeAppreciation.Globale);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire1:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire1);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire2:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire2);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_Commentaire3:
							lTabTypeAppreciation.push(ETypeAppreciation.Commentaire3);
							break;
						case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
							.AG_CPE:
							lTabTypeAppreciation.push(ETypeAppreciation.CPE);
							break;
					}
				} else {
					lTabTypeAppreciation.push(ETypeAppreciation.Assiduite);
					lTabTypeAppreciation.push(ETypeAppreciation.Autonomie);
					lTabTypeAppreciation.push(ETypeAppreciation.Globale);
				}
				break;
			default:
				break;
		}
		return lTabTypeAppreciation;
	},
};
exports.ETypeAppreciationUtil = ETypeAppreciationUtil;
