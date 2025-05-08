exports.UtilitaireHtml = void 0;
const UtilitaireHtml = {
	composeGroupeRadiosBoutons(aParams) {
		const H = [];
		const lClasses = ["GroupeRadioButton"];
		if (!!aParams.class) {
			lClasses.push(aParams.class);
		}
		H.push(
			'<div class="',
			lClasses.join(" "),
			'" id="',
			aParams.id,
			'" tabindex="-1">',
		);
		for (let i = 0; i < aParams.listeRadios.length; i++) {
			const lRadio = aParams.listeRadios[i];
			if (!lRadio.id) {
				lRadio.id = aParams.id + "_" + i;
			}
			const isChecked = !!aParams.selectedValue
				? lRadio.value === aParams.selectedValue
				: i === 0;
			const lArrDataset = [];
			if (!!lRadio.dataset) {
				for (let j = 0; j < lRadio.dataset.length; j++) {
					lArrDataset.push(
						"data-" +
							lRadio.dataset[j].name +
							'="' +
							lRadio.dataset[j].value +
							'"',
					);
				}
			}
			H.push(
				'<input name="',
				aParams.id,
				'" id="',
				lRadio.id,
				'" value="',
				lRadio.value,
				'" type="radio" ',
				isChecked ? 'checked="checked" ' : "",
				lArrDataset.join(" "),
				" />",
				'<label for="',
				lRadio.id,
				'">',
				lRadio.libelle,
				"</label>",
			);
		}
		H.push("</div>");
		return H.join("");
	},
	composeTitreAvecPuce(aLibelle, aParams) {
		const H = [];
		const lClass = ["titreAvecPuce"];
		if (aParams.avecFondClair) {
			lClass.push("titreAvecFondClaire");
		}
		if (aParams.avecSouligne) {
			lClass.push("titreAvecSouligne");
		}
		H.push('<div class="', lClass.join(" "), '">');
		H.push(aLibelle);
		H.push("</div>");
		return H.join("");
	},
};
exports.UtilitaireHtml = UtilitaireHtml;
