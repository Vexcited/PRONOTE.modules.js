exports.ObjetGrilleHoraires = void 0;
const MethodesObjet_1 = require("MethodesObjet");
class ObjetGrilleHoraires {
  constructor() {
    this.init();
  }
  init() {
    this.initCache();
    this.horaires = [];
    this.options = { tailleGouttiereDefaut: 6, filtre: null };
    return this;
  }
  initCache() {
    this.cache = null;
    return this;
  }
  setOptions(aOptions) {
    $.extend(this.options, aOptions);
    return this;
  }
  addBloc(aBlocHoraire) {
    this.initCache();
    if (!aBlocHoraire) {
      return this;
    }
    if (aBlocHoraire) {
      if (
        !MethodesObjet_1.MethodesObjet.isNumber(aBlocHoraire.debutBloc) ||
        !MethodesObjet_1.MethodesObjet.isNumber(aBlocHoraire.finBloc)
      ) {
        return this;
      }
      if (aBlocHoraire.debutBloc > aBlocHoraire.finBloc) {
        aBlocHoraire.finBloc = Math.max(
          aBlocHoraire.debutBloc,
          aBlocHoraire.finBloc,
        );
      }
      this.horaires.push(
        Object.assign(
          { debut: aBlocHoraire.debutBloc, fin: aBlocHoraire.finBloc },
          aBlocHoraire,
        ),
      );
    }
    return this;
  }
  parcourirHoraires(aFunction) {
    return this.horaires.every((aBloc, aIndex) => {
      for (let lIHoraire = aBloc.debut; lIHoraire <= aBloc.fin; lIHoraire++) {
        if (
          aFunction(lIHoraire, this.rechercheHoraire(lIHoraire), aIndex) ===
          false
        ) {
          return false;
        }
      }
      return true;
    });
  }
  parcourirBlocs(aFunction) {
    this.horaires.every((aBloc, aIndex) => {
      return aFunction(this.rechercheHoraire(aBloc.fin), aIndex) !== false;
    });
  }
  nbHoraires() {
    this._construireCacheHoraire();
    return this.cache.nbHoraires;
  }
  nbHorairesVisibles() {
    this._construireCacheHoraire();
    return this.cache.nbHorairesVisibles;
  }
  appliquerFiltre(aFiltre) {
    if (MethodesObjet_1.MethodesObjet.isFunction(aFiltre)) {
      this.horaires.forEach((aBloc, aIndex) => {
        if (MethodesObjet_1.MethodesObjet.isNumber(aBloc.__debut)) {
          aBloc.debut = aBloc.__debut;
        } else {
          aBloc.__debut = aBloc.debut;
        }
        if (MethodesObjet_1.MethodesObjet.isNumber(aBloc.__fin)) {
          aBloc.fin = aBloc.__fin;
        } else {
          aBloc.__fin = aBloc.fin;
        }
        aFiltre(aBloc, aIndex, this);
      });
      this.initCache();
    }
    return this;
  }
  rechercheHoraire(aHoraire, aAvecRechercheNonVisible) {
    this._construireCacheHoraire();
    let lResult, lHoraire;
    if (this.cache.hashHoraires[aHoraire]) {
      const lBloc = this.cache.hashHoraires[aHoraire];
      if (
        lBloc &&
        lBloc.trouve === false &&
        lBloc.trouveNonVisible &&
        !aAvecRechercheNonVisible &&
        lBloc.dernierBlocVisible
      ) {
        return lBloc.dernierBlocVisible;
      } else {
        return lBloc;
      }
    }
    for (let i = 0; i < this.horaires.length; i++) {
      lHoraire = this.cache.hashHoraires[this.horaires[i].debut];
      if (lHoraire && aHoraire < lHoraire.debut && lResult) {
        break;
      }
      lResult = lHoraire;
      if (lHoraire && aHoraire <= lHoraire.fin) {
        break;
      }
    }
    if (lResult) {
      lResult = MethodesObjet_1.MethodesObjet.dupliquer(lResult);
      lResult.trouve = false;
      return lResult;
    } else {
      return { trouve: false, decalage: 0 };
    }
  }
  getNumeroHoraireSelonBloc(aNumeroHoraire) {
    return aNumeroHoraire - this.rechercheHoraire(aNumeroHoraire).debutBloc;
  }
  _construireCacheHoraire() {
    let lHoraire,
      lIHoraire,
      lDecalage,
      lTailleGouttiere,
      lDecalageGouttiere = 0,
      lDernierBlocVisible = null;
    if (!this.cache) {
      this.cache = {};
      this.cache = { nbHoraires: 0, nbHorairesVisibles: 0, hashHoraires: {} };
      lDecalage = 0;
      for (let i = 0; i < this.horaires.length; i++) {
        lHoraire = this.horaires[i];
        this.cache.nbHoraires += lHoraire.finBloc - lHoraire.debutBloc + 1;
        if (i === 0) {
          lDecalage = lHoraire.debut;
        } else {
          lDecalage += lHoraire.debut - this.horaires[i - 1].fin - 1;
        }
        this.cache.nbHorairesVisibles += lHoraire.fin - lHoraire.debut + 1;
        for (
          lIHoraire = lHoraire.debutBloc;
          lIHoraire <= lHoraire.finBloc;
          lIHoraire++
        ) {
          lTailleGouttiere =
            lIHoraire === lHoraire.fin && i < this.horaires.length - 1
              ? lHoraire.tailleGouttiere || this.options.tailleGouttiereDefaut
              : 0;
          this.cache.hashHoraires[lIHoraire] = Object.assign(
            {
              decalage: lDecalage,
              decalageGouttiere: lDecalageGouttiere,
              indiceBloc: i,
              dernierBloc: i === this.horaires.length - 1,
              trouve: true,
            },
            lHoraire,
          );
          this.cache.hashHoraires[lIHoraire].tailleGouttiere = lTailleGouttiere;
          if (lIHoraire < lHoraire.debut || lIHoraire > lHoraire.fin) {
            this.cache.hashHoraires[lIHoraire].trouve = false;
            this.cache.hashHoraires[lIHoraire].trouveNonVisible = true;
            if (lDernierBlocVisible) {
              this.cache.hashHoraires[lIHoraire].dernierBlocVisible =
                MethodesObjet_1.MethodesObjet.dupliquer(lDernierBlocVisible);
              this.cache.hashHoraires[lIHoraire].dernierBlocVisible.trouve =
                false;
            }
          } else {
            lDernierBlocVisible = this.cache.hashHoraires[lIHoraire];
          }
          lDecalageGouttiere += lTailleGouttiere ? lTailleGouttiere + 1 : 0;
        }
      }
    }
  }
}
exports.ObjetGrilleHoraires = ObjetGrilleHoraires;
