exports.getHtml = void 0;
const getHtml = (aParams) => {
	return IE.jsx.str(
		IE.jsx.fragment,
		null,
		IE.jsx.str(
			"div",
			{ class: ["accueil-mobile", aParams.options.classApplication] },
			IE.jsx.str(
				"nav",
				{ class: "nav-login", id: aParams.id.BandeauLogin },
				IE.jsx.str(
					"div",
					{ class: "nav-wrapper connexion" },
					IE.jsx.str(
						"div",
						{ class: "masque-rond" },
						IE.jsx.str(
							"div",
							{ class: "content" },
							IE.jsx.str(
								"div",
								{ class: "titre" },
								IE.jsx.str("h1", null, aParams.options.nomEspace),
								IE.jsx.str("h2", null, " ", aParams.options.titreEtablissement),
							),
						),
					),
				),
				IE.jsx.str("div", {
					class: "drapeau-changement-langue",
					"ie-display": "visibiliteChangementLangue",
					"ie-html": "choixLangue",
				}),
			),
			IE.jsx.str(
				"main",
				{ class: "main-contain" },
				IE.jsx.str(
					"form",
					{
						id: aParams.id.Form,
						target: "_self",
						onsubmit:
							"event.stopImmediatePropagation();event.preventDefault();return false;",
						autocomplete: "off",
					},
					IE.jsx.str(
						"fieldset",
						{ class: "login-contain" },
						IE.jsx.str(
							"h3",
							{ class: aParams.options.classLogoName },
							IE.jsx.str("span", null, aParams.options.nomApplication),
						),
						IE.jsx.str(
							"div",
							{ class: "input-field" },
							IE.jsx.str("input", {
								id: aParams.id.identification,
								type: "text",
								title: aParams.traductions.texteTitleIdentifiant,
								placeholder: aParams.traductions.textePlaceholderIdentifiant,
								"ie-model": "login",
								"ie-textbrut": true,
								autocomplete: "off",
								autocorrect: "off",
								autocapitalize: "off",
								spellcheck: "false",
								class: "full-width",
								"aria-required": "true",
								"aria-describedby": aParams.id.msgErreur,
								"ie-attr": "getAttrLogin",
							}),
							IE.jsx.str(
								"label",
								{ for: aParams.id.identification, class: "icon_uniF2BD" },
								aParams.traductions.texteIdentifiant,
							),
						),
						IE.jsx.str(
							"div",
							{ class: "input-field" },
							IE.jsx.str(
								"div",
								{ class: "as-input as-password" },
								IE.jsx.str("input", {
									id: aParams.id.motDePasse,
									type: "password",
									title: aParams.traductions.texteTitleMotdepasse,
									placeholder: aParams.traductions.textePlaceholderMotdepasse,
									"ie-model": "motDePasse",
									class: "full-width",
									"aria-required": "true",
									"aria-describedby": aParams.id.msgErreur,
									"ie-attr": "getAttrMDP",
								}),
								IE.jsx.str("ie-btnicon", {
									class: "icon_eye_open",
									"ie-model": "montrerMasquerMotDePasse()",
									"ie-title": "montrerMasquerMotDePasse.getTitle",
								}),
							),
							IE.jsx.str(
								"label",
								{
									for: aParams.id.motDePasse,
									class: "icon_strategie_code_pin",
								},
								aParams.traductions.texteMotdepasse,
							),
						),
						IE.jsx.str("p", {
							id: aParams.id.msgErreur,
							class: "message-erreur",
							"aria-hidden": "true",
						}),
						IE.jsx.str(
							"div",
							{ class: "check-field " },
							IE.jsx.str(
								"ie-checkbox",
								{
									class: "colored-label",
									id: aParams.id.checkSouvenir,
									"ie-model": "stockageMDP",
									"ie-tooltipdescribe": aParams.traductions.seSouvenirInfo,
								},
								aParams.traductions.seSouvenirLabel,
							),
						),
						IE.jsx.str(
							"div",
							{ class: "btn-contain" },
							IE.jsx.str(
								"ie-bouton",
								{
									id: aParams.id.btnConnexion,
									class: "themeBoutonPrimaire",
									"ie-model": "boutonValidation",
								},
								aParams.traductions.texteBouton,
							),
						),
						IE.jsx.str(
							"div",
							{
								"ie-display": "visibiliteRecupIdMdp",
								class: "text-center p-all-xl",
							},
							IE.jsx.str(
								"ie-bouton",
								{
									class: "small-bt themeBoutonNeutre",
									"ie-model": "boutonRecupMDP",
									"aria-haspopup": "dialog",
									"aria-description": aParams.traductions.ariaDescrRecupIdMdp,
								},
								aParams.traductions.texteRecupIdMdp,
							),
						),
						IE.jsx.str(
							"div",
							{
								class: "retour-espace",
								"ie-display": "visibiliteRetourEspace",
							},
							IE.jsx.str("p", null, aParams.traductions.redirigeMobile),
							IE.jsx.str(
								"ie-bouton",
								{
									class: " small-bt themeBoutonNeutre",
									onclick: `${aParams.id.thisNom}.retourEspaceBureau()`,
								},
								aParams.traductions.retourEspace,
							),
						),
					),
				),
			),
			aParams.options.afficherCookieInfo &&
				IE.jsx.str(
					"div",
					{ class: "cookies-disclaimer" },
					IE.jsx.str(
						"p",
						null,
						aParams.traductions.cookiesMessage1,
						"\u00A0",
						aParams.traductions.cookiesMessage2,
						IE.jsx.str(
							"span",
							{
								role: "button",
								tabindex: "0",
								class: "as-link m-left",
								"ie-node": aParams.jsx.jsxNodeOuvrirMentionsLegales,
								"aria-haspopup": "dialog",
							},
							aParams.traductions.mentionsLegales,
							".",
						),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							tabindex: "0",
							"aria-label": aParams.traductions.fermer,
							"ie-hint": aParams.traductions.fermer,
							"ie-node": aParams.jsx.jsxNodeFermerBandeauCoookie,
						},
						aParams.traductions.fermer,
					),
				),
			IE.jsx.str(
				"footer",
				null,
				aParams.options.mentionsPagesPubliques &&
					aParams.options.mentionsPagesPubliques.lien &&
					IE.jsx.str(
						"div",
						{ style: "flex-basis: 100%; text-align: center;" },
						aParams.options.mentionsPagesPubliques.lien,
					),
				aParams.options.publierMentions &&
					IE.jsx.str(
						"div",
						{
							class: "AvecMain",
							"ie-node": aParams.jsx.jsxNodeOuvrirMentionsLegales,
						},
						aParams.traductions.mentionsLegales,
					),
				IE.jsx.str(
					"a",
					{
						href: aParams.options.urlSiteIndexEducation,
						title: aParams.options.titreLien,
						target: "_blank",
					},
					aParams.options.texteLien,
				),
			),
		),
	);
};
exports.getHtml = getHtml;
