exports.ObjetFenetre_ModificationIdentifiantMDP = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_SaisieMdpCP_1 = require("ObjetFenetre_SaisieMdpCP");
const ObjetSaisieMotDePasseCP_1 = require("ObjetSaisieMotDePasseCP");
class ObjetFenetre_ModificationIdentifiantMDP extends ObjetFenetre_SaisieMdpCP_1.ObjetFenetre_SaisieMdpCP {
	constructor() {
		super(...arguments);
		this.changementMDP = true;
		this.changementMDPEleve = false;
	}
	setDonnees(aDonneesReglesMdp) {
		this.setOptionsFenetre({
			titre: this.changementMDPEleve
				? ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.titreEcranMotDePasseEnfant",
					)
				: this.changementMDP
					? ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.titreEcranMotDePasse",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.titreEcranIdentifiant",
						),
		});
		const lOptions = {
			avecMDPActuel: !this.changementMDPEleve,
			avecReglesMDP: this.changementMDP,
			avecMdpNouveauDifferentDeActuel:
				this.changementMDP && !this.changementMDPEleve,
			setReglesMDP: function (aJSON) {
				GEtatUtilisateur.setReglesSaisieMotDePasse(aJSON);
			},
			avecMessageReussiteModif: true,
			libelleMDPActuel: this.changementMDP
				? ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.libelle1EcranMotDePasse",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.libelle1EcranIdentifiant",
					),
			libelleNewMDP: this.changementMDP
				? this.changementMDPEleve
					? ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.libelle1EcranMotDePasseEleve",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.libelle2EcranMotDePasse",
						)
				: ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.libelle2EcranIdentifiant",
					) +
					"<br/>" +
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.conseil2EcranIdentifiant",
						),
						[
							ObjetSaisieMotDePasseCP_1.ObjetSaisieMotDePasseCP
								.C_TailleMinLogin,
						],
					),
			libelleConfirmNewMDP: this.changementMDPEleve
				? ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.libelle2EcranMotDePasseEleve",
					)
				: this.changementMDP
					? ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.libelle3EcranMotDePasse",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.libelle3EcranIdentifiant",
						),
			libelleEchecModification: ObjetTraduction_1.GTraductions.getValeur(
				"saisieMDP.EchecModification",
			),
			libelleReussiteModification: ObjetTraduction_1.GTraductions.getValeur(
				"saisieMDP.ReussiteModification",
			),
			libelleConfirmationIncorrecte: this.changementMDP
				? ObjetTraduction_1.GTraductions.getValeur(
						"saisieMDP.ConfirmationIncorrecte",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.message3Identifiant",
					),
		};
		if (!this.changementMDP) {
			lOptions.attrInputNouveau =
				'type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ie-textbrut';
		}
		this.getInstance(this.identMDP).setOptions(lOptions);
		super.setDonnees(aDonneesReglesMdp);
	}
}
exports.ObjetFenetre_ModificationIdentifiantMDP =
	ObjetFenetre_ModificationIdentifiantMDP;
