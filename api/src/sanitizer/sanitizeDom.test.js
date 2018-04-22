import createSanitizer from './sanitizeDom';

describe('Sanitize json', () => {
  let onSanitize;

  describe('should configure', () => {
    let sanitizerMock;
    let sanitizerConfiguration;

    beforeEach(() => {
      sanitizerMock = {
        sanitize: jest.fn(),
        addHook: jest.fn(),
      };
      sanitizerMock.sanitize.mockImplementation((content, options) => {
        sanitizerConfiguration = options;
        return content;
      });
      onSanitize = jest.fn();

      const sanitize = createSanitizer(onSanitize, sanitizerMock);
      sanitize('foo');
    });

    it('no allowed tags', () => {
      expect(sanitizerConfiguration.ALLOWED_TAGS).toEqual([]);
    });

    it('content not to be discarded after sanitation', () => {
      expect(sanitizerConfiguration.KEEP_CONTENT).toBe(true);
    });

    it('no allowed attributes', () => {
      expect(sanitizerConfiguration.ADD_ATTR).toEqual([]);
    });

    it('no allowed tags', () => {
      expect(sanitizerConfiguration.ADD_TAGS).toEqual([]);
    });

    it('the return value to be plain string', () => {
      expect(sanitizerConfiguration.RETURN_DOM).toBe(false);
    });

    it('uponSanitizeElement callback', () => {
      expect(sanitizerMock.addHook).toHaveBeenCalledWith('uponSanitizeElement', onSanitize);
    });

    it('uponSanitizeAttribute callback', () => {
      expect(sanitizerMock.addHook).toHaveBeenCalledWith('uponSanitizeAttribute', onSanitize);
    });

    it('uponSanitizeShadowNode callback', () => {
      expect(sanitizerMock.addHook).toHaveBeenCalledWith('uponSanitizeShadowNode', onSanitize);
    });
  });

  // OWASP examples
  describe('should invoke callback when content is sanitized', () => {
    let sanitize;

    beforeEach(() => {
      onSanitize = jest.fn();
      sanitize = createSanitizer(onSanitize);
    });

    afterEach(() => {
      expect(onSanitize).toHaveBeenCalled();
    });

    it('<3', () => {
      sanitize('<3');
    });

    it('foo<script>bar</script>', () => {
      sanitize('foo<script>bar</script>');
    });

    it('<p>text</p>', () => {
      sanitize('<p>text</p>');
    });

    it('polyglot', () => {
      sanitize(`'">><marquee><img src=x onerror=confirm(1)></marquee>"></plaintext></|><plaintext/onmouseover=prompt(1)>
      <script>prompt(1)</script>@gmail.com<isindex formaction=javascript:alert(/XSS/) type=submit>'-->"></script>
      <script>alert(document.cookie)</script>">
      <img/id="confirm&lpar;1)"/alt="/"src="/"onerror=eval(id)>'">
      <img src="http://www.shellypalmer.com/wp-content/images/2015/07/hacked-compressor.jpg">`);
    });

    it('<IMG SRC="javascript:alert(\'XSS\');">', () => {
      sanitize('<IMG SRC="javascript:alert(\'XSS\');">');
    });

    it('\'\';!--"<XSS>=&{()}', () => {
      sanitize('\'\';!--"<XSS>=&{()}');
    });

    it('<IMG SRC=javascript:alert(\'XSS\')>', () => {
      sanitize('<IMG SRC=javascript:alert(\'XSS\')>');
    });

    it('<IMG SRC=JaVaScRiPt:alert(\'XSS\')>', () => {
      sanitize('<IMG SRC=JaVaScRiPt:alert(\'XSS\')>');
    });

    it('<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>', () => {
      sanitize('<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>');
    });

    it('<IMG """><SCRIPT>alert("XSS")</SCRIPT>">', () => {
      sanitize('<IMG """><SCRIPT>alert("XSS")</SCRIPT>">');
    });

    it('<IMG SRC=# onmouseover="alert(\'xxs\')">', () => {
      sanitize('<IMG SRC=# onmouseover="alert(\'xxs\')">');
    });

    it('encoded javascript', () => {
      sanitize('<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">');
    });

    it('decimal html', () => {
      sanitize('<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>');
    });

    it('decimal html with no trailing semicolons', () => {
      sanitize('<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>');
    });

    it('<BODY onload!#$%&()*~+-_.,:;?@[/|\\]^`=alert("XSS")>', () => {
      sanitize('<BODY onload!#$%&()*~+-_.,:;?@[/|\\]^`=alert("XSS")>');
    });

    it('<SCRIPT SRC=http://xss.rocks/xss.js?< B >', () => {
      sanitize('<SCRIPT SRC=http://xss.rocks/xss.js?< B >');
    });

    it('<iframe src=http://xss.rocks/scriptlet.html <', () => {
      sanitize('<iframe src=http://xss.rocks/scriptlet.html <');
    });

    it('<INPUT TYPE="IMAGE" SRC="javascript:alert(\'XSS\');">', () => {
      sanitize('<INPUT TYPE="IMAGE" SRC="javascript:alert(\'XSS\');">');
    });

    it('<STYLE>li {list-style-image: url("javascript:alert(\'XSS\')");}</STYLE><UL><LI>XSS</br>', () => {
      sanitize('<STYLE>li {list-style-image: url("javascript:alert(\'XSS\')");}</STYLE><UL><LI>XSS</br>');
    });

    it('<STYLE>@import\'http://xss.rocks/xss.css\';</STYLE>', () => {
      sanitize('<STYLE>@import\'http://xss.rocks/xss.css\';</STYLE>');
    });

    it('<BR SIZE="&{alert(\'XSS\')}">', () => {
      sanitize('<BR SIZE="&{alert(\'XSS\')}">');
    });

    it('exp/*<A STYLE=\'no\\xss:noxss("*//*");xss:ex/*XSS*//*/*/pression(alert("XSS"))\'>', () => {
      sanitize('exp/*<A STYLE=\'no\\xss:noxss("*//*");xss:ex/*XSS*//*/*/pression(alert("XSS"))\'>');
    });

    it('<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert(\'XSS\');">', () => {
      sanitize('<META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert(\'XSS\');">');
    });

    it('<IFRAME SRC="javascript:alert(\'XSS\');"></IFRAME>', () => {
      sanitize('<IFRAME SRC="javascript:alert(\'XSS\');"></IFRAME>');
    });

    it('<DIV STYLE="background-image: url(javascript:alert(\'XSS\'))">', () => {
      sanitize('<DIV STYLE="background-image: url(javascript:alert(\'XSS\'))">');
    });

    it('<DIV STYLE="background-image: url(&#1;javascript:alert(\'XSS\'))">', () => {
      sanitize('<DIV STYLE="background-image: url(&#1;javascript:alert(\'XSS\'))">');
    });

    it('<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>', () => {
      sanitize('<OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"></OBJECT>');
    });

    it('cdata obfuscation', () => {
      sanitize(`<XML ID="xss"><I><B><IMG SRC="javas<!-- -->cript:alert('XSS')"></B></I></XML>
      <SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>`);
    });

    it('<!--#exec cmd="/bin/echo \'<SCR\'"--><!--#exec cmd="/bin/echo \'IPT SRC=http://xss.rocks/xss.js></SCRIPT>\'"-->', () => {
      sanitize('<!--#exec cmd="/bin/echo \'<SCR\'"--><!--#exec cmd="/bin/echo \'IPT SRC=http://xss.rocks/xss.js></SCRIPT>\'"-->');
    });

    it('<SCRIPT a=">" SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT a=">" SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });

    it('<SCRIPT =">" SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT =">" SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });

    it('<SCRIPT a=">" \'\' SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT a=">" \'\' SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });

    it('<SCRIPT a=`>` SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT a=`>` SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });

    it('<SCRIPT a=">\'>" SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT a=">\'>" SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });

    it('<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="httx://xss.rocks/xss.js"></SCRIPT>', () => {
      sanitize('<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="httx://xss.rocks/xss.js"></SCRIPT>');
    });
  });

  describe('should not invoke callback when content is not sanitized', () => {
    let sanitize;

    beforeEach(() => {
      onSanitize = jest.fn();
      sanitize = createSanitizer(onSanitize);
    });

    afterEach(() => {
      expect(onSanitize).not.toHaveBeenCalled();
    });

    it('foo!"#¤%&/()=?@£$}[]{\\|-_^*\'', () => {
      sanitize('foo!"#¤%&/()=?@£$}[]{\\|-_^*\'');
    });

    it('it is --> ok.', () => {
      sanitize('it is --> ok.');
    });

    it('{"foo": "bar", "baz": [{"foobar": 104}]}', () => {
      sanitize('{"foo": "bar", "baz": [{"foobar": 104}]}');
    });
  });
});
