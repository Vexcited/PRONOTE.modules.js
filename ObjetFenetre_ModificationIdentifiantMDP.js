const { GChaine } = require("ObjetChaine.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_SaisieMdpCP } = require("ObjetFenetre_SaisieMdpCP.js");
const { ObjetSaisieMotDePasseCP } = require("ObjetSaisieMotDePasseCP.js");
class ObjetFenetre_ModificationIdentifiantMDP extends ObjetFenetre_SaisieMdpCP {
  constructor(...aParams) {
    super(...aParams);
    this.changementMDP = true;
    this.changementMDPEleve = false;
  }
  setDonnees(...aParams) {
    this.setOptionsFenetre({
      titre: this.changementMDPEleve
        ? GTraductions.getValeur("PageCompte.titreEcranMotDePasseEnfant")
        : this.changementMDP
          ? GTraductions.getValeur("PageCompte.titreEcranMotDePasse")
          : GTraductions.getValeur("PageCompte.titreEcranIdentifiant"),
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
        ? GTraductions.getValeur("PageCompte.libelle1EcranMotDePasse")
        : GTraductions.getValeur("PageCompte.libelle1EcranIdentifiant"),
      libelleNewMDP: this.changementMDP
        ? this.changementMDPEleve
          ? GTraductions.getValeur("PageCompte.libelle1EcranMotDePasseEleve")
          : GTraductions.getValeur("PageCompte.libelle2EcranMotDePasse")
        : GTraductions.getValeur("PageCompte.libelle2EcranIdentifiant") +
          "<br/>" +
          GChaine.format(
            GTraductions.getValeur("PageCompte.conseil2EcranIdentifiant"),
            [ObjetSaisieMotDePasseCP.C_TailleMinLogin],
          ),
      libelleConfirmNewMDP: this.changementMDPEleve
        ? GTraductions.getValeur("PageCompte.libelle2EcranMotDePasseEleve")
        : this.changementMDP
          ? GTraductions.getValeur("PageCompte.libelle3EcranMotDePasse")
          : GTraductions.getValeur("PageCompte.libelle3EcranIdentifiant"),
      libelleEchecModification: GTraductions.getValeur(
        "saisieMDP.EchecModification",
      ),
      libelleReussiteModification: GTraductions.getValeur(
        "saisieMDP.ReussiteModification",
      ),
      libelleConfirmationIncorrecte: this.changementMDP
        ? GTraductions.getValeur("saisieMDP.ConfirmationIncorrecte")
        : GTraductions.getValeur("PageCompte.message3Identifiant"),
    };
    if (!this.changementMDP) {
      lOptions.attrInputNouveau =
        'type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ie-textbrut';
    }
    this.getInstance(this.identMDP).setOptions(lOptions);
    super.setDonnees(...aParams);
  }
}
module.exports = { ObjetFenetre_ModificationIdentifiantMDP };
