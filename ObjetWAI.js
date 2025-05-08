exports.EGenreAttribut =
	exports.EGenreRole =
	exports.EGenreObjet =
	exports.GObjetWAI =
	exports.ObjetWAI =
		void 0;
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
var EGenreObjet;
(function (EGenreObjet) {
	EGenreObjet[(EGenreObjet["Aide"] = 1)] = "Aide";
	EGenreObjet[(EGenreObjet["Tableau"] = 2)] = "Tableau";
	EGenreObjet[(EGenreObjet["AvecValidation"] = 3)] = "AvecValidation";
	EGenreObjet[(EGenreObjet["BarreOnglets"] = 4)] = "BarreOnglets";
	EGenreObjet[(EGenreObjet["NavigationHorizontal"] = 5)] =
		"NavigationHorizontal";
	EGenreObjet[(EGenreObjet["NavigationVertical"] = 6)] = "NavigationVertical";
	EGenreObjet[(EGenreObjet["NavigationHorizontalAvecValidation"] = 7)] =
		"NavigationHorizontalAvecValidation";
	EGenreObjet[(EGenreObjet["NavigationVerticalAvecValidation"] = 8)] =
		"NavigationVerticalAvecValidation";
	EGenreObjet[(EGenreObjet["CalendrierNavigation"] = 9)] =
		"CalendrierNavigation";
	EGenreObjet[(EGenreObjet["CalendrierPrecedent"] = 10)] =
		"CalendrierPrecedent";
	EGenreObjet[(EGenreObjet["CalendrierSuivant"] = 11)] = "CalendrierSuivant";
	EGenreObjet[(EGenreObjet["DetailEvenement"] = 12)] = "DetailEvenement";
	EGenreObjet[(EGenreObjet["TitreDetailEvenement"] = 13)] =
		"TitreDetailEvenement";
	EGenreObjet[(EGenreObjet["AvecMenuContextuel"] = 16)] = "AvecMenuContextuel";
	EGenreObjet[(EGenreObjet["ItemDesactiver"] = 17)] = "ItemDesactiver";
	EGenreObjet[(EGenreObjet["AvecEdition"] = 18)] = "AvecEdition";
	EGenreObjet[(EGenreObjet["Tabulation"] = 19)] = "Tabulation";
	EGenreObjet[(EGenreObjet["Supprimer"] = 20)] = "Supprimer";
	EGenreObjet[(EGenreObjet["Fenetre"] = 21)] = "Fenetre";
	EGenreObjet[(EGenreObjet["NouvelElement"] = 22)] = "NouvelElement";
	EGenreObjet[(EGenreObjet["BarreOngletsPrincipal"] = 23)] =
		"BarreOngletsPrincipal";
	EGenreObjet[(EGenreObjet["SousOnglets"] = 24)] = "SousOnglets";
	EGenreObjet[(EGenreObjet["ValidezEvenement"] = 25)] = "ValidezEvenement";
	EGenreObjet[(EGenreObjet["RetourDebutFenetre"] = 26)] = "RetourDebutFenetre";
	EGenreObjet[(EGenreObjet["FenetreChoix"] = 27)] = "FenetreChoix";
})(EGenreObjet || (exports.EGenreObjet = EGenreObjet = {}));
var EGenreRole;
(function (EGenreRole) {
	EGenreRole[(EGenreRole["Application"] = 1)] = "Application";
	EGenreRole[(EGenreRole["Window"] = 2)] = "Window";
	EGenreRole[(EGenreRole["Textbox"] = 3)] = "Textbox";
	EGenreRole[(EGenreRole["Link"] = 5)] = "Link";
	EGenreRole[(EGenreRole["Combobox"] = 6)] = "Combobox";
	EGenreRole[(EGenreRole["Option"] = 7)] = "Option";
	EGenreRole[(EGenreRole["Checkbox"] = 8)] = "Checkbox";
	EGenreRole[(EGenreRole["Radio"] = 10)] = "Radio";
	EGenreRole[(EGenreRole["Radiogroup"] = 11)] = "Radiogroup";
	EGenreRole[(EGenreRole["Button"] = 12)] = "Button";
	EGenreRole[(EGenreRole["Progressbar"] = 13)] = "Progressbar";
	EGenreRole[(EGenreRole["Tree"] = 17)] = "Tree";
	EGenreRole[(EGenreRole["Treeitem"] = 19)] = "Treeitem";
	EGenreRole[(EGenreRole["Presentation"] = 20)] = "Presentation";
	EGenreRole[(EGenreRole["Group"] = 21)] = "Group";
	EGenreRole[(EGenreRole["Grid"] = 22)] = "Grid";
	EGenreRole[(EGenreRole["Tab"] = 24)] = "Tab";
	EGenreRole[(EGenreRole["Tabpanel"] = 25)] = "Tabpanel";
	EGenreRole[(EGenreRole["Tablist"] = 26)] = "Tablist";
	EGenreRole[(EGenreRole["Rowheader"] = 30)] = "Rowheader";
	EGenreRole[(EGenreRole["Columnheader"] = 31)] = "Columnheader";
	EGenreRole[(EGenreRole["List"] = 32)] = "List";
	EGenreRole[(EGenreRole["Listitem"] = 33)] = "Listitem";
	EGenreRole[(EGenreRole["Menu"] = 34)] = "Menu";
	EGenreRole[(EGenreRole["Menubar"] = 35)] = "Menubar";
	EGenreRole[(EGenreRole["Menuitem"] = 36)] = "Menuitem";
	EGenreRole[(EGenreRole["Alert"] = 37)] = "Alert";
	EGenreRole[(EGenreRole["Alertdialog"] = 38)] = "Alertdialog";
	EGenreRole[(EGenreRole["Dialog"] = 39)] = "Dialog";
	EGenreRole[(EGenreRole["Gridcell"] = 40)] = "Gridcell";
	EGenreRole[(EGenreRole["Log"] = 41)] = "Log";
	EGenreRole[(EGenreRole["Marquee"] = 42)] = "Marquee";
	EGenreRole[(EGenreRole["Menuitemcheckbox"] = 43)] = "Menuitemcheckbox";
	EGenreRole[(EGenreRole["Menuitemradio"] = 44)] = "Menuitemradio";
	EGenreRole[(EGenreRole["Scrollbar"] = 45)] = "Scrollbar";
	EGenreRole[(EGenreRole["Slider"] = 46)] = "Slider";
	EGenreRole[(EGenreRole["Spinbutton"] = 47)] = "Spinbutton";
	EGenreRole[(EGenreRole["Status"] = 48)] = "Status";
	EGenreRole[(EGenreRole["Timer"] = 49)] = "Timer";
	EGenreRole[(EGenreRole["Tooltip"] = 50)] = "Tooltip";
	EGenreRole[(EGenreRole["Listbox"] = 51)] = "Listbox";
	EGenreRole[(EGenreRole["Treegrid"] = 52)] = "Treegrid";
	EGenreRole[(EGenreRole["Article"] = 53)] = "Article";
	EGenreRole[(EGenreRole["Definition"] = 54)] = "Definition";
	EGenreRole[(EGenreRole["Directory"] = 55)] = "Directory";
	EGenreRole[(EGenreRole["Document"] = 56)] = "Document";
	EGenreRole[(EGenreRole["Heading"] = 57)] = "Heading";
	EGenreRole[(EGenreRole["Img"] = 58)] = "Img";
	EGenreRole[(EGenreRole["Math"] = 59)] = "Math";
	EGenreRole[(EGenreRole["Note"] = 60)] = "Note";
	EGenreRole[(EGenreRole["Region"] = 61)] = "Region";
	EGenreRole[(EGenreRole["Row"] = 62)] = "Row";
	EGenreRole[(EGenreRole["Separator"] = 63)] = "Separator";
	EGenreRole[(EGenreRole["Toolbar"] = 64)] = "Toolbar";
	EGenreRole[(EGenreRole["Banner"] = 65)] = "Banner";
	EGenreRole[(EGenreRole["Complementary"] = 66)] = "Complementary";
	EGenreRole[(EGenreRole["Contentinfo"] = 67)] = "Contentinfo";
	EGenreRole[(EGenreRole["Form"] = 68)] = "Form";
	EGenreRole[(EGenreRole["Main"] = 69)] = "Main";
	EGenreRole[(EGenreRole["Navigation"] = 70)] = "Navigation";
	EGenreRole[(EGenreRole["Search"] = 71)] = "Search";
	EGenreRole[(EGenreRole["Cell"] = 72)] = "Cell";
})(EGenreRole || (exports.EGenreRole = EGenreRole = {}));
var EGenreAttribut;
(function (EGenreAttribut) {
	EGenreAttribut[(EGenreAttribut["activedescendant"] = 0)] = "activedescendant";
	EGenreAttribut[(EGenreAttribut["atomic"] = 1)] = "atomic";
	EGenreAttribut[(EGenreAttribut["autocomplete"] = 2)] = "autocomplete";
	EGenreAttribut[(EGenreAttribut["busy"] = 3)] = "busy";
	EGenreAttribut[(EGenreAttribut["checked"] = 4)] = "checked";
	EGenreAttribut[(EGenreAttribut["controls"] = 5)] = "controls";
	EGenreAttribut[(EGenreAttribut["describedby"] = 6)] = "describedby";
	EGenreAttribut[(EGenreAttribut["disabled"] = 7)] = "disabled";
	EGenreAttribut[(EGenreAttribut["dropeffect"] = 8)] = "dropeffect";
	EGenreAttribut[(EGenreAttribut["expanded"] = 9)] = "expanded";
	EGenreAttribut[(EGenreAttribut["flowto"] = 10)] = "flowto";
	EGenreAttribut[(EGenreAttribut["grabbed"] = 11)] = "grabbed";
	EGenreAttribut[(EGenreAttribut["haspopup"] = 12)] = "haspopup";
	EGenreAttribut[(EGenreAttribut["hidden"] = 13)] = "hidden";
	EGenreAttribut[(EGenreAttribut["invalid"] = 14)] = "invalid";
	EGenreAttribut[(EGenreAttribut["label"] = 15)] = "label";
	EGenreAttribut[(EGenreAttribut["labelledby"] = 16)] = "labelledby";
	EGenreAttribut[(EGenreAttribut["level"] = 17)] = "level";
	EGenreAttribut[(EGenreAttribut["live"] = 18)] = "live";
	EGenreAttribut[(EGenreAttribut["multiline"] = 19)] = "multiline";
	EGenreAttribut[(EGenreAttribut["multiselectable"] = 20)] = "multiselectable";
	EGenreAttribut[(EGenreAttribut["orientation"] = 21)] = "orientation";
	EGenreAttribut[(EGenreAttribut["owns"] = 22)] = "owns";
	EGenreAttribut[(EGenreAttribut["posinset"] = 23)] = "posinset";
	EGenreAttribut[(EGenreAttribut["pressed"] = 24)] = "pressed";
	EGenreAttribut[(EGenreAttribut["readonly"] = 25)] = "readonly";
	EGenreAttribut[(EGenreAttribut["relevant"] = 26)] = "relevant";
	EGenreAttribut[(EGenreAttribut["required"] = 27)] = "required";
	EGenreAttribut[(EGenreAttribut["selected"] = 28)] = "selected";
	EGenreAttribut[(EGenreAttribut["setsize"] = 29)] = "setsize";
	EGenreAttribut[(EGenreAttribut["sort"] = 30)] = "sort";
	EGenreAttribut[(EGenreAttribut["valuemax"] = 31)] = "valuemax";
	EGenreAttribut[(EGenreAttribut["valuemin"] = 32)] = "valuemin";
	EGenreAttribut[(EGenreAttribut["valuenow"] = 33)] = "valuenow";
	EGenreAttribut[(EGenreAttribut["valuetext"] = 34)] = "valuetext";
	EGenreAttribut[(EGenreAttribut["colindex"] = 35)] = "colindex";
	EGenreAttribut[(EGenreAttribut["colspan"] = 36)] = "colspan";
	EGenreAttribut[(EGenreAttribut["rowindex"] = 37)] = "rowindex";
	EGenreAttribut[(EGenreAttribut["rowspan"] = 38)] = "rowspan";
	EGenreAttribut[(EGenreAttribut["description"] = 39)] = "description";
})(EGenreAttribut || (exports.EGenreAttribut = EGenreAttribut = {}));
class ObjetWAI {
	constructor() {
		this.idMessagesAide = GUID_1.GUID.getId();
		this.InfoWai = [];
		this.InfoWai[EGenreObjet.Aide] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.Aide");
		this.InfoWai[EGenreObjet.Tableau] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.Tableau");
		this.InfoWai[EGenreObjet.AvecValidation] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.AvecValidation");
		this.InfoWai[EGenreObjet.BarreOnglets] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.BarreOnglets");
		this.InfoWai[EGenreObjet.NavigationHorizontal] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.NavigationHorizontal",
			);
		this.InfoWai[EGenreObjet.NavigationVertical] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.NavigationVertical");
		this.InfoWai[EGenreObjet.NavigationHorizontalAvecValidation] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.NavigationHorizontalAvecValidation",
			);
		this.InfoWai[EGenreObjet.NavigationVerticalAvecValidation] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.NavigationVerticalAvecValidation",
			);
		this.InfoWai[EGenreObjet.CalendrierNavigation] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.CalendrierNavigation",
			);
		this.InfoWai[EGenreObjet.CalendrierPrecedent] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.CalendrierPrecedent",
			);
		this.InfoWai[EGenreObjet.CalendrierSuivant] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.CalendrierSuivant");
		this.InfoWai[EGenreObjet.ValidezEvenement] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.ValidezEvenement");
		this.InfoWai[EGenreObjet.TitreDetailEvenement] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.TitreDetailEvenement",
			);
		this.InfoWai[EGenreObjet.ItemDesactiver] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.ItemDesactiver");
		this.InfoWai[EGenreObjet.AvecEdition] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.AvecEdition");
		this.InfoWai[EGenreObjet.Tabulation] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.Tabulation");
		this.InfoWai[EGenreObjet.Supprimer] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.Supprimer");
		this.InfoWai[EGenreObjet.Fenetre] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.Fenetre");
		this.InfoWai[EGenreObjet.NouvelElement] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.NouvelElement");
		this.InfoWai[EGenreObjet.BarreOngletsPrincipal] =
			ObjetTraduction_1.GTraductions.getValeur(
				"Navigation.BarreOngletsPrincipal",
			);
		this.InfoWai[EGenreObjet.SousOnglets] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.SousOnglets");
		this.InfoWai[EGenreObjet.RetourDebutFenetre] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.RetourDebutFenetre");
		this.InfoWai[EGenreObjet.FenetreChoix] =
			ObjetTraduction_1.GTraductions.getValeur("Navigation.FenetreChoix");
		this.WaiRole = [];
		this.WaiRole[EGenreRole.Window] = "window";
		this.WaiRole[EGenreRole.Alert] = "alert";
		this.WaiRole[EGenreRole.Alertdialog] = "alertdialog";
		this.WaiRole[EGenreRole.Button] = "button";
		this.WaiRole[EGenreRole.Checkbox] = "checkbox";
		this.WaiRole[EGenreRole.Cell] = "cell";
		this.WaiRole[EGenreRole.Dialog] = "dialog";
		this.WaiRole[EGenreRole.Gridcell] = "gridcell";
		this.WaiRole[EGenreRole.Link] = "link";
		this.WaiRole[EGenreRole.Log] = "log";
		this.WaiRole[EGenreRole.Marquee] = "marquee";
		this.WaiRole[EGenreRole.Menuitem] = "menuitem";
		this.WaiRole[EGenreRole.Menuitemcheckbox] = "menuitemcheckbox";
		this.WaiRole[EGenreRole.Menuitemradio] = "menuitemradio";
		this.WaiRole[EGenreRole.Option] = "option";
		this.WaiRole[EGenreRole.Progressbar] = "progressbar";
		this.WaiRole[EGenreRole.Radio] = "radio";
		this.WaiRole[EGenreRole.Scrollbar] = "scrollbar";
		this.WaiRole[EGenreRole.Slider] = "slider";
		this.WaiRole[EGenreRole.Spinbutton] = "spinbutton";
		this.WaiRole[EGenreRole.Status] = "status";
		this.WaiRole[EGenreRole.Tab] = "tab";
		this.WaiRole[EGenreRole.Tabpanel] = "tabpanel";
		this.WaiRole[EGenreRole.Textbox] = "textbox";
		this.WaiRole[EGenreRole.Timer] = "timer";
		this.WaiRole[EGenreRole.Tooltip] = "tooltip";
		this.WaiRole[EGenreRole.Treeitem] = "treeitem";
		this.WaiRole[EGenreRole.Combobox] = "combobox";
		this.WaiRole[EGenreRole.Grid] = "grid";
		this.WaiRole[EGenreRole.Listbox] = "listbox";
		this.WaiRole[EGenreRole.Menu] = "menu";
		this.WaiRole[EGenreRole.Menubar] = "menubar";
		this.WaiRole[EGenreRole.Radiogroup] = "radiogroup";
		this.WaiRole[EGenreRole.Tablist] = "tablist";
		this.WaiRole[EGenreRole.Tree] = "tree";
		this.WaiRole[EGenreRole.Treegrid] = "treegrid";
		this.WaiRole[EGenreRole.Article] = "article";
		this.WaiRole[EGenreRole.Columnheader] = "columnheader";
		this.WaiRole[EGenreRole.Definition] = "definition";
		this.WaiRole[EGenreRole.Directory] = "directory";
		this.WaiRole[EGenreRole.Document] = "document";
		this.WaiRole[EGenreRole.Group] = "group";
		this.WaiRole[EGenreRole.Heading] = "heading";
		this.WaiRole[EGenreRole.Img] = "img";
		this.WaiRole[EGenreRole.List] = "list";
		this.WaiRole[EGenreRole.Listitem] = "listitem";
		this.WaiRole[EGenreRole.Math] = "math";
		this.WaiRole[EGenreRole.Note] = "note";
		this.WaiRole[EGenreRole.Presentation] = "presentation";
		this.WaiRole[EGenreRole.Region] = "region";
		this.WaiRole[EGenreRole.Row] = "row";
		this.WaiRole[EGenreRole.Rowheader] = "rowheader";
		this.WaiRole[EGenreRole.Separator] = "separator";
		this.WaiRole[EGenreRole.Toolbar] = "toolbar";
		this.WaiRole[EGenreRole.Application] = "application";
		this.WaiRole[EGenreRole.Banner] = "banner";
		this.WaiRole[EGenreRole.Complementary] = "complementary";
		this.WaiRole[EGenreRole.Contentinfo] = "contentinfo";
		this.WaiRole[EGenreRole.Form] = "form";
		this.WaiRole[EGenreRole.Main] = "main";
		this.WaiRole[EGenreRole.Navigation] = "navigation";
		this.WaiRole[EGenreRole.Search] = "search";
		this.WaiAttribut = [];
		this.WaiAttribut[EGenreAttribut.activedescendant] = "aria-activedescendant";
		this.WaiAttribut[EGenreAttribut.atomic] = "aria-atomic";
		this.WaiAttribut[EGenreAttribut.autocomplete] = "aria-autocomplete";
		this.WaiAttribut[EGenreAttribut.busy] = "aria-busy";
		this.WaiAttribut[EGenreAttribut.checked] = "aria-checked";
		this.WaiAttribut[EGenreAttribut.controls] = "aria-controls";
		this.WaiAttribut[EGenreAttribut.describedby] = "aria-describedby";
		this.WaiAttribut[EGenreAttribut.disabled] = "aria-disabled";
		this.WaiAttribut[EGenreAttribut.dropeffect] = "aria-dropeffect";
		this.WaiAttribut[EGenreAttribut.expanded] = "aria-expanded";
		this.WaiAttribut[EGenreAttribut.flowto] = "aria-flowto";
		this.WaiAttribut[EGenreAttribut.grabbed] = "aria-grabbed";
		this.WaiAttribut[EGenreAttribut.haspopup] = "aria-haspopup";
		this.WaiAttribut[EGenreAttribut.hidden] = "aria-hidden";
		this.WaiAttribut[EGenreAttribut.invalid] = "aria-invalid";
		this.WaiAttribut[EGenreAttribut.label] = "aria-label";
		this.WaiAttribut[EGenreAttribut.labelledby] = "aria-labelledby";
		this.WaiAttribut[EGenreAttribut.level] = "	aria-level";
		this.WaiAttribut[EGenreAttribut.live] = "aria-live";
		this.WaiAttribut[EGenreAttribut.multiline] = "aria-multiline";
		this.WaiAttribut[EGenreAttribut.multiselectable] = "aria-multiselectable";
		this.WaiAttribut[EGenreAttribut.orientation] = "aria-orientation";
		this.WaiAttribut[EGenreAttribut.owns] = "aria-owns";
		this.WaiAttribut[EGenreAttribut.posinset] = "aria-posinset";
		this.WaiAttribut[EGenreAttribut.pressed] = "aria-pressed";
		this.WaiAttribut[EGenreAttribut.readonly] = "aria-readonly";
		this.WaiAttribut[EGenreAttribut.relevant] = "aria-relevant";
		this.WaiAttribut[EGenreAttribut.required] = "aria-required";
		this.WaiAttribut[EGenreAttribut.selected] = "aria-selected";
		this.WaiAttribut[EGenreAttribut.setsize] = "aria-setsize";
		this.WaiAttribut[EGenreAttribut.sort] = "aria-sort";
		this.WaiAttribut[EGenreAttribut.valuemax] = "aria-valuemax";
		this.WaiAttribut[EGenreAttribut.valuemin] = "aria-valuemin";
		this.WaiAttribut[EGenreAttribut.valuenow] = "aria-valuenow";
		this.WaiAttribut[EGenreAttribut.valuetext] = "aria-valuetext";
		this.WaiAttribut[EGenreAttribut.colindex] = "aria-colindex";
		this.WaiAttribut[EGenreAttribut.colspan] = "aria-colspan";
		this.WaiAttribut[EGenreAttribut.rowindex] = "aria-rowindex";
		this.WaiAttribut[EGenreAttribut.rowspan] = "aria-rowspan";
		this.WaiAttribut[EGenreAttribut.description] = "aria-description";
	}
	getInfo(AEnum) {
		return this.InfoWai[AEnum];
	}
	strRole(AEnum) {
		return this.WaiRole[AEnum] || "";
	}
	getRole(AEnum) {
		return 'role="' + this.strRole(AEnum) + '"';
	}
	getAttribut(aEnum) {
		return this.WaiAttribut[aEnum];
	}
	composeSpan(AParametre, AId) {
		const lID = AId || false;
		const lTabIndex = AId ? "-1" : false;
		return typeof AParametre === "string"
			? IE.jsx.str(
					"span",
					{ id: lID, tabindex: lTabIndex, class: "sr-only" },
					AParametre,
				)
			: IE.jsx.str(
					"span",
					{ id: lID, tabindex: lTabIndex, class: "sr-only" },
					this.getInfo(AParametre),
				);
	}
	composeRole(AParametre) {
		return typeof AParametre === "string" ? "" : this.getRole(AParametre);
	}
	composeAttribut(aParametre) {
		if (aParametre.valeur && typeof aParametre.valeur !== "string") {
			IE.log.addLog(
				"ObjetWAI.composeAttribut: mauvais type de parametre " +
					aParametre.genre +
					" => " +
					aParametre.valeur,
			);
		}
		if (!aParametre.valeur || typeof aParametre.valeur !== "string") {
			return "";
		}
		const lAttribute = this.getAttribut(aParametre.genre);
		return typeof aParametre.genre === "string" && lAttribute
			? ""
			: " " + lAttribute + '="' + aParametre.valeur.toAttrValue() + '"';
	}
	getObjetAttributValeur(aGenreAttribut, aValeur) {
		const lObjetValeurAttribut = {};
		const lValeurStringAttribut = this.composeAttribut({
			genre: aGenreAttribut,
			valeur: aValeur,
		});
		if (lValeurStringAttribut && lValeurStringAttribut.includes("=")) {
			const lSplit = lValeurStringAttribut.split("=");
			if (lSplit && lSplit.length === 2) {
				lObjetValeurAttribut[lSplit[0]] = lSplit[1];
			}
		}
		return lObjetValeurAttribut;
	}
	getNodeRechercheNavigation(aTabNodes, aNodeOrigine, aModeRecherche) {
		if (aTabNodes && aTabNodes.length > 0) {
			let lIndexTrouve = aTabNodes.indexOf(aNodeOrigine);
			if (lIndexTrouve < 0) {
				aTabNodes.forEach((aElement, aIndex) => {
					if (lIndexTrouve < 0 && $(aElement).find(aNodeOrigine).length > 0) {
						lIndexTrouve = aIndex;
					}
				});
			}
			if (lIndexTrouve < 0) {
				return null;
			}
			switch (aModeRecherche) {
				case ObjetWAI.ModeRechercheNavigation.current:
					return aTabNodes[lIndexTrouve];
				case ObjetWAI.ModeRechercheNavigation.prev:
					return lIndexTrouve > 0 ? aTabNodes[lIndexTrouve - 1] : null;
				case ObjetWAI.ModeRechercheNavigation.prevCycle:
					return lIndexTrouve > 0
						? aTabNodes[lIndexTrouve - 1]
						: aTabNodes[aTabNodes.length - 1];
				case ObjetWAI.ModeRechercheNavigation.next:
					return lIndexTrouve < aTabNodes.length - 1
						? aTabNodes[lIndexTrouve + 1]
						: null;
				case ObjetWAI.ModeRechercheNavigation.nextCycle:
					return lIndexTrouve < aTabNodes.length - 1
						? aTabNodes[lIndexTrouve + 1]
						: aTabNodes[0];
				case ObjetWAI.ModeRechercheNavigation.first:
					return aTabNodes[0];
				case ObjetWAI.ModeRechercheNavigation.last:
					return aTabNodes[aTabNodes.length - 1];
				default:
			}
		}
		return null;
	}
}
exports.ObjetWAI = ObjetWAI;
(function (ObjetWAI) {
	let ModeRechercheNavigation;
	(function (ModeRechercheNavigation) {
		ModeRechercheNavigation[(ModeRechercheNavigation["prev"] = 0)] = "prev";
		ModeRechercheNavigation[(ModeRechercheNavigation["prevCycle"] = 1)] =
			"prevCycle";
		ModeRechercheNavigation[(ModeRechercheNavigation["next"] = 2)] = "next";
		ModeRechercheNavigation[(ModeRechercheNavigation["nextCycle"] = 3)] =
			"nextCycle";
		ModeRechercheNavigation[(ModeRechercheNavigation["first"] = 4)] = "first";
		ModeRechercheNavigation[(ModeRechercheNavigation["last"] = 5)] = "last";
		ModeRechercheNavigation[(ModeRechercheNavigation["current"] = 6)] =
			"current";
	})(
		(ModeRechercheNavigation =
			ObjetWAI.ModeRechercheNavigation ||
			(ObjetWAI.ModeRechercheNavigation = {})),
	);
})(ObjetWAI || (exports.ObjetWAI = ObjetWAI = {}));
const GObjetWAI = new ObjetWAI();
exports.GObjetWAI = GObjetWAI;
