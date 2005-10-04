include("Konform.js");


function initialize()
{
  form1 = new Konform();
  form1.set("title", "KonformTest - Default Skin");
  form1.set("resizable", true);
  
  button1 = form1.add(new KonformButton());
  button1.set("label", "Test");
  button1.set("onClick", "alert('clicked!');");
  form1.anchor("bottomright", button1);
  
  /*
  popup1 = form1.add(new KonformPopup());
  popup1.set("hOffset", 30);
  */
  
  /*
  list1 = form1.add(new KonformList());
  list1.set("options", ["1", "Two", "III", "100", "0x5"]);
  list1.set("hOffset", 100);
  list1.set("vOffset", 100);
  */
  
  scroll1 = form1.add(new KonformScrollbar());
  scroll1.set("hOffset", 40);
  scroll1.set("vOffset", 80);
  
  
  /*
  label1 = form1.add(new KonformLabel());
  label1.set("hOffset", 145);
  label1.set("vOffset", 100);
  label1.set("label", "Test Button:");
  label1.set("alignment", "right");
  */
  
  
  checkbox1 = form1.add(new KonformCheckbox());
  checkbox1.set("label", "Checkbox");
  checkbox1.set("hOffset", 140);
  checkbox1.set("vOffset", 140);
  checkbox1.set("onClick", "log('Checkbox value is ' + checkbox1.value);");
  
  WindozeSkin = new KonformSkin("Resources/Konform/Windoze/");
  
  form2 = new Konform();
  form2.set("title", "KonformTest - Windoze Skin");
  form2.set("skin", WindozeSkin);
  form2.set("resizable", true);
  
  buttonOK = form2.add(new KonformButton());
  buttonOK.set("label", "OK");
  
  buttonCancel1 = form2.add(new KonformButton());
  buttonCancel1.set("label", "Cancel");
  // form2.snug("bottomright", 10, 10, buttonOK, buttonCancel);
  form2.anchor("bottomright", buttonOK);
  form2.anchor("bottomright", buttonCancel1);
  
  form2.set("liveResize", false);
  
  
  AguaSkin = new KonformSkin("Resources/Konform/Agua/");
  
  form3 = new Konform();
  
  form3.set("title", "KonformTest - Agua Skin");
  form3.set("skin", AguaSkin);
  form3.set("resizable", true);
  
  buttonCancel2 = form3.add(new KonformButton());
  buttonCancel2.set("label", "Cancel");
  
  form3.anchor("bottomright", buttonCancel2);
  
}




initialize();




