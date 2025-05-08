require("DeclarationJQuery");
$.fn.extend({
  inputChecked(aValue) {
    const $this = $(this);
    if (aValue === undefined) {
      return $this.is(":checked");
    }
    $this.prop("checked", aValue);
    $this.trigger("IEChecked");
    return $this;
  },
});
