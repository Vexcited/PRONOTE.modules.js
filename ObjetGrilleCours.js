exports.ObjetGrilleCours = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const IEHtml = require("IEHtml");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_BoutonSouris_1 = require("Enumere_BoutonSouris");
const ObjetImage_1 = require("ObjetImage");
const ObjetSupport_1 = require("ObjetSupport");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const UtilitaireCss_1 = require("UtilitaireCss");
const tag_1 = require("tag");
const ObjetTri_1 = require("ObjetTri");
class ObjetGrilleCours {
	constructor(aGrille) {
		this.grille = aGrille;
		const lId = GUID_1.GUID.getId();
		this.params = {
			couleurBordureCours: "black",
			tailleTexteCours: null,
			paddingContenuCoursTop: 0,
			paddingContenuCoursBottom: 0,
			paddingContenuCoursLeft: 1,
			paddingContenuCoursRight: 1,
			prefixeImageCours: "",
			grilleInverse: false,
			cadreSelection: {
				tailleMax: 3,
				tailleMin: 1,
				couleur: GCouleur.grille.selectionCours,
				tailleInterne: 1,
				tailleExterne: 1,
				couleurInterne: "white",
			},
			coursAvecIEHint: true,
			classCoursMS: "",
			couleurFondCoursMS: "white",
			titleBoutonCoursMS: "",
			couleurFondSlider: "#d8d8d8",
			largeurBordureHorsGrille: 1,
			superpose: {
				const_valeurCouloirPlus: -2,
				const_valeurCouloirMoins: -1,
				tailleBoutonMax: 18,
				tailleBoutonMin: 12,
				tailleBoutonMinForce: 8,
				tailleBoutonMinForceOppose: 9,
				tailleBoutonMinExtreme: 4,
			},
			ieNodeImage: "nodeImageCours",
			selection: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
			avecScrollSurSelectionCours: true,
			id: lId,
			idPiedTranche: "",
			idCours: lId + "_cours",
			idImage: lId + "_image",
			idContenu: lId + "_cont",
			idCoursInterne: lId + "_coursInt",
		};
		this.grille.controleur.moduleCours = this.getControleur(this);
	}
	setParametres(aParametres) {
		Object.assign(this.params, aParametres);
		return this;
	}
	getControleur(aInstance) {
		return {
			getNodeSlider: function (aIndiceCours) {
				$(this.node).on("mouseup", (aEvent) => {
					if (
						GNavigateur.BoutonSouris ===
						Enumere_BoutonSouris_1.EGenreBoutonSouris.Droite
					) {
						return;
					}
					const lCours = aInstance.params.listeCours.get(aIndiceCours);
					if (!lCours) {
						return;
					}
					aEvent.stopPropagation();
					lCours.numeroCouloir += 1;
					if (lCours.numeroCouloir >= lCours.listeCours.nbCouloirs) {
						lCours.numeroCouloir = 0;
					}
					aInstance.actualiserCours(aIndiceCours);
				});
			},
			getHintCours: function (aIndiceCours) {
				const lCours = aInstance.params.listeCours.get(aIndiceCours);
				return lCours ? aInstance.getHintCours(lCours, aIndiceCours) : "";
			},
		};
	}
	getPlaceDebutCours(aCours, aPlaceReelle) {
		return this.grille
			.getOptions()
			.convertisseurPosition.getPlaceDebutCours(aCours, aPlaceReelle);
	}
	getPlaceFinCours(aCours, aPlaceReelle) {
		return this.grille
			.getOptions()
			.convertisseurPosition.getPlaceFinCours(aCours, aPlaceReelle);
	}
	getPlaceCoursHorsGrille(aCours, aDebutCours) {
		if (aDebutCours) {
			return (
				this.getPlaceDebutCours(aCours) !==
				this.getPlaceDebutCours(aCours, true)
			);
		}
		return (
			this.getPlaceFinCours(aCours) !== this.getPlaceFinCours(aCours, true)
		);
	}
	getNumeroTrancheDeCours(aCours) {
		return 0;
	}
	estCoursVisible(aCours) {
		return false;
	}
	getIdCours(aIndiceCours) {
		return `${this.params.idCours}_${aIndiceCours}`;
	}
	getIdInterneCours(aIndiceCours) {
		return this.params.idCoursInterne + "_" + aIndiceCours;
	}
	actualiserContenuCours(aParams) {}
	getIdContenu(I) {
		return this.params.idContenu + I;
	}
	getTopImagesCoin(aParams) {
		return null;
	}
	getListeImagesCoin(aParams) {
		return null;
	}
	actualiserCours(aIndiceCours) {
		if (aIndiceCours >= 0) {
			this._actualiserCours(
				aIndiceCours,
				this.params.listeCours.get(aIndiceCours),
				false,
			);
		} else if (this.params.listeCours && this.params.listeCours.parcourir) {
			this.params.listeCours.parcourir((aCours, aIndex) => {
				this._actualiserCours(aIndex, aCours, false);
			});
		}
	}
	composeEnteteCours(I, aCours) {
		return "";
	}
	getHintCours(aCours, aIndiceCours) {
		return "";
	}
	getCadreCours(aCours) {
		return {
			left: 5,
			top: 1,
			right: 1,
			bottom: 1,
			couleurFond: aCours.coursMultiple
				? aCours.CouleurFond
				: GCouleur.getCouleurTransformationCours(aCours.CouleurFond),
			couleurBordure: aCours.CouleurFond,
		};
	}
	construireDecorateurCours(aCours, aIndiceCours) {
		return "";
	}
	avecHintCours() {
		return false;
	}
	composeListeCours(aParams) {
		this.params.selection = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		this.setParametres(aParams);
		const T = [];
		const HHorsGrille = [];
		const lTabCours = [];
		if (this.params.listeCours) {
			this.params.listeCours.parcourir((aCours, aIndice) => {
				if (!this.params.avecCours || this.params.avecCours(aCours)) {
					lTabCours.push({
						cours: aCours,
						indice: aIndice,
						trancheHoraire: this.grille.getTrancheHoraireDePlace(
							this.getPlaceDebutCours(aCours, true),
							true,
						),
					});
				}
			});
		}
		ObjetTri_1.ObjetTri.trierTableau(lTabCours, [
			ObjetTri_1.ObjetTri.init((aValue) => {
				return aValue.trancheHoraire.tranche;
			}),
			ObjetTri_1.ObjetTri.init((aValue) => {
				return aValue.trancheHoraire.horaire;
			}),
		]);
		lTabCours.forEach((aValue) => {
			const lCours = aValue.cours;
			const lClass = this.params.getClassCours
				? this.params.getClassCours(lCours, aValue.indice)
				: "";
			const lTab = lCours.horsHoraire ? HHorsGrille : T;
			const lDroppable = this.params.getDroppableCours
				? this.params.getDroppableCours(lCours, aValue.indice)
				: false;
			const lEstAccessible = !lCours.coursMultiple;
			lTab.push(
				IE.jsx.str(
					"div",
					{
						id: this.getIdCours(aValue.indice),
						tabindex: lEstAccessible ? "0" : false,
						role: lEstAccessible ? "listitem" : "presentation",
						"aria-haspopup": "dialog",
						"aria-hidden": lEstAccessible ? false : "true",
						class: [
							"EmploiDuTemps_Element",
							lCours.coursMultiple ? "conteneur-multiple" : "",
							lCours.estCoursMS ? "cours-ms sr-only" : "",
							lClass,
						],
						style: ObjetStyle_2.GStyle.composeCouleurBordure(
							this.params.couleurBordureCours,
						),
						"ie-node": this.params.getContenuNodeCours
							? this.params.getContenuNodeCours(lCours, aValue.indice)
							: false,
						"ie-droppable": lDroppable ? lDroppable : false,
					},
					this._composeCours(lCours, aValue.indice),
				),
			);
		});
		ObjetHtml_1.GHtml.setHtml(this.params.id, T.join(""), {
			controleur: this.grille.controleur,
			ignorerScroll: true,
		});
		const lHtmlHorsGrille = HHorsGrille.join("");
		if (this.params.idPiedTranche && lHtmlHorsGrille) {
			ObjetHtml_1.GHtml.setHtml(this.params.idPiedTranche, lHtmlHorsGrille, {
				controleur: this.grille.controleur,
				ignorerScroll: true,
			});
		}
		this.actualiserCours();
		return this;
	}
	forcerVisibleCoursMS(aIndiceCours) {
		const lCours = this.params.listeCours.get(aIndiceCours);
		if (lCours && lCours.estCoursMS) {
			this.params.listeCours.parcourir(
				(aCoursMultiple, aIndiceCoursMultiple) => {
					if (aCoursMultiple && aCoursMultiple.listeCours) {
						aCoursMultiple.listeCours.parcourir((aCoursSuperpose) => {
							const lIndice =
								this._getIndiceCoursOrigineDeCoursSuperpose(aCoursSuperpose);
							if (lIndice === aIndiceCours) {
								if (
									aCoursMultiple.numeroCouloir !== aCoursSuperpose.numeroCouloir
								) {
									aCoursMultiple.numeroCouloir = aCoursSuperpose.numeroCouloir;
									this._actualiserCours(
										aIndiceCoursMultiple,
										aCoursMultiple,
										true,
									);
								}
								return false;
							}
						});
					}
				},
			);
			IEHtml.refresh();
		}
	}
	selectionnerCours(aIndiceCours, aSelectionne, aAvecMAJCouloir) {
		const lSelectionne = aSelectionne !== false;
		const lCours = this.params.listeCours.get(aIndiceCours);
		if (!lCours) {
			return;
		}
		if (lCours.listeCours) {
			return;
		}
		const lDejaSelectionnee = this.params.selection.contains(aIndiceCours);
		if (lSelectionne) {
			this.params.selection.add(aIndiceCours);
		} else {
			this.params.selection.remove(aIndiceCours);
		}
		if (lDejaSelectionnee === lSelectionne) {
			IE.log.addLog("selectionnerCours rien ??");
			return;
		}
		const lNode = ObjetHtml_1.GHtml.getElement(this.getIdCours(aIndiceCours));
		if (!ObjetHtml_1.GHtml.elementExiste(lNode)) {
			return;
		}
		const lId = this.getIdInterneCours(aIndiceCours);
		const lEcart = lSelectionne ? this._ecartSelection() : 0;
		const lJId = $("#" + lId.escapeJQ());
		lJId.css({ top: lEcart, bottom: lEcart, left: lEcart, right: lEcart });
		const lJSelection = lJId.parent().find(".selectionCoursGrille");
		if (lSelectionne && lJSelection.length === 0) {
			lJId.parent().append(this._composeCadreSelection());
		} else if (!lSelectionne && lJSelection.length > 0) {
			lJSelection.remove();
		}
		this._actualiserCours(aIndiceCours, lCours, true);
		if (aAvecMAJCouloir && lSelectionne && lCours.estCoursMS) {
			this.forcerVisibleCoursMS(aIndiceCours);
		}
		if (this.params.avecScrollSurSelectionCours && aSelectionne) {
			this.grille.ScrollV.scrollToElement(lNode);
			this.grille.ScrollH.scrollToElement(lNode);
		}
		if (aSelectionne) {
			const lElement = ObjetHtml_1.GHtml.getElement(
				this.getIdCours(aIndiceCours),
			);
			if (lElement) {
				lElement.focus();
			}
		}
		IEHtml.refresh();
	}
	deselectionnerTout() {
		this.params.selection.each((aIndex) => {
			this.selectionnerCours(aIndex, false);
		});
	}
	_getIdElementSlider(I) {
		return this.params.id + "_slider_" + I;
	}
	_getNbCoursDeCouloir(aCoursMultiple, aNumeroCouloir) {
		let lResult = 0;
		for (let i = 0; i < aCoursMultiple.listeCours.count(); i++) {
			const lCours = aCoursMultiple.listeCours.get(i);
			if (lCours.numeroCouloir === aNumeroCouloir) {
				lResult++;
			}
		}
		return lResult;
	}
	_composeSelecteurCoursMultiple(aParams, aNumeroCouloir, aDernierBouton) {
		const H = [],
			lEcart =
				!aDernierBouton &&
				aParams.taille > this.params.superpose.tailleBoutonMin
					? 1
					: 0,
			lEcartEntreBouton = lEcart + 1,
			lHeightCellule = this.params.grilleInverse
				? aParams.tailleOppose - 2
				: aParams.taille - lEcartEntreBouton,
			lWidthCellule = this.params.grilleInverse
				? aParams.taille - lEcartEntreBouton
				: aParams.tailleOppose - 2;
		const lTitle =
			aNumeroCouloir !== this.params.superpose.const_valeurCouloirMoins &&
			aNumeroCouloir !== this.params.superpose.const_valeurCouloirPlus
				? 'title="' +
					this._getNbCoursDeCouloir(aParams.cours, aNumeroCouloir) +
					" / " +
					aParams.cours.listeCours.count() +
					" " +
					this.params.titleBoutonCoursMS +
					'" '
				: "";
		const lPadding =
			"padding:1px " +
			(this.params.grilleInverse ? (lEcart ? "1px " : "0 ") : "1px ") +
			(!this.params.grilleInverse ? (lEcart ? "1px " : "0 ") : "1px ") +
			"1px;";
		H.push(
			'<div style="',
			lPadding,
			'"',
			this.params.grilleInverse ? ' class="InlineBlock AlignementHaut"' : "",
			">",
		);
		H.push(
			'<div class="btn-choix-couloir" ',
			ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeCoursSuperpose", [
				aNumeroCouloir,
			]),
			ObjetHtml_1.GHtml.composeAttr("ie-class", "getClassSelecCouloir", [
				aNumeroCouloir,
			]),
			'style="overflow:hidden;',
			ObjetStyle_2.GStyle.composeHeight(lHeightCellule - 1) +
				ObjetStyle_2.GStyle.composeWidth(lWidthCellule - 1) +
				"font-size:" +
				Math.max(8, Math.min(lWidthCellule, lHeightCellule) - 1) +
				"px;" +
				"line-height:" +
				lHeightCellule +
				"px;" +
				'" ' +
				lTitle +
				">",
		);
		if (
			aNumeroCouloir !== this.params.superpose.const_valeurCouloirMoins &&
			aNumeroCouloir !== this.params.superpose.const_valeurCouloirPlus
		) {
			H.push(aNumeroCouloir + 1);
		} else {
			const lIcon =
				aNumeroCouloir === this.params.superpose.const_valeurCouloirMoins
					? this.params.grilleInverse
						? "icon_chevron_left"
						: "icon_chevron_up"
					: this.params.grilleInverse
						? "icon_chevron_right"
						: "icon_chevron_down";
			H.push((0, tag_1.tag)("i", { class: lIcon }));
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeSliderCoursMultiple(aParams) {
		const H = [],
			lNbCouloirs = aParams.cours.listeCours.nbCouloirs;
		let i;
		if (!aParams.avecFleches) {
			for (i = 0; i < lNbCouloirs; i++) {
				H.push(
					this._composeSelecteurCoursMultiple(
						aParams,
						i,
						i === lNbCouloirs - 1,
					),
				);
			}
		} else {
			if (!aParams.cours.numeroDefilementCouloir) {
				aParams.cours.numeroDefilementCouloir = 0;
			}
			H.push(
				this._composeSelecteurCoursMultiple(
					aParams,
					this.params.superpose.const_valeurCouloirMoins,
				),
			);
			let lInc = 0;
			i = aParams.cours.numeroDefilementCouloir;
			while (lInc < aParams.nbCouloirs - 2) {
				if (i >= lNbCouloirs) {
					i = 0;
				}
				H.push(this._composeSelecteurCoursMultiple(aParams, i));
				lInc++;
				i++;
			}
			H.push(
				this._composeSelecteurCoursMultiple(
					aParams,
					this.params.superpose.const_valeurCouloirPlus,
					true,
				),
			);
		}
		return H.join("");
	}
	_actualiserCoursMultiple(aIndice, aCours, aTaille) {
		let lAvecFleches = false;
		let lTailleBouton, lNbCouloirs, lNbCouloirsMin;
		const lIdSlider = this._getIdElementSlider(aIndice);
		let lTaille = aTaille - 1;
		let lTailleMax;
		let lTailleMin;
		const lTabIndicesCoursParCouloir = [];
		const lTabIndiceCours = [];
		lTailleMax = Math.min(
			this.params.superpose.tailleBoutonMax,
			Math.ceil(
				(this.params.grilleInverse
					? this.grille.hauteurCellule
					: this.grille.largeurCellule) / 6,
			) - 1,
		);
		lTailleMin = this.params.superpose.tailleBoutonMin;
		lTailleMax = Math.max(lTailleMin, lTailleMax);
		lNbCouloirs = Math.min(
			aCours.listeCours.nbCouloirs,
			Math.floor(lTaille / lTailleMin),
		);
		if (lNbCouloirs < aCours.listeCours.nbCouloirs) {
			lNbCouloirsMin = Math.min(
				aCours.listeCours.nbCouloirs,
				Math.floor(lTaille / lTailleMax),
			);
			if (lNbCouloirsMin >= 3) {
				lNbCouloirs = lNbCouloirsMin;
			} else {
				lTailleMax = this.params.superpose.tailleBoutonMin;
				if (lNbCouloirs < 3) {
					lTailleMin = this.params.superpose.tailleBoutonMinForce;
					lNbCouloirs = Math.min(
						aCours.listeCours.nbCouloirs,
						Math.floor(lTaille / lTailleMin),
					);
					if (lNbCouloirs < 3) {
						lTailleMin = this.params.superpose.tailleBoutonMinExtreme;
						lNbCouloirs = Math.min(3, aCours.listeCours.nbCouloirs);
					}
				}
			}
			lAvecFleches =
				aCours.listeCours.nbCouloirs >= 3 &&
				lNbCouloirs < aCours.listeCours.nbCouloirs;
			lTailleBouton = Math.floor(lTaille / lNbCouloirs);
		} else {
			lTailleBouton = Math.floor(lTaille / lNbCouloirs);
		}
		lTailleBouton = Math.borner(lTailleBouton, lTailleMin, lTailleMax);
		const lTailleBoutonOppose = Math.max(
			this.params.superpose.tailleBoutonMinForceOppose,
			lTailleBouton,
		);
		if (this.params.grilleInverse) {
			ObjetPosition_1.GPosition.setHeight(lIdSlider, lTailleBoutonOppose);
		} else {
			ObjetPosition_1.GPosition.setWidth(lIdSlider, lTailleBoutonOppose);
		}
		lTaille = lTailleBoutonOppose;
		const lThis = this,
			lControleurCoursSuperpose = {
				getNodeCoursSuperpose: function (aNumeroCouloir) {
					const lControleur = this.controleur;
					$(this.node).on({
						mouseup: function (aEvent) {
							if (
								GNavigateur.BoutonSouris ===
								Enumere_BoutonSouris_1.EGenreBoutonSouris.Droite
							) {
								return;
							}
							aEvent.stopPropagation();
							if (
								aNumeroCouloir ===
								lThis.params.superpose.const_valeurCouloirMoins
							) {
								aCours.numeroDefilementCouloir -= 1;
								if (aCours.numeroDefilementCouloir < 0) {
									aCours.numeroDefilementCouloir =
										aCours.listeCours.nbCouloirs - 1;
								}
							} else if (
								aNumeroCouloir ===
								lThis.params.superpose.const_valeurCouloirPlus
							) {
								aCours.numeroDefilementCouloir += 1;
								if (
									aCours.numeroDefilementCouloir >= aCours.listeCours.nbCouloirs
								) {
									aCours.numeroDefilementCouloir = 0;
								}
							} else {
								aCours.numeroCouloir = aNumeroCouloir;
							}
							lThis.actualiserCours(aIndice);
							lControleur.$refresh();
						},
					});
				},
				getClassSelecCouloir(aNumeroCouloir) {
					const lSelectionne = aNumeroCouloir === aCours.numeroCouloir;
					if (lSelectionne) {
						return "selected";
					}
					return "";
				},
			};
		aCours.listeCours.parcourir((aCoursSuperpose) => {
			const lIndiceCours =
				this._getIndiceCoursOrigineDeCoursSuperpose(aCoursSuperpose);
			lTabIndiceCours.push(lIndiceCours);
			if (!lTabIndicesCoursParCouloir[aCoursSuperpose.numeroCouloir]) {
				lTabIndicesCoursParCouloir[aCoursSuperpose.numeroCouloir] = [];
			}
			lTabIndicesCoursParCouloir[aCoursSuperpose.numeroCouloir].push(
				lIndiceCours,
			);
			const lCoursOrigine = this.params.listeCours.get(lIndiceCours);
			lCoursOrigine.estCoursMSInvisibleCouloir =
				aCoursSuperpose.numeroCouloir !== aCours.numeroCouloir;
			lCoursOrigine._ecartCoursMS =
				lTaille + (ObjetSupport_1.Support.bordureExterneDIV ? 0 : 1);
		});
		ObjetHtml_1.GHtml.setHtml(
			ObjetHtml_1.GHtml.getElement(lIdSlider),
			this._composeSliderCoursMultiple({
				cours: aCours,
				taille: lTailleBouton,
				tailleOppose: lTailleBoutonOppose,
				nbCouloirs: lNbCouloirs,
				avecFleches: lAvecFleches,
			}),
			{ controleur: lControleurCoursSuperpose, ignorerScroll: true },
		);
		if (this.grille.getOptions().decorateurAbsences) {
			this.grille
				.getOptions()
				.decorateurAbsences.traiterCoursMultiple(aCours, lTaille);
		}
		lTabIndiceCours.forEach((aIndiceCours) => {
			this._actualiserCours(
				aIndiceCours,
				this.params.listeCours.get(aIndiceCours),
				true,
			);
		});
	}
	_getIdImage(aIndiceCours, aGenreCoin) {
		return this.params.idImage + "_" + aGenreCoin + "_" + aIndiceCours;
	}
	_getLargeurImageDeClass(aNomClass) {
		if (
			!uCacheLargeurImage[aNomClass] &&
			uCacheLargeurImage[aNomClass] !== false
		) {
			const lLargeur = parseInt(
				UtilitaireCss_1.UtilitaireCss.chercherAttributReglesCss(
					"." + aNomClass,
					"width",
				),
			);
			uCacheLargeurImage[aNomClass] = lLargeur > 0 ? lLargeur : false;
		}
		return uCacheLargeurImage[aNomClass];
	}
	_composeImagesCoursDeCoin(aParams) {
		const HContenu = [];
		const lListe = aParams.liste;
		lListe.largeur = 0;
		lListe.parcourir((aImage) => {
			let lPrefixeImage = this.params.prefixeImageCours || "";
			const lLibelle = aImage.getLibelle();
			if (
				!!aImage.estImageDeFont ||
				(lPrefixeImage &&
					lLibelle &&
					lLibelle.startsWith &&
					lLibelle.startsWith(lPrefixeImage))
			) {
				lPrefixeImage = "";
			}
			const lClassImage = lPrefixeImage + lLibelle;
			const lLargeur =
				(aImage.width
					? aImage.width
					: this._getLargeurImageDeClass(lClassImage)) || 20;
			lListe.largeur += lLargeur + 1;
			const lAvecEvenement =
				aImage.getGenre() >= 0 && !!this.params.ieNodeImage;
			const lTitle = aImage.hint && !aImage.title ? aImage.hint : false;
			const lAriaLabel = aImage.ariaLabel || lTitle;
			if (!lAriaLabel) {
				IE.log.addLog(
					`label/title manquant sur image de cours pour accessibilité`,
				);
			}
			const lAttrs = {
				title: aImage.title ? aImage.title : false,
				"ie-hint": lTitle,
				"aria-label": lAriaLabel,
			};
			let lContenu = "";
			if (aImage.html) {
				lContenu = aImage.html;
			} else if (aImage.btnImage) {
				const lAttributsClasseImage = [lClassImage];
				if (!!aImage.estImageDeFont) {
					lAttributsClasseImage.push("btnImageIcon");
				}
				const lStylesImage = [];
				if (!!aImage.width) {
					lStylesImage.push("width:" + aImage.width + "px;");
				}
				if (!!aImage.tailleImageFont) {
					lStylesImage.push("font-size:" + aImage.tailleImageFont + ";");
				}
				lContenu = IE.jsx.str(
					"ie-btnimage",
					Object.assign(
						{},
						Object.assign(lAttrs, {
							class: lAttributsClasseImage,
							style: lStylesImage.join(""),
						}),
					),
				);
			} else {
				lContenu = ObjetImage_1.GImage.compose(lClassImage, lLargeur);
			}
			if (aImage.getHtmlSupp) {
				lContenu += aImage.getHtmlSupp();
			}
			let lRole = false;
			if (!aImage.btnImage) {
				if (lAvecEvenement) {
					lRole = "button";
				} else {
					lRole = lAriaLabel ? "img" : "presentation";
				}
			}
			const lAttrsDiv = {
				style: aImage.style || false,
				class:
					this.grille.getOptions().avecSelection && lAvecEvenement
						? "AvecMain"
						: false,
				"ie-node": lAvecEvenement
					? tag_1.tag.funcAttr(this.params.ieNodeImage, [
							aParams.indiceCours,
							aImage.getGenre(),
						])
					: false,
				role: lRole,
				tabindex: lAvecEvenement && !aImage.btnImage ? "0" : false,
			};
			if (!aImage.btnImage) {
				Object.assign(lAttrsDiv, lAttrs);
			}
			HContenu.push(IE.jsx.str("div", Object.assign({}, lAttrsDiv), lContenu));
		});
		let lStylePosition = "";
		if (aParams.height > 0 && aParams.width > 0) {
			switch (aParams.coin) {
				case ObjetGrilleCours.positionImage.basG:
				case ObjetGrilleCours.positionImage.hautG:
					lStylePosition = "left:" + (aParams.cadreCours.left || 0) + "px;";
					break;
				case ObjetGrilleCours.positionImage.basD:
				case ObjetGrilleCours.positionImage.hautD:
					lStylePosition = tag_1.tag.styleToStr(
						"right",
						(aParams.cadreCours.right || 0) + "px",
					);
					break;
			}
		}
		const lEstPositionHaute =
			aParams.coin === ObjetGrilleCours.positionImage.hautG ||
			aParams.coin === ObjetGrilleCours.positionImage.hautD ||
			aParams.coin === ObjetGrilleCours.positionImage.centreH;
		if (lEstPositionHaute) {
			let lTop = aParams.cadreCours.top || 0;
			const lTopImage = this.getTopImagesCoin(aParams);
			if (lTopImage > 0) {
				lTop += lTopImage;
			}
			lStylePosition += "top:" + lTop + "px;";
		} else {
			lStylePosition += tag_1.tag.styleToStr(
				"bottom",
				(aParams.cadreCours.bottom || 0) + "px",
			);
		}
		return (0, tag_1.tag)(
			"div",
			{
				id: this._getIdImage(aParams.indiceCours, aParams.coin),
				class: [
					"conteneur_image",
					lEstPositionHaute ? "conteneur_image_haut" : "conteneur_image_bas",
					aParams.coin === ObjetGrilleCours.positionImage.centreB ||
					aParams.coin === ObjetGrilleCours.positionImage.centreH
						? " conteneur_image_centre"
						: "",
				],
				style: lStylePosition,
			},
			HContenu.join(""),
		);
	}
	_actualiserImagesCours(aNodeCours, aCours, aIndice, aHeight, aWidth) {
		if (!aCours) {
			return;
		}
		if (!aNodeCours) {
			return;
		}
		const lParams = {
			cours: aCours,
			indiceCours: aIndice,
			cadreCours: this.getCadreCours(aCours),
			width: aWidth,
			height: aHeight,
			tailleTexteCours: this.params.tailleTexteCours,
			grilleInverse: this.params.grilleInverse,
		};
		let lListeImagesCoins = null;
		try {
			lListeImagesCoins = this.getListeImagesCoin(lParams);
		} catch (e) {
			lListeImagesCoins = null;
		}
		$(aNodeCours).find(".conteneur_image").remove();
		if (lListeImagesCoins) {
			const H = [];
			[
				ObjetGrilleCours.positionImage.centreH,
				ObjetGrilleCours.positionImage.centreB,
				ObjetGrilleCours.positionImage.basG,
				ObjetGrilleCours.positionImage.basD,
				ObjetGrilleCours.positionImage.hautG,
				ObjetGrilleCours.positionImage.hautD,
			].forEach((aCoin) => {
				if (lListeImagesCoins[aCoin] && lListeImagesCoins[aCoin].count() > 0) {
					H.push(
						this._composeImagesCoursDeCoin(
							Object.assign(
								{ liste: lListeImagesCoins[aCoin], coin: aCoin },
								lParams,
							),
						),
					);
				}
			});
			const lHtmlImages = H.join("");
			if (lHtmlImages && aNodeCours) {
				IEHtml.injectHTML(
					aNodeCours,
					lHtmlImages,
					this.grille.controleur,
					true,
					null,
					false,
				);
			}
		}
	}
	_getTailleSelonCellule() {
		const lTailleBordures =
			(this.params.cadreSelection.tailleInterne || 0) +
			(this.params.cadreSelection.tailleExterne || 0);
		return (
			this.grille.getTailleSelonCellule({
				tailleMax: this.params.cadreSelection.tailleMax + lTailleBordures,
				tailleMin: this.params.cadreSelection.tailleMin + lTailleBordures,
			}) - lTailleBordures
		);
	}
	_ecartSelection() {
		return (
			this._getTailleSelonCellule() +
			(this.params.cadreSelection.tailleInterne || 0) +
			(this.params.cadreSelection.tailleExterne || 0)
		);
	}
	_actualiserCours(aIndice, aCours, aActualisationCoursSuperpose) {
		if (!aActualisationCoursSuperpose && aCours.estCoursMS) {
			return;
		}
		const lNode = ObjetHtml_1.GHtml.getElement(this.getIdCours(aIndice));
		let lAfficherCours = this.estCoursVisible(aCours);
		let lPlaceDebutCours, lPlaceFinCours, lCoordonnes, lTailles;
		if (!ObjetHtml_1.GHtml.elementExiste(lNode)) {
			return;
		}
		if (lAfficherCours) {
			lNode.classList.remove("cours-invisible");
		} else {
			lNode.classList.add("cours-invisible");
		}
		if (aCours.estCoursMS) {
			if (aCours.estCoursMSInvisibleCouloir) {
				lNode.classList.add("sr-only");
				lAfficherCours = false;
			} else {
				lNode.classList.remove("sr-only");
			}
		}
		if (lAfficherCours) {
			const lCadreCours = this.getCadreCours(aCours);
			if (aCours.horsHoraire) {
				lCoordonnes = this.grille.getCoordonneesPiedTrancheDeNumeroTranche(
					this.getNumeroTrancheDeCours(aCours),
				);
				if (!lCoordonnes) {
					ObjetStyle_2.GStyle.setVisible(lNode, false);
					return;
				}
				if (this.params.grilleInverse) {
					lCoordonnes.left += 4;
				}
				lTailles = {
					width: lCoordonnes.right - lCoordonnes.left,
					height: lCoordonnes.bottom - lCoordonnes.top,
				};
			} else {
				lPlaceDebutCours = this.getPlaceDebutCours(aCours);
				lPlaceFinCours = this.getPlaceFinCours(aCours);
				lCoordonnes = this.grille.getCoordonneesDePlace(lPlaceDebutCours);
				lTailles = this.grille.getTaillesDePositionGrille({
					nbHoraires: lPlaceFinCours - lPlaceDebutCours + 1,
				});
				lCoordonnes.left += -1;
				lCoordonnes.top += -1;
				lTailles.width += 1;
				lTailles.height += 1;
			}
			if (aCours.estCoursMS && aCours._ecartCoursMS) {
				if (this.params.grilleInverse) {
					lTailles.height -= aCours._ecartCoursMS;
					lCoordonnes.top += aCours._ecartCoursMS;
				} else {
					lTailles.width -= aCours._ecartCoursMS;
					lCoordonnes.left += aCours._ecartCoursMS;
				}
			} else if (aCours.coursMultiple) {
				this._actualiserCoursMultiple(
					aIndice,
					aCours,
					this.params.grilleInverse ? lTailles.width : lTailles.height,
				);
			}
			ObjetPosition_1.GPosition.setPosition(
				lNode,
				lCoordonnes.left,
				lCoordonnes.top,
			);
			ObjetPosition_1.GPosition.setTaille(
				lNode,
				lTailles.width,
				lTailles.height,
			);
			this._actualiserImagesCours(
				ObjetHtml_1.GHtml.getElement(this.getIdInterneCours(aIndice)),
				aCours,
				aIndice,
				lTailles.height,
				lTailles.width,
			);
			if (this.params.selection.contains(aIndice)) {
				lTailles.height -= this._ecartSelection() * 2;
				lTailles.width -= this._ecartSelection() * 2;
			}
			const lBordureConteneurNode = 2;
			lTailles.height -=
				this.params.paddingContenuCoursTop +
				this.params.paddingContenuCoursBottom +
				lCadreCours.top +
				lCadreCours.bottom +
				lBordureConteneurNode;
			lTailles.width -=
				this.params.paddingContenuCoursLeft +
				this.params.paddingContenuCoursRight +
				lCadreCours.left +
				lCadreCours.right +
				lBordureConteneurNode;
			const lDebuCourstHorsGrille = this.getPlaceCoursHorsGrille(aCours, true);
			const lFinCoursHorsGrille = this.getPlaceCoursHorsGrille(aCours, false);
			if (lDebuCourstHorsGrille || lFinCoursHorsGrille) {
				const lDecalage =
					((lDebuCourstHorsGrille ? 1 : 0) + (lFinCoursHorsGrille ? 1 : 0)) *
					this.params.largeurBordureHorsGrille;
				if (this.params.grilleInverse) {
					lTailles.width -= lDecalage;
				} else {
					lTailles.height -= lDecalage;
				}
			}
			this.actualiserContenuCours({
				visible: true,
				indiceCours: aIndice,
				width: lTailles.width,
				height: lTailles.height,
			});
		}
	}
	composeCoursMS(I) {
		const H = [];
		H.push(
			'<div class="Table Cours ',
			this.params.classCoursMS,
			'"',
			' style="' +
				ObjetStyle_2.GStyle.composeCouleurFond(this.params.couleurFondCoursMS) +
				'">',
			'<div id="' + this._getIdElementSlider(I) + '"',
			ObjetHtml_1.GHtml.composeAttr("ie-node", "moduleCours.getNodeSlider", I),
			' class="AvecMain cours-multiple-slider',
			this.params.grilleInverse ? " NoWrap" : "",
			'"',
			' style="',
			this.params.grilleInverse ? "width:100%;" : "height:100%;",
			ObjetStyle_2.GStyle.composeCouleurFond(this.params.couleurFondSlider),
			ObjetStyle_2.GStyle.composeCouleurBordure(
				this.params.couleurBordureCours,
				1,
				this.params.grilleInverse
					? ObjetStyle_1.EGenreBordure.bas
					: ObjetStyle_1.EGenreBordure.droite,
			),
			'"></div>',
			"</div>",
		);
		return H.join("");
	}
	_composeCadreSelection() {
		const H = [];
		H.push('<div class="selectionCoursGrille">');
		const lTaille = this._getTailleSelonCellule();
		if (this.params.cadreSelection.tailleExterne > 0) {
			H.push(
				'<div class="cadre" style="',
				ObjetStyle_2.GStyle.composeCouleurBordure(
					this.params.cadreSelection.couleurInterne,
					this.params.cadreSelection.tailleExterne,
				),
				'">',
			);
		}
		H.push(
			'<div class="cadre" style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				this.params.cadreSelection.couleur,
				lTaille,
			),
			'">',
		);
		H.push(
			'<div class="cadre" style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				this.params.cadreSelection.couleurInterne,
				this.params.cadreSelection.tailleInterne,
			),
			'"></div>',
		);
		H.push("</div>");
		if (this.params.cadreSelection.tailleExterne > 0) {
			H.push("</div>");
		}
		H.push("</div>");
		return H.join("");
	}
	composeCourssimple(I, aCours) {
		const H = [];
		const lCadreCours = this.getCadreCours(aCours);
		const lDebutCoursHorsGrille = this.getPlaceCoursHorsGrille(aCours, true);
		const lFinCoursHorsGrille = this.getPlaceCoursHorsGrille(aCours, false);
		H.push(
			'<div class="cours-simple" id="',
			this.getIdInterneCours(I),
			'" ',
			ObjetHtml_1.GHtml.composeAttr(
				this.params.coursAvecIEHint ? "ie-hint" : "ie-title",
				"moduleCours.getHintCours",
				I,
			),
			">",
		);
		if (lDebutCoursHorsGrille || lFinCoursHorsGrille) {
			H.push(
				'<div class="Cours" style="',
				ObjetStyle_2.GStyle.composeCouleurFond("white"),
				lDebutCoursHorsGrille
					? "border-" +
							(this.params.grilleInverse ? "left" : "top") +
							"-style:dashed; border-" +
							(this.params.grilleInverse ? "left" : "top") +
							"-color:black;"
					: "",
				lFinCoursHorsGrille
					? "border-" +
							(this.params.grilleInverse ? "right" : "bottom") +
							"-style:dashed; border-" +
							(this.params.grilleInverse ? "right" : "bottom") +
							"-color:black;"
					: "",
				"border-width:",
				this.params.largeurBordureHorsGrille,
				'px;"',
				">",
			);
		}
		H.push(
			'<table role="presentation" class="Cours ',
			this.params.tailleTexteCours
				? " Texte" + this.params.tailleTexteCours
				: "",
			'" style="',
			ObjetStyle_2.GStyle.composeCouleurFond(lCadreCours.couleurFond),
			lCadreCours.left > 0
				? "border-width:" +
						lCadreCours.top +
						"px " +
						lCadreCours.right +
						"px " +
						lCadreCours.bottom +
						"px " +
						lCadreCours.left +
						"px; border-style:solid; border-color:" +
						lCadreCours.couleurBordure
				: "border:0",
			'">',
		);
		H.push(this.composeEnteteCours(I, aCours));
		H.push(
			'<tr><td  id="',
			this.getIdContenu(I),
			'"',
			' style="padding:',
			this.params.paddingContenuCoursTop + "px ",
			this.params.paddingContenuCoursRight,
			"px ",
			this.params.paddingContenuCoursBottom,
			"px ",
			this.params.paddingContenuCoursLeft,
			"px;",
			'">',
		);
		H.push("</td></tr>");
		H.push("</table>");
		if (lDebutCoursHorsGrille || lFinCoursHorsGrille) {
			H.push("</div>");
		}
		const lHtmlDecorateur = this.construireDecorateurCours(aCours, I);
		if (lHtmlDecorateur) {
			H.push(lHtmlDecorateur);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeCours(aCours, I) {
		if (aCours.coursMultiple) {
			return this.composeCoursMS(I);
		}
		return this.composeCourssimple(I, aCours);
	}
	_getIndiceCoursOrigineDeCoursSuperpose(aCoursSuperpose) {
		if (!aCoursSuperpose) {
			return -1;
		}
		return aCoursSuperpose.coursOrigine
			? this.params.listeCours
					.getTabListeElements()
					.indexOf(aCoursSuperpose.coursOrigine)
			: aCoursSuperpose.indiceCoursOrigine;
	}
}
exports.ObjetGrilleCours = ObjetGrilleCours;
(function (ObjetGrilleCours) {
	let positionImage;
	(function (positionImage) {
		positionImage["hautG"] = "hautG";
		positionImage["hautD"] = "hautD";
		positionImage["basG"] = "basG";
		positionImage["basD"] = "basD";
		positionImage["centreH"] = "centreH";
		positionImage["centreB"] = "centreB";
	})(
		(positionImage =
			ObjetGrilleCours.positionImage || (ObjetGrilleCours.positionImage = {})),
	);
})(ObjetGrilleCours || (exports.ObjetGrilleCours = ObjetGrilleCours = {}));
const uCacheLargeurImage = {};
