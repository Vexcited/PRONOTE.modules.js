exports.InterfaceSelectionRessourceCours = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
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
const tag_1 = require("tag");
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeTitreRessource: function (aGenreRessource) {
				$(this.node).on("click", () => {
					aInstance._ajoutDeGenreRessource(aGenreRessource);
				});
			},
			btnAjout: {
				event: function (aGenreRessource, aEvent) {
					aEvent.stopPropagation();
					aInstance._ajoutDeGenreRessource(aGenreRessource);
				},
			},
			fantomeLigneSuppression: function (aGenreRessource, aNumeroLigne) {
				const lDescripteur = aInstance._parametres.ressources[aGenreRessource];
				if (
					!lDescripteur ||
					!lDescripteur.liste ||
					!lDescripteur.liste.get(aNumeroLigne)
				) {
					return;
				}
				const lRessource = lDescripteur.liste.get(aNumeroLigne);
				return {
					getIdZone: function () {
						return $("#" + aInstance.getNom().escapeJQ() + " :first").get(0);
					},
					start: function (aParams) {
						aParams.data.libelle = lRessource.getLibelle();
					},
					stop: function (aParams) {
						if (aParams.data.horsZoneSuppression) {
							aInstance._parametres.callbackSuppressionRessource(
								aGenreRessource,
								aNumeroLigne,
								lRessource,
							);
						}
					},
					drag: function (aParams) {
						aParams.data.horsZoneSuppression = aParams.horsZone;
					},
				};
			},
			getNodeRessource: function (aGenreRessource, aNumeroLigne) {
				const lDescripteur = aInstance._parametres.ressources[aGenreRessource];
				if (
					!lDescripteur ||
					!lDescripteur.liste ||
					!lDescripteur.liste.get(aNumeroLigne)
				) {
					return;
				}
				const lRessource = lDescripteur.liste.get(aNumeroLigne);
				const lNonEditable =
					aInstance._parametres.nonEditable ||
					(lDescripteur.fonctionNonEditable &&
						lDescripteur.fonctionNonEditable(lRessource));
				if (lNonEditable) {
					return;
				}
				$(this.node).on({
					click: function () {
						if (aInstance._parametres.callbackAjoutRessource) {
							aInstance._parametres.callbackAjoutRessource(
								aGenreRessource,
								lRessource,
							);
						}
					},
					keyup: function () {
						if (GNavigateur.isToucheSelection()) {
							if (aInstance._parametres.callbackAjoutRessource) {
								aInstance._parametres.callbackAjoutRessource(
									aGenreRessource,
									lRessource,
								);
							}
						} else if (GNavigateur.isToucheSupprimer()) {
							if (
								lDescripteur.avecSuppression &&
								aInstance._parametres.callbackSuppressionRessource
							) {
								aInstance._parametres.callbackSuppressionRessource(
									aGenreRessource,
									aNumeroLigne,
									lRessource,
								);
							}
						}
					},
					contextmenu: function () {
						ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
							pere: aInstance,
							initCommandes: function (aMenu) {
								aMenu.add(
									aInstance._parametres.libelleMenuAjouterRessource,
									true,
									() => {
										if (aInstance._parametres.callbackAjoutRessource) {
											aInstance._parametres.callbackAjoutRessource(
												aGenreRessource,
												lRessource,
											);
										}
									},
								);
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
									!!aInstance._parametres.callbackSuppressionRessource &&
										lDescripteur.avecSuppression,
									() => {
										aInstance._parametres.callbackSuppressionRessource(
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
			},
			btnRessourceSupp: {
				event: function (aGenreRessource, aNumeroLigne, aEvent) {
					const lDescripteur =
						aInstance._parametres.ressources[aGenreRessource];
					if (
						!lDescripteur ||
						!lDescripteur.liste ||
						!lDescripteur.liste.get(aNumeroLigne)
					) {
						return;
					}
					const lRessource = lDescripteur.liste.get(aNumeroLigne);
					aEvent.stopPropagation();
					aInstance._parametres.callbackSuppressionRessource(
						aGenreRessource,
						aNumeroLigne,
						lRessource,
					);
				},
			},
		});
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
				'<div style="',
				ObjetStyle_2.GStyle.composeCouleurBordure(
					this._parametres.couleur.bordure,
					1,
					ObjetStyle_1.EGenreBordure.bas,
				),
				'" ',
				">",
			);
			H.push(this._construireListeGenreRessource(aDescripteurRessource));
			H.push("</div>");
		}
		return H.join("");
	}
	_construireTitreGenreRessource(aDescripteurRessource) {
		const H = [];
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
		H.push(
			'<div style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				this._parametres.couleur.bordure,
				1,
				ObjetStyle_1.EGenreBordure.bas,
			),
			ObjetStyle_2.GStyle.composeCouleurFond(
				this._parametres.couleurFond ||
					this._parametres.couleur.themeNeutre.moyen1,
			),
			'" ',
			">",
		);
		H.push(
			"<div ",
			'class="LigneTitreRessource',
			lAvecAjout || lAvecEditionSurAjout ? " LigneTitreRessourceEdition" : "",
			'" ',
			lAvecAjout || lAvecEditionSurAjout
				? ObjetHtml_1.GHtml.composeAttr(
						"ie-node",
						"getNodeTitreRessource",
						aDescripteurRessource.genre,
					)
				: "",
			'style="',
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurLigneTitre),
			'">',
		);
		H.push(
			'<div class="libelleTitreRessource" ie-ellipsis-fixe style="line-height:',
			this._parametres.hauteurLigneTitre,
			'px;">',
			aDescripteurRessource.libelle,
			"</div>",
		);
		if (lAvecAjout) {
			H.push(
				"<ie-btnicon",
				ObjetHtml_1.GHtml.composeAttr(
					"ie-model",
					"btnAjout",
					aDescripteurRessource.genre,
				),
				'class="icon_plus_cercle color-neutre" title="',
				ObjetTraduction_1.GTraductions.getValeur("diagnostic.AjouterRessource"),
				'">',
				"</ie-btnicon>",
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
		H.push("</div>");
		if (aDescripteurRessource.filtre && aDescripteurRessource.filtre.html) {
			if (aDescripteurRessource.filtre.controleur) {
				$.extend(this.controleur, aDescripteurRessource.filtre.controleur);
			}
			H.push(
				'<div class="Espace">',
				aDescripteurRessource.filtre.html,
				"</div>",
			);
		}
		H.push("</div>");
		return H.join("");
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
				(0, tag_1.tag)("i", { class: "icon_accompagnant" }),
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
			(0, tag_1.tag)(
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
				(0, tag_1.tag)(
					"div",
					{
						class: "LigneRessource",
						style:
							ObjetStyle_2.GStyle.composeHeight(lHauteur) +
							"line-height:" +
							lHauteur +
							"px;",
					},
					(0, tag_1.tag)(
						"div",
						{
							style:
								ObjetStyle_2.GStyle.composeCouleurFond(
									this.couleur.themeNeutre.moyen1,
								) + "line-height:14px;",
							class: `PastilleRessource ${lClassPastille}`,
							"ie-node": lNonEditable
								? false
								: tag_1.tag.funcAttr("getNodeRessource", [
										aDescripteurRessource.genre,
										aLigneRessource,
									]),
							"aria-disabled": lNonEditable ? "true" : false,
							"ie-draggable-fantome": lAvecSuppression
								? tag_1.tag.funcAttr("fantomeLigneSuppression", [
										aDescripteurRessource.genre,
										aLigneRessource,
									])
								: false,
							tabindex: "0",
						},
						() => {
							return [
								aDescripteurRessource.htmlPastilleEntete
									? aDescripteurRessource.htmlPastilleEntete(aRessource) || ""
									: "",
								(0, tag_1.tag)(
									"div",
									{
										style: lCouleurTexte
											? ObjetStyle_2.GStyle.composeCouleurTexte(lCouleurTexte)
											: "",
										class: `TextePastille ${aRessource.absenceRessource && !this._parametres.avecDiagnostic ? " Barre" : ""}`,
										title: lTitle ? lTitle : false,
										"ie-ellipsis": true,
									},
									lChaineRessource,
								),
								lAvecSuppression
									? (0, tag_1.tag)("ie-btnicon", {
											"ie-model": tag_1.tag.funcAttr("btnRessourceSupp", [
												aDescripteurRessource.genre,
												aLigneRessource,
											]),
											title:
												ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
											class: "icon_remove color-neutre",
										})
									: "",
							].join("");
						},
					),
				),
			),
		);
		return H.join("");
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
				'<div class="AlignementMilieu Image_Diagnostic_LienManuel" ',
				'title="',
				ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(
						"diagnostic.PartiesLieesOccupees",
					) +
						"\n" +
						aDiagnosticRessource.partiesLieesOccupees,
				),
				'">',
				"</div>",
			);
		}
		if (lDiagnostic) {
			if (
				lDiagnostic.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagOccupeVerrouilleDure,
				)
			) {
				H.push(
					'<i class="icon_lock" style="color: #ED5555; font-size:0.9rem;"></i>',
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
						(0, tag_1.tag)("div", {
							class: "Image_Diagnostic_TOrange",
							title: lTitle,
						}),
					);
				}
			}
		}
		H.push("</div>");
		return H.join("");
	}
	_construireDiagnosticJourFerie() {
		const lTitle = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.JourFerie",
			),
			H = [];
		H.push(
			'<div class="Texte9 Gras" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurDiagnosticImage),
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurIconesDiagno),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.JourFerie_Abrev"),
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticIndispoDure(aRessource) {
		const lTitle = ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.RessourceIndisponible",
				),
				[aRessource.getLibelle()],
			),
			H = [];
		H.push(
			"<div ",
			'style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurDiagnosticImage),
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurIconesDiagno),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			ObjetStyle_2.GStyle.composeCouleurFond(
				this.couleur.diagnostic.indisponibilite,
			),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticAbsenceRessource() {
		const H = [],
			lTitle = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.RessourceAbsente",
			);
		H.push(
			'<div class=" AlignementMilieu Texte9 Gras" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurDiagnosticImage),
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurIconesDiagno),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			ObjetStyle_2.GStyle.composeCouleurFond(
				this.couleur.diagnostic.absenceRessource,
			),
			ObjetStyle_2.GStyle.composeCouleurTexte(this.couleur.blanc),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.AbsenceRessource_Abrev",
			),
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticDP() {
		const H = [],
			lTitle = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.AucunServiceDemiPension",
			);
		H.push(
			'<div class=" AlignementMilieu Texte9 Gras" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurDiagnosticImage),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			ObjetStyle_2.GStyle.composeCouleurFond(
				this.couleur.diagnostic.demiPension,
			),
			ObjetStyle_2.GStyle.composeCouleurTexte(this.couleur.blanc),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.DemiPension_Abrev"),
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticGAEV() {
		const H = [],
			lTitle = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.ChangementSemaineGAEV",
			);
		H.push(
			'<div class=" AlignementMilieu Texte9 Gras" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(this._parametres.largeurDiagnosticImage),
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurIconesDiagno),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			ObjetStyle_2.GStyle.composeCouleurFond(this.couleur.diagnostic.gaev),
			ObjetStyle_2.GStyle.composeCouleurTexte(this.couleur.blanc),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.GAEV_Abrev"),
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticSite(aRessource, aDiagnostics) {
		const H = [],
			lTitle = [];
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
		H.push(
			'<div class=" AlignementMilieu Texte9 Gras" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(9),
			"line-height:",
			this._parametres.hauteurIconesDiagno,
			"px;",
			ObjetStyle_2.GStyle.composeCouleurFond(this.couleur.diagnostic.site),
			ObjetStyle_2.GStyle.composeCouleurTexte(this.couleur.blanc),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle.join("\n")),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("diagnostic.Site_Abrev"),
			"</div>",
		);
		return H.join("");
	}
	_construireDiagnosticIndispoEtab() {
		const H = [],
			lTitle = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.DJNonTravaille",
			);
		H.push(
			'<div class="AlignementMilieu Texte9 Gras Image_Diagnostic_IndispoEtab" ',
			'style="',
			ObjetStyle_2.GStyle.composeWidth(13),
			ObjetStyle_2.GStyle.composeCouleurFond(this.couleur.noir),
			ObjetStyle_2.GStyle.composeCouleurTexte(this.couleur.blanc),
			'" ',
			'title="',
			ObjetChaine_1.GChaine.toTitle(lTitle),
			'">',
			"</div>",
		);
		return H.join("");
	}
}
exports.InterfaceSelectionRessourceCours = InterfaceSelectionRessourceCours;
InterfaceSelectionRessourceCours.ressourcesAcceptesPronotePrim = [
	Enumere_Ressource_1.EGenreRessource.Matiere,
	Enumere_Ressource_1.EGenreRessource.LibelleCours,
	Enumere_Ressource_1.EGenreRessource.Enseignant,
	Enumere_Ressource_1.EGenreRessource.Classe,
];
