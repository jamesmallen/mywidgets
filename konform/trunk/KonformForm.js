/**
 * KonformForm
 * A form function, similar to Konfabulator's form()
 */


function KonformForm(fieldArray, doneCode, dialogTitle, confirmButtonLabel, cancelButtonLabel)
{
  if (!dialogTitle) {
    dialogTitle = "";
  }
  
  if (!confirmButtonLabel) {
    confirmButtonLabel = "OK";
  }
  
  if (!cancelButtonLabel) {
    cancelButtonLabel = "Cancel";
  }
  
  var theForm = new Konform();
  
  var confirmButton = theForm.add(new KonformButton());
  confirmButton.set("label", confirmButtonLabel);
  confirmButton.set("onClick", "KonformFormDone(" + theForm.id + ", 'confirm');");
  var cancelButton = theForm.add(new KonformButton());
  cancelButton.set("label", cancelButtonLabel);
  cancelButton.set("onClick", "KonformFormDone(" + theForm.id + ", 'cancel');");
  
  theForm.anchor("bottomright", confirmButton, cancelButton);
  
  theForm.anchor("top", fieldArray);
  
}


function KonformFormDone(id, doneCode)
{
  
}