const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreImport } = require("Enumere_GenreImport.js");
class ObjetMoteurImports {
	constructor() {
		this.c_CharObligatoire = "* ";
	}
	getChampAssocieCol(aParam) {
		const lRefTable =
			aParam.table && aParam.table.nomRef ? aParam.table.nomRef : "";
		const lMappingTable = this.getMappingDeTable({
			refTable: lRefTable,
			mapping: aParam.mapping,
		});
		if (lMappingTable !== null && lMappingTable !== undefined) {
			const lMappingCol = this.getMappingDeColonne({
				col: aParam.col,
				mappingTable: lMappingTable,
			});
			if (lMappingCol !== null && lMappingCol !== undefined) {
				const lNomRefChamp = lMappingCol.nomRefChamp;
				return this.getChampDeTable({
					nomRefChamp: lNomRefChamp,
					table: aParam.table,
				});
			}
		}
	}
	estColAssociee(aParam) {
		const lChampDeCol = this.getChampAssocieCol({
			col: aParam.col,
			mapping: aParam.mapping,
			table: aParam.table,
		});
		return lChampDeCol !== null && lChampDeCol !== undefined;
	}
	getMappingDeTable(aParam) {
		if (
			aParam.mapping &&
			aParam.mapping.tables !== undefined &&
			aParam.mapping.tables !== null
		) {
			for (let i = 0, lNbr = aParam.mapping.tables.count(); i < lNbr; i++) {
				const lMappingTable = aParam.mapping.tables.get(i);
				if (lMappingTable.nomRef === aParam.refTable) {
					return lMappingTable;
				}
			}
		}
	}
	creerMappingDeTable(aParam) {
		const lExisteMapping =
			aParam.mapping !== undefined && aParam.mapping !== null;
		if (lExisteMapping) {
			if (
				aParam.mapping.tables === undefined ||
				aParam.mapping.tables === null
			) {
				aParam.mapping.tables = new ObjetListeElements();
			}
			const lTable = new ObjetElement();
			lTable.nomRef = aParam.refTable;
			lTable.correspondances = new ObjetListeElements();
			aParam.mapping.tables.addElement(lTable);
			return lTable;
		}
	}
	supprimerCorrespondanceDeChamp(aParam) {
		const lTable = aParam.mappingTable;
		if (lTable !== null && lTable !== undefined) {
			if (
				lTable.correspondances !== null &&
				lTable.correspondances !== undefined
			) {
				const lCorresp = this.getMappingDeChamp({
					nomRefChamp: aParam.nomRefChamp,
					mappingTable: aParam.mappingTable,
				});
				if (lCorresp !== null && lCorresp !== undefined) {
					const lIndice = lTable.correspondances.getIndiceElementParFiltre(
						(D) => {
							return D.nomRefChamp === lCorresp.nomRefChamp;
						},
					);
					if (lIndice >= 0 && MethodesObjet.isNumber(lIndice)) {
						lTable.correspondances.remove(lIndice);
					}
				}
			} else {
			}
		} else {
		}
	}
	supprimerCorrespondanceDeCol(aParam) {
		const lTable = aParam.mappingTable;
		if (lTable !== null && lTable !== undefined) {
			if (
				lTable.correspondances !== null &&
				lTable.correspondances !== undefined
			) {
				const lCorresp = this.getMappingDeColonne({
					col: aParam.col,
					mappingTable: aParam.mappingTable,
				});
				if (lCorresp !== null && lCorresp !== undefined) {
					const lIndice = lTable.correspondances.getIndiceElementParFiltre(
						(D) => {
							return D.indiceCol === lCorresp.indiceCol;
						},
					);
					if (lIndice >= 0 && MethodesObjet.isNumber(lIndice)) {
						lTable.correspondances.remove(lIndice);
					}
				}
			} else {
			}
		} else {
		}
	}
	creerCorrespondance(aParam) {
		const lTable = aParam.mappingTable;
		if (lTable !== null && lTable !== undefined) {
			if (
				lTable.correspondances !== null &&
				lTable.correspondances !== undefined
			) {
				const lCorresp = new ObjetElement();
				lCorresp.indiceCol = aParam.col;
				lCorresp.nomRefChamp = aParam.nomRefChamp;
				lTable.correspondances.addElement(lCorresp);
			} else {
			}
		} else {
		}
	}
	getMappingDeChamp(aParam) {
		if (
			aParam.mappingTable &&
			aParam.mappingTable.correspondances !== undefined &&
			aParam.mappingTable.correspondances !== null
		) {
			for (
				let i = 0, lNbr = aParam.mappingTable.correspondances.count();
				i < lNbr;
				i++
			) {
				const lMappingCol = aParam.mappingTable.correspondances.get(i);
				if (lMappingCol.nomRefChamp === aParam.nomRefChamp) {
					return lMappingCol;
				}
			}
		}
	}
	getMappingDeColonne(aParam) {
		if (
			aParam.mappingTable &&
			aParam.mappingTable.correspondances !== undefined &&
			aParam.mappingTable.correspondances !== null
		) {
			for (
				let i = 0, lNbr = aParam.mappingTable.correspondances.count();
				i < lNbr;
				i++
			) {
				const lMappingCol = aParam.mappingTable.correspondances.get(i);
				if (lMappingCol.indiceCol === aParam.col) {
					return lMappingCol;
				}
			}
		}
	}
	getChampDeTable(aParam) {
		if (
			aParam.table &&
			aParam.table.SousChamps !== undefined &&
			aParam.table.SousChamps !== null
		) {
			for (let i = 0, lNbr = aParam.table.SousChamps.length; i < lNbr; i++) {
				const lChamp = aParam.table.SousChamps[i];
				if (lChamp.nomRef === aParam.nomRefChamp) {
					return lChamp;
				}
				if (lChamp.Genre === EGenreImport.Composite) {
					const lSousChamp = this.getChampDeTable({
						nomRefChamp: aParam.nomRefChamp,
						table: lChamp,
					});
					if (
						lSousChamp !== undefined &&
						lSousChamp.nomRef === aParam.nomRefChamp
					) {
						return lSousChamp;
					}
				}
			}
		}
	}
	getPereDeChamp(aParam) {
		if (
			aParam.table &&
			aParam.table.SousChamps !== undefined &&
			aParam.table.SousChamps !== null
		) {
			for (let i = 0, lNbr = aParam.table.SousChamps.length; i < lNbr; i++) {
				const lChamp = aParam.table.SousChamps[i];
				if (lChamp.nomRef === aParam.nomRefChamp) {
					return aParam.table;
				}
				if (lChamp.Genre === EGenreImport.Composite) {
					const lSousChamp = this.getPereDeChamp({
						nomRefChamp: aParam.nomRefChamp,
						table: lChamp,
					});
					if (lSousChamp !== undefined) {
						for (
							let j = 0, lNbr2 = lSousChamp.SousChamps.length;
							j < lNbr2;
							j++
						) {
							if (
								lSousChamp !== undefined &&
								lSousChamp.SousChamps[j].nomRef === aParam.nomRefChamp
							) {
								return lSousChamp;
							}
						}
					}
				}
			}
		}
	}
	getChampDeIndex(aParam) {
		if (
			aParam.table &&
			aParam.table.SousChamps !== undefined &&
			aParam.table.SousChamps !== null
		) {
			for (let i = 0, lNbr = aParam.table.SousChamps.length; i < lNbr; i++) {
				const lChamp = aParam.table.SousChamps[i];
				if (lChamp.Index === aParam.Index) {
					return lChamp;
				}
				if (lChamp.Genre === EGenreImport.Composite) {
					const lSousChamp = this.getChampDeTable({
						Index: aParam.Index,
						table: lChamp,
					});
					if (lSousChamp !== undefined && lSousChamp.Index === aParam.Index) {
						return lSousChamp;
					}
				}
			}
		}
	}
	getIndiceTable(aParam) {
		if (aParam.nomRef && aParam.listeTables) {
			for (let i = 0, lNbr = aParam.listeTables.count(); i < lNbr; i++) {
				if (aParam.nomRef === aParam.listeTables.get(i).nomRef) {
					return i;
				}
			}
		}
	}
	estChampObligatoire(aParam) {
		if (aParam.nomRefChamp !== undefined) {
			const lChamp = this.getChampDeTable(aParam);
			const lPere = this.getPereDeChamp(aParam);
			if (lPere !== undefined && lPere.nomRef !== aParam.table.nomRef) {
				const lEstDejaAssocie = this.estChampAssocie({
					nomRefChamp: lPere,
					refTable: aParam.table.nomRef,
					mapping: aParam.mapping,
				});
				if (lEstDejaAssocie) {
					return lChamp.Obligatoire;
				} else {
					return false;
				}
			} else {
				if (lChamp !== null && lChamp !== undefined) {
					return lChamp.Obligatoire;
				}
				return false;
			}
		}
		return false;
	}
	estChampDeColObligatoire(aParam) {
		const lChamp = this.getChampAssocieCol({
			col: aParam.col,
			mapping: aParam.mapping,
			table: aParam.table,
		});
		if (lChamp !== null && lChamp !== undefined) {
			return lChamp.Obligatoire;
		}
		return false;
	}
	estPasUnDoublonObligatoire(aArray, aIndex) {
		for (let i = 0, lNbr = aArray.length; i < lNbr; i++) {
			if (aArray[i].Index === aIndex) {
				return false;
			}
		}
		return true;
	}
	champsObligatoiresNonAssocies(aParam, aTable) {
		const lResult = [];
		function _traiterSousChamp(aThis, aChamp) {
			for (let j = 0, lNbr2 = aChamp.SousChamps.length; j < lNbr2; j++) {
				if (aChamp.SousChamps[j].Genre === EGenreImport.Composite) {
					let lRes = aThis.champsObligatoiresNonAssocies(
						{ table: aChamp, mapping: aParam.mapping },
						aTable,
					);
					let lTailleRes = lRes.length;
					if (lTailleRes > 0) {
						for (let k = 0; k < lTailleRes; k++) {
							if (aThis.estPasUnDoublonObligatoire(lResult, lRes[k].Index)) {
								lResult.push(lRes[k]);
							}
						}
					}
				} else {
					_traiterNonComposite(aChamp.SousChamps[j], aThis);
				}
			}
		}
		function _traiterNonComposite(aChamp, aThis) {
			let lEstObligatoire = aThis.estChampObligatoire({
				nomRefChamp: aChamp.nomRef,
				table: aTable,
				mapping: aParam.mapping,
			});
			if (lEstObligatoire) {
				let lEstDejaAssocie = aThis.estChampAssocie({
					nomRefChamp: aChamp.nomRef,
					refTable: aTable.nomRef,
					mapping: aParam.mapping,
				});
				if (!lEstDejaAssocie) {
					if (aThis.estPasUnDoublonObligatoire(lResult, aChamp.Index)) {
						lResult.push(aChamp);
					}
				}
			}
		}
		if (aParam.table.Index === 0) {
			aTable = aParam.table;
		}
		if (
			aParam.table &&
			aParam.table.SousChamps !== undefined &&
			aParam.table.SousChamps !== null
		) {
			let lEstDejaAssocie,
				lEstObligatoire,
				lFlagFilsObligatoire,
				lRes,
				lTailleRes;
			for (let i = 0, lNbr = aParam.table.SousChamps.length; i < lNbr; i++) {
				const lChamp = aParam.table.SousChamps[i];
				lRes = [];
				if (lChamp.Genre === EGenreImport.Composite) {
					lEstObligatoire = this.estChampObligatoire({
						nomRefChamp: lChamp.nomRef,
						table: aTable,
						mapping: aParam.mapping,
					});
					lEstDejaAssocie = this.estChampAssocie({
						nomRefChamp: lChamp,
						refTable: aTable.nomRef,
						mapping: aParam.mapping,
					});
					if (lEstObligatoire) {
						if (!lEstDejaAssocie) {
							lFlagFilsObligatoire = false;
							for (
								let j = 0, lNbr2 = lChamp.SousChamps.length;
								j < lNbr2;
								j++
							) {
								if (lChamp.SousChamps[j].Genre === EGenreImport.Composite) {
									lRes = this.champsObligatoiresNonAssocies(
										{ table: lChamp, mapping: aParam.mapping },
										aTable,
									);
									lTailleRes = lRes.length;
									if (lTailleRes > 0) {
										lFlagFilsObligatoire = true;
										for (let k = 0; k < lTailleRes; k++) {
											if (
												this.estPasUnDoublonObligatoire(lResult, lRes[k].Index)
											) {
												lResult.push(lRes[k]);
											}
										}
									}
								} else {
									lEstObligatoire = this.estChampObligatoire({
										nomRefChamp: lChamp.SousChamps[j].nomRef,
										table: aTable,
										mapping: aParam.mapping,
									});
									if (lEstObligatoire) {
										lFlagFilsObligatoire = true;
										if (
											this.estPasUnDoublonObligatoire(
												lResult,
												lChamp.SousChamps[j].Index,
											)
										) {
											lResult.push(lChamp.SousChamps[j]);
										}
									}
								}
							}
							if (!lFlagFilsObligatoire) {
								if (this.estPasUnDoublonObligatoire(lResult, lChamp.Index)) {
									lResult.push(lChamp);
								}
							}
						} else {
							_traiterSousChamp(this, lChamp);
						}
					} else {
						if (lEstDejaAssocie) {
							_traiterSousChamp(this, lChamp);
						}
					}
				} else {
					_traiterNonComposite(lChamp, this);
				}
			}
		}
		return lResult;
	}
	estPereAvecChampObligatoireManquant(aParam) {
		const lTabChampsNonAssocies = this.champsObligatoiresNonAssocies({
			table: aParam.table,
			mapping: aParam.mapping,
		});
		const lPere = aParam.pere;
		if (lPere.Genre === EGenreImport.Composite) {
			for (let i = 0, lNbr = lTabChampsNonAssocies.length; i < lNbr; i++) {
				for (let j = 0, lNbr2 = lPere.SousChamps.length; j < lNbr2; j++) {
					if (lTabChampsNonAssocies[i] === lPere.SousChamps[j]) {
						return true;
					}
					if (lPere.SousChamps[j].Genre === EGenreImport.Composite) {
						const lEstPereAvecChmpObliManquant =
							this.estPereAvecChampObligatoireManquant({
								pere: lPere.SousChamps[j],
								table: aParam.table,
								mapping: aParam.mapping,
							});
						if (lEstPereAvecChmpObliManquant) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	nbChampsObligatoiresNonAssocies(aParam) {
		const lTabChampsNonAssocies = this.champsObligatoiresNonAssocies(aParam);
		return lTabChampsNonAssocies.length;
	}
	estAuMoinsUnChampObligatoireManquant(aParam) {
		const lNbManquants = this.nbChampsObligatoiresNonAssocies(aParam);
		return lNbManquants > 0;
	}
	ajouterCorrespondance(aParam) {
		let lMappingTable = this.getMappingDeTable({
			refTable: aParam.table.nomRef,
			mapping: aParam.mapping,
		});
		if (lMappingTable === null || lMappingTable === undefined) {
			lMappingTable = this.creerMappingDeTable({
				refTable: aParam.table.nomRef,
				mapping: aParam.mapping,
			});
		}
		this.supprimerCorrespondanceDeCol({
			col: aParam.col,
			mappingTable: lMappingTable,
		});
		if (aParam.nomRefChamp !== null && aParam.nomRefChamp !== undefined) {
			const lTable = aParam.table;
			const lChamp = this.getChampDeTable({
				nomRefChamp: aParam.nomRefChamp,
				table: lTable,
			});
			if (lChamp.MultiAssociation === undefined) {
				this.supprimerCorrespondanceDeChamp({
					nomRefChamp: aParam.nomRefChamp,
					mappingTable: lMappingTable,
				});
			}
			this.creerCorrespondance({
				col: aParam.col,
				nomRefChamp: aParam.nomRefChamp,
				mappingTable: lMappingTable,
			});
		}
	}
	estChampAssocie(aParam) {
		const lMappingTable = this.getMappingDeTable({
			refTable: aParam.refTable,
			mapping: aParam.mapping,
		});
		if (lMappingTable !== null && lMappingTable !== undefined) {
			if (
				lMappingTable.correspondances !== undefined &&
				lMappingTable.correspondances !== null
			) {
				let lFlagChampAssocie = false;
				for (
					let i = 0, lNbr = lMappingTable.correspondances.count();
					i < lNbr;
					i++
				) {
					const lMappingCol = lMappingTable.correspondances.get(i);
					if (
						aParam.nomRefChamp.Genre !== undefined &&
						aParam.nomRefChamp.Genre === EGenreImport.Composite
					) {
						for (
							let j = 0, lNbr2 = aParam.nomRefChamp.SousChamps.length;
							j < lNbr2;
							j++
						) {
							if (
								aParam.nomRefChamp.SousChamps[j].Genre ===
								EGenreImport.Composite
							) {
								lFlagChampAssocie = this.estChampAssocie({
									nomRefChamp: aParam.nomRefChamp.SousChamps[j],
									refTable: aParam.refTable,
									mapping: aParam.mapping,
								});
							} else {
								lFlagChampAssocie = this.estChampAssocie({
									nomRefChamp: aParam.nomRefChamp.SousChamps[j].nomRef,
									refTable: aParam.refTable,
									mapping: aParam.mapping,
								});
							}
							if (lFlagChampAssocie) {
								return lFlagChampAssocie;
							}
						}
					}
					if (lMappingCol.nomRefChamp === aParam.nomRefChamp) {
						return true;
					}
				}
			}
		}
		return false;
	}
	avecPereObliAssocie(aParam) {
		let lPere = aParam.pere;
		const lTable = aParam.table;
		if (lPere !== undefined) {
			const lAvecPereAssociee = this.estChampAssocie({
				nomRefChamp: lPere,
				refTable: lTable.nomRef,
				mapping: aParam.mapping,
			});
			if (lAvecPereAssociee) {
				if (lPere.Obligatoire) {
					return true;
				}
			}
			lPere = this.getPereDeChamp({ nomRefChamp: lPere.nomRef, table: lTable });
			return this.avecPereObliAssocie({
				pere: lPere,
				table: lTable,
				mapping: aParam.mapping,
			});
		}
		return false;
	}
	getStrChamp(aParam) {
		const lStr = [];
		if (aParam.Obligatoire) {
			lStr.push(this.c_CharObligatoire);
		} else if (aParam.avecAlignement === true) {
			lStr.push("&nbsp;&nbsp;");
		}
		lStr.push(aParam.strChamp);
		return lStr.join("");
	}
	estCelluleValide(aParam, I, aBareme) {
		const lCell = aParam.cellule;
		const lTable = aParam.table;
		const lMapping = aParam.mapping;
		if (lMapping.tables.count() > 0) {
			const lIndiceTable = this.getIndiceTable({
				nomRef: lTable.nomRef,
				listeTables: lMapping.tables,
			});
			if (lIndiceTable !== undefined) {
				const lCorresp = this.getMappingDeColonne({
					col: I,
					mappingTable: lMapping.tables.get(lIndiceTable),
				});
				if (lCorresp !== undefined) {
					const lNomRefChamp = lCorresp.nomRefChamp;
					const lChamp = this.getChampDeTable({
						nomRefChamp: lNomRefChamp,
						table: lTable,
					});
					return estValide(lChamp, lCell, aBareme);
				}
			}
		}
		return true;
	}
	estColonneValide(aParam, I, aBareme) {
		if (aParam.table && aParam.mapping) {
			const lTable = aParam.table;
			const lMapping = aParam.mapping;
			if (lMapping.tables.count() > 0) {
				const lIndiceTable = this.getIndiceTable({
					nomRef: lTable.nomRef,
					listeTables: lMapping.tables,
				});
				if (lIndiceTable !== undefined) {
					const lCorresp = this.getMappingDeColonne({
						col: I,
						mappingTable: lMapping.tables.get(lIndiceTable),
					});
					if (lCorresp !== undefined) {
						const lIndiceCol = lCorresp.indiceCol;
						const lNomRefChamp = lCorresp.nomRefChamp;
						const lChamp = this.getChampDeTable({
							nomRefChamp: lNomRefChamp,
							table: lTable,
						});
						const lCol = aParam.donnees.get(lIndiceCol);
						aBareme.cell = lCol.cellules.get(0);
						for (let j = 0, lNbr = lCol.cellules.count(); j < lNbr; j++) {
							if (!estValide(lChamp, lCol.cellules.get(j), aBareme)) {
								return false;
							}
						}
					}
				}
			}
		}
		return true;
	}
	genresNonValides(aParam, aBareme) {
		const TGenresNonValides = [];
		if (aParam.table && aParam.mapping) {
			const lTable = aParam.table;
			const lMapping = aParam.mapping;
			if (lMapping.tables.count() > 0) {
				if (
					this.getIndiceTable({
						nomRef: lTable.nomRef,
						listeTables: lMapping.tables,
					}) !== undefined
				) {
					for (
						let i = 0,
							lNbr = lMapping.tables
								.get(
									this.getIndiceTable({
										nomRef: lTable.nomRef,
										listeTables: lMapping.tables,
									}),
								)
								.correspondances.count();
						i < lNbr;
						i++
					) {
						const lCorresp = lMapping.tables
							.get(
								this.getIndiceTable({
									nomRef: lTable.nomRef,
									listeTables: lMapping.tables,
								}),
							)
							.correspondances.get(i);
						if (lCorresp !== undefined) {
							const lIndiceCol = lCorresp.indiceCol;
							const lNomRefChamp = lCorresp.nomRefChamp;
							const lChamp = this.getChampDeTable({
								nomRefChamp: lNomRefChamp,
								table: lTable,
							});
							const lCol = aParam.donnees.get(lIndiceCol);
							aBareme.cell = lCol.cellules.get(0);
							for (let j = 0, lNbr2 = lCol.cellules.count(); j < lNbr2; j++) {
								if (!estValide(lChamp, lCol.cellules.get(j), aBareme)) {
									TGenresNonValides.push(lCol.cellules.get(j));
								}
							}
						}
					}
				}
			}
		}
		return TGenresNonValides;
	}
	nbGenresNonValides(aParam, aBareme) {
		const TNbGenresNonValides = this.genresNonValides(aParam, aBareme);
		return TNbGenresNonValides.length;
	}
	estImportPossible(aParam, aBareme) {
		const lNbGenresNonValides = this.nbGenresNonValides(
			{
				donnees: aParam.donnees,
				mapping: aParam.mapping,
				table: aParam.table,
				ligneSuppr: aParam.ligneSuppr,
			},
			aBareme,
		);
		const lNbChampsObliNonAssocies = this.nbChampsObligatoiresNonAssocies({
			mapping: aParam.mapping,
			table: aParam.table,
		});
		const lEstVide = !!(
			aParam.donnees.count() === 0 ||
			aParam.donnees.get(0).cellules.count() === 0
		);
		return !(
			lNbChampsObliNonAssocies !== 0 ||
			lNbGenresNonValides > 0 ||
			lEstVide
		);
	}
	editerCellule(aParams, I, V, aAvecFormatDateUnique) {
		let lRegex, lSplit;
		let lFlagTypeFounded = false;
		const lDonnees = aParams.instance.Donnees;
		const lCelluleRow = lDonnees.Donnees.get(aParams.ligne).cellules.get(I);
		const lCelluleCol = lDonnees.donneesColonnes
			.get(I)
			.cellules.get(aParams.ligne);
		if (parseFloat(V) || parseFloat(V) === 0) {
			V = V.replace(",", ".");
		}
		if (Number(V) || (Number(V) === 0 && parseInt(V) === 0)) {
			lCelluleRow.type = EGenreImport.Numerique;
			lCelluleCol.type = EGenreImport.Numerique;
			V = V.replace(".", ",");
			lFlagTypeFounded = true;
		}
		if (aAvecFormatDateUnique) {
			if (Date.parse(V) || (Date.parse(V) === 0 && !lFlagTypeFounded)) {
				lRegex = /(\d{4})[-/.]+(\d{2})[-/.]+(\d{2})/;
				if ((lSplit = lRegex.exec(V)) !== null) {
					lCelluleRow.type = EGenreImport.Date;
					lCelluleCol.type = EGenreImport.Date;
					V = new Date(V.replace(lRegex, "$1/$2/$3"));
					lCelluleRow.strValeur =
						V.getFullYear() +
						"-" +
						(("" + (V.getMonth() + 1)).length > 1
							? V.getMonth() + 1
							: "0" + (V.getMonth() + 1)) +
						"-" +
						(("" + V.getDate()).length > 1 ? V.getDate() : "0" + V.getDate());
					lCelluleCol.strValeur = lCelluleRow.strValeur;
					lFlagTypeFounded = true;
				}
			}
		} else if (!lFlagTypeFounded) {
			lRegex = /(\d+)[-/.]+(\d+)[-/.]+(\d{4})/;
			if ((lSplit = lRegex.exec(V)) !== null) {
				const lDate =
					lSplit[2] > 12
						? V.replace(lRegex, "$3/$1/$2")
						: V.replace(lRegex, "$3/$2/$1");
				if (Date.parse(lDate) || Date.parse(lDate) === 0) {
					lCelluleRow.type = EGenreImport.Date;
					lCelluleCol.type = EGenreImport.Date;
					V = new Date(lDate);
					lCelluleRow.strValeur = V.toLocaleDateString("defaut", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					});
					lCelluleCol.strValeur = lCelluleRow.strValeur;
					lFlagTypeFounded = true;
				}
			} else {
				lRegex = /(\d{4})[-/.]+(\d+)[-/.]+(\d+)/;
				if (
					(lSplit = lRegex.exec(V)) !== null &&
					(Date.parse(lSplit[0]) || Date.parse(lSplit[0]) === 0)
				) {
					lCelluleRow.type = EGenreImport.Date;
					lCelluleCol.type = EGenreImport.Date;
					V = new Date(V.replace(lRegex, "$1/$2/$3"));
					lCelluleRow.strValeur = V.toLocaleDateString("defaut", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					});
					lCelluleCol.strValeur = lCelluleRow.strValeur;
					lFlagTypeFounded = true;
				}
			}
		}
		if (Number(V) === 0 && !lFlagTypeFounded) {
			lCelluleRow.type = -1;
			lCelluleCol.type = -1;
			lFlagTypeFounded = true;
		}
		if (!lFlagTypeFounded) {
			lCelluleRow.type = EGenreImport.Chaine;
			lCelluleCol.type = EGenreImport.Chaine;
			lFlagTypeFounded = true;
		}
		if (lCelluleRow.type !== EGenreImport.Date) {
			lCelluleRow.strValeur = V;
			lCelluleCol.strValeur = V;
		}
		lCelluleRow.valeur = V;
		lCelluleCol.valeur = V;
		lCelluleRow.nbrChar = V.length;
		lCelluleCol.nbrChar = V.length;
		if (typeof lDonnees.Donnees.CellulesModifiees === "undefined") {
			lDonnees.Donnees.CellulesModifiees = [];
		}
		lDonnees.Donnees.CellulesModifiees.push(lCelluleRow);
	}
	supprimerLigne(aParam, aLigne) {
		for (
			let i = 0, lNbr = aParam.Donnees.count(), lFlag = false;
			i < lNbr && !lFlag;
			i++
		) {
			if (
				aParam.Donnees.get(i) !== undefined &&
				aParam.Donnees.get(i).Numero === aLigne
			) {
				if (typeof aParam.Donnees.LignesSupprimees === "undefined") {
					aParam.Donnees.LignesSupprimees = [];
				}
				aParam.Donnees.LignesSupprimees.push(aParam.Donnees.get(i).Numero);
				aParam.Donnees.remove(i);
				lFlag = true;
			}
		}
		for (let i = 0, lNbr = aParam.donneesColonnes.count(); i < lNbr; i++) {
			for (
				let j = 0,
					lNbr2 = aParam.donneesColonnes.get(i).cellules.count(),
					lFlag = false;
				j < lNbr2 && !lFlag;
				j++
			) {
				if (aParam.donneesColonnes.get(i).cellules.get(j).numLigne === aLigne) {
					aParam.donneesColonnes.get(i).cellules.remove(j);
					lFlag = true;
				}
			}
		}
	}
}
function estValide(aChamp, aCell, aBareme) {
	if (aChamp.Genre !== EGenreImport.Enumere) {
		if (aCell.type !== aChamp.Genre && aCell.type !== -1) {
			return false;
		}
		if (aCell.type !== -1 && aCell.type !== EGenreImport.Date) {
			aCell.valeur = aCell.valeur.replace(",", ".");
		}
		if (aBareme.avecBareme === true) {
			const lCellBareme =
				aBareme.cell.type !== -1 && aBareme.cell.type !== EGenreImport.Date
					? aBareme.cell.valeur.replace(",", ".")
					: GParametres.baremeNotation.getValeur();
			if (aBareme.baremeAvecDecimales) {
				if (
					(aCell.valeur > parseFloat(lCellBareme) ||
						parseFloat(lCellBareme) < 1 ||
						parseFloat(lCellBareme) > 100) &&
					aCell.type !== EGenreImport.Date
				) {
					return false;
				}
			} else {
				if (
					(aCell.valeur > parseInt(lCellBareme) ||
						parseInt(lCellBareme) < 1 ||
						parseInt(lCellBareme) > 100) &&
					aCell.type !== EGenreImport.Date
				) {
					return false;
				}
			}
		}
		for (let i = 0, lNbr2 = aChamp.Contraintes.length; i < lNbr2; i++) {
			const lPos = aChamp.Contraintes[i].indexOf(":");
			const lContrainte = aChamp.Contraintes[i].slice(0, lPos - 1);
			const lParam = aChamp.Contraintes[i].slice(
				-(aChamp.Contraintes[i].length - lPos - 2),
			);
			switch (lContrainte) {
				case "longueur_maximum":
					if (aCell.nbrChar > parseInt(lParam)) {
						return false;
					}
					break;
				case "longueur_minimum":
					if (aCell.nbrChar < parseInt(lParam)) {
						return false;
					}
					break;
				case "type":
					if (
						lParam === "integer" &&
						aCell.valeur !== parseInt(aCell.strValeur)
					) {
						return false;
					}
					break;
				case "minimum":
					if (aCell.valeur < parseFloat(lParam)) {
						return false;
					}
					break;
				case "maximum":
					if (aCell.valeur > parseFloat(lParam)) {
						return false;
					}
					break;
				case "defaut":
					if (aCell.type === -1) {
						aCell.strValeur = lParam;
					}
					break;
				default:
					break;
			}
		}
	} else {
		let lFlagEnumere = false;
		if (aCell.type === -1) {
			lFlagEnumere = true;
		} else {
			for (let k = 0, lNbr = aChamp.Contraintes.length; k < lNbr; k++) {
				if (aCell.strValeur === aChamp.Contraintes[k]) {
					lFlagEnumere = true;
				}
			}
		}
		if (!lFlagEnumere) {
			return false;
		}
	}
	return true;
}
module.exports = { ObjetMoteurImports };
