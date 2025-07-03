exports.WidgetKiosque = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetImage_1 = require("ObjetImage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const UtilitaireManuelsNumeriques_1 = require("UtilitaireManuelsNumeriques");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const ObjetFenetre_ManuelsNumeriques_1 = require("ObjetFenetre_ManuelsNumeriques");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
require("IEHtml.MrFiche.js");
const AccessApp_1 = require("AccessApp");
class WidgetKiosque extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	_notificationKiosque() {
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	construire(aParams) {
		var _a;
		this.donnees = aParams.donnees;
		this.optionsKiosque = {
			avecNomEditeur: [
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace),
			avecDetailsRessources: [
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace),
			avecPanierRessources: [
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace),
			avecInformationNonResponsive: IE.estMobile,
			avecCumulMatiere: [
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
				Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			].includes(this.etatUtilisateurSco.GenreEspace),
		};
		const lWidget = {
			getHtml: this.composeWidgetKiosque.bind(this),
			nbrElements:
				(_a = this.donnees.listeRessources) === null || _a === void 0
					? void 0
					: _a.count(),
			afficherMessage: false,
			listeElementsGraphiques: [
				{
					htmlMrFiche:
						'<span class="as-mrfiche" ie-mrfichewidget="accueil.kiosques.mrFiche"></span>',
				},
			],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			nodeNonResponsive: function () {
				$(this.node).on({
					click: function (aEvent) {
						GApplication.getMessage().afficher({
							message: ObjetChaine_1.GChaine.toTitle(
								ObjetTraduction_1.GTraductions.getValeur(
									"Kiosque.ContenuNonResponsive",
								),
							),
						});
						aEvent.stopPropagation();
					},
				});
			},
			nodeMessageHint: function (aMessage) {
				$(this.node).on({
					click: function (aEvent) {
						const lMessage = ObjetChaine_1.GChaine.replaceRCToHTML(
							ObjetChaine_1.GChaine.ajouterEntites(aMessage),
						);
						GApplication.getMessage().afficher({ message: lMessage });
						aEvent.stopPropagation();
					},
				});
			},
			nodeEvenementPanier(aNumeroRessource) {
				$(this.node).eventValidation((e) => {
					aInstance._evntPanier(aNumeroRessource);
					e.originalEvent.stopPropagation();
				});
			},
		});
	}
	composeWidgetKiosque() {
		var _a, _b;
		const lDonnees =
			UtilitaireManuelsNumeriques_1.UtilitaireManuelsNumeriques.formatDonnees(
				this.donnees.listeRessources,
				this.optionsKiosque,
			);
		const H = [];
		let lMatiere, lRessource, lLien;
		for (
			let i = 0;
			i <
			((_a = lDonnees.liste) === null || _a === void 0 ? void 0 : _a.count());
			i++
		) {
			lRessource = lDonnees.liste.get(i);
			if (lRessource.matiere && lRessource.matiere.existeNumero()) {
				lDonnees.avecCumulMatiere = true;
			}
		}
		H.push('<ul class="liste-clickable">');
		for (
			let i = 0;
			i <
			((_b = lDonnees.liste) === null || _b === void 0 ? void 0 : _b.count());
			i++
		) {
			lRessource = lDonnees.liste.get(i);
			if (lDonnees.avecCumulMatiere) {
				if (
					!lMatiere ||
					lMatiere.getNumero() !== lRessource.matiere.getNumero()
				) {
					lMatiere = lRessource.matiere;
					H.push(
						'<li aria-level="4" class="has-title">',
						"<h3>",
						ObjetChaine_1.GChaine.avecEspaceSiVide(
							lRessource.matiere.getLibelle(),
						),
						"</h3>",
						"</li>",
					);
				}
			}
			lLien = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lRessource, {
				forcerURLComplete: true,
			});
			H.push(
				"<li",
				!this.optionsKiosque.avecNomEditeur ? ' class="has-bullet"' : "",
				">",
			);
			H.push(
				'<a tabindex="0" class="wrapper-link flex-gap-l" href="',
				lLien,
				'">',
			);
			if (this.optionsKiosque.avecNomEditeur) {
				H.push("<div");
				if (lRessource.logo) {
					if (lRessource.avecLien) {
						H.push(
							' ie-hint="' +
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.avecLien",
								) +
								'"',
						);
					}
					H.push(
						' class="logo-contain">',
						ObjetImage_1.GImage.composeImage(lRessource.logo),
					);
				} else {
					H.push(
						' class="libelle-contain">',
						ObjetChaine_1.GChaine.insecable(lRessource.editeur),
					);
				}
				H.push("</div>");
			}
			H.push(
				'<div class="contain-wrapper">',
				'<div class="link-as-wrapper" title="',
				ObjetChaine_1.GChaine.toTitle(lRessource.description),
				'" >',
				"<span" +
					(!this.optionsKiosque.avecNomEditeur ? ' class="with-bullet"' : "") +
					">",
				lRessource.titre,
				"</span></div>",
			);
			H.push("</div>");
			const lAvecApiAjout =
				!!lRessource &&
				!!lRessource.apiSupport &&
				lRessource.apiSupport.contains(
					TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier,
				);
			const lAvecApiRenduTAF =
				!!lRessource &&
				!!lRessource.apiSupport &&
				lRessource.apiSupport.contains(
					TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
				) &&
				this.etatUtilisateurSco.activerKiosqueRenduTAF;
			const lAvecApiEnvoiNote =
				!!lRessource &&
				!!lRessource.apiSupport &&
				lRessource.apiSupport.contains(
					TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
				) &&
				this.etatUtilisateurSco.activerKiosqueEnvoiNote;
			let lNbrApiAjout = 0,
				lNbrApiRenduTAF = 0,
				lNbrApiEnvoiNote = 0;
			if (lAvecApiAjout && lRessource.listeRessourcesAtomiques) {
				for (let k = 0; k < lRessource.listeRessourcesAtomiques.count(); k++) {
					const lElement = lRessource.listeRessourcesAtomiques.get(k);
					if (
						lElement.apiSupport &&
						lElement.apiSupport.contains(
							TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier,
						)
					) {
						lNbrApiAjout++;
					}
					if (
						lElement.apiSupport &&
						lElement.apiSupport.contains(
							TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
						)
					) {
						lNbrApiRenduTAF++;
					}
					if (
						lElement.apiSupport &&
						lElement.apiSupport.contains(
							TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
						)
					) {
						lNbrApiEnvoiNote++;
					}
				}
			}
			if (
				this.optionsKiosque.avecDetailsRessources &&
				(lAvecApiAjout || lAvecApiRenduTAF || lAvecApiEnvoiNote)
			) {
				const lIcon = this.etatUtilisateurSco.pourPrimaire()
					? "icon_work"
					: "icon_home";
				const lHint = [];
				lHint.push('<div class="infobulle-kiosque">');
				const lTtitre =
					lNbrApiAjout > 0
						? ObjetTraduction_1.GTraductions.getValeur(
								"WidgetKiosque.infoRessourcesExtrait.titre",
								[lNbrApiAjout],
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"WidgetKiosque.infoRessourcesExtrait.aucune",
							);
				const lTypeTAF = this.etatUtilisateurSco.pourPrimaire()
					? ObjetTraduction_1.GTraductions.getValeur(
							"WidgetKiosque.infoRessourcesExtrait.tafpp",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"WidgetKiosque.infoRessourcesExtrait.taf",
						);
				lHint.push(
					'<div class="infobulle-titre"><i class="material-icons icon_taf" role="presentation"></i> ',
					lTtitre,
					"</div>",
				);
				if (lAvecApiRenduTAF || lAvecApiEnvoiNote) {
					lHint.push(
						"<div>",
						ObjetTraduction_1.GTraductions.getValeur(
							"WidgetKiosque.infoRessourcesExtrait.type",
						),
						"</div>",
					);
					if (lAvecApiRenduTAF) {
						lHint.push(
							'<div class="infobulle-type"><i class="material-icons ',
							lIcon,
							'" role="presentation"></i> ',
							lTypeTAF,
							lNbrApiAjout > 0 ? " : " + lNbrApiRenduTAF : "",
							"</div>",
						);
					}
					if (lAvecApiEnvoiNote) {
						lHint.push(
							'<div class="infobulle-type"><i class="material-icons icon_saisie_note" role="presentation"></i> ',
							ObjetTraduction_1.GTraductions.getValeur(
								"WidgetKiosque.infoRessourcesExtrait.idevoir",
							),
							lNbrApiAjout > 0 ? " : " + lNbrApiEnvoiNote : "",
							"</div>",
						);
					}
				}
				lHint.push("</div>");
				const lEventPanier = this.optionsKiosque.avecPanierRessources
					? " ie-node=\"nodeEvenementPanier('" + lRessource.getNumero() + "')\""
					: "";
				const lNode = "";
				H.push(
					'<div class="summary-wrapper" ie-hint="',
					ObjetChaine_1.GChaine.toTitle(lHint.join("")),
					'" ',
					lNode,
					lEventPanier,
					">",
				);
				const lClassSummary = ["item-summary"];
				if (this.optionsKiosque.avecPanierRessources) {
					lClassSummary.push("with-action");
				}
				if (lAvecApiAjout) {
					H.push('<div class="', lClassSummary.join(" "), '">');
					H.push(
						'<i class="material-icons icon_taf" role="img" aria-label="',
						lTtitre,
						'"></i>',
					);
					if (lNbrApiAjout > 0) {
						H.push("<span>" + lNbrApiAjout + "</span>");
					}
					H.push("</div>");
				}
				if (lAvecApiRenduTAF) {
					H.push('<div class="', lClassSummary.join(" "), '">');
					H.push(
						'<i class="material-icons ',
						lIcon,
						'" role="img" aria-label="',
						lTypeTAF,
						'"></i>',
					);
					if (lNbrApiRenduTAF > 0) {
						H.push("<span>" + lNbrApiRenduTAF + "</span>");
					}
					H.push("</div>");
				}
				if (lAvecApiEnvoiNote) {
					H.push('<div class="', lClassSummary.join(" "), '">');
					H.push(
						'<i class="material-icons icon_saisie_note" role="presentation"></i>',
					);
					if (lNbrApiEnvoiNote > 0) {
						H.push("<span>" + lNbrApiEnvoiNote + "</span>");
					}
					H.push("</div>");
				}
				H.push("</div>");
			}
			H.push("</a>");
			H.push("</li>");
		}
		H.push("</ul>");
		return H.join("");
	}
	_evntPanier(aNumero) {
		const lGenresApi = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lGenresApi.add(TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier);
		const lManuel = this.donnees.listeRessources.getElementParNumero(aNumero);
		ObjetFenetre_ManuelsNumeriques_1.ObjetFenetre_ManuelsNumeriques.ouvrir({
			instance: this,
			callback: () => {
				this._notificationKiosque();
			},
			genresApiKiosque: lGenresApi,
			sansAjouterLien: true,
			manuel: lManuel,
		});
	}
}
exports.WidgetKiosque = WidgetKiosque;
