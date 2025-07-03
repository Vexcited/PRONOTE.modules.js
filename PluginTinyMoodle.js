const lPlugin = {
	init: function (ed, url) {
		let lThis = this;
		this.editor = ed;
		this.options = {
			ShortAnswer: {
				withGrade: true,
				withValue: true,
				withFeedback: false,
				maxResponses: 999,
				withUI: true,
				autoAdd: false,
			},
			MultiChoice: {
				withGrade: true,
				withValue: true,
				withFeedback: false,
				maxResponses: 999,
				oneList: false,
				withUI: true,
				autoAdd: false,
			},
		};
		this.backupEdition = null;
		this.selectionBookmark = null;
		this.styleMoodle =
			"background-color:#e6e6e6;color:#222222;font-style:italic;border:#000 1px dashed;";
		this.actualAnswers = [];
		let lTempiEMoodle = this.editor.getParam("iEMoodle");
		let lModes = ["ShortAnswer", "MultiChoice"];
		if (lTempiEMoodle) {
			for (let x in lModes) {
				tinymce.extend(
					this.options[lModes[x]],
					lTempiEMoodle.options[lModes[x]],
				);
			}
		}
		this.url = url.replace(/plugins/, "tiny");
		this.editor.ui.registry.addIcon(
			"qcmdeftrou",
			'<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg viewBox="0 0 5 5" height="20px" width="20px"><g id="layer1"><g transform="matrix(1.1250001,0,0,1.1250001,96.44368,-60.498353)" id="g35"><path id="path547" d="m -81.523773,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path545" d="m -81.788357,57.980244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path543" d="m -82.05294,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path541" d="m -82.317523,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path539" d="m -82.582106,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path537" d="m -82.84669,57.980244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path535" d="m -83.111273,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path533" d="m -83.375856,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path531" d="m -83.64044,57.980244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path529" d="m -83.905023,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path527" d="m -84.169606,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path525" d="m -84.43419,57.980244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path523" d="m -84.698773,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path521" d="m -84.963356,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path519" d="m -85.22794,57.980244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path517" d="m -85.492523,57.980244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path515" d="m -81.523773,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path513" d="m -81.788357,57.71566 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path511" d="m -82.05294,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path509" d="m -82.317523,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path507" d="m -82.582106,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path505" d="m -82.84669,57.71566 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path503" d="m -83.111273,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path501" d="m -83.375856,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path499" d="m -83.64044,57.71566 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path497" d="m -83.905023,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path495" d="m -84.169606,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path493" d="m -84.43419,57.71566 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path491" d="m -84.698773,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path489" d="m -84.963356,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path487" d="m -85.22794,57.71566 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path485" d="m -85.492523,57.71566 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path483" d="m -81.523773,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path481" d="m -81.788357,57.451077 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path479" d="m -82.05294,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path477" d="m -82.317523,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path475" d="m -82.582106,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path473" d="m -82.84669,57.451077 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path471" d="m -83.111273,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path469" d="m -83.375856,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path467" d="m -83.64044,57.451077 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path465" d="m -83.905023,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path463" d="m -84.169606,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path461" d="m -84.43419,57.451077 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path459" d="m -84.698773,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path457" d="m -84.963356,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path455" d="m -85.22794,57.451077 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path453" d="m -85.492523,57.451077 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path451" d="m -81.523773,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path449" d="m -81.788357,57.186494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path447" d="m -82.05294,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path445" d="m -82.317523,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path443" d="m -82.582106,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path441" d="m -82.84669,57.186494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path439" d="m -83.111273,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path437" d="m -83.375856,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path435" d="m -83.64044,57.186494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path433" d="m -83.905023,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path431" d="m -84.169606,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path429" d="m -84.43419,57.186494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path427" d="m -84.698773,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path425" d="m -84.963356,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path423" d="m -85.22794,57.186494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path421" d="m -85.492523,57.186494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path419" d="m -81.523773,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path417" d="m -81.788357,56.921911 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path415" d="m -82.05294,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path413" d="m -82.317523,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path411" d="m -82.582106,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path409" d="m -82.84669,56.921911 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path407" d="m -83.111273,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path405" d="m -83.375856,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path403" d="m -83.64044,56.921911 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path401" d="m -83.905023,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path399" d="m -84.169606,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path397" d="m -84.43419,56.921911 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path395" d="m -84.698773,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path393" d="m -84.963356,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path391" d="m -85.22794,56.921911 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path389" d="m -85.492523,56.921911 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path387" d="m -81.523773,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path385" d="m -81.788357,56.657327 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path383" d="m -82.05294,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path381" d="m -82.317523,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path379" d="m -82.582106,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path377" d="m -82.84669,56.657327 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path375" d="m -83.111273,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path373" d="m -83.375856,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path371" d="m -83.64044,56.657327 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path369" d="m -83.905023,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path367" d="m -84.169606,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path365" d="m -84.43419,56.657327 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path363" d="m -84.698773,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path361" d="m -84.963356,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path359" d="m -85.22794,56.657327 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path357" d="m -85.492523,56.657327 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path355" d="m -81.523773,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path353" d="m -81.788357,56.392744 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path351" d="m -82.05294,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path349" d="m -82.317523,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path347" d="m -82.582106,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path345" d="m -82.84669,56.392744 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path343" d="m -83.111273,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path341" d="m -83.375856,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path339" d="m -83.64044,56.392744 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path337" d="m -83.905023,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path335" d="m -84.169606,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path333" d="m -84.43419,56.392744 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path331" d="m -84.698773,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path329" d="m -84.963356,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path327" d="m -85.22794,56.392744 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path325" d="m -85.492523,56.392744 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path323" d="m -81.523773,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path321" d="m -81.788357,56.128161 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path319" d="m -82.05294,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path317" d="m -82.317523,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path315" d="m -82.582106,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path313" d="m -82.84669,56.128161 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path311" d="m -83.111273,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path309" d="m -83.375856,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path307" d="m -83.64044,56.128161 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path305" d="m -83.905023,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path303" d="m -84.169606,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path301" d="m -84.43419,56.128161 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path299" d="m -84.698773,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path297" d="m -84.963356,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path295" d="m -85.22794,56.128161 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path293" d="m -85.492523,56.128161 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path291" d="m -81.523773,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path289" d="m -81.788357,55.863577 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path287" d="m -82.05294,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path285" d="m -82.317523,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path283" d="m -82.582106,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path281" d="m -82.84669,55.863577 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path279" d="m -83.111273,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path277" d="m -83.375856,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path275" d="m -83.64044,55.863577 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path273" d="m -83.905023,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path271" d="m -84.169606,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path269" d="m -84.43419,55.863577 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path267" d="m -84.698773,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path265" d="m -84.963356,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path263" d="m -85.22794,55.863577 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path261" d="m -85.492523,55.863577 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path259" d="m -81.523773,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path257" d="m -81.788357,55.598994 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path255" d="m -82.05294,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path253" d="m -82.317523,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path251" d="m -82.582106,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path249" d="m -82.84669,55.598994 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path247" d="m -83.111273,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path245" d="m -83.375856,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path243" d="m -83.64044,55.598994 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path241" d="m -83.905023,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path239" d="m -84.169606,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path237" d="m -84.43419,55.598994 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path235" d="m -84.698773,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path233" d="m -84.963356,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path231" d="m -85.22794,55.598994 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path229" d="m -85.492523,55.598994 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path227" d="m -81.523773,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path225" d="m -81.788357,55.334411 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path223" d="m -82.05294,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path221" d="m -82.317523,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path219" d="m -82.582106,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path217" d="m -82.84669,55.334411 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path215" d="m -83.111273,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path213" d="m -83.375856,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path211" d="m -83.64044,55.334411 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path209" d="m -83.905023,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path207" d="m -84.169606,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path205" d="m -84.43419,55.334411 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path203" d="m -84.698773,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path201" d="m -84.963356,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path199" d="m -85.22794,55.334411 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path197" d="m -85.492523,55.334411 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path195" d="m -81.523773,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path193" d="m -81.788357,55.069827 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path191" d="m -82.05294,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path189" d="m -82.317523,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path187" d="m -82.582106,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path185" d="m -82.84669,55.069827 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path183" d="m -83.111273,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path181" d="m -83.375856,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path179" d="m -83.64044,55.069827 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path177" d="m -83.905023,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path175" d="m -84.169606,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path173" d="m -84.43419,55.069827 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path171" d="m -84.698773,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path169" d="m -84.963356,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path167" d="m -85.22794,55.069827 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path165" d="m -85.492523,55.069827 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path163" d="m -81.523773,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path161" d="m -81.788357,54.805244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path159" d="m -82.05294,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path157" d="m -82.317523,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path155" d="m -82.582106,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path153" d="m -82.84669,54.805244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path151" d="m -83.111273,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path149" d="m -83.375856,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path147" d="m -83.64044,54.805244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path145" d="m -83.905023,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path143" d="m -84.169606,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path141" d="m -84.43419,54.805244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path139" d="m -84.698773,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path137" d="m -84.963356,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path135" d="m -85.22794,54.805244 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path133" d="m -85.492523,54.805244 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path131" d="m -81.523773,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path129" d="m -81.788357,54.540661 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path127" d="m -82.05294,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path125" d="m -82.317523,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path123" d="m -82.582106,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path121" d="m -82.84669,54.540661 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path119" d="m -83.111273,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path117" d="m -83.375856,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path115" d="m -83.64044,54.540661 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path113" d="m -83.905023,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path111" d="m -84.169606,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path109" d="m -84.43419,54.540661 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path107" d="m -84.698773,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path105" d="m -84.963356,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path103" d="m -85.22794,54.540661 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path101" d="m -85.492523,54.540661 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path99" d="m -81.523773,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path97" d="m -81.788357,54.276077 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path95" d="m -82.05294,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path93" d="m -82.317523,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path91" d="m -82.582106,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path89" d="m -82.84669,54.276077 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path87" d="m -83.111273,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path85" d="m -83.375856,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path83" d="m -83.64044,54.276077 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path81" d="m -83.905023,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path79" d="m -84.169606,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path77" d="m -84.43419,54.276077 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path75" d="m -84.698773,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path73" d="m -84.963356,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path71" d="m -85.22794,54.276077 h 0.264584 v 0.264584 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path69" d="m -85.492523,54.276077 h 0.264583 v 0.264584 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path67" d="m -81.523773,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path65" d="m -81.788357,54.011494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path63" d="m -82.05294,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path61" d="m -82.317523,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path59" d="m -82.582106,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path57" d="m -82.84669,54.011494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path55" d="m -83.111273,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path53" d="m -83.375856,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path51" d="m -83.64044,54.011494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path49" d="m -83.905023,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path47" d="m -84.169606,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path45" d="m -84.43419,54.011494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path43" d="m -84.698773,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path41" d="m -84.963356,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /><path id="path39" d="m -85.22794,54.011494 h 0.264584 v 0.264583 h -0.264584" style="fill:#000000;fill-opacity:1;stroke-width:0.264583" /><path id="path37" d="m -85.492523,54.011494 h 0.264583 v 0.264583 h -0.264583" style="fill:#000000;fill-opacity:0;stroke-width:0.264583" /></g></g></svg>',
		);
		this.editor.ui.registry.addToggleButton("iEMoodleShortAnswer", {
			name: "iEMoodleShortAnswer",
			icon: "qcmdeftrou",
			tooltip:
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"title_shortanswer"
				],
			onAction: this.execCommand.bind(
				this,
				"mceiEMoodleShortAnswer",
				this.options.ShortAnswer.withUI,
			),
			onSetup: function (api) {
				ed.on("NodeChange", function (event) {
					lThis.selectionBookmark = null;
					let lIsCollapsed = this.selection.isCollapsed();
					let lMoodleIncluded =
						!lIsCollapsed &&
						this.selection
							.getContent({ format: "html", raw: true })
							.search(/iEMoodle/gi) > -1;
					let lInMoodle =
						!lMoodleIncluded &&
						event.element.nodeName === "SPAN" &&
						!!event.element.getAttribute("data-mce-iEMoodleShortAnswer");
					api.setDisabled((lIsCollapsed && !lInMoodle) || lMoodleIncluded);
					api.setActive(lInMoodle);
					for (let itemName in Object.keys(this.ui.registry.getAll().buttons)) {
						if (
							this.ui.registry.getAll().buttons[itemName] &&
							!/(iEMoodle|ieMathquill)/i.test(itemName)
						) {
							this.ui.registry
								.getAll()
								.buttons[itemName].getApi()
								.setDisabled(!!lInMoodle);
						}
					}
				});
				return null;
			},
		});
		this.editor.ui.registry.addToggleButton("iEMoodleMultiChoice", {
			name: "iEMoodleMultiChoice",
			icon: "qcmdeftrou",
			tooltip:
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"title_multichoice"
				],
			onAction: this.execCommand.bind(
				this,
				"mceiEMoodleMultiChoice",
				this.options.MultiChoice.withUI,
			),
			onSetup: function (api) {
				ed.on("NodeChange", function (event) {
					lThis.selectionBookmark = null;
					let lIsCollapsed = this.selection.isCollapsed();
					let lMoodleIncluded =
						!lIsCollapsed &&
						this.selection
							.getContent({ format: "html", raw: true })
							.search(/iEMoodle/gi) > -1;
					let lInMoodle =
						!lMoodleIncluded &&
						event.element.nodeName === "SPAN" &&
						!!event.element.getAttribute("data-mce-iEMoodleMultiChoice");
					api.setDisabled((lIsCollapsed && !lInMoodle) || lMoodleIncluded);
					api.setActive(lInMoodle);
					for (let itemName in Object.keys(this.ui.registry.getAll().buttons)) {
						if (
							this.ui.registry.getAll().buttons[itemName] &&
							!/(iEMoodle|ieMathquill)/i.test(itemName)
						) {
							this.ui.registry
								.getAll()
								.buttons[itemName].getApi()
								.setDisabled(!!lInMoodle);
						}
					}
				});
				return null;
			},
		});
		this.editor.on("MouseUp", this._onSelection.bind(this));
		this.editor.on("MouseUp", this._onNodeEdition.bind(this));
		this.editor.on("KeyDown", this._onNodeEdition.bind(this));
		this.editor.on("KeyPress", this._onNodeEdition.bind(this));
		this.editor.on("KeyUp", this._onNodeEdition.bind(this));
		this.editor.on("Paste", this._onNodeEdition.bind(this));
		this.editor.on("Change", this._onNodeEdition.bind(this));
		this.editor.on("GetContent", function (ed) {
			if (ed.format === "html" && ed.raw && ed.raw === true) {
				return;
			}
			ed.content = ed.content.replace(
				/<span[^>]+?data-mce-iEMoodle(?:ShortAnswer|MultiChoice)="(.+?)".+?\/span>/gi,
				"$1",
			);
			ed.content = tinymce.DOM.decode(ed.content);
		});
		this.editor.on("BeforeSetContent", function (ed) {
			if (ed.content.search(/data-mce-iemoodle/gi) > -1) {
				return;
			}
			ed.content = ed.content.replace(
				/({[0-9]*:(ShortAnswer|MultiChoice):.*?(~*(?:%100%|=)([^~%#{}]+)#?[^~%#{}]*).*?})/gi,
				'<span data-mce-iemoodle$2="$1" style="' +
					lThis.styleMoodle +
					'">$4</span>',
			);
			let lAnswers = tinymce.map(
				ed.content.match(
					/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
				),
				function (ele) {
					ele = ele.replace(/^(multichoice:|shortanswer:)/i, "");
					ele = ele.replace(/^(:|~)?=/, "%100%");
					ele = ele.replace(/^(:|~)?([^~%#{}])/, "%0%$2");
					let lResponse = ele.split("%");
					lResponse.splice(
						2,
						1,
						lResponse[2].split("#")[0],
						lResponse[2].split("#")[1],
					);
					return {
						value: lResponse[1],
						response: lResponse[2],
						feedback: lResponse[3] ? lResponse[3] : "",
					};
				},
			);
			lThis.options.MultiChoice.answers = [];
			let lRespInAnswers = [];
			for (let x in lAnswers) {
				if (tinymce.inArray(lRespInAnswers, lAnswers[x].response) === -1) {
					lThis.options.MultiChoice.answers.push(lAnswers[x]);
					lRespInAnswers.push(lAnswers[x].response);
				}
			}
		});
	},
	execCommand: function (cmd, ui, val) {
		switch (cmd) {
			case "mceiEMoodleShortAnswer":
			case "mceiEMoodleMultiChoice":
				this._doExecCommand(cmd, ui);
				return true;
		}
		return false;
	},
	_onNodeEdition: function (aEvent) {
		let lModes = [],
			x,
			y;
		let lControls = tinymce.grep(
			Object.keys(this.editor.ui.registry.getAll().buttons),
			function (ele) {
				return (
					ele &&
					ele.settings &&
					ele.settings.cmd &&
					ele.settings.cmd.search(/iEMoodle/i) > -1
				);
			},
		);
		for (x in lControls) {
			if (lControls[x].settings.cmd.search("MultiChoice") > -1) {
				lModes.push("MultiChoice");
			} else if (lControls[x].settings.cmd.search("ShortAnswer") > -1) {
				lModes.push("ShortAnswer");
			}
		}
		for (x in lModes) {
			if (
				this.editor.selection
					.getStart()
					.getAttribute("data-mce-iEMoodle" + lModes[x]) !==
					this.editor.selection
						.getEnd()
						.getAttribute("data-mce-iEMoodle" + lModes[x]) ||
				(aEvent.keyCode === 46 &&
					aEvent.charCode === 0 &&
					this.editor.selection.getRng(true).startContainer.length ===
						this.editor.selection.getRng(true).startOffset)
			) {
				return tinymce.dom.Event.cancel(aEvent);
			}
			let lMoodle = this.editor.selection
				.getNode()
				.getAttribute("data-mce-iEMoodle" + lModes[x]);
			if (lMoodle) {
				if (
					lModes[x] !== "MultiChoice" ||
					this.editor.plugins.iEMoodle.options[lModes[x]].oneList === false
				) {
					if (this.editor.selection.getNode().innerHTML !== "") {
						this.editor.selection
							.getNode()
							.setAttribute(
								"data-mce-iEMoodle" + lModes[x],
								lMoodle.replace(
									/(~|:)(%100%|=)([^~%#{}]+)/gi,
									"$1$2" + this.editor.selection.getNode().innerHTML,
								),
							);
					} else {
						this.editor.dom.setOuterHTML(this.editor.selection.getNode(), "");
					}
				} else {
					if (
						aEvent.type === "keydown" ||
						aEvent.type === "keypress" ||
						aEvent.type === "paste" ||
						aEvent.type === "mouseup"
					) {
						this.editor.plugins.iEMoodle.backupEdition =
							this.editor.selection.getNode().innerHTML;
					} else {
						let lNewText = this.editor.selection.getNode().innerHTML;
						if (
							!this.editor.selection.getNode().innerText.trim() ||
							this.editor.plugins.iEMoodle.backupEdition === lNewText
						) {
							return;
						}
						let lAllSpan = tinymce.activeEditor.dom.select(
							"span[data-mce-iEMoodleMultiChoice]",
						);
						let lOtherWithSameOldWord = false;
						for (y in lAllSpan) {
							if (lAllSpan[y] === this.editor.selection.getNode()) {
								continue;
							}
							if (
								lAllSpan[y].innerHTML ===
								this.editor.plugins.iEMoodle.backupEdition
							) {
								lOtherWithSameOldWord = true;
								break;
							}
						}
						let lOtherWithSameNewWord = false;
						for (y in lAllSpan) {
							if (lAllSpan[y] === this.editor.selection.getNode()) {
								continue;
							}
							if (lAllSpan[y].innerHTML === lNewText) {
								lOtherWithSameNewWord = true;
								break;
							}
						}
						if (!lOtherWithSameOldWord && !lOtherWithSameNewWord) {
							if (lNewText !== "") {
								for (y in lAllSpan) {
									lAllSpan[y].setAttribute(
										"data-mce-iEMoodle" + lModes[x],
										lAllSpan[y]
											.getAttribute("data-mce-iEMoodle" + lModes[x])
											.replace(
												new RegExp(
													"(%|=|~)(" +
														this.editor.plugins.iEMoodle.backupEdition +
														")(#|~)",
													"",
												),
												"$1" + lNewText + "$3",
											),
									);
									if (
										lAllSpan[y].innerHTML ===
										this.editor.plugins.iEMoodle.backupEdition
									) {
										lAllSpan[y].innerHTML =
											this.editor.selection.getNode().innerHTML;
									}
								}
							} else {
								for (y in lAllSpan) {
									lAllSpan[y].setAttribute(
										"data-mce-iEMoodle" + lModes[x],
										lAllSpan[y]
											.getAttribute("data-mce-iEMoodle" + lModes[x])
											.replace(
												new RegExp(
													"(:|~)(%[0-9]+%|=)(" +
														this.editor.plugins.iEMoodle.backupEdition +
														")(#|~)([^~%}]*)?(~)?(?=})?",
													"",
												),
												"$1",
											),
									);
									lAllSpan[y].setAttribute(
										"data-mce-iEMoodle" + lModes[x],
										lAllSpan[y]
											.getAttribute("data-mce-iEMoodle" + lModes[x])
											.replace(new RegExp("~}$", ""), "}"),
									);
								}
								this.editor.dom.setOuterHTML(
									this.editor.selection.getNode(),
									"",
								);
							}
						} else if (lOtherWithSameOldWord && lOtherWithSameNewWord) {
							this.editor.selection.getNode().setAttribute(
								"data-mce-iEMoodle" + lModes[x],
								this.editor.selection
									.getNode()
									.getAttribute("data-mce-iEMoodle" + lModes[x])
									.replace(
										new RegExp(
											"(%[0-9]+%|=)(" +
												this.editor.plugins.iEMoodle.backupEdition +
												")(#|~)",
											"",
										),
										"%0%$2$3",
									),
							);
							this.editor.selection.getNode().setAttribute(
								"data-mce-iEMoodle" + lModes[x],
								this.editor.selection
									.getNode()
									.getAttribute("data-mce-iEMoodle" + lModes[x])
									.replace(
										new RegExp("(%[0-9]+%|=)(" + lNewText + ")(#|~)", ""),
										"%100%$2$3",
									),
							);
						} else if (lOtherWithSameOldWord) {
							if (lNewText !== "") {
								for (y in lAllSpan) {
									lAllSpan[y].setAttribute(
										"data-mce-iEMoodle" + lModes[x],
										lAllSpan[y]
											.getAttribute("data-mce-iEMoodle" + lModes[x])
											.replace(new RegExp("}$", ""), "~%0%" + lNewText + "#}"),
									);
								}
								this.editor.selection.getNode().setAttribute(
									"data-mce-iEMoodle" + lModes[x],
									this.editor.selection
										.getNode()
										.getAttribute("data-mce-iEMoodle" + lModes[x])
										.replace(
											new RegExp(
												"(%[0-9]+%|=)(" +
													this.editor.plugins.iEMoodle.backupEdition +
													")(#|~)",
												"",
											),
											"%0%$2$3",
										),
								);
								this.editor.selection.getNode().setAttribute(
									"data-mce-iEMoodle" + lModes[x],
									this.editor.selection
										.getNode()
										.getAttribute("data-mce-iEMoodle" + lModes[x])
										.replace(
											new RegExp("(%[0-9]+%|=)(" + lNewText + ")(#|~)", ""),
											"%100%$2$3",
										),
								);
							} else {
								this.editor.dom.setOuterHTML(
									this.editor.selection.getNode(),
									"",
								);
							}
						} else if (lOtherWithSameNewWord) {
							for (y in lAllSpan) {
								lAllSpan[y].setAttribute(
									"data-mce-iEMoodle" + lModes[x],
									lAllSpan[y]
										.getAttribute("data-mce-iEMoodle" + lModes[x])
										.replace(
											new RegExp(
												"(:|~)(%[0-9]+%|=)(" +
													this.editor.plugins.iEMoodle.backupEdition +
													")(#|~)([^~%}]*)?(~)?(?=})?",
												"",
											),
											"$1",
										),
								);
								lAllSpan[y].setAttribute(
									"data-mce-iEMoodle" + lModes[x],
									lAllSpan[y]
										.getAttribute("data-mce-iEMoodle" + lModes[x])
										.replace(new RegExp("~}$", ""), "}"),
								);
							}
							this.editor.selection.getNode().setAttribute(
								"data-mce-iEMoodle" + lModes[x],
								this.editor.selection
									.getNode()
									.getAttribute("data-mce-iEMoodle" + lModes[x])
									.replace(
										new RegExp("(%[0-9]+%|=)(" + lNewText + ")(#|~)", ""),
										"%100%$2$3",
									),
							);
						}
						this.editor.plugins.iEMoodle.backupEdition = null;
						let lInnerHTML = this.editor.selection
							.getNode()
							.getAttribute("data-mce-iEMoodle" + lModes[x])
							.match(/(%100%|=)([^~%#{}]+)/);
						if (this.editor.selection.getNode().innerHTML !== lInnerHTML[2]) {
							this.editor.selection.getNode().innerHTML = lInnerHTML[2];
						}
					}
				}
			}
		}
	},
	_onSelection: function () {
		let lMoodleInclude =
			this.editor.selection
				.getContent({ format: "html" })
				.search(/iEMoodle/gi) > -1;
		if (
			Object.keys(this.editor.ui.registry.getAll().buttons).indexOf(
				"iEMoodleShortAnswer",
			) >= 0
		) {
			this.editor.ui.registry
				.getAll()
				.buttons["iEMoodleShortAnswer"].getApi()
				.setDisabled(
					lMoodleInclude ||
						this.editor.selection.getContent({ format: "text" }) === "" ||
						this.editor.selection
							.getNode()
							.getAttribute("data-mce-iEMoodleMultiChoice"),
				);
		}
		if (
			Object.keys(this.editor.ui.registry.getAll().buttons).indexOf(
				"iEMoodleMultiChoice",
			) >= 0
		) {
			this.editor.ui.registry
				.getAll()
				.buttons["iEMoodleMultiChoice"].getApi()
				.setDisabled(
					lMoodleInclude ||
						this.editor.selection.getContent({ format: "text" }) === "" ||
						this.editor.selection
							.getNode()
							.getAttribute("data-mce-iEMoodleShortAnswer"),
				);
		}
	},
	_doExecCommand: function (cmd, ui) {
		this.actualAnswers = [];
		let lMode = cmd.substring(11),
			lThis = this;
		if (!this.selectionBookmark) {
			this.selectionBookmark = this.editor.selection.getBookmark();
		}
		if (ui || (lMode === "MultiChoice" && !this.options[lMode].oneList)) {
			const lWin = this.editor.windowManager.open({
				title:
					tinymce.i18n.getData()[
						this.editor.settings.language + ".iEMoodle_dlg"
					]["title_multichoice"],
				size: "normal",
				onAction: function (api, details) {
					if (details.name === "ieMoodle-insert-button") {
						lThis.insertSA(lMode, lWin);
					} else if (details.name === "ieMoodle-delete-button") {
						lThis.removeSA(lMode, lWin);
					} else if (details.name === "ieMoodle-cancel-button") {
						lThis.editor.nodeChanged();
						lWin.close();
					}
				},
				body: {
					type: "panel",
					items: [{ type: "htmlpanel", html: this._constructWindow() }],
				},
				buttons: [
					{
						name: "ieMoodle-insert-button",
						type: "custom",
						text: tinymce.i18n.getData()[this.editor.settings.language][
							"insert"
						],
						primary: true,
					},
					{
						name: "ieMoodle-delete-button",
						type: "custom",
						text: tinymce.i18n.getData()[
							this.editor.settings.language + ".iEMoodle_dlg"
						]["deletion"],
						disabled: true,
					},
					{
						name: "ieMoodle-cancel-button",
						type: "cancel",
						text: tinymce.i18n.getData()[this.editor.settings.language][
							"cancel"
						],
					},
				],
			});
			this._initWindow(lMode, lWin);
		} else {
			let lActualAnswer = this._getSelection(lMode);
			if (lActualAnswer.answers.length > 0) {
				this._removeMoodle(lMode);
			} else {
				if (
					!this._isValidAnswer(
						this.editor.selection.getContent({ format: "text" }),
						lMode,
					)
				) {
					this.editor.windowManager.alert(
						tinymce.i18n.getData()[
							this.editor.settings.language + ".iEMoodle_dlg"
						]["forbiddenchar"],
					);
					return false;
				}
				let lGlobalAnswers = this._getAnswers(
					lMode,
					this.editor.selection.getContent({ format: "text" }),
				);
				if (lGlobalAnswers.answers.length > 0) {
					for (let x in lGlobalAnswers.answers) {
						this._addAnswer(lGlobalAnswers.answers[x]);
					}
				}
				if (!lGlobalAnswers.inList) {
					this._addAnswer({
						value: 100,
						response: this.editor.selection.getContent({ format: "text" }),
						feedback: "",
					});
				}
				if (this._getNbAnswers() > 0) {
					let lAnswers = this._getValidAnswers();
					this._storeAnswers(lMode, lAnswers);
					if (lAnswers.length === 0) {
						this._removeMoodle(lMode);
					} else {
						this._addMoodle(lMode, "", lAnswers);
					}
				}
			}
			this.editor.addVisual();
		}
		return true;
	},
	_addAnswer: function (aAnswer) {
		aAnswer.response = aAnswer.response.replace(
			/^[\u2000-\u200F\s\uFEFF]+/,
			"",
		);
		aAnswer.response = aAnswer.response.replace(
			/[\u2000-\u200F\s\uFEFF]+$/,
			"",
		);
		this.actualAnswers.push(aAnswer);
		return this.actualAnswers[this.actualAnswers.length - 1];
	},
	_getAnswer: function (aIndice) {
		return this.actualAnswers[aIndice];
	},
	_getGoodAnswerIndice: function () {
		for (let x in this.actualAnswers) {
			if (this.actualAnswers[x].value === 100) {
				return x;
			}
		}
		return -1;
	},
	_getNbAnswers: function () {
		return this.actualAnswers.length;
	},
	_getValidAnswers: function () {
		return tinymce.grep(this.actualAnswers, function (ele) {
			return ele && ele.response;
		});
	},
	_isMaxAnswers: function (aMode) {
		return (
			tinymce.grep(this.actualAnswers, function (ele) {
				return ele && ele.response;
			}).length >= this.options[aMode].maxResponses
		);
	},
	_isValidAnswer: function (aAnswer, aMode) {
		let lAnswer = aAnswer.replace(/^[\u2000-\u200F\s\uFEFF]+/, "");
		lAnswer = lAnswer.replace(/[\u2000-\u200F\s\uFEFF]+$/, "");
		if (
			aMode === "MultiChoice" &&
			!this.options[aMode].oneList &&
			lAnswer.search(/[<>]/g) > -1
		) {
			return false;
		}
		return (
			lAnswer !== "" &&
			lAnswer.search(/[~%#{}:]/g) === -1 &&
			tinymce.grep(this.actualAnswers, function (ele) {
				return ele && ele.response === lAnswer;
			}).length === 0
		);
	},
	_removeAnswer: function (aIndice) {
		if (this.actualAnswers[aIndice]) {
			this.actualAnswers[aIndice] = null;
			return true;
		}
		return false;
	},
	_editAnswer: function (aIndice, aAnswer) {
		if (this.actualAnswers[aIndice]) {
			aAnswer.response = aAnswer.response.replace(
				/^[\u2000-\u200F\s\uFEFF]+/,
				"",
			);
			aAnswer.response = aAnswer.response.replace(
				/[\u2000-\u200F\s\uFEFF]+$/,
				"",
			);
			this.actualAnswers[aIndice] = aAnswer;
			return true;
		}
		return false;
	},
	_removeAllAnswers: function () {
		this.actualAnswers = [null];
	},
	_addMoodle: function (aMode, aGrade, aAnswers) {
		let lResponses = [];
		function findNewAnswers(eleAns) {
			return (
				eleAns &&
				tinymce.grep(lResponses, function (eleResp) {
					return eleResp && eleResp.response === eleAns.response;
				}).length === 0
			);
		}
		this.editor.execCommand("mceBeginUndoLevel");
		if (aMode === "MultiChoice" && this.options[aMode].oneList) {
			let lOtherElements = this.editor.dom.select(
				"[data-mce-iEMoodle" + aMode + "]",
			);
			for (let x in lOtherElements) {
				let lElement = lOtherElements[x];
				let lOldResponses = lElement.getAttribute("data-mce-iEMoodle" + aMode);
				let lGrade = "";
				if (this.options[aMode].withGrade) {
					lGrade = lOldResponses.substring(1, lOldResponses.indexOf(":"));
				}
				lResponses = lOldResponses.match(
					/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
				);
				for (let y in lResponses) {
					lResponses[y] = lResponses[y].replace(
						/^(multichoice:|shortanswer:)/i,
						"",
					);
					lResponses[y] = lResponses[y].replace(/^(:|~)?=/, "%100%");
					lResponses[y] = lResponses[y].replace(/^(:|~)?([^~%#{}])/, "%0%$2");
					let lResponse = lResponses[y].split("%");
					lResponse.splice(
						2,
						1,
						lResponse[2].split("#")[0],
						lResponse[2].split("#")[1],
					);
					lResponses[y] = {
						value: lResponse[1],
						response: lResponse[2],
						feedback: lResponse[3] ? lResponse[3] : "",
					};
				}
				let lNewAnswers = tinymce.grep(aAnswers, findNewAnswers);
				let lNewAnswersCopy = [];
				for (let z in lNewAnswers) {
					lNewAnswersCopy[z] = {};
					lNewAnswersCopy[z].value = 0;
					lNewAnswersCopy[z].response = lNewAnswers[z].response;
					lNewAnswersCopy[z].feedback = lNewAnswers[z].feedback;
				}
				lResponses = lResponses.concat(lNewAnswersCopy);
				lElement.setAttribute(
					"data-mce-iEMoodle" + aMode,
					"{" +
						(lGrade !== "" ? parseInt(lGrade) : "") +
						":" +
						aMode.toUpperCase() +
						":" +
						tinymce
							.map(lResponses, function (ele) {
								return ele
									? "%" + ele.value + "%" + ele.response + "#" + ele.feedback
									: false;
							})
							.join("~") +
						"}",
				);
			}
		}
		let lMoodle =
			"{" +
			(aGrade !== "" ? parseInt(aGrade) : "") +
			":" +
			aMode.toUpperCase() +
			":" +
			tinymce
				.map(aAnswers, function (ele) {
					return ele
						? "%" + ele.value + "%" + ele.response + "#" + ele.feedback
						: false;
				})
				.join("~") +
			"}";
		if (this.selectionBookmark) {
			this.editor.selection.moveToBookmark(this.selectionBookmark);
			this.selectionBookmark = null;
		}
		let lOriginalContent = this.editor.selection.getContent({ format: "html" });
		let lContent = tinymce.grep(aAnswers, function (ele) {
			return ele && ele.value === 100;
		})[0].response;
		let lLeadTrailSpace = lOriginalContent.match(
			/^([\u2000-\u200F\s\uFEFF]*)(.*?)([\u2000-\u200F\s\uFEFF]*)$/,
		);
		this.editor.selection.setContent(
			lLeadTrailSpace[1] +
				'<span style="' +
				this.styleMoodle +
				'" data-mce-iEMoodle' +
				aMode +
				'="' +
				lMoodle +
				'">' +
				lContent +
				"</span>" +
				lLeadTrailSpace[3],
		);
		this.editor.addVisual();
		this.editor.execCommand("mceEndUndoLevel");
	},
	_removeMoodle: function (aMode) {
		let lOriginalText = this.editor.selection.getContent({ format: "text" });
		this.editor.execCommand("mceBeginUndoLevel");
		this.editor.selection.setContent(lOriginalText, { no_events: true });
		if (aMode === "MultiChoice" && this.options[aMode].oneList) {
			this._removeOneListMultiChoice(aMode, lOriginalText);
		}
		this.editor.addVisual();
		this.editor.execCommand("mceEndUndoLevel");
	},
	_removeOneListMultiChoice: function (aMode, aOriginalText) {
		let lOtherElements = this.editor.dom.select(
			"[data-mce-iEMoodle" + aMode + "]",
		);
		let lStillWithSameName = tinymce.grep(lOtherElements, function (ele) {
			return ele.textContent === aOriginalText;
		});
		if (lStillWithSameName.length === 0) {
			let x, lNewAnswers;
			for (x in lOtherElements) {
				let lElement = lOtherElements[x];
				let lOldResponses = lElement.getAttribute("data-mce-iEMoodle" + aMode);
				let lGrade = "";
				if (this.options[aMode].withGrade) {
					lGrade = lOldResponses.substring(1, lOldResponses.indexOf(":"));
				}
				let lResponses = lOldResponses.match(
					/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
				);
				for (let y in lResponses) {
					if (!$.isNumeric(y)) {
						continue;
					}
					lResponses[y] = lResponses[y].replace(
						/^(multichoice:|shortanswer:)/i,
						"",
					);
					lResponses[y] = lResponses[y].replace(/^(:|~)?=/, "%100%");
					lResponses[y] = lResponses[y].replace(/^(:|~)?([^~%#{}])/, "%0%$2");
					let lResponse = lResponses[y].split(/[%#]/g);
					if (lResponse[2] !== aOriginalText) {
						lResponses[y] = {
							value: lResponse[1],
							response: lResponse[2],
							feedback: lResponse[3] ? lResponse[3] : "",
						};
					} else {
						lResponses[y] = null;
					}
				}
				lNewAnswers = tinymce.grep(lResponses, function (ele) {
					return ele && ele.response;
				});
				lElement.setAttribute(
					"data-mce-iEMoodle" + aMode,
					"{" +
						(lGrade !== "" ? parseInt(lGrade) : "") +
						":" +
						aMode.toUpperCase() +
						":" +
						tinymce
							.map(lNewAnswers, function (ele) {
								return ele
									? "%" + ele.value + "%" + ele.response + "#" + ele.feedback
									: false;
							})
							.join("~") +
						"}",
				);
			}
			for (x in this.options[aMode].answers) {
				if (this.options[aMode].answers[x].response === aOriginalText) {
					this.options[aMode].answers[x] = null;
				}
			}
			lNewAnswers = tinymce.grep(this.options[aMode].answers, function (ele) {
				return ele && ele.response;
			});
			this._storeAnswers(aMode, lNewAnswers);
		}
	},
	_storeAnswers: function (aMode, aAnswers) {
		if (aMode === "MultiChoice" && this.options[aMode].oneList) {
			this.options[aMode].answers = aAnswers;
		}
	},
	_getAnswers: function (aMode, aText) {
		let lReturn = { inList: "", answers: [] };
		let lText = aText.replace(/^[\u2000-\u200F\s\uFEFF]+/, "");
		lText = lText.replace(/[\u2000-\u200F\s\uFEFF]+$/, "");
		if (aMode === "MultiChoice" && this.options[aMode].oneList) {
			for (let x in this.options[aMode].answers) {
				let lAnswer = this.options[aMode].answers[x];
				lReturn.answers.push({
					value: lAnswer.response === lText ? 100 : 0,
					response: lAnswer.response,
					feedback: lAnswer.feedback,
				});
			}
			let lAnswerWithText = tinymce.grep(lReturn.answers, function (ele) {
				return ele && ele.response === lText;
			});
			lReturn.inList = lAnswerWithText.length > 0;
		}
		return lReturn;
	},
	_getSelection: function (aMode) {
		let lReturn = { grade: "", answers: [] };
		if (this.selectionBookmark) {
			this.editor.selection.moveToBookmark(this.selectionBookmark);
		}
		if (
			this.editor.selection.getNode().nodeName === "SPAN" &&
			this.editor.selection.getNode().getAttribute("data-mce-iEMoodle" + aMode)
		) {
			let lOldResponses = this.editor.selection
				.getNode()
				.getAttribute("data-mce-iEMoodle" + aMode);
			this.editor.selection.select(this.editor.selection.getNode());
			if (!this.selectionBookmark) {
				this.selectionBookmark = this.editor.selection.getBookmark();
			}
			if (this.options[aMode].withGrade) {
				lReturn.grade = lOldResponses.substring(1, lOldResponses.indexOf(":"));
			}
			let lResponses = lOldResponses.match(
				/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
			);
			for (let x in lResponses) {
				if (!$.isNumeric(x)) {
					continue;
				}
				lResponses[x] = lResponses[x].replace(
					/^(multichoice:|shortanswer:)/i,
					"",
				);
				lResponses[x] = lResponses[x].replace(/^(:|~)?=/, "%100%");
				lResponses[x] = lResponses[x].replace(/^(:|~)?([^~%#{}])/, "%0%$2");
				let lResponse = lResponses[x].split("%");
				lResponse.splice(
					2,
					1,
					lResponse[2].split("#")[0],
					lResponse[2].split("#")[1],
				);
				lReturn.answers.push({
					value: lResponse[1],
					response: lResponse[2],
					feedback: lResponse[3] ? lResponse[3] : "",
				});
			}
		} else if (!this.selectionBookmark) {
			this.selectionBookmark = this.editor.selection.getBookmark();
		}
		return lReturn;
	},
	_constructWindow: function () {
		let lHtml = [];
		lHtml.push('<div id="ieMoodle-response-grade-container">');
		lHtml.push('<label for="ieMoodle-response-grade"></label>');
		lHtml.push('<input type="text" id="ieMoodle-response-grade" />');
		lHtml.push("</div>");
		lHtml.push('<div id="ieMoodle-answers-table">');
		lHtml.push('<table cellpadding="0" cellspacing="0">');
		lHtml.push("<thead>");
		lHtml.push("<tr>");
		lHtml.push(
			'<th style="width: 100%;">' +
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"response"
				] +
				"</th>",
		);
		lHtml.push(
			'<th style="width: 5%;">' +
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"correct"
				] +
				"</th>",
		);
		lHtml.push(
			'<th id="thFeedback" style="width: 30%;">' +
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"feedback"
				] +
				"</th>",
		);
		lHtml.push("</tr>");
		lHtml.push("</thead>");
		lHtml.push('<tbody id="answers" style="background-color:#fff;">');
		lHtml.push('<tr id="addAnswer">');
		lHtml.push(
			'<td colspan="3">' +
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"add"
				] +
				"</td>",
		);
		lHtml.push("</tr>");
		lHtml.push("</tbody>");
		lHtml.push("</table>");
		lHtml.push("</div>");
		return lHtml.join("");
	},
	_initWindow: function (aMode, aWindow) {
		if (!this.options[aMode].withGrade) {
			tinymce.dom.DomQuery("#ieMoodle-response-grade-container").hide();
		}
		if (!this.options[aMode].withFeedback) {
			tinymce.dom.DomQuery("#thFeedback").hide();
		}
		tinymce.dom
			.DomQuery("#addAnswer")
			.find("td")
			.on("click", this.insertMode.bind(this, aMode));
		let lActualAnswers = this._getSelection(aMode);
		if (lActualAnswers.answers.length > 0) {
			this.selectionBookmark = this.editor.selection.getBookmark();
			tinymce.dom.DomQuery("#ieMoodle-response-grade")[0].value =
				lActualAnswers.grade;
			for (let x in lActualAnswers.answers) {
				this.addRowResp(
					aMode,
					lActualAnswers.answers[x].value,
					lActualAnswers.answers[x].response,
					lActualAnswers.answers[x].feedback,
					lActualAnswers.answers[x].response ===
						this.editor.selection.getContent({ format: "text" }),
				);
			}
			if (aMode === "MultiChoice" && !this.options[aMode].oneList) {
				aWindow.enable("ieMoodle-delete-button");
			}
		} else {
			if (this.selectionBookmark) {
				this.editor.selection.moveToBookmark(this.selectionBookmark);
				this.selectionBookmark = this.editor.selection.getBookmark();
			}
			let lTextSelec = this.editor.selection.getContent({ format: "text" });
			let lGlobalAnswers = this._getAnswers(aMode, lTextSelec);
			if (lGlobalAnswers.answers.length > 0) {
				for (let x in lGlobalAnswers.answers) {
					let lAnswer = lGlobalAnswers.answers[x];
					this.addRowResp(
						aMode,
						lAnswer.value,
						lAnswer.response,
						lAnswer.feedback,
						lAnswer.response === lTextSelec,
					);
				}
			}
			if (!lGlobalAnswers.inList) {
				this.insertMode(aMode);
				tinymce.dom.DomQuery("#addOpt_resp")[0].value = lTextSelec;
				if (this.options[aMode].autoAdd) {
					this.addResponse(aMode, true);
				}
			}
		}
	},
	insertSA: function (aMode, aWindow) {
		if (this._getNbAnswers() > 0) {
			let lAnswers = this._getValidAnswers();
			this._storeAnswers(aMode, lAnswers);
			if (lAnswers.length === 0) {
				this._removeMoodle(aMode);
				this.editor.nodeChanged();
				aWindow.close();
			} else {
				let lGoodAnswers = tinymce.grep(lAnswers, function (ele) {
					return ele && ele.value === 100;
				});
				if (lGoodAnswers.length === 0) {
					this.editor.windowManager.alert(
						tinymce.i18n.getData()[
							this.editor.settings.language + ".iEMoodle_dlg"
						]["no_good_answer"],
					);
				} else if (lAnswers.length === 1) {
					this.editor.windowManager.alert(
						tinymce.i18n.getData()[
							this.editor.settings.language + ".iEMoodle_dlg"
						]["no_alone_answer"],
					);
				} else {
					if (this.selectionBookmark) {
						this.editor.selection.moveToBookmark(this.selectionBookmark);
					}
					let inputGrade = tinymce.dom.DomQuery("#ieMoodle-response-grade");
					if (
						inputGrade[0].value === "" ||
						parseInt(inputGrade[0].value) >= 0
					) {
						inputGrade[0].style.borderColor = "";
						this._addMoodle(aMode, inputGrade[0].value || "", lAnswers);
						this.editor.nodeChanged();
						aWindow.close();
					} else {
						inputGrade[0].style.borderColor = "red";
					}
				}
			}
		} else {
			this.editor.nodeChanged();
			aWindow.close();
		}
		this.selectionBookmark = null;
	},
	removeSA: function (aMode, aWindow) {
		if (this.selectionBookmark) {
			this.editor.selection.moveToBookmark(this.selectionBookmark);
		}
		this._removeMoodle(aMode);
		this.editor.nodeChanged();
		aWindow.close();
		this.selectionBookmark = null;
	},
	insertMode: function (aMode) {
		tinymce.dom
			.DomQuery("#addAnswer")
			.find("td")
			.html(
				'<input id="addOpt_resp" name="addOpt_resp" type="text" value="" />',
			);
		tinymce.dom
			.DomQuery("#addOpt_resp")
			.on("blur", this.addResponse.bind(this, aMode, false))
			.on("keydown", this.keyUpInput.bind(this, aMode))[0]
			.focus();
	},
	addResponse: function (aMode, aForceGood) {
		let inputResp = tinymce.dom.DomQuery("#addOpt_resp")[0];
		let tempResp = inputResp ? inputResp.value : null;
		if (tempResp && this._isValidAnswer(tempResp, aMode)) {
			this.addRowResp(
				aMode,
				aForceGood ? 100 : 0,
				tempResp,
				"",
				tempResp === this.editor.selection.getContent({ format: "text" }),
			);
			inputResp.value = "";
		} else if (tempResp !== "") {
			this.editor.windowManager.alert(
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"forbiddencharcrduplicate"
				],
			);
		}
		tinymce.dom
			.DomQuery("#addAnswer")
			.find("td")
			.html(
				tinymce.i18n.getData()[this.editor.settings.language + ".iEMoodle_dlg"][
					"add"
				],
			);
		tinymce.dom
			.DomQuery("#addAnswer")
			.find("td")
			.on("click", this.insertMode.bind(this, aMode));
	},
	keyUpInput: function (aMode, event) {
		if (event.keyCode === 13) {
			this.addResponse(aMode, false);
		}
	},
	addRowResp: function (aMode, aValue, aResp, aFeed, aDisabledRemove) {
		let lAnswer = this._addAnswer({
			value: parseInt(aValue),
			response: aResp,
			feedback: aFeed,
		});
		let curInd = this._getNbAnswers() - 1;
		let newRow = document.createElement("tr");
		newRow.id = "response_" + curInd;
		let newCell = document.createElement("td");
		newCell.className = "valeurReponse";
		newCell.textContent = lAnswer.response;
		newRow.appendChild(newCell);
		newCell = document.createElement("td");
		newCell.className = "bonneReponse";
		newCell.style.textAlign = "center";
		let newSpan = false;
		if (aMode === "ShortAnswer") {
			newSpan = document.createElement("span");
			if (!this.options[aMode].withValue) {
				newSpan.style.display = "none";
			}
			newSpan.innerHTML = parseInt(lAnswer.value) + "&nbsp;%";
		} else if (aMode === "MultiChoice") {
			newSpan = document.createElement("div");
			if (lAnswer.value === 100) {
				newSpan.className = "Image_QCM_CocheVerte";
			}
			newSpan.innerHTML = "&nbsp;";
		}
		if (newSpan) {
			newCell.appendChild(newSpan);
		}
		newRow.appendChild(newCell);
		if (this.options[aMode].withFeedback) {
			newCell = document.createElement("td");
			newCell.className = "feedbackReponse";
			newCell.style.fontStyle = "italic";
			newCell.textContent = lAnswer.feedback;
			newRow.appendChild(newCell);
		}
		tinymce.dom.DomQuery("#answers").append(newRow);
		tinymce.dom
			.DomQuery("#answers")
			.find("tr:last")
			.on("contextmenu", this.openContext.bind(this, curInd))
			.find("td.valeurReponse")
			.on("click", this.makeEditable.bind(this, aMode))
			.next("td.bonneReponse")
			.children("div")
			.on("click", this.changeValue.bind(this))
			.parent()
			.next("td.feedbackReponse")
			.on("click", this.makeEditable.bind(this, aMode));
	},
	makeEditable: function (aMode, event) {
		if (tinymce.dom.DomQuery(event.target).children("input").length === 0) {
			tinymce.dom
				.DomQuery(event.target)
				.html(
					'<input type="text" value="' +
						tinymce.dom.DomQuery(event.target).text() +
						'" />',
				)
				.children("input")
				.on("blur", this.removeEditable.bind(this, aMode, event))
				.on("keydown", this.keyUpInput.bind(this, aMode, event))[0]
				.focus();
		}
	},
	openContext: function (aIndex, event) {
		tinymce.dom.DomQuery("#ieMoodle-answers-context").remove();
		if (this._getNbAnswers() <= 1) {
			return;
		}
		tinymce.dom
			.DomQuery("#ieMoodle-answers-table")
			.append(
				'<div id="ieMoodle-answers-context" style="top:' +
					(event.pageY -
						tinymce.dom.DomQuery("#ieMoodle-answers-table").offset().top) +
					"px;left:" +
					(event.pageX -
						tinymce.dom.DomQuery("#ieMoodle-answers-table").offset().left) +
					'px;">' +
					"<div>" +
					tinymce.i18n.getData()[
						this.editor.settings.language + ".iEMoodle_dlg"
					]["deletion"] +
					"</div>" +
					"</div>",
			);
		tinymce.dom
			.DomQuery("#ieMoodle-answers-table")
			.find("div:last")
			.on("mouseout", function () {
				tinymce.dom.DomQuery("#ieMoodle-answers-context").remove();
			})
			.on("click", () => {
				this.removeResponse(aIndex);
				tinymce.dom.DomQuery("#ieMoodle-answers-context").remove();
			});
		event.preventDefault();
		event.stopImmediatePropagation();
	},
	removeEditable: function (aMode, event) {
		let newVal = tinymce.dom.DomQuery(event.target).children()[0].value;
		if (tinymce.dom.DomQuery(event.target).parent().length === 0) {
			return;
		}
		let indiceReponse = tinymce.dom
			.DomQuery(event.target)
			.parent()
			.attr("id")
			.match(/response_([0-9]+)$/i)[1];
		let oldAnswer = this._getAnswer(indiceReponse);
		let newAnswer = {
			value: oldAnswer.value,
			response: oldAnswer.response,
			feedback: oldAnswer.feedback,
		};
		if (tinymce.dom.DomQuery(event.target).hasClass("valeurReponse")) {
			newAnswer.response = newVal;
		} else if (tinymce.dom.DomQuery(event.target).hasClass("feedbackReponse")) {
			newAnswer.feedback = newVal;
		}
		if (newVal === "") {
			this.removeResponse(indiceReponse);
		} else if (this._isValidAnswer(newVal, aMode)) {
			this._editAnswer(indiceReponse, newAnswer);
			tinymce.dom.DomQuery(event.target).html(newVal);
		} else {
			let oldVal = "";
			if (tinymce.dom.DomQuery(event.target).hasClass("valeurReponse")) {
				oldVal = oldAnswer.response;
			} else if (
				tinymce.dom.DomQuery(event.target).hasClass("feedbackReponse")
			) {
				oldVal = oldAnswer.feedback;
			}
			tinymce.dom.DomQuery(event.target).html(oldVal);
			if (oldVal !== newVal) {
				this.editor.windowManager.alert(
					tinymce.i18n.getData()[
						this.editor.settings.language + ".iEMoodle_dlg"
					]["forbiddenchar"],
				);
			}
		}
	},
	removeResponse: function (aIndice) {
		if (this._removeAnswer(aIndice)) {
			tinymce.dom
				.DomQuery("#answers")
				.find("#response_" + aIndice)
				.remove();
		}
	},
	changeValue: function (event) {
		let indiceReponse =
			tinymce.dom.DomQuery(event.target).parents("tr:first") &&
			tinymce.dom.DomQuery(event.target).parents("tr:first").attr("id") &&
			tinymce.dom
				.DomQuery(event.target)
				.parents("tr:first")
				.attr("id")
				.match(/response_([0-9]+)$/i)[1];
		if (indiceReponse) {
			let newGoodAnswer = this._getAnswer(indiceReponse);
			if (newGoodAnswer.value === 100) {
				return;
			}
			let indiceGoodAnswer = this._getGoodAnswerIndice();
			let oldGoodAnswer =
				indiceGoodAnswer > -1 ? this._getAnswer(indiceGoodAnswer) : null;
			newGoodAnswer.value = 100;
			if (oldGoodAnswer) {
				oldGoodAnswer.value = 0;
			}
			this._editAnswer(indiceReponse, newGoodAnswer);
			if (oldGoodAnswer) {
				this._editAnswer(indiceGoodAnswer, oldGoodAnswer);
			}
			tinymce.dom.DomQuery(event.target).addClass("Image_QCM_CocheVerte");
			if (oldGoodAnswer) {
				tinymce.dom
					.DomQuery("#response_" + indiceGoodAnswer + " td.bonneReponse")
					.children("div")
					.removeClass("Image_QCM_CocheVerte");
			}
		}
	},
};
tinymce.create("tinymce.plugins.iEMoodlePlugin", lPlugin);
tinymce.PluginManager.add("iEMoodle", tinymce.plugins.iEMoodlePlugin);
