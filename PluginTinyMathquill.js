const lPlugin = {
	init: function (ed) {
		this.selectionBookmark = null;
		this.win = null;
		this.editor = ed;
		let self = this;
		this.editor.settings.images_dataimg_filter = function (aElement) {
			return !$(aElement).attr("data-latex");
		};
		this.editor.ui.registry.addIcon(
			"formula",
			'<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.42,5.29C11.32,5.19 10.35,6 10.25,7.11L10,10H12.82V12H9.82L9.38,17.07C9.18,19.27 7.24,20.9 5.04,20.7C3.79,20.59 2.66,19.9 2,18.83L3.5,17.33C3.83,18.38 4.96,18.97 6,18.63C6.78,18.39 7.33,17.7 7.4,16.89L7.82,12H4.82V10H8L8.27,6.93C8.46,4.73 10.39,3.1 12.6,3.28C13.86,3.39 15,4.09 15.66,5.17L14.16,6.67C13.91,5.9 13.23,5.36 12.42,5.29M22,13.65L20.59,12.24L17.76,15.07L14.93,12.24L13.5,13.65L16.35,16.5L13.5,19.31L14.93,20.72L17.76,17.89L20.59,20.72L22,19.31L19.17,16.5L22,13.65Z" /></svg>',
		);
		this.editor.ui.registry.addToggleButton("ieMathquill", {
			tooltip:
				tinymce.i18n.getData()[
					this.editor.settings.language + ".iEMathquill_dlg"
				]["title"],
			icon: "formula",
			cmd: "mceIeMathquill",
			onAction: this.openDialog.bind(this),
			onSetup: function (api) {
				self.editor.on("NodeChange", function (event) {
					self.selectionBookmark = null;
					let lIsCollapsed = this.selection.isCollapsed();
					let lEquaIncluded =
						!lIsCollapsed &&
						this.selection
							.getContent({ format: "html", raw: true })
							.search(/data-latex/gi) > -1;
					let lOnEqua =
						event.element.nodeName === "IMG" &&
						event.element.hasAttribute("data-latex");
					api.setDisabled(!lOnEqua && lEquaIncluded);
					api.setActive(lOnEqua);
					for (let itemName in Object.keys(this.ui.registry.getAll().buttons)) {
						if (
							this.ui.registry.getAll().buttons[itemName] &&
							!/(iEMoodle|ieMathquill)/i.test(itemName)
						) {
							this.ui.registry
								.getAll()
								.buttons[itemName].getApi()
								.setDisabled(!!lOnEqua);
						}
					}
				});
				return null;
			},
		});
		this.editor.shortcuts.add("ctrl+m", "Mathquill", function () {
			$("[aria-label=Mathquill]").click();
		});
	},
	execCommand: function (cmd) {
		switch (cmd) {
			case "mceIeMathquill":
				this.openDialog();
				return true;
		}
		return false;
	},
	openDialog: function () {
		let lLatex = this.editor.selection.getNode().getAttribute("data-latex");
		if (lLatex) {
			this.editor.selection.select(this.editor.selection.getNode());
		} else if (!this.editor.selection.isCollapsed()) {
			lLatex = this.editor.selection.getContent();
		} else {
			lLatex = "";
		}
		this.selectionBookmark = this.editor.selection.getBookmark();
		this.win = this.editor.windowManager.openUrl({
			title:
				tinymce.i18n.getData()[
					this.editor.settings.language + ".iEMathquill_dlg"
				]["title"],
			url:
				this.editor.documentBaseUrl +
				"tiny/iEMathquill/ieMathquill.html" +
				(lLatex ? "?" + lLatex : ""),
			onAction: this.renderLatex.bind(this),
			height: this.editor.settings.clientLourd
				? Math.min(600, window.innerHeight - 20)
				: 600,
			width: 700,
			buttons: [
				{
					type: "cancel",
					name: "ieMathquill-cancel-button",
					text: tinymce.i18n.getData()[this.editor.settings.language]["cancel"],
				},
				{
					type: "custom",
					name: "ieMathquill-insert-button",
					text: tinymce.i18n.getData()[
						this.editor.settings.language + ".iEMathquill_dlg"
					]["genererimage"],
					primary: true,
				},
			],
		});
	},
	renderLatex: function () {
		if (this.win) {
			this.win.sendMessage("renderLatex");
		}
	},
	submitEquation: function (aParam) {
		if (this.selectionBookmark) {
			this.editor.selection.moveToBookmark(this.selectionBookmark);
		}
		if (aParam) {
			this.editor.execCommand("mceBeginUndoLevel");
			this.editor.selection.setContent(
				'<img data-latex="' +
					aParam.latex +
					'" alt="' +
					aParam.latex +
					'" src="' +
					aParam.dataURL +
					'" />',
			);
			this.editor.addVisual();
			this.editor.execCommand("mceEndUndoLevel");
		}
		if (this.win) {
			this.win.close();
		}
		this.editor.focus();
	},
};
tinymce.create("tinymce.plugins.iEMathquill", lPlugin);
tinymce.PluginManager.add("iEMathquill", tinymce.plugins.iEMathquill);
