exports.ObjetFenetreHarcelement = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
class ObjetFenetreHarcelement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = GEtatUtilisateur;
		this.setOptionsFenetre({
			fermerFenetreSurClicHorsFenetre: true,
			largeur: 600,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreHarcelement.titreFenetre",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnContact: {
				event(aNumeroEtablissement, aNumeroContact, aGenreContact) {
					let lReferent = null;
					if (aInstance.listeInformationsEtablissements) {
						const lEtablissement =
							aInstance.listeInformationsEtablissements.getElementParNumero(
								aNumeroEtablissement,
							);
						if (lEtablissement && lEtablissement.listeReferentsHarcelement) {
							lReferent =
								lEtablissement.listeReferentsHarcelement.getElementParNumeroEtGenre(
									aNumeroContact,
									aGenreContact,
								);
						}
					}
					UtilitaireContactReferents_1.UtilitaireContactReferents.contacterReferentHarcelement(
						aInstance,
						lReferent,
					);
				},
			},
		});
	}
	setDonnees() {
		let lListeEtab = new ObjetListeElements_1.ObjetListeElements();
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Parent,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			lListeEtab = this.etatUtilisateurSco.listeInformationsEtablissements;
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Eleve,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			const lEtablissement =
				this.etatUtilisateurSco.getUtilisateur() &&
				this.etatUtilisateurSco.getUtilisateur().Etablissement;
			if (lEtablissement) {
				const lEtablissementAvecToutesLesInfos =
					this.etatUtilisateurSco.listeInformationsEtablissements &&
					this.etatUtilisateurSco.listeInformationsEtablissements.getElementParNumero(
						lEtablissement.getNumero(),
					);
				if (lEtablissementAvecToutesLesInfos) {
					lListeEtab.add(lEtablissementAvecToutesLesInfos);
				}
			}
		}
		this.listeInformationsEtablissements = lListeEtab;
		this.listeNumerosUtiles = this.etatUtilisateurSco.listeNumerosUtiles;
		this.afficher(this.composeHtml());
	}
	composeHtml() {
		const H = [];
		if (this.listeInformationsEtablissements) {
			const lAvecBlockReferents =
				this.listeInformationsEtablissements
					.getListeElements((aEtablissement) => {
						return (
							aEtablissement.avecReferentsHarcelementPublie &&
							aEtablissement.listeReferentsHarcelement &&
							aEtablissement.listeReferentsHarcelement.count() > 0
						);
					})
					.count() > 0;
			if (lAvecBlockReferents) {
				H.push(this.composeBlockReferents());
			}
		}
		if (this.listeNumerosUtiles && this.listeNumerosUtiles.count() > 0) {
			H.push(this.composeBlockNumeroUtiles());
		}
		return H.join("");
	}
	composeBlocGeneric(aTitre, aContenuHtml) {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "BlocHarcelement" },
					IE.jsx.str("p", { class: "titre-block", tabindex: "0" }, aTitre),
					IE.jsx.str(
						"div",
						{ class: "flex-contain cols m-top-l" },
						aContenuHtml,
					),
				),
			),
		);
		return H.join("");
	}
	composeBlockReferents() {
		const H = [];
		if (this.listeInformationsEtablissements) {
			for (const lEtablissement of this.listeInformationsEtablissements) {
				if (
					lEtablissement.avecReferentsHarcelementPublie &&
					lEtablissement.listeReferentsHarcelement &&
					lEtablissement.listeReferentsHarcelement.count() > 0
				) {
					H.push(this.composeListeReferentsDEtablissement(lEtablissement));
				}
			}
		}
		return this.composeBlocGeneric(
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreHarcelement.victimeDeHarcelement",
			),
			H.join(""),
		);
	}
	composeListeReferentsDEtablissement(aEtablissement) {
		const H = [];
		if (aEtablissement && aEtablissement.listeReferentsHarcelement) {
			const lLibelleEtablissement =
				'<span class="Gras">' + aEtablissement.getLibelle() + "</span>";
			H.push('<div class="BlocListeReferentsDEtablissement">');
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"p",
						{ class: "m-bottom-l", tabindex: "0" },
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreHarcelement.referentsContreHarcelement",
							[lLibelleEtablissement],
						),
						" :",
					),
				),
			);
			H.push("<ul>");
			for (const lReferent of aEtablissement.listeReferentsHarcelement) {
				let lStrBoutonContact = [];
				if (lReferent.avecDiscussion) {
					const lIeModelContact =
						"btnContact('" +
						aEtablissement.getNumero() +
						"', '" +
						lReferent.getNumero() +
						"', " +
						lReferent.getGenre() +
						")";
					lStrBoutonContact.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"p",
								{ class: "m-top" },
								IE.jsx.str(
									"ie-bouton",
									{
										"ie-model": lIeModelContact,
										"ie-icon": "icon_envoyer",
										class: "themeBoutonNeutre small-bt",
										tabindex: "0",
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"fenetreHarcelement.ContacterReferent",
									),
								),
							),
						),
					);
				}
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"li",
							{ class: "BlocReferent" },
							IE.jsx.str(
								"p",
								{ tabindex: "0" },
								IE.jsx.str(
									"span",
									{ class: "LibelleReferent" },
									lReferent.getLibelle(),
								),
								lReferent.discipline ? " - " + lReferent.discipline : "",
							),
							lStrBoutonContact.join(""),
						),
					),
				);
			}
			H.push("</ul>");
			H.push("</div>");
		}
		return H.join("");
	}
	composeBlockNumeroUtiles() {
		const H = [];
		for (const lArticleNumeroUtile of this.listeNumerosUtiles) {
			if (lArticleNumeroUtile.estNrHarcelement) {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"p",
							{
								class: [
									ObjetFenetreHarcelement_css_1.StylesObjetFenetreHarcelement
										.ctnLienTitre,
								],
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreHarcelement.EstLaPourVous",
								[lArticleNumeroUtile.numeroTelBrut],
							),
						),
						lArticleNumeroUtile.url
							? IE.jsx.str(
									"div",
									null,
									IE.jsx.str(
										"ie-chips",
										{
											class: [
												"iconic",
												"icon_link",
												Divers_css_1.StylesDivers.mTopL,
												Divers_css_1.StylesDivers.mBottomL,
											],
											href: lArticleNumeroUtile.url,
										},
										ObjetTraduction_1.GTraductions.getValeur(
											"fenetreHarcelement.LibelleTchatez",
											[lArticleNumeroUtile.numeroTelBrut],
										),
									),
								)
							: "",
						IE.estMobile
							? IE.jsx.str(
									"div",
									{
										class: [
											ObjetFenetreHarcelement_css_1
												.StylesObjetFenetreHarcelement.ctnPhone,
										],
									},
									this.formaterNumeroUtilePourMobile(
										lArticleNumeroUtile,
										lArticleNumeroUtile.getLibelle(),
									),
								)
							: "",
					),
				);
			} else {
				H.push(
					`<div class="ctn-phone">`,
					`<span>${lArticleNumeroUtile.getLibelle()}</span>`,
					IE.estMobile
						? this.formaterNumeroUtilePourMobile(
								lArticleNumeroUtile,
								lArticleNumeroUtile.getLibelle(),
							)
						: `<span class="numero-tel" >${lArticleNumeroUtile.numeroTelFormate}</span>`,
					"</div>",
				);
			}
		}
		return this.composeBlocGeneric(
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreHarcelement.lesNumerosUtiles",
			),
			H.join(""),
		);
	}
	formaterNumeroUtilePourMobile(aNumeroUtile, aTitle) {
		const lHref = "tel:" + aNumeroUtile.numeroTelBrut;
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "lien-communication tel-autre", "ie-tooltiplabel": aTitle },
				IE.jsx.str(
					"a",
					{ href: lHref, target: "_blank" },
					aNumeroUtile.numeroTelFormate,
				),
			),
		);
	}
}
exports.ObjetFenetreHarcelement = ObjetFenetreHarcelement;
