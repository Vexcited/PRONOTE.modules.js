exports.TypeGenrePublicPartageModeleActualiteToGenreRessource =
	exports.TypeModalitePartageModeleActualite =
	exports.TypeGenrePublicPartageModeleActualite =
		void 0;
const Enumere_Ressource_1 = require("Enumere_Ressource");
var TypeGenrePublicPartageModeleActualite;
(function (TypeGenrePublicPartageModeleActualite) {
	TypeGenrePublicPartageModeleActualite[
		(TypeGenrePublicPartageModeleActualite["tgppma_Professeur"] = 0)
	] = "tgppma_Professeur";
	TypeGenrePublicPartageModeleActualite[
		(TypeGenrePublicPartageModeleActualite["tgppma_Personnel"] = 1)
	] = "tgppma_Personnel";
	TypeGenrePublicPartageModeleActualite[
		(TypeGenrePublicPartageModeleActualite["tgppma_ResponsableDelegue"] = 2)
	] = "tgppma_ResponsableDelegue";
})(
	TypeGenrePublicPartageModeleActualite ||
		(exports.TypeGenrePublicPartageModeleActualite =
			TypeGenrePublicPartageModeleActualite =
				{}),
);
var TypeModalitePartageModeleActualite;
(function (TypeModalitePartageModeleActualite) {
	TypeModalitePartageModeleActualite[
		(TypeModalitePartageModeleActualite["tmpma_Tous"] = 0)
	] = "tmpma_Tous";
	TypeModalitePartageModeleActualite[
		(TypeModalitePartageModeleActualite["tmpma_Personnalise"] = 1)
	] = "tmpma_Personnalise";
})(
	TypeModalitePartageModeleActualite ||
		(exports.TypeModalitePartageModeleActualite =
			TypeModalitePartageModeleActualite =
				{}),
);
const TypeGenrePublicPartageModeleActualiteToGenreRessource = (aGenre) => {
	switch (aGenre) {
		case TypeGenrePublicPartageModeleActualite.tgppma_Personnel:
			return Enumere_Ressource_1.EGenreRessource.Personnel;
		case TypeGenrePublicPartageModeleActualite.tgppma_Professeur:
			return Enumere_Ressource_1.EGenreRessource.Enseignant;
		case TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue:
			return Enumere_Ressource_1.EGenreRessource.Responsable;
	}
};
exports.TypeGenrePublicPartageModeleActualiteToGenreRessource =
	TypeGenrePublicPartageModeleActualiteToGenreRessource;
