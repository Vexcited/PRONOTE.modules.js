exports.ObjetRequeteSaisieRecapitulatifLSU = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeColonneRecapExportLSU_1 = require("TypeColonneRecapExportLSU");
const TypeEnseignementComplement_1 = require("TypeEnseignementComplement");
const TypePointsEnseignementComplement_1 = require("TypePointsEnseignementComplement");
const TypeOrigineCreationLangueRegionale_1 = require("TypeOrigineCreationLangueRegionale");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
class ObjetRequeteSaisieRecapitulatifLSU extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams, aListePiliers) {
		$.extend(this.JSON, aParams);
		if (!!this.JSON.listeEleves) {
			this.JSON.listeEleves.setSerialisateurJSON({
				methodeSerialisation: function (aEleve, aJSON) {
					_ajouterEleve(aEleve, aJSON, aListePiliers);
				},
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieRecapitulatifLSU = ObjetRequeteSaisieRecapitulatifLSU;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRecapitulatifLSU",
	ObjetRequeteSaisieRecapitulatifLSU,
);
function _ajouterEleve(aEleve, aJSON, aListePiliers) {
	const lEnseignementComplement = aEleve.ListeColonnes.getElementParGenre(
		TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
			.tcrl_EnseignementDeComplement,
	);
	if (
		!!lEnseignementComplement &&
		lEnseignementComplement.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
	) {
		aJSON.enseignementComplement =
			TypeEnseignementComplement_1.TypeEnseignementComplementUtil.getType(
				lEnseignementComplement.valeur,
			);
	}
	const lObjectif = aEleve.ListeColonnes.getElementParGenre(
		TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs,
	);
	if (!!lObjectif && lObjectif.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
		aJSON.objectif =
			TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getType(
				lObjectif.valeur,
			);
	}
	const lLangueRegionale = aEleve.ListeColonnes.getElementParGenre(
		TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale,
	);
	if (
		!!lLangueRegionale &&
		lLangueRegionale.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
	) {
		aJSON.langueRegionale =
			TypeOrigineCreationLangueRegionale_1.TypeOrigineCreationLangueRegionaleUtil.getType(
				lLangueRegionale.valeur,
			);
	}
	const lNiveauLangueRegionale = aEleve.ListeColonnes.getElementParGenre(
		TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_NiveauLangueRegionale,
	);
	if (
		!!lNiveauLangueRegionale &&
		lNiveauLangueRegionale.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
	) {
		aJSON.niveauLangueRegionale =
			TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getType(
				true,
				false,
				lNiveauLangueRegionale.valeur,
			);
	}
	const lAppreciation = aEleve.ListeColonnes.getElementParGenre(
		TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
			.tcrl_AppreciationFinDeCycle,
	);
	if (
		!!lAppreciation &&
		lAppreciation.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
	) {
		aJSON.appreciation = lAppreciation.valeur;
	}
	aJSON.listeNiveaux = aEleve.ListeColonnes.getListeElements((D) => {
		return (
			D.getGenre() ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun
		);
	});
	if (!!aJSON.listeNiveaux) {
		aJSON.listeNiveaux.setSerialisateurJSON({
			methodeSerialisation: function (aPilier, aJSON) {
				_ajouterNiveauMaitrise(aPilier, aJSON, aListePiliers);
			},
		});
	}
}
function _ajouterNiveauMaitrise(aPilier, aJSON, aListePiliers) {
	if (
		!!aListePiliers &&
		aPilier.indexPilier > -1 &&
		aPilier.indexPilier < aListePiliers.count()
	) {
		aJSON.pilier = aListePiliers.get(aPilier.indexPilier);
	}
	aJSON.niveauDAcquisition = aPilier.valeur;
}
