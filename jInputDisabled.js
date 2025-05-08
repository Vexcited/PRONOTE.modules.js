require("DeclarationJQuery");
$.fn.extend({
	inputDisabled(aValue) {
		const $this = $(this);
		if (aValue === undefined) {
			return $this.is(":disabled");
		} else {
			$this.attr("disabled", aValue ? "disabled" : null);
			$this.trigger("IEDisabled");
			return $this;
		}
	},
});
