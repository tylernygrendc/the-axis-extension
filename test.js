// create a preview container
let preview = new Child("div")
    .setId("extension-preview")
    .setClassList(["extension-variables", "extension-surface"])
    .appendTo(_.getQueue()).getNode();

window.addEventListener("afterprint", () => {
    // move the preview to the sheet
    ui.getSheet().append(preview);
});