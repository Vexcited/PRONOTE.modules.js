exports.ObjetSelecteurMotifPunition = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_SelectionMotifs_1 = require("DonneesListe_SelectionMotifs");
class ObjetSelecteurMotifPunition extends _ObjetSelecteur_1._ObjetSelecteur {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
        "AbsenceVS.incidents",
      ),
      titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
        "RecapPunition.motifsPunitionSanction",
      ),
    });
  }
  construireInstanceFenetreSelection() {
    this.identFenetreSelection = this.addFenetre(
      ObjetFenetre_Liste_1.ObjetFenetre_Liste,
      this.evntFenetreSelection,
      this.initFenetreSelection,
    );
  }
  setDonnees(aParam) {
    super.setDonnees(aParam);
  }
  initFenetreSelection(aInstance) {
    const lParamsListe = {
      titres: [
        { estCoche: true },
        ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.motif"),
        "",
        ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.genre"),
      ],
      tailles: [20, "100%", 15, 120],
      editable: true,
    };
    aInstance.setOptionsFenetre({
      titre: this._options.titreFenetre,
      largeur: 450,
      hauteur: 400,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
      modeActivationBtnValider:
        aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
    });
    aInstance.paramsListe = lParamsListe;
  }
  evntFenetreSelection(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      const lListeRessourcesSelectionnees = this.tempMotifs.getListeElements(
        (aElement) => {
          return aElement.cmsActif;
        },
      );
      this.callback.appel({ listeSelection: lListeRessourcesSelectionnees });
      this.listeSelection = lListeRessourcesSelectionnees;
      this.actualiserLibelle();
    }
  }
  evntBtnSelection() {
    this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(this.listeTotale);
    const lListeSelect = this.listeSelection;
    this.tempMotifs.parcourir((aElement) => {
      aElement.cmsActif = !!lListeSelect.getElementParNumeroEtGenre(
        aElement.getNumero(),
        aElement.getGenre(),
      );
    });
    const lTris = [];
    lTris.push(
      ObjetTri_1.ObjetTri.init((D) => {
        return !D.ssMotif;
      }),
    );
    lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
    this.tempMotifs.setTri(lTris);
    this.getInstance(this.identFenetreSelection).setDonnees(
      new DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs(
        this.tempMotifs,
        { avecAucunExclusif: false },
      ),
      false,
    );
  }
}
exports.ObjetSelecteurMotifPunition = ObjetSelecteurMotifPunition;
