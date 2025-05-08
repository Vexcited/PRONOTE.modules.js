let IE = { Identite: { collection: {} }, outilsUses: null, fModule: null };
(function () {
  IE.outilsUses = function () {};
  let dictionnaire = { require: {}, full: {}, cache: {} };
  let lGlobal = window || {};
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
      let subjectString = this.toString();
      if (
        typeof position !== "number" ||
        !isFinite(position) ||
        Math.floor(position) !== position ||
        position > subjectString.length
      ) {
        position = subjectString.length;
      }
      position -= searchString.length;
      let lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }
  function _findPaths(aIdentifiant, aPathDictionary) {
    if (!aIdentifiant || !aIdentifiant) {
      return false;
    }
    const lSplitIdentifiant = aIdentifiant.split("/").reverse();
    const lSplitPath = aPathDictionary.split("/").reverse();
    const lMinlength = Math.min(lSplitPath.length, lSplitIdentifiant.length);
    for (let i = 0; i < lMinlength; i++) {
      if (lSplitIdentifiant[i] !== lSplitPath[i]) {
        return false;
      }
    }
    return true;
  }
  function _getExport(aChemin, aModule, aWithoutLoad) {
    if (!aChemin || !aChemin.endsWith(".js")) {
      return null;
    }
    let lExports = dictionnaire.cache[aChemin];
    if (lExports !== undefined) {
      return lExports;
    }
    lExports = dictionnaire.full[aChemin];
    if (lExports !== undefined) {
      return lExports;
    }
    let lCheminLower = aChemin.toLowerCase();
    let lTrouves = [];
    let lFullPathLower;
    for (const lFullPath in dictionnaire.full) {
      lFullPathLower = lFullPath.toLowerCase();
      if (_findPaths(lCheminLower, lFullPathLower)) {
        if (lTrouves.length === 0) {
          lExports = dictionnaire.full[lFullPath];
        }
        lTrouves.push(lFullPath);
      }
    }
    if (lExports !== undefined && lTrouves.length === 1) {
      dictionnaire.cache[aChemin] = lExports;
    }
    if (lTrouves.length > 1) {
      alert("plusieurs trouvés");
    }
    if (lExports) {
      return lExports;
    }
    if (aWithoutLoad) {
      return null;
    }
    let lRequire = dictionnaire.require[aChemin];
    if (!lRequire) {
      lTrouves = [];
      for (const lFullPath in dictionnaire.require) {
        lFullPathLower = lFullPath.toLowerCase();
        if (_findPaths(lCheminLower, lFullPathLower)) {
          if (lTrouves.length === 0) {
            lRequire = dictionnaire.require[lFullPath];
          }
          lTrouves.push(lFullPath);
        }
      }
      if (lTrouves.length > 1) {
        alert("plusieurs trouvés");
      }
    }
    if (lRequire) {
      lRequire.main.load(aModule);
      return _getExport(aChemin, aModule, true);
    }
    return null;
  }
  function _fModule(aParams) {
    let lModule = {
      parent: null,
      exports: {},
      filename: aParams.fn,
      childrens: [],
      loaded: false,
      load: function (aParent) {
        this.parent = aParent;
        if (this.loaded) {
          return;
        }
        this.loaded = true;
        if (aParent) {
          aParent.childrens.push(this);
        }
        aParams.f.call(this.exports, this.exports, this.require, this, lGlobal);
        dictionnaire.full[this.filename] = this.exports;
        if (dictionnaire.require[this.filename]) {
          delete dictionnaire.require[this.filename];
        }
      },
      require: function require(aChemin) {
        let lChemin = aChemin;
        if (lChemin && !lChemin.endsWith(".css") && !lChemin.endsWith(".js")) {
          lChemin += ".js";
        }
        let lExports = _getExport(lChemin, lModule);
        return lExports;
      },
    };
    lModule.require.main = lModule;
    lModule.require.ressource = function () {};
    if (aParams.s !== 0) {
      lModule.load();
    } else {
      dictionnaire.require[lModule.filename] = lModule.require;
    }
  }
  IE.fModule = _fModule;
  window.require = function require(aChemin) {
    let lExports = _getExport(aChemin);
    return lExports;
  };
})();
