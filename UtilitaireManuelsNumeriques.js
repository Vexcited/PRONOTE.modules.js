exports.UtilitaireManuelsNumeriques = UtilitaireManuelsNumeriques;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetImage_1 = require("ObjetImage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const MethodesObjet_1 = require("MethodesObjet");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const AccessApp_1 = require("AccessApp");
function UtilitaireManuelsNumeriques() {}
UtilitaireManuelsNumeriques.formatDonnees = function (aDonnees, aOptions) {
	const lResult = {
		liste: new ObjetListeElements_1.ObjetListeElements(),
		avecCumulMatiere: false,
	};
	let lMatiere, lNewElm;
	if (aDonnees && aOptions.avecCumulMatiere) {
		for (let i = 0; i < aDonnees.count(); i++) {
			const lRessource = aDonnees.get(i);
			if (lRessource.listeMatieres && lRessource.listeMatieres.count() > 0) {
				for (let j = 0; j < lRessource.listeMatieres.count(); j++) {
					lMatiere = lRessource.listeMatieres.get(j);
					lNewElm = MethodesObjet_1.MethodesObjet.dupliquer(lRessource);
					lNewElm.matiere = lMatiere;
					lResult.avecCumulMatiere = true;
					lResult.liste.addElement(lNewElm);
				}
			} else {
				lNewElm = MethodesObjet_1.MethodesObjet.dupliquer(lRessource);
				lNewElm.matiere = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Kiosque.AutresMatieres"),
					0,
					-1,
				);
				lResult.liste.addElement(lNewElm);
			}
		}
		const lTris = [
			ObjetTri_1.ObjetTri.init((D) => {
				return D.matiere ? !D.matiere.existeNumero() : false;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.matiere ? D.matiere.getLibelle() : "";
			}),
		];
		if (!!aOptions.avecNomEditeur) {
			lTris.push(ObjetTri_1.ObjetTri.init("editeur"));
		}
		lTris.push(ObjetTri_1.ObjetTri.init("titre"));
		lResult.liste.setTri(lTris).trier();
	} else {
		lResult.liste = aDonnees;
	}
	return lResult;
};
UtilitaireManuelsNumeriques.composeListeManuelsNumeriquesMobile = function (
	aDonnees,
	aOptions,
) {
	const lHtml = [];
	const lDonnees = UtilitaireManuelsNumeriques.formatDonnees(
		aDonnees,
		aOptions,
	);
	let lMatiere;
	let lRessource;
	lHtml.push('<ul class="collection with-header bg-white">');
	const lEtatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
	if (!!lDonnees.liste && lDonnees.liste.count() > 0) {
		for (let i = 0; i < lDonnees.liste.count(); i++) {
			lRessource = lDonnees.liste.get(i);
			if (lDonnees.avecCumulMatiere) {
				if (
					!lMatiere ||
					lMatiere.getNumero() !== lRessource.matiere.getNumero()
				) {
					lMatiere = lRessource.matiere;
					lHtml.push(
						'<li class="collection-header">',
						ObjetChaine_1.GChaine.avecEspaceSiVide(lMatiere.getLibelle()),
						"</li>",
					);
				}
			}
			const lHtmlManuel = [];
			lHtml.push('<li class="collection-item with-action">');
			if (aOptions.avecNomEditeur) {
				lHtmlManuel.push('<div class="manuels-titre-contain">');
				if (lRessource.logo) {
					lHtmlManuel.push(
						'<div class="logo" ',
						lRessource.avecLien
							? ' ie-hint="' +
									ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.avecLien",
									) +
									'"'
							: "",
						">",
						ObjetImage_1.GImage.composeImage(lRessource.logo),
						"</div>",
					);
				}
				lHtmlManuel.push(
					'<div class="libelle">',
					ObjetChaine_1.GChaine.insecable(lRessource.editeur),
					"</div>",
				);
				lHtmlManuel.push("</div>");
			}
			lHtmlManuel.push('<div class="manuels-description-contain">');
			const lAvecApiRenduTAF =
				!!lRessource &&
				!!lRessource.apiSupport &&
				lRessource.apiSupport.contains(
					TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
				);
			const lAvecApiEnvoiNote =
				!!lRessource &&
				!!lRessource.apiSupport &&
				lRessource.apiSupport.contains(
					TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
				);
			if (aOptions.avecDetailsRessources) {
				if (lEtatUtil.activerKiosqueRenduTAF && lAvecApiRenduTAF) {
					lHtmlManuel.push(
						'<div style="float:right; width: 16px;" title="',
						ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetrePanierKiosque.hint.ManuelTAF",
							),
						),
						'" class="AlignementMilieuVertical ',
						lAvecApiRenduTAF ? "Image_Kiosque_ListeCahierTexte AvecMain" : "",
						'"></div>',
					);
				}
				if (lEtatUtil.activerKiosqueEnvoiNote && lAvecApiEnvoiNote) {
					lHtmlManuel.push(
						'<div style="float:right; width: 16px;" title="',
						ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetrePanierKiosque.hint.ManuelDevoir",
							),
						),
						'" class="AlignementMilieuVertical ',
						lAvecApiEnvoiNote ? "Image_Kiosque_ListeDevoir AvecMain" : "",
						'"></div>',
					);
				}
			}
			lHtmlManuel.push('<div class="titre">', lRessource.titre);
			if (!!lRessource.description) {
				const lModelBtnRess = () => {
					return {
						event: () => {
							GApplication.getMessage().afficher({
								message: ObjetChaine_1.GChaine.replaceRCToHTML(
									lRessource.description,
								),
							});
						},
					};
				};
				lHtmlManuel.push(
					IE.jsx.str("ie-btnicon", {
						class: [
							fonts_css_1.StylesFonts.icon_info_sign,
							Divers_css_1.StylesDivers.mLeft,
							IEHtml_BtnImage_css_1.StylesIEHtmlBtnImage.btActivable,
						],
						"ie-model": lModelBtnRess,
						"aria-label": lRessource.titre,
						"aria-haspopup": "dialog",
					}),
				);
			}
			lHtmlManuel.push("</div></div>");
			if (lRessource.avecUrlAppliMobile) {
				lHtmlManuel.push('<div class="flex-contain flex-center m-bottom">');
				lHtmlManuel.push(
					'<div class="fluid-bloc">',
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lRessource,
						title: lRessource.description,
						libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
							"Kiosque.OuvrirAppli",
						),
						libelle: lRessource.titre,
						iconeOverride: "icon_th_large",
						infoSupp: { universalLink: true },
					}),
					"</div>",
				);
				lHtmlManuel.push("</div>");
			}
			lHtmlManuel.push('<div class="manuels-liens-contain">');
			lHtmlManuel.push('<div class="infos" style="width:20px;">');
			if (!lRessource.responsive) {
				const lModelBtnResp = () => {
					return {
						event: () => {
							GApplication.getMessage().afficher({
								message: ObjetChaine_1.GChaine.toTitle(
									ObjetTraduction_1.GTraductions.getValeur(
										"Kiosque.ContenuNonResponsive",
									),
								),
							});
						},
					};
				};
				lHtmlManuel.push(
					IE.jsx.str("ie-btnicon", {
						class: [
							fonts_css_1.StylesFonts.icon_exclamation,
							Divers_css_1.StylesDivers.mLeft,
							IEHtml_BtnImage_css_1.StylesIEHtmlBtnImage.btActivable,
						],
						"ie-model": lModelBtnResp,
						"aria-label": lRessource.titre,
						"aria-haspopup": "dialog",
					}),
				);
			}
			lHtmlManuel.push("</div>");
			lHtmlManuel.push(
				"<div>" +
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lRessource,
						title: lRessource.description,
						libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
							"Kiosque.OuvrirManuel",
						),
						libelle: lRessource.titre,
						iconeOverride: "icon_book",
					}) +
					"</div>",
			);
			lHtmlManuel.push("</div>");
			lHtml.push(lHtmlManuel.join(""));
			lHtml.push("</li>");
		}
	}
	lHtml.push("</ul>");
	return lHtml.join("");
};
