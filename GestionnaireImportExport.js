const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_Import } = require("ObjetFenetre_Import.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GChaine } = require("ObjetChaine.js");
const { Identite } = require("ObjetIdentite.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { deferLoadingScript } = require("DeferLoadingScript.js");
const { EGenreImport } = require("Enumere_GenreImport.js");
const ENatureOperation = { import: 0, export: 1 };
const EFormatFichierIE = { workbook: 0 };
class UtilitaireDataSheet extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this._options = { genreOperation: null, genreImport: null };
		this.C_RC = "\n";
		this.C_SeparateurChamp = ";";
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	getTabExtensionsAutorisees() {
		const lResult = [];
		if (this._options.genreOperation === ENatureOperation.import) {
			switch (this._options.genreImport) {
				case EFormatFichierIE.workbook:
					lResult.push("xlsx", "xls", "xlsb", "xlsm", "ods", "csv", "txt");
					break;
			}
		}
		return lResult;
	}
	surSelectionFichierImport(aEvent) {
		const e = aEvent;
		const lReader = new FileReader();
		lReader.readAsArrayBuffer(e.target.files[0]);
		lReader.onload = function (aFile) {
			if (lReader.result.byteLength > 1e6) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					titre: GTraductions.getValeur("ImportExport.FichierErreur"),
					message: GTraductions.getValeur(
						"ImportExport.FichierTailleIncorrect",
					),
				});
			} else {
				deferLoadingScript.load("xlsx", {
					done: function () {
						require("xlsx.full.min.js");
						const lData = new window.Uint8Array(lReader.result);
						const lWB = XLSX.read(lData, {
							type: "array",
							cellDates: true,
							dateNF: "yyyy-mm-dd",
						});
						if (lWB.SheetNames.length > 0) {
							const lDonneesMetier = this.convertirDonnees({
								xlsx: XLSX,
								wb: lWB,
								file: aFile,
							});
							this.declencherCallback(lDonneesMetier, aFile);
						} else {
							GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Information,
								titre: GTraductions.getValeur("ImportExport.FichierErreur"),
								message: GTraductions.getValeur("ImportExport.FichierFormat"),
							});
						}
					}.bind(this),
				});
			}
		}.bind(this, e.target.files[0]);
	}
	declencherCallback(aParam, aFile) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam, aFile);
		}
	}
	convertirDonneesWB(aParam) {
		const lWB = aParam.wb;
		const lEltWB = new ObjetListeElements();
		let lEltSheet, lSheet, lSheetName;
		for (let i = 0, lNbr = Math.min(1, lWB.SheetNames.length); i < lNbr; i++) {
			lSheetName = lWB.SheetNames[i];
			lSheet = lWB.Sheets[lSheetName];
			this.Worksheet = lSheet;
			lEltSheet = this.convertirFeuilleCalcul({
				sheet: lSheet,
				sheetName: lSheetName,
				xlsx: aParam.xlsx,
				file: aParam.file,
			});
			lEltWB.addElement(lEltSheet);
		}
		const lData = { donneesImport: lEltWB };
		return lData;
	}
	convertirFeuilleCalcul(aParam) {
		const lXlsx = aParam.xlsx;
		const lEltSheet = new ObjetElement(aParam.sheetName);
		lEltSheet.colonnes = new ObjetListeElements();
		lEltSheet.lignes = new ObjetListeElements();
		const lSheetRange = aParam.sheet["!ref"];
		if (lSheetRange !== null && lSheetRange !== undefined) {
			const lRange = lXlsx.utils.decode_range(lSheetRange);
			let lRowNum, lColNum, lCell, lEltCell;
			for (lColNum = lRange.s.c; lColNum <= lRange.e.c; lColNum++) {
				const lEltCol = new ObjetElement("", lColNum);
				lEltCol.cellules = new ObjetListeElements();
				for (lRowNum = lRange.s.r; lRowNum <= lRange.e.r; ++lRowNum) {
					lCell =
						aParam.sheet[lXlsx.utils.encode_cell({ r: lRowNum, c: lColNum })];
					lEltCell = this.celluleToObjetElt(lCell, aParam.file);
					lEltCell.numLigne = lRowNum;
					lEltCell.numCol = lColNum;
					lEltCol.cellules.addElement(lEltCell);
				}
				lEltSheet.colonnes.addElement(lEltCol);
			}
			for (lRowNum = lRange.s.r; lRowNum <= lRange.e.r; lRowNum++) {
				const lEltLigne = new ObjetElement("", lRowNum);
				lEltLigne.cellules = new ObjetListeElements();
				for (lColNum = lRange.s.c; lColNum <= lRange.e.c; lColNum++) {
					lCell =
						aParam.sheet[lXlsx.utils.encode_cell({ r: lRowNum, c: lColNum })];
					lEltCell = this.celluleToObjetElt(lCell, aParam.file);
					lEltCell.numLigne = lRowNum;
					lEltCell.numCol = lColNum;
					lEltLigne.cellules.addElement(lEltCell);
				}
				lEltSheet.lignes.addElement(lEltLigne);
			}
		}
		return lEltSheet;
	}
	celluleToObjetElt(aParam, aFile) {
		let lSplit, lRegex, lReg;
		const lEltCell = new ObjetElement();
		if (
			typeof aParam === "undefined" ||
			(Number(aParam.v) === 0 && parseInt(aParam.v) !== 0)
		) {
			lEltCell.valeur = null;
			lEltCell.strValeur = "";
			lEltCell.typeCSF = null;
			lEltCell.type = -1;
			lEltCell.nbrChar = null;
		} else {
			lEltCell.typeCSF = aParam.t;
			lEltCell.strValeur =
				typeof aParam.w !== "undefined" ? aParam.w : aParam.v;
			lEltCell.strValeur = GChaine.ajouterEntites(lEltCell.strValeur);
			switch (aParam.t) {
				case "d":
					if (aParam.w !== "1900-01-00") {
						lEltCell.type = EGenreImport.Date;
						switch (aFile.type) {
							case "application/vnd.oasis.opendocument.spreadsheet":
								if (aParam.v.V !== undefined) {
									lRegex = /(\d+)[-/.]+(\d+)[-/.]+(\d{4})/;
									lSplit = aParam.v.V.split(" ")[0];
									aParam.w =
										(lReg = lRegex.exec(lSplit)) !== null
											? lReg[2] > 12
												? lSplit.replace(lRegex, "$3/$1/$2")
												: lSplit.replace(lRegex, "$3/$2/$1")
											: aParam.w;
									aParam.v = new Date(aParam.w);
									aParam.w =
										(aParam.v.toString().split("GMT")[1].split("(")[0][0] ===
											"+" &&
											aParam.v.toString().split("+")[1].split("(")[0] >=
												"0100 ") ||
										(aParam.v.toString().split("GMT")[1].split("(")[0][0] ===
											"-" &&
											aParam.v.toString().split("-")[1].split("(")[0] <
												"1000 " &&
											aParam.v.toString().split("-")[1].split("(")[0] >=
												"0100 ")
											? aParam.v.setTime(aParam.v.getTime() + 86400000)
											: aParam.v.setTime(aParam.v.getTime() + 50400000);
								} else {
									aParam.w =
										aParam.v.toString().split("GMT")[1].split("(")[0][0] ===
											"+" &&
										aParam.v.toString().split("+")[1].split("(")[0] >= "0100 "
											? aParam.v.setTime(aParam.v.getTime() + 50400000)
											: aParam.v;
								}
								break;
							case "application/vnd.ms-excel":
								aParam.w = !(
									aParam.v.toString().split("GMT")[1].split("(")[0][0] ===
										"-" &&
									aParam.v.toString().split("-")[1].split("(")[0] >= "1000 "
								)
									? aParam.v.setTime(aParam.v.getTime() + 50400000)
									: aParam.w;
								break;
							case "text/plain":
								aParam.w = !(
									aParam.v.toString().split("GMT")[1].split("(")[0][0] ===
										"-" &&
									aParam.v.toString().split("-")[1].split("(")[0] >= "1000 "
								)
									? aParam.v.setTime(aParam.v.getTime() + 50400000)
									: aParam.w;
								break;
							case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
								aParam.w =
									(("" + aParam.v.getDate()).length > 1
										? aParam.v.getDate()
										: "0" + aParam.v.getDate()
									).toString() === aParam.w.split("-")[2]
										? aParam.w
										: aParam.v.setTime(aParam.v.getTime() + 50400000);
								break;
							default:
								break;
						}
						aParam.v = new Date(
							new Date(aParam.w).toISOString().split("T")[0] + "T00:00:00",
						);
						aParam.w =
							aParam.v.getFullYear() +
							"-" +
							(("" + (aParam.v.getMonth() + 1)).length > 1
								? aParam.v.getMonth() + 1
								: "0" + (aParam.v.getMonth() + 1)) +
							"-" +
							(("" + aParam.v.getDate()).length > 1
								? aParam.v.getDate()
								: "0" + aParam.v.getDate());
						if (this.Pere.avecFormatDateUnique) {
							lEltCell.strValeur = aParam.w;
						} else {
							lEltCell.strValeur = aParam.v.toLocaleDateString("defaut", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							});
						}
					} else {
						aParam.v = null;
						lEltCell.strValeur = "";
						lEltCell.type = -1;
					}
					break;
				case "f":
					lEltCell.type = EGenreImport.Numerique;
					lEltCell.strValeur = lEltCell.strValeur.replace(".", ",");
					aParam.w = lEltCell.strValeur;
					aParam.v = lEltCell.strValeur;
					break;
				case "n":
					lEltCell.type = EGenreImport.Numerique;
					lEltCell.strValeur = lEltCell.strValeur.replace(".", ",");
					aParam.w = lEltCell.strValeur;
					aParam.v = lEltCell.strValeur;
					break;
				case "s":
					lEltCell.type = EGenreImport.Chaine;
					if (
						(aParam.w !== undefined &&
							GChaine.dateToStr(GChaine.strToDate("" + aParam.w)) !==
								"NaN/NaN/NaN NaN:NaN:NaN") ||
						GChaine.dateToStr(GChaine.strToDate("" + aParam.v)) !==
							"NaN/NaN/NaN NaN:NaN:NaN"
					) {
						lRegex = /(\d+)[-/.]+(\d+)[-/.]+(\d{4})/;
						if ((lSplit = lRegex.exec(aParam.v)) !== null) {
							lEltCell.type = EGenreImport.Date;
							aParam.t = "d";
							const lDisposition =
								lSplit[1] > lSplit[2] ? "$3/$2/$1" : "$3/$1/$2";
							aParam.v = new Date(aParam.v.replace(lRegex, lDisposition));
							aParam.w =
								aParam.v.getFullYear() +
								"-" +
								(("" + (aParam.v.getMonth() + 1)).length > 1
									? aParam.v.getMonth() + 1
									: "0" + (aParam.v.getMonth() + 1)) +
								"-" +
								(("" + aParam.v.getDate()).length > 1
									? aParam.v.getDate()
									: "0" + aParam.v.getDate());
							if (this.Pere.avecFormatDateUnique) {
								lEltCell.strValeur = aParam.w;
							} else {
								lEltCell.strValeur = aParam.v.toLocaleDateString("defaut", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
								});
							}
						}
					}
					break;
				default:
					lEltCell.type = null;
					break;
			}
			lEltCell.valeur = aParam.v;
			lEltCell.nbrChar = lEltCell.strValeur.length;
		}
		return lEltCell;
	}
	convertirDonnees(aParam) {
		if (this._options.genreOperation === ENatureOperation.import) {
			switch (this._options.genreImport) {
				case EFormatFichierIE.workbook:
					return this.convertirDonneesWB(aParam);
				default:
			}
		}
		return null;
	}
}
class GestionnaireImportExport extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.avecFormatDateUnique = true;
		this._options = { genreOperation: null, genreImport: null };
		this._datas = {
			donneesMetierSrc: null,
			tablesEtChamps: null,
			listeFormatsImport: null,
			file: null,
		};
		this.contexteImport = {
			service: undefined,
			periode: undefined,
			professeur: undefined,
			niveau: undefined,
		};
	}
	construireInstances() {
		this.identUtilImport = this.add(
			UtilitaireDataSheet,
			_evntUtilImport.bind(this),
			_initUtilImport.bind(this),
		);
		if (this._options.genreOperation === ENatureOperation.import) {
			this.identFenetreImport = this.addFenetre(
				this.setObjetFenetre(),
				_evntFenetreImport.bind(this),
			);
		}
	}
	setObjetFenetre() {
		return ObjetFenetre_Import;
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnUpload: {
				getOptionsSelecFile: function () {
					return {
						maxSize: 500 * 1024 * 1024,
						extensions: aInstance
							.getInstance(aInstance.identUtilImport)
							.getTabExtensionsAutorisees(),
						avecTransformationFlux: false,
					};
				},
				addFiles: function (aParametres) {
					aInstance.surSelectionFichierImport(aParametres);
				},
			},
		});
	}
	surSelectionFichierImport(aParametres) {
		const e = aParametres.event;
		this.getInstance(this.identUtilImport).surSelectionFichierImport(e);
	}
	_actionApresRequete(aParams) {
		this._datas.tablesEtChamps =
			aParams.JSONRapportSaisie.listeTablesImportables;
		this.getInstance(this.identFenetreImport).setDonnees({
			donnees: this._datas.donneesMetierSrc,
			file: this._datas.file,
			listeTablesImportables: this._datas.tablesEtChamps,
			listeService:
				this.contexteImport.service !== undefined
					? this.contexteImport.service.services
					: null,
			avecFormatDateUnique: this.avecFormatDateUnique,
		});
	}
	setContexteImport(aParam) {
		this.contexteImport = {
			service: aParam.service,
			periode: aParam.periode,
			professeur: aParam.professeur,
			niveau: aParam.niveau,
		};
	}
	envoyerRequeteDonnees() {}
	envoyerRequeteSaisie() {}
	_actionSurSaisie(aParam) {
		if (aParam.JSONRapportSaisie && aParam.JSONRapportSaisie.Rapport) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				titre: GTraductions.getValeur("ImportExport.RapportDImport"),
				message: aParam.JSONRapportSaisie.Rapport.get(0).Message,
				callback: function () {
					this.callback.appel();
				}.bind(this),
			});
		}
	}
	construireAffichage() {
		this.afficher(this.composePage());
	}
	composePage() {
		const H = [];
		switch (this._options.genreOperation) {
			case ENatureOperation.import:
				H.push(
					'<ie-bouton ie-model="btnUpload" class="themeBoutonPrimaire" ie-selecfile >',
					GTraductions.getValeur("ImportExport.ChoisirFichierImport"),
					"</ie-bouton>",
				);
				break;
		}
		return H.join("");
	}
}
function _evntUtilImport(aDonneesMetier, aFile) {
	this._datas.file = aFile;
	this._datas.donneesMetierSrc = aDonneesMetier;
	this.envoyerRequeteDonnees();
}
function _initUtilImport(aInstance) {
	aInstance.setOptions(this._options);
}
function _evntFenetreImport(aGenreBouton, aParam) {
	switch (aGenreBouton) {
		case 1: {
			let lWorksheet = null;
			const TMapping = [];
			if (aParam.mapping !== undefined) {
				for (
					let i = 0, lNbr = aParam.mapping.correspondances.count();
					i < lNbr;
					i++
				) {
					TMapping.push(aParam.mapping.correspondances.get(i).indiceCol);
				}
				lWorksheet = this.getInstance(this.identUtilImport).Worksheet;
				const lRef = lWorksheet["!ref"];
				if (lRef !== null && lRef !== undefined) {
					const lRange = XLSX.utils.decode_range(lRef);
					let lCellulesModif = [];
					if (
						this._datas.donneesMetierSrc.donneesImport.get(0).lignes
							.CellulesModifiees !== undefined
					) {
						lCellulesModif =
							this._datas.donneesMetierSrc.donneesImport.get(0).lignes
								.CellulesModifiees;
					}
					for (let i = 0, lNbr = lCellulesModif.length; i < lNbr; i++) {
						const lCell = lCellulesModif[i];
						const lCol = lCell.numCol;
						const lLigne = lCell.numLigne;
						const lWSCell =
							lWorksheet[XLSX.utils.encode_cell({ r: lLigne, c: lCol })];
						if (lCell.type === EGenreImport.Date) {
							lWSCell.w =
								lCell.valeur.getFullYear() +
								"-" +
								(("" + (lCell.valeur.getMonth() + 1)).length > 1
									? lCell.valeur.getMonth() + 1
									: "0" + (lCell.valeur.getMonth() + 1)) +
								"-" +
								(("" + lCell.valeur.getDate()).length > 1
									? lCell.valeur.getDate()
									: "0" + lCell.valeur.getDate());
						} else {
							lWSCell.w = lCell.strValeur;
						}
						lWSCell.v = lCell.strValeur;
						lWSCell.h = lCell.strValeur;
					}
					lWorksheet["!cols"] = [];
					lWorksheet["!rows"] = [];
					for (let j = 0, lNbr = lRange.e.c - lRange.s.c; j <= lNbr; j++) {
						if (TMapping.indexOf(j) === -1) {
							lWorksheet["!cols"][lRange.s.c + j] = { hidden: true };
						}
					}
					let lLignesSuppr = [];
					if (
						this._datas.donneesMetierSrc.donneesImport.get(0).lignes
							.LignesSupprimees !== undefined
					) {
						lLignesSuppr =
							this._datas.donneesMetierSrc.donneesImport.get(0).lignes
								.LignesSupprimees;
					}
					for (let k = 0, lNbr = lRange.e.r - lRange.s.r; k <= lNbr; k++) {
						if (lLignesSuppr.indexOf(k) !== -1) {
							lWorksheet["!rows"][lRange.s.r + k] = { hidden: true };
						}
					}
				}
			}
			aParam.mapping.correspondances.getTabListeElements().sort((a, b) => {
				return a.indiceCol - b.indiceCol;
			});
			const lObjetSaisie = {
				fichierTxt: XLSX.utils.sheet_to_csv(lWorksheet, {
					skipHidden: true,
					FS: ";",
				}),
				avecBareme: aParam.avecBareme,
				mapping: aParam.mapping,
				niveau: this.contexteImport.niveau,
				periode: this.contexteImport.periode,
				professeur: this.contexteImport.professeur,
				service:
					aParam.service !== null
						? aParam.service
						: this.contexteImport.service,
			};
			this.envoyerRequeteSaisie(lObjetSaisie);
			break;
		}
		case 2: {
			const lMatrice = [];
			for (
				let i = 0,
					lNbr = this._datas.donneesMetierSrc.donneesImport
						.get(0)
						.lignes.count();
				i < lNbr;
				i++
			) {
				const lTableau = [];
				for (
					let j = 0,
						lNbr2 = this._datas.donneesMetierSrc.donneesImport
							.get(0)
							.lignes.get(i)
							.cellules.count();
					j < lNbr2;
					j++
				) {
					lTableau.push(
						this._datas.donneesMetierSrc.donneesImport
							.get(0)
							.lignes.get(i)
							.cellules.get(j).strValeur,
					);
				}
				lMatrice.push(lTableau);
			}
			const lTable = XLSX.utils.aoa_to_sheet(lMatrice);
			const lWorkbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(lWorkbook, lTable, "SheetExport");
			const _downloadFile = function (aData, aName, aType) {
				const lWbOption = { bookType: "xlsx", bookSST: false, type: "array" };
				const lWBOut = XLSX.write(aData, lWbOption);
				let lReussite = false;
				let lBlob;
				try {
					lBlob = new Blob([lWBOut], { type: aType });
				} catch (e1) {
					try {
						const BlobBuilder =
							window.MozBlobBuilder ||
							window.WebKitBlobBuilder ||
							window.BlobBuilder;
						if (e1.name === "TypeError" && window.BlobBuilder) {
							const bb = new BlobBuilder();
							bb.append([lWBOut]);
							lBlob = bb.getBlob(aType);
						} else if (e1.name === "InvalidStateError") {
							lBlob = new Blob([lWBOut], { type: aType });
						}
					} catch (e2) {
						IE.log.addLog("echec BlobBuilder");
						return false;
					}
				}
				let lAhref = "";
				try {
					lAhref = $(
						'<a href="' +
							(window.webkitURL || window.URL).createObjectURL(lBlob) +
							'" download="' +
							aName +
							'" style="display:none;"></a>',
					);
				} catch (e) {
					IE.log.addLog("echec createObjectURL");
					return false;
				}
				$("body").append(lAhref);
				try {
					if (window.navigator && window.navigator.msSaveBlob) {
						window.navigator.msSaveBlob(lBlob, aName);
						lReussite = true;
					}
				} catch (e2) {
					IE.log.addLog("echec msSaveBlob");
				}
				if (!lReussite) {
					try {
						lAhref.get(0).click();
						lReussite = true;
					} catch (e) {}
				}
				lAhref.remove();
			};
			_downloadFile(
				lWorkbook,
				"file.xlsx",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
			break;
		}
		default:
			break;
	}
}
module.exports = {
	GestionnaireImportExport,
	ENatureOperation,
	EFormatFichierIE,
};
