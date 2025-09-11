exports.UtilitaireHtml = void 0;
const UtilitaireHtml = {
	composeGroupeRadiosBoutons(aParams) {
		const H = [];
		const lClasses = ["GroupeRadioButton"];
		if (!!aParams.class) {
			lClasses.push(aParams.class);
		}
		H.push(
			IE.jsx.str(
				"div",
				{
					class: lClasses,
					id: aParams.id,
					role: "radiogroup",
					"aria-label": aParams.ariaLabel,
				},
				" ",
				(aTab) => {
					for (let i = 0; i < aParams.listeRadios.length; i++) {
						const lRadio = aParams.listeRadios[i];
						if (!lRadio.id) {
							lRadio.id = aParams.id + "_" + i;
						}
						const isChecked = !!aParams.selectedValue
							? lRadio.value === aParams.selectedValue
							: i === 0;
						aTab.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str("input", {
									name: aParams.id,
									id: lRadio.id,
									value: lRadio.value,
									type: "radio",
									checked: isChecked && "checked",
								}),
								IE.jsx.str("label", { for: lRadio.id }, lRadio.libelle),
							),
						);
					}
				},
			),
		);
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
