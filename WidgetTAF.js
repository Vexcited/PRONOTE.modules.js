exports.WidgetTAF = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetGalerieCarrousel_1 = require("ObjetGalerieCarrousel");
const TypeGenreMiniature_1 = require("TypeGenreMiniature");
const AccessApp_1 = require("AccessApp");
class WidgetTAF extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	creerObjetsTAF() {
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte(
				this.Nom + ".utilitaireCDT",
				this,
				this.surUtilitaireCDT,
			);
	}
	surUtilitaireCDT() {
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			surTAF(aNumeroTaf) {
				$(this.node).eventValidation(() => {
					aInstance._surTAF(aNumeroTaf);
				});
			},
			getCarrouselTAF(aNumeroTAF) {
				return {
					class: ObjetGalerieCarrousel_1.ObjetGalerieCarrousel,
					pere: aInstance,
					init: (aCarrousel) => {
						aCarrousel.setOptions({
							dimensionPhoto: IE.estMobile ? 200 : 250,
							tailleFixe: true,
							nbMaxDiaposEnZoneVisible: 10,
							sansBlocLibelle: true,
							altImage: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.altImage.TAF",
							),
						});
						aCarrousel.initialiser();
					},
					start: (aCarrousel) => {
						let lTAF =
							aInstance.donnees.listeTAF.getElementParNumero(aNumeroTAF);
						const lListeDiapos = new ObjetListeElements_1.ObjetListeElements();
						if (lTAF && lTAF.listeDocumentJoint) {
							lTAF.listeDocumentJoint.parcourir((aPJ) => {
								if (aPJ.avecMiniaturePossible) {
									let lDiapo = new ObjetElement_1.ObjetElement();
									lDiapo.setLibelle(aPJ.getLibelle());
									aPJ.miniature = IE.estMobile
										? TypeGenreMiniature_1.TypeGenreMiniature.GM_400
										: TypeGenreMiniature_1.TypeGenreMiniature.GM_500;
									lDiapo.documentCasier = aPJ;
									lListeDiapos.add(lDiapo);
								}
							});
						}
						aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
					},
				};
			},
			modelBoutonQCMTAF: {
				event(aNumeroTAF) {
					aInstance._surQCMTAF(aNumeroTAF);
				},
			},
		});
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.peuFaireTAF = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
		].includes(GEtatUtilisateur.GenreEspace);
		const lThis = this;
		$.extend(this.controleur, {
			cbTAFFait: {
				getValue: function (aNumeroTaf) {
					const lTAF = lThis.donnees.listeTAF.getElementParNumero(aNumeroTaf);
					return !!lTAF && lTAF.TAFFait;
				},
				setValue: function (aNumeroTaf, aValue) {
					const lTAF = lThis.donnees.listeTAF.getElementParNumero(aNumeroTaf);
					if (!!lTAF) {
						lTAF.TAFFait = aValue;
						lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
							lThis,
							lThis.surUtilitaireCDT,
						).lancerRequete({ listeTAF: lThis.donnees.listeTAF });
					}
				},
				getHint: function (aNumeroTaf) {
					let lHint = "";
					const lTAF = lThis.donnees.listeTAF.getElementParNumero(aNumeroTaf);
					if (!!lTAF) {
						lHint = lTAF.TAFFait
							? ObjetTraduction_1.GTraductions.getValeur(
									"accueil.hintTravailFait",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"accueil.hintTravailAFaire",
								);
					}
					return lHint;
				},
				getDisabled: function () {
					return !lThis.peuFaireTAF;
				},
			},
		});
		this.creerObjetsTAF();
		if (this.donnees.listeTAF) {
			this.donnees.listeTAF.setTri([
				ObjetTri_1.ObjetTri.init("ordre"),
				ObjetTri_1.ObjetTri.init((aElement) => {
					return aElement.matiere.getLibelle();
				}),
			]);
			this.donnees.listeTAF.trier();
		}
		const lWidget = {
			getHtml: this.composeWidgetTAF.bind(this),
			nbrElements: this.donnees.listeTAF ? this.donnees.listeTAF.count() : 0,
			afficherMessage:
				!this.donnees.listeTAF || this.donnees.listeTAF.count() === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetTAF() {
		const H = [];
		let lDate, lTaf;
		const lDicoPourLeTaf = {};
		if (this.donnees.listeTAF && this.donnees.listeTAF.count() > 0) {
			H.push('<div class="conteneur-liste-CDT">');
			H.push('<ul class="liste-imbriquee">');
			for (let I = 0; I < this.donnees.listeTAF.count(); I++) {
				lTaf = this.donnees.listeTAF.get(I);
				lTaf.indice = I;
				if (!lDicoPourLeTaf[lTaf.pourLe.toDateString()]) {
					lDicoPourLeTaf[lTaf.pourLe.toDateString()] = [];
				}
				lDicoPourLeTaf[lTaf.pourLe.toDateString()].push(lTaf);
			}
			if (this.donnees.listeTAF.count() > 0) {
				for (lDate in lDicoPourLeTaf) {
					const lDateConcernee = new Date(lDate);
					H.push("<li>");
					H.push(this.composeDate(lDateConcernee));
					H.push('<ul class="sub-liste cols">');
					for (const i in lDicoPourLeTaf[lDate]) {
						lTaf = lDicoPourLeTaf[lDate][i];
						H.push(this.composeTAF(lTaf.indice, lTaf, lDateConcernee));
					}
					H.push("</ul>");
					H.push("</li>");
				}
			}
			H.push("</ul>");
			H.push("</div>");
		}
		return H.join("");
	}
	getIdDate(aDate) {
		const lIdDate = [this.donnees.id, "_date"];
		if (aDate) {
			lIdDate.push("_", aDate.getFullYear().toString());
			lIdDate.push("_", aDate.getMonth().toString());
			lIdDate.push("_", aDate.getDate().toString());
		}
		return lIdDate.join("");
	}
	composeDate(aDate) {
		const H = [];
		H.push('<h3 id="', this.getIdDate(aDate), '">');
		H.push(
			"<span>",
			(
				ObjetTraduction_1.GTraductions.getValeur("accueil.pour") +
				"</span>" +
				" " +
				ObjetDate_1.GDate.formatDate(aDate, "[" + "%JJJJ %J %MMM" + "]")
			)
				.toLowerCase()
				.ucfirst(),
		);
		H.push("</h3>");
		return H.join("");
	}
	composeMatiere(aTaf) {
		const H = [];
		H.push(
			'<span class="titre-matiere ',
			(!!aTaf.executionQCM ? aTaf.QCMFait : aTaf.TAFFait) ? "est-fait" : "",
			'">',
			aTaf.matiere.getLibelle(),
			"</span>",
		);
		return H.join("");
	}
	composeTAF(i, aTaf, aDateConcernee) {
		const H = [];
		const lAvecERendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				aTaf.genreRendu,
			);
		const lEstQCM = !!aTaf.executionQCM;
		const lEstFait = lEstQCM ? aTaf.QCMFait : aTaf.TAFFait;
		H.push(
			"<li ",
			ObjetWAI_1.GObjetWAI.composeAttribut({
				genre: ObjetWAI_1.EGenreAttribut.labelledby,
				valeur: this.getIdDate(aDateConcernee),
			}),
			">",
		);
		H.push('<div class="wrap conteneur-item">');
		let lTitleTafFait = "";
		if (!this.peuFaireTAF && aTaf.TAFFait) {
			lTitleTafFait = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.hintParentTravailFait",
				[GEtatUtilisateur.getMembre().getLibelle()],
			);
		}
		H.push(
			'<div tabindex="0" role="link" ie-node="surTAF(\'' +
				aTaf.getNumero() +
				'\')" class="as-header"',
			lTitleTafFait ? 'title="' + lTitleTafFait + '"' : "",
			">",
			'<div class="with-color" style="--couleur-matiere:',
			aTaf.CouleurFond,
			';margin-left:.8rem;">',
			this.composeMatiere(aTaf),
			"</div>",
		);
		H.push(
			' <ie-chips class="fix-bloc tag-style',
			lEstFait ? "ThemeCat-pedagogie" : "",
			'">',
			lEstFait
				? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.TAFFait")
				: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.TAFNonFait"),
			"</ie-chips>",
		);
		H.push("</div>");
		H.push(
			' <div class="m-left">',
			'<div class="as-content ',
			" avecAction",
			lEstFait && !lEstQCM ? " done" : "",
			'" aria-labelledby="' + this.Nom + "_" + i + '">',
		);
		if (aTaf.listeDocumentJoint) {
			aTaf.listeDocumentJoint.trier();
		}
		H.push(
			'<div class="description widgetTAF ',
			!lEstQCM ? "tiny-view " : "",
			lEstFait ? "est-fait" : "",
			'" id="' + this.Nom + "_" + i + '">',
			lEstQCM
				? '<i role="presentation" class="icon_qcm ThemeCat-pedagogie"></i>' +
						(lEstFait ? aTaf.descriptifCourt : aTaf.descriptif)
				: aTaf.descriptif,
			"</div>",
		);
		if (aTaf.listeDocumentJoint && aTaf.listeDocumentJoint.count() > 0) {
			H.push(this.composePiecesJointes(aTaf));
		}
		H.push("</div>", "</div>");
		if (!lEstQCM && !lAvecERendu) {
			if (
				aTaf.genreRendu ===
					TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPapier &&
				!aTaf.TAFFait
			) {
				H.push('<div class="taf-a-rendre">');
				H.push(
					'<div class="taf-btn-conteneur">',
					'<span class="as-info-light">',
					TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
						aTaf.genreRendu,
						false,
					),
					"</span></div>",
				);
				H.push("</div>");
			}
			if (GEtatUtilisateur.estEspaceEleve()) {
				H.push(
					'<div class="flex-contain conteneur-cb"><ie-checkbox class="cb-termine colored-label" ie-textleft ie-model="cbTAFFait(\'',
					aTaf.getNumero().toString(),
					"')\">",
					ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.cbTermine"),
					"</ie-checkbox></div>",
				);
			}
		} else if (lEstQCM) {
			const lAvecAction = UtilitaireQCM_1.UtilitaireQCM.estCliquable(
				aTaf.executionQCM,
			);
			if (lAvecAction) {
				const lBoutonExecution =
					!lEstFait && aTaf.executionQCM.estEnPublication;
				const lLibelleBouton =
					!lBoutonExecution &&
					(!GEtatUtilisateur.estEspacePourEleve() ||
						!UtilitaireQCM_1.UtilitaireQCM.estJouable(aTaf.executionQCM))
						? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.voirQCM")
						: ObjetTraduction_1.GTraductions.getValeur(
								"TAFEtContenu.executerQCM",
							);
				const lClasseBouton = !lBoutonExecution
					? "themeBoutonNeutre"
					: "themeBoutonSecondaire";
				const lIeModelBouton = "modelBoutonQCMTAF('" + aTaf.getNumero() + "')";
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ class: "flex-contain btn-qcm" },
							IE.jsx.str(
								"ie-bouton",
								{ "ie-model": lIeModelBouton, class: lClasseBouton },
								lLibelleBouton,
							),
						),
					),
				);
			}
		} else {
			H.push('<div class="taf-a-rendre">');
			H.push(
				this.utilitaireCDT.composeTAFARendrePourWidget(aTaf, {
					nom: this.Nom,
					controleur: this.controleur,
					listeTAF: this.donnees.listeTAF,
				}),
			);
			H.push("</div>");
		}
		H.push("</div>");
		H.push("</li>");
		return H.join("");
	}
	composePiecesJointes(aElement) {
		const H = [];
		const lListe = aElement.listeDocumentJoint;
		H.push('<div class="piece-jointe">');
		let lAvecImage = false;
		for (let I = 0; I < lListe.count(); I++) {
			const lPieceJointe = lListe.get(I);
			if (!lPieceJointe.avecMiniaturePossible) {
				H.push(
					'<div class="chips-pj">',
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lPieceJointe,
						maxWidth: 300,
					}),
					"</div>",
				);
			} else {
				lAvecImage = true;
			}
		}
		H.push("</div>");
		if (lAvecImage) {
			H.push(
				"<div ie-identite=\"getCarrouselTAF('",
				aElement.getNumero().toString(),
				"')\"></div>",
			);
		}
		return H.join("");
	}
	_surQCMTAF(aNumeroTaf) {
		const lTaf = this.donnees.listeTAF.getElementParNumero(aNumeroTaf);
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM,
			lTaf.executionQCM,
		);
	}
	_surTAF(aNumeroTaf) {
		const lTaf = this.donnees.listeTAF.getElementParNumero(aNumeroTaf);
		let lPageDestination;
		if (this.etatUtilisateurSco.estEspaceMobile()) {
			lPageDestination = {
				genreOngletDest: Enumere_Onglet_1.EGenreOnglet.CDT_TAF,
				taf: lTaf,
			};
		} else {
			lPageDestination = {
				Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_TAF,
				taf: lTaf,
			};
		}
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
			lPageDestination,
		);
	}
}
exports.WidgetTAF = WidgetTAF;
