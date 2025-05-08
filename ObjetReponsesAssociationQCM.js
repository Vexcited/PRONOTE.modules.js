exports.TypeEvenementReponsesAssociation = exports.ObjetReponsesAssociationQCM =
	void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const TypeGenreAssociationQuestionQCM_1 = require("TypeGenreAssociationQuestionQCM");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireAudio_1 = require("UtilitaireAudio");
var TypeEvenementReponsesAssociation;
(function (TypeEvenementReponsesAssociation) {
	TypeEvenementReponsesAssociation[
		(TypeEvenementReponsesAssociation["Modification"] = 0)
	] = "Modification";
})(
	TypeEvenementReponsesAssociation ||
		(exports.TypeEvenementReponsesAssociation =
			TypeEvenementReponsesAssociation =
				{}),
);
var TypeElement;
(function (TypeElement) {
	TypeElement["A"] = "ElementA";
	TypeElement["B"] = "ElementB";
})(TypeElement || (TypeElement = {}));
class ObjetReponsesAssociationQCM extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.ids = {
			ListeReponsesOuter: "ListeReponsesOuter",
			ListeReponses: "ListeReponses",
		};
		this.donnees = {
			avecEdition: true,
			listeReponsesAssociation: null,
			typesAssociation: {
				[TypeElement.A]:
					TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
						.GEA_Texte,
				[TypeElement.B]:
					TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
						.GEA_Texte,
			},
		};
	}
	getReponseAssociation(aIndexReponse) {
		let lReponseAssociation;
		if (!!this.donnees && !!this.donnees.listeReponsesAssociation) {
			lReponseAssociation =
				this.donnees.listeReponsesAssociation.get(aIndexReponse);
		}
		return lReponseAssociation;
	}
	getElementAssociation(aIndexReponse, aEstAssociationA) {
		let lElementAssociation;
		if (!!this.donnees && !!this.donnees.listeReponsesAssociation) {
			const lReponseAssociation = this.getReponseAssociation(aIndexReponse);
			if (!!lReponseAssociation) {
				lElementAssociation = aEstAssociationA
					? lReponseAssociation.associationA
					: lReponseAssociation.associationB;
			}
		}
		return lElementAssociation;
	}
	jouerSon(aIndexReponse, aEstAssociationA) {
		const lElemAudioConcerne = $(
			"#" + this.getIdAudio(aIndexReponse, aEstAssociationA),
		)
			.closest("audio")
			.get(0);
		if (
			UtilitaireAudio_1.UtilitaireAudio.estEnCoursDeLecture(lElemAudioConcerne)
		) {
			UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudioConcerne);
		} else {
			try {
				const $tousLesElementsAudios = $("#" + this.ids.ListeReponses).find(
					"audio",
				);
				for (let i = 0; i < $tousLesElementsAudios.length; i++) {
					const lElemAudio = $tousLesElementsAudios.get(i);
					UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudio);
				}
				UtilitaireAudio_1.UtilitaireAudio.jouerAudio(lElemAudioConcerne);
			} catch (error) {
				if (
					error === UtilitaireAudio_1.UtilitaireAudio.ExceptionFichierNonValide
				) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.FichierSonNonValide",
						),
					});
				}
			}
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			checkTypeAssociation: {
				getValue(aTypeElement, aTypeAssociation) {
					const lTypeAssociation =
						aInstance.donnees.typesAssociation[aTypeElement];
					return lTypeAssociation === aTypeAssociation;
				},
				setValue(aTypeElement, aTypeAssociation) {
					const lFnExecuteChangementType = function () {
						aInstance.donnees.typesAssociation[aTypeElement] = aTypeAssociation;
					};
					let lAvecAlerteChangementType = false;
					if (
						!!aInstance.donnees.listeReponsesAssociation &&
						aInstance.donnees.listeReponsesAssociation.getNbrElementsExistes() >
							0
					) {
						lAvecAlerteChangementType = true;
					}
					if (lAvecAlerteChangementType) {
						const lEstAssociationA = aTypeElement === TypeElement.A;
						let lMessageConfirmation;
						if (lEstAssociationA) {
							lMessageConfirmation = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.ConfirmChangementAssociationA",
							);
						} else {
							lMessageConfirmation = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.ConfirmChangementAssociationB",
							);
						}
						const lThis = this;
						GApplication.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: lMessageConfirmation,
							})
							.then((aGenreAction) => {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									aInstance.supprimerReponsesAssociation(
										aInstance.donnees.listeReponsesAssociation,
										aTypeAssociation,
										lEstAssociationA,
									);
									lFnExecuteChangementType();
									aInstance.updateGraphiqueListeReponses(lThis.controleur);
									aInstance.callback.appel(
										TypeEvenementReponsesAssociation.Modification,
									);
								}
							});
					} else {
						lFnExecuteChangementType();
					}
				},
				getDisabled() {
					return !aInstance.donnees.avecEdition;
				},
			},
			txtValeurElementAssociation: {
				getValue(aIndexReponse, aEstAssociationA) {
					const lElementAssociation = aInstance.getElementAssociation(
						aIndexReponse,
						aEstAssociationA,
					);
					return !!lElementAssociation
						? lElementAssociation.strTexte || ""
						: "";
				},
				setValue(aIndexReponse, aEstAssociationA, aValeur) {
					const lElementAssociation = aInstance.getElementAssociation(
						aIndexReponse,
						aEstAssociationA,
					);
					if (!!lElementAssociation) {
						lElementAssociation.strTexte = aValeur;
						lElementAssociation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						const lReponseAssociation =
							aInstance.getReponseAssociation(aIndexReponse);
						aInstance.setModificationReponseAssociation(lReponseAssociation);
						aInstance.callback.appel(
							TypeEvenementReponsesAssociation.Modification,
						);
					}
				},
				getDisabled() {
					return !aInstance.donnees.avecEdition;
				},
			},
			selecFileElementAssociation: {
				getOptionsSelecFile: function (aIndexReponse, aEstAssociationA) {
					const lElementAssociation = aInstance.getElementAssociation(
						aIndexReponse,
						aEstAssociationA,
					);
					let lPourSon = false;
					if (!!lElementAssociation) {
						lPourSon =
							lElementAssociation.getGenre() ===
							TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
								.GEA_Son;
					}
					return {
						accept: !lPourSon
							? "image/*"
							: UtilitaireAudio_1.UtilitaireAudio.getTypeMimeAudio(),
						maxSize: lPourSon ? 250 * 1024 : 0,
						acceptDragDrop: true,
						avecResizeImage: true,
						largeurMaxImageResize: 320,
						hauteurMaxImageResize: 240,
						click_surEventCapture: false,
						avecTransformationFlux: false,
					};
				},
				addFiles(aIndexReponse, aEstAssociationA, aParams) {
					const lElementAssociation = aInstance.getElementAssociation(
						aIndexReponse,
						aEstAssociationA,
					);
					if (!!lElementAssociation) {
						const lListeFichiers = aParams.listeFichiers;
						if (!!lListeFichiers) {
							const lPourSon =
								lElementAssociation.getGenre() ===
								TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
									.GEA_Son;
							const lThis = this;
							lListeFichiers.parcourir((aFichier) => {
								const lNomFichier = aFichier.getLibelle();
								UtilitaireTraitementImage_1.UtilitaireTraitementImage.fileToDataUrlPromise(
									aFichier.file,
								).then((aB64ContenuCompletFichier) => {
									if (!!aB64ContenuCompletFichier) {
										const lB64ContenuFichier =
											aB64ContenuCompletFichier.split(",")[1];
										if (lPourSon) {
											lElementAssociation.strSon = lB64ContenuFichier;
											lElementAssociation.strNomFichier = lNomFichier;
										} else {
											lElementAssociation.strImage = lB64ContenuFichier;
										}
										lElementAssociation.setEtat(
											Enumere_Etat_1.EGenreEtat.Modification,
										);
										const lReponseAssociation =
											aInstance.getReponseAssociation(aIndexReponse);
										aInstance.setModificationReponseAssociation(
											lReponseAssociation,
										);
										aInstance.updateGraphiqueListeReponses(lThis.controleur);
										aInstance.callback.appel(
											TypeEvenementReponsesAssociation.Modification,
										);
									}
								});
							});
						}
					}
				},
				getDisabled() {
					return !aInstance.donnees.avecEdition;
				},
			},
			chipsAudio: {
				event(aIndexReponse, aEstAssociationA, aEvent) {
					aEvent.stopPropagation();
					aInstance.jouerSon(aIndexReponse, aEstAssociationA);
				},
				node() {
					const $chips = $(this.node);
					const $audio = $chips.find("audio");
					$audio.on("play", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
					});
					$audio.on("pause", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
					});
				},
			},
			btnSupprimerReponse: {
				event(aIndexReponse) {
					const lReponseAssociation =
						aInstance.getReponseAssociation(aIndexReponse);
					if (!!lReponseAssociation) {
						const lThis = this;
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.ConfirmSuppression",
							),
							callback: function (aGenreAction) {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									lReponseAssociation.setEtat(
										Enumere_Etat_1.EGenreEtat.Suppression,
									);
									aInstance.updateGraphiqueListeReponses(lThis.controleur);
									aInstance.callback.appel(
										TypeEvenementReponsesAssociation.Modification,
									);
								}
							},
						});
					}
				},
				getDisabled() {
					return !aInstance.donnees.avecEdition;
				},
			},
			btnAjouterReponse: {
				event() {
					const lTypeAssociationA =
						aInstance.donnees.typesAssociation[TypeElement.A];
					const lTypeAssociationB =
						aInstance.donnees.typesAssociation[TypeElement.B];
					const lNouvelleReponseAssociation =
						ObjetElement_1.ObjetElement.create({
							associationA: ObjetElement_1.ObjetElement.create({
								Genre: lTypeAssociationA,
							}),
							associationB: ObjetElement_1.ObjetElement.create({
								Genre: lTypeAssociationB,
							}),
						});
					lNouvelleReponseAssociation.bonneReponse =
						lNouvelleReponseAssociation.associationB;
					lNouvelleReponseAssociation.setEtat(
						Enumere_Etat_1.EGenreEtat.Creation,
					);
					aInstance.donnees.listeReponsesAssociation.addElement(
						lNouvelleReponseAssociation,
					);
					aInstance.updateGraphiqueListeReponses(this.controleur, true);
					aInstance.callback.appel(
						TypeEvenementReponsesAssociation.Modification,
					);
				},
				getDisabled() {
					return !aInstance.donnees.avecEdition;
				},
			},
		});
	}
	setAvecEdition(aAvecEdition) {
		this.donnees.avecEdition = aAvecEdition;
	}
	setDonnees(aListeReponsesAssociation) {
		this.donnees.listeReponsesAssociation = aListeReponsesAssociation;
		let lTypeAssocA =
			TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation.GEA_Texte;
		let lTypeAssocB =
			TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation.GEA_Texte;
		if (
			!!aListeReponsesAssociation &&
			aListeReponsesAssociation.getNbrElementsExistes() > 0
		) {
			const lPremiereReponse = aListeReponsesAssociation.getPremierElement();
			if (!!lPremiereReponse) {
				if (lPremiereReponse.associationA) {
					lTypeAssocA = lPremiereReponse.associationA.getGenre();
				}
				if (lPremiereReponse.associationB) {
					lTypeAssocB = lPremiereReponse.associationB.getGenre();
				}
			}
		}
		this.donnees.typesAssociation.ElementA = lTypeAssocA;
		this.donnees.typesAssociation.ElementB = lTypeAssocB;
		this.afficher(this.composeContenuReponsesAssociation());
	}
	composeContenuReponsesAssociation() {
		const H = [];
		H.push('<div class="ObjetReponsesAssociationQCM">');
		H.push(
			'<div id="ZoneBoutonAjout"><ie-bouton ie-model="btnAjouterReponse" ie-icon="icon_plus_fin">',
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.NouvelleAssociation",
			),
			"</ie-bouton></div>",
		);
		H.push(this.construitChoixAssociation());
		H.push('<div id="', this.ids.ListeReponsesOuter, '">');
		H.push('<div id="', this.ids.ListeReponses, '">');
		H.push(
			this.construitListeReponsesAssociation(
				this.donnees.listeReponsesAssociation,
			),
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	getIdAudio(aIndexReponse, aEstAssociationA) {
		return "audio_" + aIndexReponse + "_" + (aEstAssociationA ? 1 : 0);
	}
	setModificationReponseAssociation(lReponseAssociation) {
		if (lReponseAssociation.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
			lReponseAssociation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lReponseAssociation.Etat = Enumere_Etat_1.EGenreEtat.Modification;
		}
	}
	supprimerReponsesAssociation(
		aListeReponses,
		aNouveauTypeAssociation,
		aEstAssociationA,
	) {
		if (!!aListeReponses) {
			aListeReponses.parcourir((aReponse) => {
				if (aReponse.existe()) {
					let lObjElementAssociation;
					if (aEstAssociationA) {
						lObjElementAssociation = aReponse.associationA;
					} else {
						lObjElementAssociation = aReponse.associationB;
					}
					if (
						!!lObjElementAssociation &&
						lObjElementAssociation.getGenre() !== aNouveauTypeAssociation
					) {
						lObjElementAssociation.Genre = aNouveauTypeAssociation;
						lObjElementAssociation.strTexte = "";
						lObjElementAssociation.strImage = "";
						lObjElementAssociation.strSon = "";
						lObjElementAssociation.strNomFichier = "";
						lObjElementAssociation.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
					this.setModificationReponseAssociation(aReponse);
				}
			});
		}
	}
	construitChoixAssociation() {
		function construitListeRadiosAssociation(aLabel, aTypeElement) {
			const lNameGroupeRadio = "radios_" + aTypeElement;
			const H = [];
			H.push('<span class="LabelTypeAssociation">', aLabel, "</span>");
			H.push(
				'<ie-radio class="as-chips" ie-icon="icon_font" name="',
				lNameGroupeRadio,
				'" ie-model="checkTypeAssociation(\'',
				aTypeElement,
				"', ",
				TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation.GEA_Texte,
				')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.TypeAssociationTexte",
				),
				"</ie-radio>",
			);
			H.push(
				'<ie-radio class="as-chips" ie-icon="icon_fichier_image" name="',
				lNameGroupeRadio,
				'" ie-model="checkTypeAssociation(\'',
				aTypeElement,
				"', ",
				TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation.GEA_Image,
				')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.TypeAssociationImage",
				),
				"</ie-radio>",
			);
			H.push(
				'<ie-radio class="as-chips" ie-icon="icon_music" name="',
				lNameGroupeRadio,
				'" ie-model="checkTypeAssociation(\'',
				aTypeElement,
				"', ",
				TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation.GEA_Son,
				')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.TypeAssociationSon",
				),
				"</ie-radio>",
			);
			return H.join("");
		}
		const H = [];
		H.push('<div id="ChoixTypeAssociation">');
		H.push(
			"<div>",
			construitListeRadiosAssociation(
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.AssociationSource",
				),
				TypeElement.A,
			),
			"</div>",
		);
		H.push(
			"<div>",
			construitListeRadiosAssociation(
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.AssociationReponse",
				),
				TypeElement.B,
			),
			"</div>",
		);
		H.push("<div></div>");
		H.push("</div>");
		return H.join("");
	}
	construitListeReponsesAssociation(aListeReponses) {
		const H = [];
		if (!!aListeReponses) {
			aListeReponses.parcourir((aReponseAssociation, aIndex) => {
				if (aReponseAssociation.existe()) {
					H.push(this.construitReponseAssociation(aIndex, aReponseAssociation));
				}
			});
		}
		return H.join("");
	}
	construitReponseAssociation(aIndexReponseAssociation, aReponseAssociation) {
		const H = [];
		if (!!aReponseAssociation) {
			H.push(
				'<div class="CellElementAssociation">',
				this.composeContenuElementAssociation(
					aIndexReponseAssociation,
					aReponseAssociation.associationA,
					true,
				),
				"</div>",
			);
			H.push(
				'<div class="CellElementAssociation">',
				this.composeContenuElementAssociation(
					aIndexReponseAssociation,
					aReponseAssociation.associationB,
					false,
				),
				"</div>",
			);
			H.push(
				'<div class="CellBtnSupprimerAssociation"><ie-btnimage class="BtnSupprimerAssociation icon_trash btnImageIcon" ie-model="btnSupprimerReponse(',
				aIndexReponseAssociation,
				')"></ie-btnimage></div>',
			);
		}
		return H.join("");
	}
	composeContenuElementAssociation(
		aIndexReponseAssociation,
		aElementAssociation,
		aEstAssociationA,
	) {
		const H = [];
		if (!!aElementAssociation) {
			switch (aElementAssociation.getGenre()) {
				case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
					.GEA_Texte:
					H.push(
						'<input type="text" ie-model="txtValeurElementAssociation(',
						aIndexReponseAssociation,
						",",
						aEstAssociationA,
						')" />',
					);
					break;
				case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
					.GEA_Image:
				case TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
					.GEA_Son: {
					const lLibelleDeposerFichier =
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.GlisserDeposerFichier",
						);
					const lEstPourSon =
						aElementAssociation.getGenre() ===
						TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
							.GEA_Son;
					H.push(
						'<div class="ZoneDrop" ie-model="selecFileElementAssociation(',
						aIndexReponseAssociation,
						",",
						aEstAssociationA,
						')" ie-selecFile>',
					);
					if (lEstPourSon) {
						if (!!aElementAssociation.strNomFichier) {
							const lChipsAudio =
								UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
									base64Audio: aElementAssociation.strSon,
									libelle: aElementAssociation.strNomFichier,
									idAudio: this.getIdAudio(
										aIndexReponseAssociation,
										aEstAssociationA,
									),
									ieModel: "chipsAudio",
									argsIEModel: [aIndexReponseAssociation, aEstAssociationA],
								});
							H.push(lChipsAudio);
						} else {
							H.push(lLibelleDeposerFichier);
						}
					} else {
						if (aElementAssociation.strImage) {
							H.push(
								'<img src="data:image/png;base64,',
								aElementAssociation.strImage,
								'" onerror="" onload="" />',
							);
						} else {
							H.push(lLibelleDeposerFichier);
						}
					}
					H.push("</div>");
					break;
				}
			}
		}
		return H.join("");
	}
	updateGraphiqueListeReponses(aControleur, aAvecScrollEnBas = false) {
		ObjetHtml_1.GHtml.setHtml(
			this.ids.ListeReponses,
			this.construitListeReponsesAssociation(
				this.donnees.listeReponsesAssociation,
			),
			aControleur,
		);
		if (aAvecScrollEnBas) {
			const lListeReponsesDivScrollable = $("#" + this.ids.ListeReponsesOuter);
			const lListeReponses = lListeReponsesDivScrollable.find(
				"#" + this.ids.ListeReponses,
			);
			lListeReponsesDivScrollable.scrollTop(lListeReponses.height());
		}
	}
}
exports.ObjetReponsesAssociationQCM = ObjetReponsesAssociationQCM;
