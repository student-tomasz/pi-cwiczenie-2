//
// http://code.google.com/apis/webfonts/docs/webfont_loader.html
//
WebFontConfig = {
  google: { families: [ 'Patrick+Hand::latin,latin-ext' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';

  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();
