exports.ObjetGrilleGabarit = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetHint_1 = require("ObjetHint");
const ObjetSupport_1 = require("ObjetSupport");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
var ActionGabaritGrille;
(function (ActionGabaritGrille) {
	ActionGabaritGrille[(ActionGabaritGrille["creation"] = 1)] = "creation";
	ActionGabaritGrille[(ActionGabaritGrille["deplacement"] = 2)] = "deplacement";
	ActionGabaritGrille[(ActionGabaritGrille["retaillagDebut"] = 3)] =
		"retaillagDebut";
	ActionGabaritGrille[(ActionGabaritGrille["retaillageFin"] = 4)] =
		"retaillageFin";
})(ActionGabaritGrille || (ActionGabaritGrille = {}));
class ObjetGrilleGabarit {
	constructor(aOptions) {
		this.estGabarit = true;
		this.options = {
			grille: null,
			callbackPositionner: null,
			callbackFinCreation: null,
			callbackCreation: null,
			callbackDoubleClic: null,
			callbackDeplacement: null,
			callbackFinDeplacement: null,
			delaiCallbackGabarit: 100,
			callbackModificationTaille: null,
			callbackMenuContextuel: null,
			deplacementAutorise: null,
			avecDeplacement: true,
			avecRetaillageHoraire: true,
			avecModificationCreation: true,
			surVider: null,
			surMiseAJour: null,
			gabaritMonoTranche: true,
			gabaritMonoBlocHoraire: true,
			interdictionDeplacementTranche: false,
			acceptePositionnementHorsGrille: false,
			modeCreationSaisieParHoraire: false,
			idConteneur: "",
			idGabarit: GUID_1.GUID.getId(),
			zIndex: 4,
			tailleTrait: 3,
			tailleTraitMax: 0,
			styleTrait: "solid",
			couleurTrait: "red",
			couleurBordure: GCouleur.blanc,
			tailleBordureInterne: 1,
			tailleBordureExterne: 1,
			ecartBord: 0,
			class: "Curseur_DoubleClick",
			hint: "",
			getHint: null,
			getHintHtml: null,
			avecScrollSurGrille: true,
			timeoutScroll: 70,
		};
		this.setOptions(aOptions);
		this.init();
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
		return this;
	}
	init() {
		this.placeDebut = -1;
		this.placeFin = -1;
		clearTimeout(this.timeoutDeplacement);
		this.visible = false;
	}
	vider() {
		this.init();
		this.options.grille.$refreshSelf();
		this._supprimerEventsGabarit();
		ObjetHtml_1.GHtml.setHtml(this._getIdConteneur(), "");
		if (this.options.surVider) {
			this.options.surVider(this);
		}
	}
	get idGabarit() {
		return this.options.idGabarit;
	}
	get placeDebut() {
		return this._placeDebut;
	}
	set placeDebut(aValue) {
		this.placeDebut_prec = this._placeDebut;
		this._placeDebut = aValue;
	}
	get placeFin() {
		return this._placeFin;
	}
	set placeFin(aValue) {
		this.placeFin_prec = this._placeFin;
		this._placeFin = aValue;
	}
	getDuree() {
		return this.placeFin - this.placeDebut + 1;
	}
	getPlacesCouvertes() {
		const lPlaces = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		const lTHDebut = this.options.grille.getTrancheHoraireDePlace(
			this.placeDebut,
		);
		const lTHFin = this.options.grille.getTrancheHoraireDePlace(this.placeFin);
		let lTranche;
		let lHoraire;
		for (
			lTranche = Math.min(lTHDebut.tranche, lTHFin.tranche);
			lTranche <= Math.max(lTHDebut.tranche, lTHFin.tranche);
			lTranche++
		) {
			for (
				lHoraire = Math.min(lTHDebut.horaire, lTHFin.horaire);
				lHoraire <= Math.max(lTHDebut.horaire, lTHFin.horaire);
				lHoraire++
			) {
				lPlaces.add(
					this.options.grille.getPlaceDeTrancheHoraire({
						tranche: lTranche,
						horaire: lHoraire,
					}),
				);
			}
		}
		return lPlaces;
	}
	miseAJour() {
		if (this.options.surMiseAJour) {
			this.options.surMiseAJour(this);
		} else {
			this.vider();
		}
	}
	demarrerCreation(aParam) {
		const lParam = Object.assign(
			{
				place: -1,
				placeFin: -1,
				event: null,
				deplacementMinPourAffichage: 0,
				hintInterruptionCreation: null,
				avecInterruptionApresDeplacement: false,
			},
			aParam,
		);
		this.init();
		if (lParam.place < 0) {
			return false;
		}
		const lFinaliserCreation =
			lParam.event && lParam.event.type === "ie-pointerdownlong";
		this.placeDebutCreation = lParam.place;
		this.placeDebut = lParam.place;
		this.placeFin = lParam.placeFin < 0 ? lParam.place : lParam.placeFin;
		if (this.placeDebut > this.placeFin) {
			this.vider();
			return;
		}
		if (!lFinaliserCreation) {
			if (this.options.avecModificationCreation) {
				this._ajouterEventsGabarit({
					ordre: ActionGabaritGrille.creation,
					placeDebutOrigine: lParam.place,
					deplacementMinPourAffichage: lParam.deplacementMinPourAffichage,
					positionDepart: lParam.event
						? { x: lParam.event.pageX, y: lParam.event.pageY }
						: null,
					hintInterruptionCreation: lParam.hintInterruptionCreation,
				});
			}
		}
		if (!lParam.deplacementMinPourAffichage || !lParam.event) {
			this.visible = true;
			this._positionnerGabarit();
			const lPlacesAffect = [];
			for (let lIPlace = this.placeDebut; lIPlace <= this.placeFin; lIPlace++) {
				lPlacesAffect.push(lIPlace);
			}
			const lParamsGabarit = this._getParamsCallback();
			if (this.options.callbackCreation) {
				this.options.callbackCreation(lParamsGabarit);
			}
			if (lFinaliserCreation) {
				this._callbackFinCreation(lParamsGabarit);
			}
		}
		return true;
	}
	afficher() {
		if (!this.visible) {
			return;
		}
		this._positionnerGabarit();
	}
	_getIdConteneur() {
		return this.options.idConteneur || this.options.grille.idGabaritGrille;
	}
	_gererScrollDeplacementGabarit() {
		if (!this.options.avecScrollSurGrille) {
			return;
		}
		if (!this.options.grille) {
			return;
		}
		if (!this.visible) {
			return;
		}
		clearTimeout(this._timeoutScroll);
		this._timeoutScroll = setTimeout(() => {
			const lDom = ObjetHtml_1.GHtml.getElement(this.options.idGabarit);
			this.options.grille.scrollToHTMLElement(lDom);
		}, this.options.timeoutScroll);
	}
	_controlerBlocHoraire(
		aTrancheHoraire,
		aTrancheHoraireOrigine,
		aBlocHoraires,
	) {
		const lBlocOrigine = aBlocHoraires.rechercheHoraire(
				aTrancheHoraireOrigine.horaire,
			),
			lBlocCourant = aBlocHoraires.rechercheHoraire(aTrancheHoraire.horaire);
		if (lBlocCourant.indiceBloc > lBlocOrigine.indiceBloc) {
			aTrancheHoraire.horaire = lBlocOrigine.fin;
		} else if (lBlocCourant.indiceBloc < lBlocOrigine.indiceBloc) {
			aTrancheHoraire.horaire = lBlocOrigine.debut;
		}
		aTrancheHoraire.horaire = this.options.grille.numeroHoraireGranularite(
			aTrancheHoraire.horaire,
		);
	}
	_avecInterruptionCreation(aCommande, aTrancheHoraire) {
		if (aCommande && aCommande.hintInterruptionCreation) {
			const lHint = aCommande.hintInterruptionCreation(
				this.options.grille.getPlaceDeTrancheHoraire(aTrancheHoraire),
			);
			if (lHint) {
				const lIEHint = ObjetHint_1.ObjetHint.start(lHint, { sansDelai: true });
				$(document).on("mouseup.hintInterruption_ObjetGrilleGabarit", () => {
					ObjetHint_1.ObjetHint.stop(lIEHint);
					$(document).off("mouseup.hintInterruption_ObjetGrilleGabarit");
				});
				this.vider();
				return true;
			}
		}
		return false;
	}
	_getParamsCallback() {
		const lPlacesPrecedentes = [];
		const lPlacesCourantes = [];
		for (let lIPlace = this.placeDebut; lIPlace <= this.placeFin; lIPlace++) {
			lPlacesCourantes.push(lIPlace);
		}
		if (this.placeDebut_prec >= 0) {
			for (
				let lIPlace = this.placeDebut_prec;
				lIPlace <= this.placeFin_prec;
				lIPlace++
			) {
				lPlacesPrecedentes.push(lIPlace);
			}
		}
		return Object.assign({
			gabarit: this,
			id: this.options.idGabarit,
			place: this.placeDebut,
			duree: this.getDuree(),
			placeDebut_prec: this.placeDebut_prec,
			placeFin_prec: this.placeFin_prec,
			placesPrecedentes: lPlacesPrecedentes,
			placesCourantes: lPlacesCourantes,
		});
	}
	_traiterPointerMove(aEvent, aCommande) {
		let lPlace;
		const lTrancheHoraire = this.options.grille.getTrancheHoraireDePosition(
			this.options.grille.getPositionGrilleEvent(aEvent),
		);
		const lBlocHoraires = this.options.grille.getOptions().blocHoraires;
		const lHoraire = lBlocHoraires.rechercheHoraire(lTrancheHoraire.horaire);
		let lTrancheHoraireOrigineGabarit;
		let lDuree;
		switch (aCommande.ordre) {
			case ActionGabaritGrille.retaillageFin:
				lTrancheHoraireOrigineGabarit =
					this.options.grille.getTrancheHoraireDePlace(this.placeDebut);
				lTrancheHoraire.horaire = Math.borner(
					lTrancheHoraire.horaire,
					lTrancheHoraireOrigineGabarit.horaire,
					lHoraire.fin,
				);
				if (this.options.gabaritMonoBlocHoraire) {
					this._controlerBlocHoraire(
						lTrancheHoraire,
						lTrancheHoraireOrigineGabarit,
						lBlocHoraires,
					);
				}
				lDuree =
					lTrancheHoraire.horaire - lTrancheHoraireOrigineGabarit.horaire + 1;
				if (lDuree !== this.getDuree()) {
					this.placeFin = this.placeDebut + lDuree - 1;
					this._positionnerGabarit();
				}
				break;
			case ActionGabaritGrille.retaillagDebut: {
				lTrancheHoraireOrigineGabarit =
					this.options.grille.getTrancheHoraireDePlace(this.placeDebut);
				lTrancheHoraire.horaire = Math.max(
					lTrancheHoraire.horaire,
					lHoraire.debut,
				);
				if (this.options.gabaritMonoBlocHoraire) {
					this._controlerBlocHoraire(
						lTrancheHoraire,
						lTrancheHoraireOrigineGabarit,
						lBlocHoraires,
					);
				}
				const lTHGabarit = {
					tranche: lTrancheHoraireOrigineGabarit.tranche,
					horaire: Math.min(
						lTrancheHoraire.horaire,
						lTrancheHoraireOrigineGabarit.horaire +
							this.placeFin -
							this.placeDebut,
					),
				};
				lPlace = this.options.grille.getPlaceDeTrancheHoraire(lTHGabarit);
				if (lPlace !== this.placeDebut) {
					this.placeDebut = lPlace;
					this._positionnerGabarit();
				}
				break;
			}
			case ActionGabaritGrille.deplacement:
				lDuree = this.getDuree();
				lTrancheHoraire.horaire = Math.borner(
					lTrancheHoraire.horaire - aCommande.decalagePlace,
					lHoraire.debut,
					lHoraire.fin - lDuree + 1,
				);
				for (
					let lIHoraire = lTrancheHoraire.horaire;
					lIHoraire < lTrancheHoraire.horaire + lDuree - 1;
					lIHoraire++
				) {
					if (lBlocHoraires.rechercheHoraire(lIHoraire).tailleGouttiere > 0) {
						lTrancheHoraire.horaire = lIHoraire + 1;
						break;
					}
				}
				lTrancheHoraire.horaire = this.options.grille.numeroHoraireGranularite(
					lTrancheHoraire.horaire,
				);
				if (this.options.interdictionDeplacementTranche) {
					lTrancheHoraire.tranche =
						this.options.grille.getTrancheHoraireDePlace(
							this.placeDebut,
						).tranche;
				}
				lPlace = this.options.grille.getPlaceDeTrancheHoraire(lTrancheHoraire);
				if (lPlace !== this.placeDebut) {
					if (
						MethodesObjet_1.MethodesObjet.isFunction(
							this.options.deplacementAutorise,
						) &&
						this.options.deplacementAutorise({
							gabarit: this,
							place: lPlace,
							duree: this.getDuree(),
							id: this.options.idGabarit,
						}) === false
					) {
						return;
					}
					this.placeDebut = lPlace;
					this.placeFin = this.placeDebut + lDuree - 1;
					this._positionnerGabarit();
					if (this.timeoutDeplacement) {
						clearTimeout(this.timeoutDeplacement);
						delete this.timeoutDeplacement;
					}
					if (this.options.callbackDeplacement) {
						const lParams = this._getParamsCallback();
						if (this.options.delaiCallbackGabarit > 0) {
							this.timeoutDeplacement = setTimeout(
								this.options.callbackDeplacement.bind(null, lParams),
								this.options.delaiCallbackGabarit,
							);
						} else {
							this.options.callbackDeplacement(lParams);
						}
					}
				}
				break;
			case ActionGabaritGrille.creation: {
				lTrancheHoraireOrigineGabarit =
					this.options.grille.getTrancheHoraireDePlace(
						aCommande.placeDebutOrigine,
					);
				if (this.options.gabaritMonoBlocHoraire) {
					this._controlerBlocHoraire(
						lTrancheHoraire,
						lTrancheHoraireOrigineGabarit,
						lBlocHoraires,
					);
				}
				if (this.options.gabaritMonoTranche) {
					lTrancheHoraire.tranche = lTrancheHoraireOrigineGabarit.tranche;
				}
				if (
					!aCommande.avecInterruptionApresDeplacement &&
					this._avecInterruptionCreation(aCommande, lTrancheHoraire)
				) {
					return;
				}
				if (
					!this.visible &&
					aCommande.deplacementMinPourAffichage &&
					aCommande.positionDepart &&
					aCommande.deplacementMinPourAffichage >
						Math.abs(aCommande.positionDepart.x - aEvent.pageX) &&
					aCommande.deplacementMinPourAffichage >
						Math.abs(aCommande.positionDepart.y - aEvent.pageY)
				) {
					return;
				}
				if (
					aCommande.avecInterruptionApresDeplacement &&
					this._avecInterruptionCreation(aCommande, lTrancheHoraire)
				) {
					return;
				}
				const lAncienVisible = this.visible;
				this.visible = true;
				let lHoraireDebut = Math.min(
					lTrancheHoraire.horaire,
					lTrancheHoraireOrigineGabarit.horaire,
				);
				let lHoraireFin = Math.max(
					lTrancheHoraire.horaire,
					lTrancheHoraireOrigineGabarit.horaire,
				);
				if (this.options.modeCreationSaisieParHoraire) {
					if (lTrancheHoraireOrigineGabarit.tranche < lTrancheHoraire.tranche) {
						lHoraireDebut = lTrancheHoraireOrigineGabarit.horaire;
						lHoraireFin = lTrancheHoraire.horaire;
					} else if (
						lTrancheHoraireOrigineGabarit.tranche > lTrancheHoraire.tranche
					) {
						lHoraireDebut = lTrancheHoraire.horaire;
						lHoraireFin = lTrancheHoraireOrigineGabarit.horaire;
					}
				}
				const lPlaceDebut = this.options.grille.getPlaceDeTrancheHoraire({
						tranche: Math.min(
							lTrancheHoraire.tranche,
							lTrancheHoraireOrigineGabarit.tranche,
						),
						horaire: lHoraireDebut,
					}),
					lPlaceFin = this.options.grille.getPlaceDeTrancheHoraire({
						tranche: Math.max(
							lTrancheHoraire.tranche,
							lTrancheHoraireOrigineGabarit.tranche,
						),
						horaire: lHoraireFin,
					});
				if (
					this.placeDebut !== lPlaceDebut ||
					this.placeFin !== lPlaceFin ||
					lAncienVisible !== this.visible
				) {
					this.placeDebut = lPlaceDebut;
					this.placeFin = lPlaceFin;
					this._positionnerGabarit();
					if (this.options.callbackCreation) {
						this.options.callbackCreation(this._getParamsCallback());
					}
				}
				break;
			}
			default:
		}
	}
	_supprimerEventsGabarit() {
		$(document).off(
			"pointermove.ObjetGrilleGabarit pointerup.ObjetGrilleGabarit",
		);
	}
	_callbackFinCreation(aParam) {
		if (this.options.callbackFinCreation) {
			const lPromise = this.options.callbackFinCreation(aParam);
			if (lPromise && lPromise.catch) {
				lPromise.catch((aMessage) => {
					IE.log.addLog("Interruption creation : " + aMessage);
					this.vider();
				});
			}
		}
	}
	_traiterPointerUp(aCommande) {
		const lParam = this._getParamsCallback();
		switch (aCommande.ordre) {
			case ActionGabaritGrille.creation:
				if (this.visible === true) {
					this._callbackFinCreation(lParam);
				}
				break;
			case ActionGabaritGrille.retaillagDebut:
			case ActionGabaritGrille.retaillageFin:
				if (
					this.options.callbackModificationTaille &&
					(this.placeDebut !== aCommande.placeOrigine ||
						this.placeFin !== aCommande.placeFinOrigine)
				) {
					this.options.callbackModificationTaille(lParam);
				}
				break;
			case ActionGabaritGrille.deplacement:
				if (this.visible === true && this.options.callbackFinDeplacement) {
					this.options.callbackFinDeplacement(lParam);
				}
				break;
			default:
		}
		this._supprimerEventsGabarit();
	}
	_ajouterEventsGabarit(aCommande) {
		this._supprimerEventsGabarit();
		const lThis = this;
		$(document).on({
			"pointermove.ObjetGrilleGabarit": function (aEvent) {
				lThis._traiterPointerMove(aEvent, aCommande);
			},
			"pointerup.ObjetGrilleGabarit": function () {
				lThis._traiterPointerUp(aCommande);
			},
		});
	}
	_getTailleTrait() {
		if (this.options.tailleTraitMax > 0) {
			const lTailleBordures =
				this.options.tailleBordureExterne + this.options.tailleBordureInterne;
			return (
				this.options.grille.getTailleSelonCellule({
					tailleMax: this.options.tailleTraitMax + lTailleBordures,
					tailleMin: 1 + lTailleBordures,
				}) - lTailleBordures
			);
		}
		return this.options.tailleTrait;
	}
	_positionnerGabarit() {
		if (!this.visible) {
			return;
		}
		if (
			$("#" + this._getIdConteneur().escapeJQ()).find(
				"#" + this.options.idGabarit,
			).length === 0
		) {
			this._construire();
		}
		const lCoordsPlaceDebut = this.options.grille.getCoordonneesDePlace(
				this.placeDebut,
				this.options.acceptePositionnementHorsGrille,
			),
			lCoordsPlaceFin = this.options.grille.getCoordonneesDePlace(
				this.placeFin,
				this.options.acceptePositionnementHorsGrille,
			);
		if (lCoordsPlaceDebut.erreur || lCoordsPlaceFin.erreur) {
			return;
		}
		const lEcart = this.options.ecartBord || 0;
		const lCoords = {
			left: Math.min(lCoordsPlaceDebut.left, lCoordsPlaceFin.left) + lEcart,
			top: Math.min(lCoordsPlaceDebut.top, lCoordsPlaceFin.top) + lEcart,
			bottom:
				Math.max(lCoordsPlaceDebut.bottom, lCoordsPlaceFin.bottom) - lEcart,
			right: Math.max(lCoordsPlaceDebut.right, lCoordsPlaceFin.right) - lEcart,
		};
		$("#" + this.options.idGabarit.escapeJQ()).css({
			left: lCoords.left + "px",
			top: lCoords.top + "px",
			width: lCoords.right - lCoords.left + "px",
			height: lCoords.bottom - lCoords.top + "px",
		});
		if (this.options.avecScrollSurGrille) {
			this._gererScrollDeplacementGabarit();
		}
		if (this.options.callbackPositionner) {
			this.options.callbackPositionner(this._getParamsCallback());
		}
		this.options.grille.$refreshSelf();
	}
	_construire() {
		const lThis = this;
		const lControleur = {
			gabarit: {
				surNodeDebut: function () {
					$(this.node).on({
						pointerdown: function () {
							lThis._ajouterEventsGabarit({
								ordre: ActionGabaritGrille.retaillagDebut,
								placeDebutOrigine: lThis.placeDebut,
								placeFinOrigine: lThis.placeFin,
							});
						},
					});
				},
				surNodeCentre: function () {
					$(this.node).on({
						pointerdown: function (aEvent) {
							const lPosition =
									lThis.options.grille.getPositionGrilleEvent(aEvent),
								lPlaceOrigine =
									lThis.options.grille.getPlaceDePosition(lPosition);
							lThis._ajouterEventsGabarit({
								ordre: ActionGabaritGrille.deplacement,
								decalagePlace: lPlaceOrigine - lThis.placeDebut,
							});
						},
						contextmenu: function (event) {
							if (lThis.options.callbackMenuContextuel) {
								lThis.options.callbackMenuContextuel(
									lThis._getParamsCallback(),
								);
							}
						},
						dblclick: function () {
							if (lThis.options.callbackDoubleClic) {
								lThis.options.callbackDoubleClic(lThis._getParamsCallback());
							}
						},
					});
				},
				surNodeFin: function () {
					$(this.node).on({
						pointerdown: function () {
							lThis._ajouterEventsGabarit({
								ordre: ActionGabaritGrille.retaillageFin,
								placeOrigine: lThis.placeDebut,
								placeFinOrigine: lThis.placeFin,
							});
						},
					});
				},
				getHintHtml: function (aHint) {
					if (lThis.options.getHintHtml && (!aHint || !aHint.hintTouch)) {
						return lThis.options.getHintHtml(lThis);
					}
					return "";
				},
			},
		};
		const T = [],
			lTailleTrait = this._getTailleTrait();
		const lZIndex = this.options.zIndex,
			lGrilleInverse = this.options.grille.getOptions().grilleInverse,
			lTrait = lTailleTrait,
			lTraitResize = this.options.avecRetaillageHoraire
				? lTailleTrait +
					this.options.tailleBordureExterne +
					this.options.tailleBordureInterne
				: 0,
			lClassResize = lGrilleInverse
				? "AvecResizeHorizontal"
				: "AvecResizeVertical",
			lTailleOreilles = 10,
			lHint = MethodesObjet_1.MethodesObjet.isFunction(this.options.getHint)
				? this.options.getHint(this)
				: this.options.hint;
		T.push(
			'<div id="',
			this.options.idGabarit,
			'" class="',
			this.options.class || "",
			' SansSelectionTexte ie-draggable-handle"',
			' style="position:absolute; z-index:' +
				lZIndex +
				'; font-size:1px; width:auto; height:auto;"',
			MethodesObjet_1.MethodesObjet.isFunction(this.options.getHintHtml)
				? ObjetHtml_1.GHtml.composeAttr("ie-hint", "gabarit.getHintHtml")
				: "",
			lHint ? ObjetHtml_1.GHtml.composeAttr("title", lHint) : "",
			">",
		);
		if (this.options.tailleBordureExterne > 0) {
			T.push(
				'<div style="position:absolute;top:0; left:0; right:0; bottom:0;',
				ObjetStyle_1.GStyle.composeCouleurBordure(
					this.options.couleurBordure,
					this.options.tailleBordureExterne,
				),
				'">',
			);
		}
		T.push(
			'<div style="position:absolute;top:0; left:0; right:0; bottom:0;',
			ObjetStyle_1.GStyle.composeCouleurBordure(
				this.options.couleurTrait,
				lTrait,
				0,
				this.options.styleTrait,
			),
			'">',
		);
		if (this.options.tailleBordureInterne > 0) {
			T.push(
				'<div style="position:absolute;top:0; left:0; right:0; bottom:0;',
				ObjetStyle_1.GStyle.composeCouleurBordure(
					this.options.couleurBordure,
					this.options.tailleBordureInterne,
				),
				'">',
			);
		}
		if (this.options.avecDeplacement) {
			T.push(
				'<div class="',
				this.options.class || "",
				'" style="position:absolute;top:0; left:0; right:0; bottom:0;"',
				' ie-node="gabarit.surNodeCentre">',
				'<table class="Table" style="font-size:1px;',
				ObjetStyle_1.GStyle.composeOpacite(0),
				'"><tr><td></td></tr></table>',
				"</div>",
			);
		}
		T.push("</div>");
		if (this.options.tailleBordureExterne > 0) {
			T.push("</div>");
		}
		if (this.options.tailleBordureInterne > 0) {
			T.push("</div>");
		}
		if (ObjetSupport_1.Support.tactile && this.options.avecRetaillageHoraire) {
			T.push(
				'<div class="',
				lClassResize,
				'" style="position:absolute;z-index:1;',
				lGrilleInverse
					? "height:33%;top:33%;left:-" +
							(lTailleOreilles - this.options.tailleBordureExterne) +
							"px;border-radius:5px 0 0 5px;"
					: "width:33%;left:33%;top:-" +
							(lTailleOreilles - this.options.tailleBordureExterne) +
							"px;border-radius:5px 5px 0 0;",
				lGrilleInverse
					? ObjetStyle_1.GStyle.composeWidth(lTailleOreilles)
					: ObjetStyle_1.GStyle.composeHeight(lTailleOreilles),
				ObjetStyle_1.GStyle.composeCouleurFond(this.options.couleurTrait),
				'"',
				' ie-node="gabarit.surNodeDebut"></div>',
			);
			T.push(
				'<div class="',
				lClassResize,
				'" style="position:absolute;z-index:1;',
				lGrilleInverse
					? "height:33%;top:33%;right:-" +
							(lTailleOreilles - this.options.tailleBordureExterne) +
							"px;border-radius:0 5px 5px 0;"
					: "width:33%;left:33%;bottom:-" +
							(lTailleOreilles - this.options.tailleBordureExterne) +
							"px;border-radius:0 0 5px 5px;",
				lGrilleInverse
					? ObjetStyle_1.GStyle.composeWidth(lTailleOreilles)
					: ObjetStyle_1.GStyle.composeHeight(lTailleOreilles),
				ObjetStyle_1.GStyle.composeCouleurFond(this.options.couleurTrait),
				'"',
				' ie-node="gabarit.surNodeFin"></div>',
			);
		}
		if (this.options.avecRetaillageHoraire) {
			T.push(
				'<div class="',
				lClassResize,
				'" style="position:absolute;z-index:1;',
				lGrilleInverse ? "top:0;left:0;bottom:0;" : "top:0;left:0;right:0;",
				lGrilleInverse
					? ObjetStyle_1.GStyle.composeWidth(lTraitResize)
					: ObjetStyle_1.GStyle.composeHeight(lTraitResize),
				'"',
				' ie-node="gabarit.surNodeDebut"></div>',
			);
		}
		if (this.options.avecRetaillageHoraire) {
			T.push(
				'<div class="',
				lClassResize,
				'" style="position:absolute;z-index:1;',
				lGrilleInverse ? "top:0;right:0;bottom:0;" : "bottom:0;left:0;right:0;",
				lGrilleInverse
					? ObjetStyle_1.GStyle.composeWidth(lTraitResize)
					: ObjetStyle_1.GStyle.composeHeight(lTraitResize),
				'"',
				' ie-node="gabarit.surNodeFin"></div>',
			);
		}
		T.push("</div>");
		ObjetHtml_1.GHtml.setHtml(this._getIdConteneur(), T.join(""), {
			controleur: lControleur,
			ignorerScroll: true,
		});
	}
}
exports.ObjetGrilleGabarit = ObjetGrilleGabarit;
