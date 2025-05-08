const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { TypeGenreChoixDOrientation } = require("TypeGenreChoixDOrientation.js");
const { Type3Etats } = require("Type3Etats.js");
const { Toast, ETypeToast } = require("Toast.js");
const { tag } = require("tag.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const EGenreEvnt = {
	orientation: 1,
	specialite: 2,
	option: 3,
	actualiser: 4,
	supprimer: 5,
	lv1: 6,
	lv2: 7,
	lvautre: 8,
};
const EGenreVoeux = { intention: 0, definitif: 1 };
const EModeAffichage = { saisie: 0, consultation: 1, simplifie: 2 };
const EGenreLangueOption = { LV1: "lv1", LV2: "lv2", LVAutres: "options" };
function TUtilitaireOrientation(aParam) {
	this.donnees = aParam.donnees;
	this.maquette = aParam.maquette;
}
TUtilitaireOrientation.getControleurGeneral = function (aInstance) {
	return {
		btnSelecteurLanguesOptions: {
			event(aGenre) {
				const lRubrique = aInstance.rubriqueLV;
				let lGenreEvent;
				switch (aGenre) {
					case EGenreLangueOption.LV1:
						lGenreEvent = EGenreEvnt.lv1;
						break;
					case EGenreLangueOption.LV2:
						lGenreEvent = EGenreEvnt.lv2;
						break;
					case EGenreLangueOption.LVAutres:
						lGenreEvent = EGenreEvnt.lvautre;
						break;
					default: {
						return;
					}
				}
				if (aGenre === EGenreLangueOption.LVAutres) {
					if (
						lRubrique &&
						lRubrique.LVAutres &&
						lRubrique.LVAutres.count() >=
							lRubrique.maquette.nombreEnseignementOptionnel
					) {
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Information,
							message: GTraductions.getValeur(
								"Orientation.Options.AjoutImpossible",
							),
						});
						return;
					}
				}
				aInstance._surEvntInput(lRubrique, { genreEvent: lGenreEvent });
			},
			getLibelle(aGenre) {
				if (aInstance.rubriqueLV) {
					const lRubriqueLV = aInstance.rubriqueLV;
					const lHtml = [];
					switch (aGenre) {
						case EGenreLangueOption.LV1:
							if (lRubriqueLV.LV1 && lRubriqueLV.LV1.existeNumero()) {
								lHtml.push(
									tag(
										"ie-chips",
										{ "ie-model": tag.funcAttr("chipsLangue", [aGenre]) },
										lRubriqueLV.LV1.getLibelle(),
									),
								);
							}
							break;
						case EGenreLangueOption.LV2:
							if (lRubriqueLV.LV2 && lRubriqueLV.LV2.existeNumero()) {
								lHtml.push(
									tag(
										"ie-chips",
										{ "ie-model": tag.funcAttr("chipsLangue", [aGenre]) },
										lRubriqueLV.LV2.getLibelle(),
									),
								);
							}
							break;
						case EGenreLangueOption.LVAutres:
							if (lRubriqueLV.LVAutres && lRubriqueLV.LVAutres.count() > 0) {
								lRubriqueLV.LVAutres.parcourir((aOption, aIndex) => {
									lHtml.push(
										tag(
											"ie-chips",
											{
												"ie-model": tag.funcAttr("chipsLangue", [
													aGenre,
													aIndex,
												]),
												class: "m-right m-bottom",
											},
											aOption.getLibelle(),
										),
									);
								});
							}
							break;
						default:
					}
					return lHtml.join("");
				}
				return "";
			},
			getVisible() {
				return true;
			},
		},
		chipsLangue: {
			event: function () {
				return false;
			},
			eventBtn: function (aGenre, aIndex) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur(
						"Orientation.LanguesOptions.msgSuppression",
					),
					callback: function (aAccepte) {
						if (aAccepte === EGenreAction.Valider) {
							switch (aGenre) {
								case EGenreLangueOption.LV1:
									aInstance.rubriqueLV.LV1 = new ObjetElement();
									break;
								case EGenreLangueOption.LV2:
									aInstance.rubriqueLV.LV2 = new ObjetElement();
									break;
								case EGenreLangueOption.LVAutres:
									aInstance.rubriqueLV.LVAutres.remove(aIndex);
									break;
							}
							aInstance.setEtatSaisie(true);
						}
					},
				});
				return false;
			},
		},
	};
};
TUtilitaireOrientation.getControleur = function (aInstance) {
	return {
		orientation: {
			getClass: function () {
				return aInstance.editable ? "AvecMain" : "IPO_Disable";
			},
			getClasseLabel: function () {
				return aInstance.donnees.orientation.getLibelle() ? "active" : "";
			},
			getVignette: function () {
				return aInstance.getHtmlVignette(
					EGenreEvnt.orientation,
					aInstance.donnees.orientation.getLibelle(),
					0,
				);
			},
			node: function () {
				$(this.node).on({
					click: function () {
						if (aInstance.editable) {
							aInstance.surEvent(EGenreEvnt.orientation);
						}
					},
				});
			},
		},
		specialite: {
			getVignette: function (aIndex) {
				const lLibelle =
					aInstance.donnees.specialites &&
					aInstance.donnees.specialites.get(aIndex)
						? aInstance.donnees.specialites.getLibelle(aIndex)
						: undefined;
				return aInstance.getHtmlVignette(
					EGenreEvnt.specialite,
					lLibelle,
					aIndex,
				);
			},
			node: function (aIndex) {
				$(this.node).on({
					click: function () {
						_ajouterSpecialite(aInstance, aIndex);
					},
				});
			},
			getDisplay: function () {
				return _estSpecialiteDisplay(this.instance);
			},
			getClass: function (aIndex) {
				const H = [];
				const lEstDisable = _estSpecialiteDisabled(aInstance, aIndex);
				H.push(lEstDisable ? "IPO_Disable" : "AvecMain");
				H.push("IPO_InputLike");
				return H.join(" ");
			},
			getClassMobile: function (aIndex) {
				const lAvecPlaceHolder =
					aIndex ===
					(aInstance.donnees.specialites &&
						aInstance.donnees.specialites.count());
				return lAvecPlaceHolder ? "AvecPlaceHolder" : "";
			},
		},
		stagePasserelle: {
			getValue: function () {
				return aInstance.donnees.orientation.avecStageFamille;
			},
			setValue: function (aValue) {
				aInstance.donnees.orientation.avecStageFamille = aValue;
				aInstance.donnees.setEtat(EGenreEtat.Modification);
				aInstance.setEtatSaisie(true);
			},
			getDisplay: function () {
				return (
					aInstance.donnees.orientation.getLibelle() &&
					aInstance.maquette.avecStagePasserelleFamille &&
					aInstance.donnees.orientation.estVoiePro
				);
			},
		},
		option: {
			getVignette: function () {
				const H = [];
				if (aInstance.donnees.options) {
					let I = 0;
					aInstance.donnees.options.parcourir((aOption) => {
						H.push(
							aInstance.getHtmlVignette(
								EGenreEvnt.option,
								aOption.getLibelle(),
								I++,
							),
						);
					});
				}
				return H.join("");
			},
			node: function () {
				$(this.node).on({
					click: function () {
						_ajouterOption(aInstance);
					},
				});
			},
			surClickItem: function () {
				_ajouterOption(aInstance);
			},
			getClass: function () {
				return _estOptionDisabled(aInstance) ? "IPO_Disable" : "AvecMain";
			},
			getDisplay: function () {
				return !_estOptionDisabled(aInstance);
			},
		},
		commentaire: {
			getValue: function () {
				if (aInstance.donnees.commentaire) {
					return aInstance.donnees.commentaire;
				}
			},
			setValue: function (aValue) {
				aInstance.donnees.commentaire = aValue;
			},
			exitChange: function () {
				aInstance.donnees.setEtat(EGenreEtat.Modification);
				if (aInstance.estEditable()) {
					aInstance.surEvent(EGenreEvnt.actualiser, aInstance.donnees.rang);
				} else if (aInstance.donnees.commentaire.length === 0) {
					aInstance.surEvent(EGenreEvnt.supprimer, aInstance.donnees.rang);
				}
			},
			getDisabled: function () {
				return !aInstance.estEditable();
			},
		},
		btnSupprimerVoeux: {
			event: function () {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur("Orientation.Supprimer"),
					callback: function (aAccepte) {
						if (aAccepte === EGenreAction.Valider) {
							aInstance.initDonneeVierge();
							aInstance.surEvent(EGenreEvnt.supprimer, aInstance.donnees.rang);
						}
					},
				});
			},
			getDisplay: function () {
				return this.instance.editable && this.instance.estEditable();
			},
			getTitle: function () {
				return GTraductions.getValeur("Orientation.Bouton.Supprimer");
			},
		},
		getRang: function () {
			return aInstance.donnees.rang;
		},
		chipsOrientation: {
			event: function () {
				return false;
			},
			eventBtn: function (aGenre, aIndex, aEvent) {
				aEvent.stopPropagation();
				const lCleTraduction =
					aGenre === EGenreEvnt.orientation
						? "Orientation.Supprimer"
						: aGenre === EGenreEvnt.specialite
							? "Orientation.Specialites.Supprimer"
							: "Orientation.Options.Supprimer";
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur(lCleTraduction),
					callback: function (aAccepte) {
						if (aAccepte === EGenreAction.Valider) {
							switch (aGenre) {
								case EGenreEvnt.orientation:
									aInstance.initDonneeVierge();
									aInstance.surEvent(
										EGenreEvnt.supprimer,
										aInstance.donnees.rang,
									);
									break;
								case EGenreEvnt.specialite:
									aInstance.donnees.specialites.remove(aIndex);
									aInstance.donnees.setEtat(EGenreEtat.Modification);
									break;
								case EGenreEvnt.option:
									aInstance.donnees.options.remove(aIndex);
									aInstance.donnees.setEtat(EGenreEtat.Modification);
									break;
							}
							aInstance.actualiser(true);
						}
					},
				});
			},
		},
	};
};
TUtilitaireOrientation.getHtmlLangueEtOption = function (
	aRubriqueLV,
	aEstMobile,
) {
	const lHtml = [];
	if (
		!aEstMobile &&
		(aRubriqueLV.estPublie || aRubriqueLV.dateMsgPublication)
	) {
		let lTitre = GTraductions.getValeur("Orientation.LanguesOptions.titre");
		if (aRubriqueLV.avecSaisie && aRubriqueLV.dateFinRubrique) {
			lTitre +=
				" " +
				GTraductions.getValeur("Orientation.ASaisirJusqau", [
					GDate.formatDate(aRubriqueLV.dateFinRubrique, "%JJ/%MM/%AAAA"),
				]);
		}
		lHtml.push(`<h2 class="ie-titre m-bottom-xl">${lTitre}</h2>`);
	}
	if (aRubriqueLV.estPublie) {
		lHtml.push(
			`<div class="${aEstMobile ? "m-bottom-xl" : "flex-contain IPO_Voeux IPO_Bloc65 p-all-l"} ${aRubriqueLV.avecSaisie ? "" : "IPO_Fond"}">`,
		);
		if (aRubriqueLV.avecSaisie) {
			lHtml.push(getHTMLLangueEtOptionSaisie(aRubriqueLV, aEstMobile));
		} else {
			lHtml.push(getHTMLLangueEtOptionConsultation(aRubriqueLV, aEstMobile));
		}
		lHtml.push("</div>");
		if (aRubriqueLV.avecSaisie) {
			lHtml.push(
				tag(
					"div",
					{ class: "p-right-l" },
					tag(
						"ie-bouton",
						{
							"ie-model": "btnValider",
							class: "themeBoutonPrimaire m-bottom-xl",
						},
						GTraductions.getValeur("Orientation.LanguesOptions.bouton"),
					),
				),
			);
		}
	} else if (!aEstMobile && aRubriqueLV.dateMsgPublication) {
		lHtml.push(
			tag(
				"div",
				{ class: "semi-bold m-all-l" },
				GTraductions.getValeur(
					"Orientation.Ressources.MessageSaisieIndisponible",
					[GDate.formatDate(aRubriqueLV.dateMsgPublication, "%JJ/%MM/%AAAA")],
				),
			),
		);
	}
	return lHtml.join("");
};
function getHTMLLangueEtOptionSaisie(aRubriqueLV, aEstMobile) {
	const lHtml = [];
	if (aRubriqueLV.maquette.avecLV1 || aRubriqueLV.maquette.avecLV2) {
		lHtml.push(`<div class="${aEstMobile ? "p-x-xl" : "IPO_Bloc50"}">`);
		if (aRubriqueLV.maquette.avecLV1) {
			lHtml.push(`<div class="${aEstMobile ? "field-contain" : ""}">`);
			lHtml.push(
				tag(
					"label",
					{ class: "m-top" },
					GTraductions.getValeur("Orientation.LanguesOptions.LV1"),
				),
			);
			lHtml.push(
				tag("ie-btnselecteur", {
					"ie-model": tag.funcAttr("btnSelecteurLanguesOptions", [
						EGenreLangueOption.LV1,
					]),
					placeholder: GTraductions.getValeur(
						"Orientation.LanguesOptions.TitreListeLV1",
					),
					"aria-label": GTraductions.getValeur(
						"Orientation.LanguesOptions.TitreListeLV1",
					),
				}),
			);
			lHtml.push(`</div>`);
		}
		if (aRubriqueLV.maquette.avecLV2) {
			lHtml.push(`<div class="${aEstMobile ? "field-contain" : ""}">`);
			lHtml.push(
				tag(
					"label",
					{ class: "m-top" },
					GTraductions.getValeur("Orientation.LanguesOptions.LV2"),
				),
			);
			lHtml.push(
				tag("ie-btnselecteur", {
					"ie-model": tag.funcAttr("btnSelecteurLanguesOptions", [
						EGenreLangueOption.LV2,
					]),
					placeholder: GTraductions.getValeur(
						"Orientation.LanguesOptions.TitreListeLV2",
					),
					"aria-label": GTraductions.getValeur(
						"Orientation.LanguesOptions.TitreListeLV2",
					),
				}),
			);
			lHtml.push(`</div>`);
		}
		lHtml.push("</div>");
	}
	if (
		aRubriqueLV.maquette.nombreEnseignementOptionnel &&
		aRubriqueLV.maquette.nombreEnseignementOptionnel > 0
	) {
		lHtml.push(`<div class="${aEstMobile ? "" : "IPO_Bloc50 m-left-xl"}">`);
		lHtml.push(
			tag(
				"label",
				{ class: "m-top" },
				GTraductions.getValeur("Orientation.LanguesOptions.Options", [
					aRubriqueLV.maquette.nombreEnseignementOptionnel,
				]),
			),
		);
		lHtml.push(
			tag("ie-btnselecteur", {
				"ie-model": tag.funcAttr("btnSelecteurLanguesOptions", [
					EGenreLangueOption.LVAutres,
				]),
				class: "multilignes",
				"aria-label": GTraductions.getValeur("Orientation.Options.TitreListe"),
			}),
		);
		lHtml.push("</div>");
	}
	return lHtml.join("");
}
function getHTMLLangueEtOptionConsultation(aRubriqueLV, aEstMobile) {
	const lHtml = [];
	if (aRubriqueLV.maquette.avecLV1 || aRubriqueLV.maquette.avecLV2) {
		lHtml.push(`<div class="${aEstMobile ? "" : "IPO_Bloc50"}">`);
		if (aRubriqueLV.maquette.avecLV1) {
			if (aRubriqueLV.LV1) {
				lHtml.push(
					tag(
						"label",
						{ class: "m-y-l" },
						GTraductions.getValeur("Orientation.LanguesOptions.LV1"),
					),
				);
				lHtml.push(
					tag("p", { class: "semi-bold" }, aRubriqueLV.LV1.getLibelle()),
				);
			}
		}
		lHtml.push("</div>", `<div class="${aEstMobile ? "" : 'IPO_Bloc50"'}>`);
		if (aRubriqueLV.maquette.avecLV2) {
			if (aRubriqueLV.LV2) {
				lHtml.push(
					tag(
						"label",
						{ class: "m-y-l" },
						GTraductions.getValeur("Orientation.LanguesOptions.LV2"),
					),
				);
				lHtml.push(
					tag("p", { class: "semi-bold" }, aRubriqueLV.LV2.getLibelle()),
				);
			}
		}
		lHtml.push("</div>");
	}
	if (
		aRubriqueLV.maquette.nombreEnseignementOptionnel &&
		aRubriqueLV.maquette.nombreEnseignementOptionnel > 0
	) {
		lHtml.push(`<div class="${aEstMobile ? "" : 'IPO_Bloc50 m-left-xl"'}>`);
		if (aRubriqueLV.LVAutres && aRubriqueLV.LVAutres.count() > 0) {
			lHtml.push(
				tag(
					"label",
					{ class: "m-y-l" },
					GTraductions.getValeur("Orientation.LanguesOptions.Options", [
						aRubriqueLV.maquette.nombreEnseignementOptionnel,
					]),
				),
			);
			const lLangues = [];
			aRubriqueLV.LVAutres.parcourir((aLV) => {
				lLangues.push(tag("li", aLV.getLibelle()));
			});
			lHtml.push(tag("ul", { class: "semi-bold" }, lLangues.join("")));
		}
		lHtml.push("</div>");
	}
	return lHtml.join("");
}
function _estOrientationSaisie(aInstance) {
	return !!(
		aInstance.donnees.orientation && aInstance.donnees.orientation.getLibelle()
	);
}
function _estSpecialiteDisabled(aInstance, aIndex) {
	if (!aInstance.editable) {
		return true;
	}
	if (aInstance.donnees.orientation.getLibelle() === undefined) {
		return true;
	}
	return (
		!aInstance.donnees.specialites ||
		aIndex > aInstance.donnees.specialites.count()
	);
}
function _estSpecialiteDisplay(aInstance) {
	return (
		_estOrientationSaisie(aInstance) &&
		((aInstance.donnees.specialites &&
			aInstance.donnees.specialites.count() > 0) ||
			(aInstance.donnees.orientation.listeSpecialites &&
				aInstance.donnees.orientation.listeSpecialites.count() > 0))
	);
}
function _estOptionDisabled(aInstance) {
	if (!aInstance.editable) {
		return true;
	}
	if (aInstance.donnees.orientation.getLibelle() === undefined) {
		return true;
	}
	return (
		!aInstance.donnees.orientation.listeOptions ||
		aInstance.donnees.orientation.listeOptions.count() === 0
	);
}
function _ajouterOption(aInstance) {
	if (!_estOptionDisabled(aInstance)) {
		if (
			aInstance.donnees.options.count() >=
			aInstance.donnees.orientation.listeOptions.count()
		) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur(
					"Orientation.Options.AucuneOptionDisponible",
				),
			});
		} else if (
			aInstance.donnees.options.count() >= aInstance.maquette.nombreOptions
		) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur("Orientation.Options.AjoutImpossible"),
			});
		} else {
			aInstance.surEvent(EGenreEvnt.option);
		}
	}
}
function _ajouterSpecialite(aInstance, aIndex) {
	if (!_estSpecialiteDisabled(aInstance, aIndex)) {
		if (
			aInstance.donnees.specialites.count() >=
			aInstance.donnees.orientation.listeSpecialites.count()
		) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur(
					"Orientation.Specialites.AucuneSpecialiteDisponible",
				),
			});
		} else if (
			aInstance.donnees.specialites.count() >=
			aInstance.maquette.nombreSpecialites
		) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur(
					"Orientation.Specialites.AjoutImpossible",
				),
			});
		} else {
			aInstance.surEvent(EGenreEvnt.specialite, aIndex);
		}
	}
}
TUtilitaireOrientation.formatterDonneesPourRegroupements = function (
	aInstance,
	aDonnees,
) {
	const lDonneesAcRegroup = new ObjetListeElements();
	let lLigne = null;
	let lPere = null;
	aDonnees.parcourir(
		((aLigne) => {
			lLigne = aLigne;
			if (aLigne.getGenre() === undefined) {
				lLigne.estUnDeploiement = true;
				lLigne.estDeploye = true;
				lPere = lLigne;
			} else {
				lLigne.pere = lPere;
			}
			lDonneesAcRegroup.addElement(lLigne);
		}).bind(aInstance),
	);
	return lDonneesAcRegroup;
};
TUtilitaireOrientation.filtrerRessources = function (
	aInstance,
	aElement,
	aListeRessource,
	aGenre,
) {
	const lListeFiltre = new ObjetListeElements();
	let lListeDonneesSelectionne = new ObjetListeElements();
	if (aGenre === EGenreEvnt.orientation) {
		const lListeOrientations =
			aElement.Genre === TypeRubriqueOrientation.RO_IntentionFamille
				? aInstance.IdentOrientationsIntentions
				: aInstance.IdentOrientationsDefinitif;
		lListeOrientations.forEach((aOrientation) => {
			if (
				aOrientation.donnees.orientation &&
				aOrientation.donnees.orientation.getGenre() ===
					TypeGenreChoixDOrientation.TGCDO_AutreOrientation &&
				aOrientation.donnees.orientation.existeNumero()
			) {
				lListeDonneesSelectionne.addElement(aOrientation.donnees.orientation);
			}
		});
	} else {
		lListeDonneesSelectionne =
			aGenre === EGenreEvnt.specialite
				? aElement.donnees.specialites
				: aGenre === EGenreEvnt.option
					? aElement.donnees.options
					: aElement.LVAutres;
	}
	const lTableauNumero =
		lListeDonneesSelectionne && lListeDonneesSelectionne.count() > 0
			? lListeDonneesSelectionne.getTableauNumeros()
			: [];
	aListeRessource.parcourir((aLigne) => {
		if (!lTableauNumero.includes(aLigne.getNumero())) {
			lListeFiltre.addElement(aLigne);
		}
	});
	return lListeFiltre;
};
TUtilitaireOrientation.construireAR = function (aParams) {
	let lHtml = [];
	switch (!!aParams.rubrique && aParams.rubrique.getGenre()) {
		case TypeRubriqueOrientation.RO_IntentionFamille:
		case TypeRubriqueOrientation.RO_AutreRecommandationConseil:
			lHtml = _construireARIntention(aParams);
			break;
		case TypeRubriqueOrientation.RO_VoeuDefinitif:
		case TypeRubriqueOrientation.RO_AutrePropositionConseil:
			lHtml = _construireARVoeuxDefinitifs(aParams);
			break;
		default:
			break;
	}
	return lHtml;
};
function _construireARIntention(aParams) {
	const lHtml = [];
	const lEstProfesseur = [
		EGenreEspace.Professeur,
		EGenreEspace.Mobile_Professeur,
	].includes(GEtatUtilisateur.GenreEspace);
	const lRubrique = aParams.rubrique;
	const lTitre = lRubrique.donneesAR.estEditable
		? GTraductions.getValeur("Orientation.AR.RetourFamilleASaisirAvant", [
				GDate.formatDate(lRubrique.donneesAR.dateLimiteAR, "%JJ/%MM/%AAAA"),
			])
		: GTraductions.getValeur("Orientation.AR.RetourFamille");
	const lClasse = !!aParams.estMobile ? "IPO_Bloc100" : "IPO_Bloc65";
	const lClasseNonEditable = aParams.rubrique.donneesAR.estEditable
		? ""
		: "non-editable";
	lHtml.push(tag("div", { class: ["IPO_TitreAR", lClasse] }, lTitre));
	lHtml.push(
		tag(
			"div",
			{ class: ["IPO_AccuseReception", lClasse, lClasseNonEditable] },
			(aTab) => {
				aTab.push(
					tag(
						"span",
						tag(
							"ie-checkbox",
							{ "ie-model": "cbARAvisConseil" },
							GTraductions.getValeur(
								lEstProfesseur
									? "Orientation.AR.FamillePrisConnaissance"
									: "Orientation.AR.PrisConnaissance",
							),
						),
					),
				);
				if (
					!!lRubrique.donneesAR.avecARStage &&
					lRubrique.donneesAR.estAccuse === Type3Etats.TE_Oui
				) {
					aTab.push(
						tag(
							"div",
							{ class: "IPO_ARStage" },
							tag(
								"span",
								GTraductions.getValeur("Orientation.AR.PropositionCCStageAR"),
							),
							tag(
								"div",
								tag(
									"ie-radio",
									{
										"ie-model": tag.funcAttr("radioARStage", Type3Etats.TE_Oui),
									},
									GTraductions.getValeur("Orientation.AR.Jaccepte"),
								),
								tag(
									"ie-radio",
									{
										"ie-model": tag.funcAttr("radioARStage", Type3Etats.TE_Non),
									},
									GTraductions.getValeur("Orientation.AR.JeRefuse"),
								),
							),
						),
					);
				}
			},
		),
	);
	return lHtml.join("");
}
function _construireARVoeuxDefinitifs(aParams) {
	const lHtml = [];
	const lEstProfesseur = [
		EGenreEspace.Professeur,
		EGenreEspace.Mobile_Professeur,
	].includes(GEtatUtilisateur.GenreEspace);
	const lTitre = aParams.rubrique.donneesAR.estEditable
		? GTraductions.getValeur("Orientation.AR.ReponseFamilleASaisirAvant", [
				GDate.formatDate(
					aParams.rubrique.donneesAR.dateLimiteAR,
					"%JJ/%MM/%AAAA",
				),
			])
		: GTraductions.getValeur("Orientation.AR.ReponseFamilleSaisiePar", [
				aParams.rubrique.donneesAR.accusePar,
				GDate.formatDate(aParams.rubrique.donneesAR.accuseLe, "%JJ/%MM/%AAAA"),
			]);
	const lClasse = !!aParams.estMobile ? "IPO_Bloc100" : "IPO_Bloc65";
	const lClasseNonEditable = aParams.rubrique.donneesAR.estEditable
		? ""
		: "non-editable";
	const lStrAccepte = lEstProfesseur
		? GTraductions.getValeur(
				"Orientation.AR.LaFamilleAccepteLaPropositionDuConseilDeClasse",
			)
		: `<em>${GTraductions.getValeur("Orientation.AR.NousAcceptons")} &nbsp;</em> ${GTraductions.getValeur("Orientation.AR.NousAcceptonsSuite")}`;
	const lStrNAcceptePas = lEstProfesseur
		? GTraductions.getValeur(
				"Orientation.AR.LaFamilleNAcceptePasLaPropositionEtDemandeUnRDV",
			)
		: `<em> ${GTraductions.getValeur("Orientation.AR.NousAcceptonsAucune")} &nbsp;</em> ${GTraductions.getValeur("Orientation.AR.NousAcceptonsAucuneSuite")}`;
	lHtml.push(tag("div", { class: ["IPO_TitreAR", lClasse] }, lTitre));
	lHtml.push(
		tag(
			"div",
			{ class: ["IPO_AccuseReception", lClasse, lClasseNonEditable] },
			(aTab) => {
				aTab.push(
					tag(
						"div",
						{ class: ["IPO_ARStage", aParams.estMobile ? "est-mobile" : ""] },
						tag(
							"ie-radio",
							{
								"ie-textright": true,
								"ie-model": tag.funcAttr(
									"radioARProposition",
									Type3Etats.TE_Oui,
								),
							},
							lStrAccepte,
						),
						!!aParams.idCombo ? tag("div", { id: aParams.idCombo }) : "",
					),
					lEstProfesseur
						? ""
						: tag(
								"span",
								GTraductions.getValeur("Orientation.AR.MsgARProposition"),
							),
					tag(
						"ie-radio",
						{
							"ie-textright": true,
							"ie-model": tag.funcAttr("radioARProposition", Type3Etats.TE_Non),
						},
						lStrNAcceptePas,
					),
				);
			},
		),
	);
	return lHtml.join("");
}
TUtilitaireOrientation.construireDecisionRetenue = function (
	aInstance,
	aRubrique,
) {
	const lHtml = [];
	if (!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0) {
		const lVoeux = aRubrique.listeVoeux.get(0);
		if (!!lVoeux.orientation) {
			const lStrOrientation = lVoeux.orientation.getLibelle();
			const lStrOptionObligatoire =
				!!lVoeux.specialites && !!lVoeux.specialites.count() > 0
					? lVoeux.specialites.getTableauLibelles().join(" - ")
					: "";
			const lStrOptionFacultative =
				!!lVoeux.options && !!lVoeux.options.count() > 0
					? lVoeux.options.getTableauLibelles().join("; ")
					: "";
			const lStrAfficher =
				lStrOrientation +
				(!!lStrOptionObligatoire ? "-" + lStrOptionObligatoire : "");
			const lStrStage = lVoeux.orientation.avecStageFamille
				? GTraductions.getValeur(
						"Orientation.Ressources.DemandeStagePasserelle",
					)
				: lVoeux.orientation.avecStageConseil
					? GTraductions.getValeur(
							"Orientation.Ressources.StagePasserellePropose",
						)
					: "";
			let lStrCommentaire =
				lVoeux.avis && lVoeux.avis.motivation
					? `${GTraductions.getValeur("Orientation.Commentaire")} : ${lVoeux.avis.motivation}`
					: "";
			if (
				[EGenreEspace.Professeur, EGenreEspace.Mobile_Professeur].includes(
					GEtatUtilisateur.GenreEspace,
				) &&
				lVoeux.avis.publicationParent
			) {
				lStrCommentaire += ` (${GTraductions.getValeur("Orientation.PublieSurEspaceParent")})`;
			}
			lHtml.push(
				tag(
					"div",
					{ class: ["IPO_Bloc65", "IPO_DecisionRetenue"] },
					tag("div", tag("p", { class: "semi-bold" }, lStrAfficher)),
					tag(
						"div",
						!!lStrOptionFacultative
							? GTraductions.getValeur("Orientation.Option") +
									" : " +
									lStrOptionFacultative
							: "",
					),
					tag("div", tag("p", lStrCommentaire)),
					tag("div", lStrStage),
				),
			);
		}
	}
	return lHtml.join("");
};
TUtilitaireOrientation.afficherMessageValidation = function () {
	Toast.afficher({
		msg: GTraductions.getValeur("Orientation.SaisiePriseEnCompte"),
		type: ETypeToast.succes,
	});
};
TUtilitaireOrientation.afficherMessageSaisieAR = function (aRubrique) {
	if (
		!!aRubrique.avecAccuseReception &&
		!!aRubrique.auMoinsUnAvisFavorable &&
		!!aRubrique.donneesAR &&
		!!aRubrique.donneesAR.estEditable
	) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("Orientation.AR.MsgAttentionSaisieAR", [
				GDate.formatDate(aRubrique.donneesAR.dateLimiteAR, "%JJ/%MM/%AAAA"),
			]),
		});
	}
};
module.exports = {
	TUtilitaireOrientation,
	EGenreEvnt,
	EGenreVoeux,
	EModeAffichage,
	EGenreLangueOption,
};
