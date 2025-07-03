exports.InterfaceSelectionRessourceCours = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Type_Diagnostic_1 = require("Type_Diagnostic");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ToucheClavier_1 = require("ToucheClavier");
const Tooltip_1 = require("Tooltip");
class InterfaceSelectionRessourceCours extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.couleur = GApplication.getCouleur();
		this.classCssScroll = GUID_1.GUID.getClassCss() + "_scroll";
		this.estPronotePrim = [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.PrimEleve,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	jsxNodeRessource(aGenreRessource, aNumeroLigne, aNode) {
		const lDescripteur = this._parametres.ressources[aGenreRessource];
		if (
			!lDescripteur ||
			!lDescripteur.liste ||
			!lDescripteur.liste.get(aNumeroLigne)
		) {
			return;
		}
		const lRessource = lDescripteur.liste.get(aNumeroLigne);
		const lNonEditable =
			this._parametres.nonEditable ||
			(lDescripteur.fonctionNonEditable &&
				lDescripteur.fonctionNonEditable(lRessource));
		if (lNonEditable) {
			return;
		}
		$(aNode).on({
			click: () => {
				if (this._parametres.callbackAjoutRessource) {
					this._parametres.callbackAjoutRessource(aGenreRessource, lRessource);
				}
			},
			keyup: (aEvent) => {
				if (ObjetNavigateur_1.Navigateur.isToucheSelection()) {
					if (this._parametres.callbackAjoutRessource) {
						this._parametres.callbackAjoutRessource(
							aGenreRessource,
							lRessource,
						);
					}
				} else if (
					ToucheClavier_1.ToucheClavierUtil.estEventSupprimer(aEvent)
				) {
					if (
						lDescripteur.avecSuppression &&
						this._parametres.callbackSuppressionRessource
					) {
						this._parametres.callbackSuppressionRessource(
							aGenreRessource,
							aNumeroLigne,
							lRessource,
						);
					}
				}
			},
			contextmenu: () => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					initCommandes: (aMenu) => {
						aMenu.add(
							this._parametres.libelleMenuAjouterRessource,
							true,
							() => {
								if (this._parametres.callbackAjoutRessource) {
									this._parametres.callbackAjoutRessource(
										aGenreRessource,
										lRessource,
									);
								}
							},
						);
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
							!!this._parametres.callbackSuppressionRessource &&
								lDescripteur.avecSuppression,
							() => {
								this._parametres.callbackSuppressionRessource(
									aGenreRessource,
									aNumeroLigne,
									lRessource,
								);
							},
						);
					},
				});
			},
		});
	}
	jsxModeleBoutonSupprimerRessource(aGenreRessource, aNumeroLigne) {
		return {
			event: (aEvent) => {
				const lDescripteur = this._parametres.ressources[aGenreRessource];
				if (
					!lDescripteur ||
					!lDescripteur.liste ||
					!lDescripteur.liste.get(aNumeroLigne)
				) {
					return;
				}
				const lRessource = lDescripteur.liste.get(aNumeroLigne);
				aEvent.stopPropagation();
				this._parametres.callbackSuppressionRessource(
					aGenreRessource,
					aNumeroLigne,
					lRessource,
				);
			},
		};
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return "&nbsp;";
	}
	setDonneesSelectionRessourceCours(aParametres) {
		this._parametres = {
			nonEditable: false,
			ressources: {},
			ordreRessources: [],
			avecDiagnostic: true,
			diagnostic: null,
			diagnosticPlace: null,
			largeur: 250,
			largeurColDiagno: 70,
			largeurDiagnosticImage: 9,
			hauteurLigneTitre: 20,
			hauteurLigneContenu: 20,
			hauteurIconesDiagno: 11,
			couleurFondListe: this.couleur.blanc,
			couleurFondListeNonEditable: this.couleur.nonEditable.fond,
			couleurFond: null,
			libelleMenuAjouterRessource: ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.RemplacerRessource",
			),
			callbackAjoutRessource: null,
			callbackSuppressionRessource: null,
		};
		$.extend(this._parametres, aParametres);
		for (
			let iGenreRessource = 0;
			iGenreRessource < this._parametres.ordreRessources.length;
			iGenreRessource++
		) {
			const lGenreRessource = this._parametres.ordreRessources[iGenreRessource];
			const lParamRessource = this._parametres.ressources[lGenreRessource];
			if (lParamRessource) {
				this._parametres.ressources[lGenreRessource] = $.extend(
					{
						genre: lGenreRessource,
						libelle: "",
						liste: new ObjetListeElements_1.ObjetListeElements(),
						afficherNombreRessources: true,
						nbLignesMax: 5,
						avecAjout: true,
						avecAjoutSeulementSiVide: false,
						avecEdition: true,
						avecSuppression:
							lGenreRessource !== Enumere_Ressource_1.EGenreRessource.Matiere,
						htmlPastilleEntete: null,
					},
					lParamRessource,
				);
			}
		}
		this._parametres.couleur = GCouleur;
		this._donnees = { selection: null };
		$("#" + this.getNom().escapeJQ()).ieHtml(this._construireAffichage(), {
			controleur: this.controleur,
		});
	}
	_ajoutDeGenreRessource(aGenreRessource) {
		if (this._parametres.callbackAjoutRessource) {
			const lDescripteur = this._parametres.ressources[aGenreRessource];
			let lRessource = null;
			if (!lDescripteur.avecAjout && lDescripteur.liste) {
				lRessource = lDescripteur.liste.get(0);
			}
			this._parametres.callbackAjoutRessource(aGenreRessource, lRessource);
		}
	}
	_construireAffichage() {
		const H = [];
		H.push(
			'<div class="SansMain InterfaceSelectionRessourceCours',
			this._parametres.avecDiagnostic ? " EnDiagnostic" : "",
			'"',
			' style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeur),
			ObjetStyle_2.GStyle.composeCouleurBordure(
				this._parametres.couleur.bordure,
				1,
				ObjetStyle_1.EGenreBordure.haut +
					ObjetStyle_1.EGenreBordure.droite +
					ObjetStyle_1.EGenreBordure.gauche,
			),
			'">',
		);
		for (
			let iGenreRessource = 0;
			iGenreRessource < this._parametres.ordreRessources.length;
			iGenreRessource++
		) {
			const lGenreRessource = this._parametres.ordreRessources[iGenreRessource];
			const lDescripteurRessource =
				this._parametres.ressources[lGenreRessource];
			if (lDescripteurRessource) {
				if (
					!this.estPronotePrim ||
					InterfaceSelectionRessourceCours.ressourcesAcceptesPronotePrim.indexOf(
						lGenreRessource,
					) >= 0
				) {
					H.push(this._construireGenreRessource(lDescripteurRessource));
				}
			}
		}
		H.push("</div>");
		return H.join("");
	}
	_construireGenreRessource(aDescripteurRessource) {
		const H = [];
		H.push(this._construireTitreGenreRessource(aDescripteurRessource));
		if (
			aDescripteurRessource.liste &&
			aDescripteurRessource.liste.count() > 0
		) {
			H.push(
				IE.jsx.str(
					"div",
					{
						style: ObjetStyle_2.GStyle.composeCouleurBordure(
							this._parametres.couleur.bordure,
							1,
							ObjetStyle_1.EGenreBordure.bas,
						),
						role: "group",
						"aria-label": aDescripteurRessource.libelle,
					},
					this._construireListeGenreRessource(aDescripteurRessource),
				),
			);
		}
		return H.join("");
	}
	jsxNodeTitreRessource(aGenreRessource, aNode) {
		$(aNode).eventValidation(() => {
			this._ajoutDeGenreRessource(aGenreRessource);
		});
	}
	_construireTitreGenreRessource(aDescripteurRessource) {
		const lNbElements = aDescripteurRessource.liste.count();
		const lAvecAjout =
				!this._parametres.nonEditable &&
				aDescripteurRessource.avecAjout &&
				!!this._parametres.callbackAjoutRessource &&
				(!aDescripteurRessource.avecAjoutSeulementSiVide || lNbElements === 0),
			lAvecEditionSurAjout =
				!this._parametres.nonEditable &&
				!lAvecAjout &&
				aDescripteurRessource.avecEdition;
		const lIdTitreGenre = `${this.Nom}_g${aDescripteurRessource.genre}_lib`;
		return IE.jsx.str(
			"div",
			{
				style:
					ObjetStyle_2.GStyle.composeCouleurBordure(
						this._parametres.couleur.bordure,
						1,
						ObjetStyle_1.EGenreBordure.bas,
					) +
					ObjetStyle_2.GStyle.composeCouleurFond(
						this._parametres.couleurFond ||
							this._parametres.couleur.themeNeutre.moyen1,
					),
			},
			IE.jsx.str(
				"div",
				{
					class: [
						"LigneTitreRessource",
						lAvecAjout || lAvecEditionSurAjout
							? " LigneTitreRessourceEdition"
							: "",
					],
					"ie-node":
						lAvecAjout || lAvecEditionSurAjout
							? this.jsxNodeTitreRessource.bind(
									this,
									aDescripteurRessource.genre,
								)
							: "",
					style: ObjetStyle_2.GStyle.composeHeight(
						this._parametres.hauteurLigneTitre,
					),
				},
				IE.jsx.str(
					"div",
					{
						id: lIdTitreGenre,
						class: "libelleTitreRessource",
						"ie-ellipsis-fixe": true,
						style: { "line-height": this._parametres.hauteurLigneTitre + "px" },
						role: lAvecEditionSurAjout && !lAvecAjout ? "button" : false,
						tabindex: lAvecEditionSurAjout && !lAvecAjout ? "0" : false,
						"aria-haspopup":
							lAvecEditionSurAjout && !lAvecAjout ? "dialog" : false,
					},
					aDescripteurRessource.libelle,
				),
				(H) => {
					if (lAvecAjout) {
						const lBtnAjout = () => {
							return {
								event: (aEvent) => {
									aEvent.stopPropagation();
									this._ajoutDeGenreRessource(aDescripteurRessource.genre);
								},
							};
						};
						H.push(
							IE.jsx.str("ie-btnicon", {
								"ie-model": lBtnAjout,
								class: "icon_plus_cercle color-neutre",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"diagnostic.AjouterRessource",
								),
								"data-tooltip": Tooltip_1.Tooltip.Type.default,
								"aria-haspopup": "dialog",
								"aria-describedby": lIdTitreGenre,
							}),
						);
					}
					if (aDescripteurRessource.afficherNombreRessources) {
						H.push(
							'<div class="PetitEspaceDroit PetitEspaceGauche AlignementDroit"',
							' style="min-width:',
							this._parametres.avecDiagnostic
								? this._parametres.largeurColDiagno + 3
								: 6 + 6,
							'px;">',
							lNbElements || "",
							"</div>",
						);
					}
				},
			),
			(H) => {
				if (aDescripteurRessource.filtre && aDescripteurRessource.filtre.html) {
					if (aDescripteurRessource.filtre.controleur) {
						$.extend(this.controleur, aDescripteurRessource.filtre.controleur);
					}
					H.push(
						IE.jsx.str(
							"div",
							{ class: "Espace" },
							aDescripteurRessource.filtre.html,
						),
					);
				}
			},
		);
	}
	_construireListeGenreRessource(aDescripteurRessource) {
		const H = [];
		const lNbLignes = aDescripteurRessource.liste.count();
		let lILigne;
		let lRessource;
		let lRessourceDiagnostic;
		const lEditionAutoriseeParGenre =
			!this._parametres.nonEditable && !!aDescripteurRessource.avecEdition;
		H.push(
			'<div style="',
			ObjetStyle_2.GStyle.composeCouleurFond(
				lEditionAutoriseeParGenre
					? this._parametres.couleurFondListe
					: this._parametres.couleurFondListeNonEditable,
			),
			"max-height:",
			this._parametres.hauteurLigneContenu * aDescripteurRessource.nbLignesMax,
			'px;"',
			' class="overflow-y-auto"',
			">",
		);
		H.push(
			'<div class="ConteneurRessources" style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeur - 2),
			'">',
		);
		aDescripteurRessource.liste.trier();
		for (lILigne = 0; lILigne < lNbLignes; lILigne++) {
			lRessource = aDescripteurRessource.liste.get(lILigne);
			lRessourceDiagnostic = null;
			if (this._parametres.avecDiagnostic && this._parametres.diagnostic) {
				lRessourceDiagnostic =
					this._parametres.diagnostic.getElementParNumeroEtGenre(
						lRessource.getNumero(),
						aDescripteurRessource.genre,
					);
			}
			if (this._parametres.avecDiagnostic) {
				H.push(
					'<div style="display:flex; align-items:center;" class="full-width">',
				);
				H.push(
					this._construireRessource(
						lRessource,
						lRessourceDiagnostic,
						aDescripteurRessource,
						lILigne,
						lEditionAutoriseeParGenre,
					),
				);
				H.push(
					this._construireDiagnosticDeRessource(
						lRessource,
						lRessourceDiagnostic,
						aDescripteurRessource.genre ===
							Enumere_Ressource_1.EGenreRessource.Matiere
							? this._parametres.diagnosticPlace
							: null,
						aDescripteurRessource.genre,
					),
				);
				H.push("</div>");
			} else {
				H.push(
					this._construireRessource(
						lRessource,
						lRessourceDiagnostic,
						aDescripteurRessource,
						lILigne,
						lEditionAutoriseeParGenre,
					),
				);
			}
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_construireRessource(
		aRessource,
		aDiagnosticRessource,
		aDescripteurRessource,
		aLigneRessource,
		aEditionAutoriseeParGenre,
	) {
		const H = [];
		const lDiagsPermanences = [
			Type_Diagnostic_1.TypeDiagnostic.DiagOccupePermanence,
			Type_Diagnostic_1.TypeDiagnostic.DiagOccupePermanenceVerrouillee,
		];
		const lLargeurRessource =
			this._parametres.largeur -
			2 +
			(this._parametres.avecDiagnostic
				? -this._parametres.largeurColDiagno
				: 0);
		const lDiag = aDiagnosticRessource ? aDiagnosticRessource.diag : null;
		const lDiagComposantes = null;
		const lDiagnosticOccupe =
			lDiag &&
			(lDiag.contains(Type_Diagnostic_1.TypeDiagnostic.DiagOccupe) ||
				lDiag.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagOccupeVerrouilleDure,
				));
		const lDiagnosticOccupeComposantes =
			lDiagComposantes &&
			(lDiagComposantes.contains(Type_Diagnostic_1.TypeDiagnostic.DiagOccupe) ||
				lDiagComposantes.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagOccupeVerrouilleDure,
				));
		const lDiagnosticOccupeConseil =
			lDiag &&
			lDiag.contains(Type_Diagnostic_1.TypeDiagnostic.DiagPresenceConseil);
		const lDiagOccupePermanence =
			(lDiag &&
				new TypeEnsembleNombre_1.TypeEnsembleNombre()
					.add(lDiagsPermanences)
					.intersect(lDiag)
					.count() > 0) ||
			(lDiagComposantes &&
				new TypeEnsembleNombre_1.TypeEnsembleNombre()
					.add(lDiagsPermanences)
					.intersect(lDiagComposantes)
					.count() > 0);
		const lRessourceNonEditable =
			aDescripteurRessource.fonctionNonEditable &&
			aDescripteurRessource.fonctionNonEditable(aRessource);
		const lNonEditable = !aEditionAutoriseeParGenre || lRessourceNonEditable;
		const lAvecSuppression =
			!lNonEditable &&
			aDescripteurRessource.avecSuppression &&
			!!this._parametres.callbackSuppressionRessource;
		let lChaineRessource = aRessource.getLibelle();
		if (
			aDescripteurRessource.genre ===
				Enumere_Ressource_1.EGenreRessource.Salle ||
			aDescripteurRessource.genre ===
				Enumere_Ressource_1.EGenreRessource.Materiel
		) {
			if (aRessource.nombre > 1) {
				lChaineRessource = ObjetChaine_1.GChaine.format("%s (x%s)", [
					lChaineRessource,
					aRessource.nombre,
				]);
			}
		} else if (aRessource.provenanceGroupe && aRessource.libelleGroupe) {
			lChaineRessource += " [" + aRessource.libelleGroupe + "]";
		}
		if (
			aDescripteurRessource.genre ===
				Enumere_Ressource_1.EGenreRessource.Personnel &&
			aRessource.estAccompagnant
		) {
			lChaineRessource = ObjetChaine_1.GChaine.format("%s %s", [
				lChaineRessource,
				IE.jsx.str("i", {
					class: "icon_accompagnant",
					role: "img",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"PersonnelAccompagnant",
					),
				}),
			]);
			if (aRessource.strEleves) {
				lChaineRessource = ObjetChaine_1.GChaine.format("%s (%s)", [
					lChaineRessource,
					aRessource.strEleves,
				]);
			}
		}
		const lTitle = lDiagnosticOccupe
			? ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"diagnostic.RessourceOccupe",
					),
					[aRessource.getLibelle()],
				)
			: lDiagnosticOccupeConseil
				? ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.RessourceOccupeConseil",
						),
						[aRessource.getLibelle()],
					)
				: lDiagnosticOccupeComposantes
					? ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"diagnostic.ElevesOccupes",
							),
							[aRessource.getLibelle()],
						)
					: lDiagOccupePermanence
						? ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"diagnostic.RessourceOccupePermanence",
								),
								[aRessource.getLibelle()],
							)
						: "";
		const lHauteur = this._parametres.hauteurLigneContenu;
		let lCouleurTexte = null;
		if (
			lDiagnosticOccupe ||
			lDiagnosticOccupeConseil ||
			lDiagnosticOccupeComposantes
		) {
			lCouleurTexte = this.couleur.diagnostic.occupation;
		} else if (lDiagOccupePermanence) {
			lCouleurTexte = this.couleur.diagnostic.occupationPermanence;
		} else if (aRessource.provenanceGroupe) {
			lCouleurTexte = "#A9A9A9";
		}
		const lClassPastille = lNonEditable
			? aEditionAutoriseeParGenre
				? " PastilleRessourceEditableInterdit"
				: ""
			: " PastilleRessourceEditable";
		H.push(
			IE.jsx.str(
				"div",
				{
					style: this._parametres.avecDiagnostic
						? ObjetStyle_2.GStyle.composeWidth(lLargeurRessource) +
							ObjetStyle_2.GStyle.composeCouleurBordure(
								this._parametres.couleur.bordure,
								1,
								ObjetStyle_1.EGenreBordure.droite,
							)
						: "width: 100%;",
				},
				IE.jsx.str(
					"div",
					{
						class: "LigneRessource",
						style:
							ObjetStyle_2.GStyle.composeHeight(lHauteur) +
							"line-height:" +
							lHauteur +
							"px;",
					},
					IE.jsx.str(
						"div",
						{
							style:
								ObjetStyle_2.GStyle.composeCouleurFond(
									this.couleur.themeNeutre.moyen1,
								) + "line-height:14px;",
							class: `PastilleRessource ${lClassPastille}`,
							"ie-node": lNonEditable
								? false
								: this.jsxNodeRessource.bind(
										this,
										aDescripteurRessource.genre,
										aLigneRessource,
									),
							"aria-disabled": lNonEditable ? "true" : false,
							"ie-draggable-fantome": lAvecSuppression
								? this.jsxFantomeLigneSuppression.bind(
										this,
										aRessource,
										aDescripteurRessource.genre,
										aLigneRessource,
									)
								: false,
						},
						aDescripteurRessource.htmlPastilleEntete
							? aDescripteurRessource.htmlPastilleEntete(aRessource) || ""
							: "",
						IE.jsx.str(
							"div",
							{
								style: lCouleurTexte
									? ObjetStyle_2.GStyle.composeCouleurTexte(lCouleurTexte)
									: "",
								class: `TextePastille ${aRessource.absenceRessource && !this._parametres.avecDiagnostic ? " Barre" : ""}`,
								"ie-tooltipdescribe": lTitle ? lTitle : false,
								"ie-ellipsis": true,
								role: lNonEditable ? false : "button",
								"aria-haspopup": lNonEditable ? false : "dialog",
								tabindex: "0",
							},
							lChaineRessource,
						),
						lAvecSuppression
							? IE.jsx.str("ie-btnicon", {
									"ie-model": this.jsxModeleBoutonSupprimerRessource.bind(
										this,
										aDescripteurRessource.genre,
										aLigneRessource,
									),
									"aria-label":
										ObjetTraduction_1.GTraductions.getValeur("Supprimer") +
										" " +
										lChaineRessource,
									"data-tooltip": Tooltip_1.Tooltip.Type.default,
									class: "icon_remove color-neutre",
								})
							: "",
					),
				),
			),
		);
		return H.join("");
	}
	jsxFantomeLigneSuppression(aRessource, aGenreRessource, aNumeroLigne) {
		return {
			getIdZone: () => {
				return $("#" + this.getNom().escapeJQ() + " :first").get(0);
			},
			start: function (aParams) {
				aParams.data.libelle = aRessource.getLibelle();
			},
			stop: (aParams) => {
				if (aParams.data.horsZoneSuppression) {
					this._parametres.callbackSuppressionRessource(
						aGenreRessource,
						aNumeroLigne,
						aRessource,
					);
				}
			},
			drag: function (aParams) {
				aParams.data.horsZoneSuppression = aParams.horsZone;
			},
		};
	}
	_construireDiagnosticDeRessource(
		aRessource,
		aDiagnosticRessource,
		aDiagnosticPlace,
		aGenreRessource,
	) {
		const H = [];
		H.push(
			'<div class="ConteneurDiagnostic" style="',
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurLigneContenu),
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurColDiagno),
			'">',
		);
		if (aDiagnosticPlace) {
			if (
				aDiagnosticPlace.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagJourFerie,
				)
			) {
				H.push(this._construireDiagnosticJourFerie());
			}
		}
		const lDiagnostic = aDiagnosticRessource && aDiagnosticRessource.diag;
		if (aDiagnosticRessource && aDiagnosticRessource.partiesLieesOccupees) {
			H.push(
				IE.jsx.str("div", {
					class: "AlignementMilieu Image_Diagnostic_LienManuel",
					role: "img",
					"ie-tooltiplabel":
						ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.PartiesLieesOccupees",
						) +
						"\n" +
						aDiagnosticRessource.partiesLieesOccupees,
				}),
			);
		}
		if (lDiagnostic) {
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagOccupeVerrouilleDure,
				)
			) {
				H.push(
					IE.jsx.str("i", {
						class: "icon_lock",
						style: "color: #ED5555; font-size:0.9rem;",
						role: "img",
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"EDT.CoursVerrouille",
						),
					}),
				);
			}
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteDureRessource,
				)
			) {
				H.push(this._construireDiagnosticIndispoDure(aRessource));
			}
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagAbsenceRessource,
				)
			) {
				H.push(this._construireDiagnosticAbsenceRessource());
			}
			const lDiagnosticsDP = new TypeEnsembleNombre_1.TypeEnsembleNombre()
				.add(lDiagnostic)
				.intersect(Type_Diagnostic_1.TypeDiagnosticUtil.getDiagnosticsDP());
			if (lDiagnosticsDP.count() > 0) {
				H.push(this._construireDiagnosticDP());
			}
			const lDiagnosticsSite = new TypeEnsembleNombre_1.TypeEnsembleNombre()
				.add(lDiagnostic)
				.intersect(Type_Diagnostic_1.TypeDiagnosticUtil.getDiagnosticsSite());
			if (lDiagnosticsSite.count() > 0) {
				H.push(this._construireDiagnosticSite(aRessource, lDiagnosticsSite));
			}
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteEtablissement,
				)
			) {
				H.push(this._construireDiagnosticIndispoEtab());
			}
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagChangementCycleGAEV,
				)
			) {
				H.push(this._construireDiagnosticGAEV());
			}
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagOccupeSuperposable,
				)
			) {
				let lTitle = "";
				switch (aGenreRessource) {
					case Enumere_Ressource_1.EGenreRessource.Eleve:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.EleveOccupeClasseOuPartie",
						);
						break;
					case Enumere_Ressource_1.EGenreRessource.Classe:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.ClasseEleveDetacheOccupe",
						);
						break;
					case Enumere_Ressource_1.EGenreRessource.PartieDeClasse:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.PartieEleveDetacheOccupe",
						);
						break;
					case Enumere_Ressource_1.EGenreRessource.Groupe:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"diagnostic.GroupeEleveDetacheOccupe",
						);
						break;
					default:
				}
				if (lTitle) {
					H.push(
						IE.jsx.str("div", {
							class: "Image_Diagnostic_TOrange",
							"ie-tooltiplabel": lTitle,
						}),
					);
				}
			}
		}
		H.push("</div>");
		return H.join("");
	}
	_construireDiagnosticJourFerie() {
		return IE.jsx.str(
			"div",
			{
				role: "img",
				class: "Texte9 Gras",
				style: {
					width: this._parametres.largeurDiagnosticImage,
					height: this._parametres.hauteurIconesDiagno,
					"line-height": this._parametres.hauteurIconesDiagno + "px",
				},
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.JourFerie",
				),
			},
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.JourFerie_Abrev"),
		);
	}
	_construireDiagnosticIndispoDure(aRessource) {
		const lTitle = ObjetChaine_1.GChaine.format(
			ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.RessourceIndisponible",
			),
			[aRessource.getLibelle()],
		);
		return IE.jsx.str("div", {
			role: "img",
			style: {
				width: this._parametres.largeurDiagnosticImage,
				height: this._parametres.hauteurIconesDiagno,
				"line-height": `${this._parametres.hauteurIconesDiagno}px`,
				"background-color": this.couleur.diagnostic.indisponibilite,
			},
			"ie-tooltiplabel": lTitle,
		});
	}
	_construireDiagnosticAbsenceRessource() {
		return IE.jsx.str(
			"div",
			{
				class: "AlignementMilieu Texte9 Gras",
				role: "img",
				style: {
					width: this._parametres.largeurDiagnosticImage,
					height: this._parametres.hauteurIconesDiagno,
					"line-height": `${this._parametres.hauteurIconesDiagno}px`,
					"background-color": this.couleur.diagnostic.absenceRessource,
					color: this.couleur.blanc,
				},
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.RessourceAbsente",
				),
			},
			ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.AbsenceRessource_Abrev",
			),
		);
	}
	_construireDiagnosticDP() {
		return IE.jsx.str(
			"div",
			{
				class: "AlignementMilieu Texte9 Gras",
				role: "img",
				style: {
					width: this._parametres.largeurDiagnosticImage,
					"line-height": `${this._parametres.hauteurIconesDiagno}px`,
					"background-color": this.couleur.diagnostic.demiPension,
					color: this.couleur.blanc,
				},
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.AucunServiceDemiPension",
				),
			},
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.DemiPension_Abrev"),
		);
	}
	_construireDiagnosticGAEV() {
		return IE.jsx.str(
			"div",
			{
				role: "img",
				class: "AlignementMilieu Texte9 Gras",
				style: {
					width: this._parametres.largeurDiagnosticImage,
					height: this._parametres.hauteurIconesDiagno,
					"line-height": `${this._parametres.hauteurIconesDiagno}px`,
					"background-color": this.couleur.diagnostic.gaev,
					color: this.couleur.blanc,
				},
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.ChangementSemaineGAEV",
				),
			},
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.GAEV_Abrev"),
		);
	}
	_construireDiagnosticSite(aRessource, aDiagnostics) {
		const lTitle = [];
		if (
			aDiagnostics.contains(
				Type_Diagnostic_1.TypeDiagnostic.DiagSitesIncompatiblesHeureTransition,
			)
		) {
			lTitle.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.SitesIncompatiblesHeureTransition",
				),
			);
		}
		if (
			aDiagnostics.contains(
				Type_Diagnostic_1.TypeDiagnostic.DiagSitesIncompatiblesDureeTrajet,
			)
		) {
			lTitle.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.SitesIncompatiblesDureeTrajet",
				),
			);
		}
		if (
			aDiagnostics.contains(
				Type_Diagnostic_1.TypeDiagnostic
					.DiagSitesIncompatiblesNbTransitionsHebdo,
			)
		) {
			lTitle.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.SitesIncompatiblesNbTransitionsHebdo",
				),
			);
		}
		if (
			aDiagnostics.contains(
				Type_Diagnostic_1.TypeDiagnostic
					.DiagSitesIncompatiblesNbTransitionsJour,
			)
		) {
			lTitle.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.SitesIncompatiblesNbTransitionsJour",
				),
			);
		}
		return IE.jsx.str(
			"div",
			{
				role: "img",
				class: "AlignementMilieu Texte9 Gras",
				style: {
					width: 9,
					"line-height": this._parametres.hauteurIconesDiagno + "px",
					"background-color": this.couleur.diagnostic.site,
					color: this.couleur.blanc,
				},
				"ie-tooltiplabel": lTitle.join("\n"),
			},
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.Site_Abrev"),
		);
	}
	_construireDiagnosticIndispoEtab() {
		return IE.jsx.str("div", {
			role: "img",
			class: "AlignementMilieu Texte9 Gras Image_Diagnostic_IndispoEtab",
			style: {
				width: 13,
				"background-color": this.couleur.noir,
				color: this.couleur.blanc,
			},
			"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.DJNonTravaille",
			),
		});
	}
}
exports.InterfaceSelectionRessourceCours = InterfaceSelectionRessourceCours;
InterfaceSelectionRessourceCours.ressourcesAcceptesPronotePrim = [
	Enumere_Ressource_1.EGenreRessource.Matiere,
	Enumere_Ressource_1.EGenreRessource.LibelleCours,
	Enumere_Ressource_1.EGenreRessource.Enseignant,
	Enumere_Ressource_1.EGenreRessource.Classe,
];
