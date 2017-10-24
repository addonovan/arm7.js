if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'main'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'main'.");
}
if (typeof this['kotlinx-html-js'] === 'undefined') {
  throw new Error("Error loading module 'main'. Its dependency 'kotlinx-html-js' was not found. Please, check whether 'kotlinx-html-js' is loaded prior to 'main'.");
}
var main = function (_, Kotlin, $module$kotlinx_html_js) {
  'use strict';
  var $$importsForInline$$ = _.$$importsForInline$$ || (_.$$importsForInline$$ = {});
  var Unit = Kotlin.kotlin.Unit;
  var get_js = Kotlin.kotlin.js.get_js_1yb8b7$;
  var UnsupportedOperationException = Kotlin.kotlin.UnsupportedOperationException;
  var HashMap_init = Kotlin.kotlin.collections.HashMap_init_q3lmfv$;
  var IllegalArgumentException = Kotlin.kotlin.IllegalArgumentException;
  var ArrayList_init = Kotlin.kotlin.collections.ArrayList_init_ww73n8$;
  var toInt = Kotlin.kotlin.text.toInt_6ic1pp$;
  var toInt_0 = Kotlin.kotlin.text.toInt_pdl1vz$;
  var first = Kotlin.kotlin.text.first_gw00vp$;
  var IntRange = Kotlin.kotlin.ranges.IntRange;
  var toLong = Kotlin.kotlin.text.toLong_6ic1pp$;
  var arrayListOf = Kotlin.kotlin.collections.arrayListOf_i5x0yv$;
  var downTo = Kotlin.kotlin.ranges.downTo_dqglrj$;
  var unboxChar = Kotlin.unboxChar;
  var th = $module$kotlinx_html_js.kotlinx.html.th_bncpyi$;
  var set_id = $module$kotlinx_html_js.kotlinx.html.set_id_ueiko3$;
  var td = $module$kotlinx_html_js.kotlinx.html.td_vlzo05$;
  var tr = $module$kotlinx_html_js.kotlinx.html.tr_7wec05$;
  var table = $module$kotlinx_html_js.kotlinx.html.table_llpdic$;
  var append = $module$kotlinx_html_js.kotlinx.html.dom.append_k9bwru$;
  var get_classes = $module$kotlinx_html_js.kotlinx.html.get_classes_fxodxh$;
  var plus = Kotlin.kotlin.collections.plus_xfiyik$;
  var set_classes = $module$kotlinx_html_js.kotlinx.html.set_classes_njy09m$;
  var span = $module$kotlinx_html_js.kotlinx.html.span_fqsp1s$;
  var span_0 = $module$kotlinx_html_js.kotlinx.html.span_6djfml$;
  var li = $module$kotlinx_html_js.kotlinx.html.li_jf6zlv$;
  var ul = $module$kotlinx_html_js.kotlinx.html.ul_e6giw3$;
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  var removeClass = Kotlin.kotlin.dom.removeClass_hhb33f$;
  var addClass = Kotlin.kotlin.dom.addClass_hhb33f$;
  var set_onClickFunction = $module$kotlinx_html_js.kotlinx.html.js.set_onClickFunction_pszlq2$;
  var button = $module$kotlinx_html_js.kotlinx.html.button_whohl6$;
  var div = $module$kotlinx_html_js.kotlinx.html.div_ri36nr$;
  var div_0 = $module$kotlinx_html_js.kotlinx.html.div_59el9d$;
  Particle$Instruction.prototype = Object.create(Particle.prototype);
  Particle$Instruction.prototype.constructor = Particle$Instruction;
  Particle$Label.prototype = Object.create(Particle.prototype);
  Particle$Label.prototype.constructor = Particle$Label;
  Particle$OpCode.prototype = Object.create(Particle.prototype);
  Particle$OpCode.prototype.constructor = Particle$OpCode;
  Particle$Register.prototype = Object.create(Particle.prototype);
  Particle$Register.prototype.constructor = Particle$Register;
  Particle$Literal.prototype = Object.create(Particle.prototype);
  Particle$Literal.prototype.constructor = Particle$Literal;
  Particle$BinaryLiteral.prototype = Object.create(Particle$Literal.prototype);
  Particle$BinaryLiteral.prototype.constructor = Particle$BinaryLiteral;
  Particle$DecimalLiteral.prototype = Object.create(Particle$Literal.prototype);
  Particle$DecimalLiteral.prototype.constructor = Particle$DecimalLiteral;
  Particle$HexadecimalLiteral.prototype = Object.create(Particle$Literal.prototype);
  Particle$HexadecimalLiteral.prototype.constructor = Particle$HexadecimalLiteral;
  Particle$CharacterLiteral.prototype = Object.create(Particle$Literal.prototype);
  Particle$CharacterLiteral.prototype.constructor = Particle$CharacterLiteral;
  I32.prototype = Object.create(BitArray.prototype);
  I32.prototype.constructor = I32;
  function View() {
  }
  View.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'View',
    interfaces: []
  };
  function Controller(source, view, interpreter) {
    this.program_0 = new Program(source);
    this.view_0 = view;
    this.interpreter_0 = interpreter;
    this.registers_0 = new RegisterFile();
    view.init_dzlk23$(this.program_0, this.registers_0);
    interpreter.init_dzlk23$(this.program_0, this.registers_0);
    view.onStep = Controller_init$lambda(interpreter, view);
  }
  function Controller_init$lambda(closure$interpreter, closure$view) {
    return function () {
      closure$interpreter.step();
      closure$view.updateRegisters();
      closure$view.updateLine();
      return Unit;
    };
  }
  Controller.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Controller',
    interfaces: []
  };
  function Interpreter() {
    this.program_0 = this.program_0;
    this.registers_0 = this.registers_0;
    this.ops_0 = this.ops_0;
    this.interval_0 = null;
  }
  Interpreter.prototype.init_dzlk23$ = function (program, registers) {
    this.program_0 = program;
    this.registers_0 = registers;
    this.ops_0 = new Operations(registers, program);
  };
  Interpreter.prototype.step = function () {
    var address = this.registers_0.pc.unsignedValue;
    this.registers_0.pc.plusAssign_za3lpa$(4);
    var it = this.program_0.get_s8cxhz$(address);
    if (!Kotlin.isType(it, Particle$Instruction)) {
      throw new UnsupportedOperationException('Expected Particle.Instruction, found: ' + get_js(Kotlin.getKClassFromExpression(it)));
    }
    var instruction = it;
    this.ops_0.get_61zpoe$(instruction.op.value)(instruction.args);
  };
  Interpreter.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Interpreter',
    interfaces: []
  };
  function find(selector) {
    return document.querySelector(selector);
  }
  function main(args) {
    var tmp$, tmp$_0;
    var it = (tmp$ = find('pre#src')) != null ? tmp$ : Kotlin.throwNPE();
    var tmp$_1;
    it.remove();
    var source = (tmp$_1 = it.textContent) != null ? tmp$_1 : Kotlin.throwNPE();
    var controller = new Controller(source, new WebView((tmp$_0 = document.body) != null ? tmp$_0 : Kotlin.throwNPE()), new Interpreter());
  }
  function Operations(registers, program) {
    this.registers = registers;
    this.program = program;
    this.ops = HashMap_init();
    this.ops.put_xwzc9p$('nop', Operations_init$lambda);
    this.ops.put_xwzc9p$('mov', Operations_init$lambda_0(this));
    this.ops.put_xwzc9p$('add', Operations_init$lambda_1(this));
    this.ops.put_xwzc9p$('bal', Operations_init$lambda_2(this));
  }
  var Map = Kotlin.kotlin.collections.Map;
  Operations.prototype.get_61zpoe$ = function (name) {
    var tmp$, tmp$_0;
    var $receiver = this.ops;
    var tmp$_1;
    return !(Kotlin.isType(tmp$_1 = $receiver, Map) ? tmp$_1 : Kotlin.throwCCE()).containsKey_11rb$(name) ? (tmp$ = this.ops.get_11rb$('nop')) != null ? tmp$ : Kotlin.throwNPE() : (tmp$_0 = this.ops.get_11rb$(name)) != null ? tmp$_0 : Kotlin.throwNPE();
  };
  function Operations_init$lambda(it) {
    console.warn('Performing no op');
    return Unit;
  }
  function Operations_init$lambda_0(this$Operations) {
    return function (it) {
      if (it.size !== 2)
        throw new IllegalArgumentException('Expected 2 arguments, received ' + it.size);
      var it_0 = it.get_za3lpa$(0);
      if (!Kotlin.isType(it_0, Particle$Register))
        throw new IllegalArgumentException('mov#dst must be a register');
      var dst = it_0;
      var src = it.get_za3lpa$(1);
      if (Kotlin.isType(src, Particle$Register))
        this$Operations.registers.get_61zpoe$(dst.value).copy_v30hsj$(this$Operations.registers.get_61zpoe$(src.value));
      else if (Kotlin.isType(src, Particle$Literal))
        this$Operations.registers.get_61zpoe$(dst.value).copy_za3lpa$(src.intValue);
      else {
        throw new IllegalArgumentException('mov#src only accepts a register or literal');
      }
      return Unit;
    };
  }
  function Operations_init$lambda_1(this$Operations) {
    return function (it) {
      var tmp$, tmp$_0;
      if (it.size < 2)
        throw new IllegalArgumentException('add must have at least 2 operands');
      if (it.size > 3)
        throw new IllegalArgumentException('add must have no more than 3 operands');
      var dst = this$Operations.registers.get_61zpoe$((Kotlin.isType(tmp$ = it.get_za3lpa$(0), Particle$Register) ? tmp$ : Kotlin.throwCCE()).value);
      var left = it.size === 2 ? 0 : 1;
      var right = left + 1 | 0;
      var lhs = this$Operations.registers.get_61zpoe$((Kotlin.isType(tmp$_0 = it.get_za3lpa$(left), Particle$Register) ? tmp$_0 : Kotlin.throwCCE()).value);
      var $receiver = it.get_za3lpa$(right);
      var this$Operations_0 = this$Operations;
      var block$result;
      if (Kotlin.isType($receiver, Particle$Register)) {
        block$result = this$Operations_0.registers.get_61zpoe$($receiver.value);
      }
       else if (Kotlin.isType($receiver, Particle$Literal)) {
        block$result = toI32($receiver.intValue);
      }
       else
        throw new UnsupportedOperationException('Last parameter must be either register or literal');
      var rhs = block$result;
      dst.copy_v30hsj$(lhs.plus_7u9hsx$(rhs));
      return Unit;
    };
  }
  function Operations_init$lambda_2(this$Operations) {
    return function (it) {
      var tmp$, tmp$_0;
      if (it.size !== 1)
        throw new IllegalArgumentException('bal can only have 1 argument');
      tmp$_0 = Kotlin.isType(tmp$ = it.get_za3lpa$(0), Particle$Label) ? tmp$ : null;
      if (tmp$_0 == null) {
        throw new IllegalArgumentException('bal#dst should be a label');
      }
      var dst = tmp$_0;
      this$Operations.registers.pc.copy_za3lpa$(this$Operations.program.get_61zpoe$(dst.value));
      return Unit;
    };
  }
  Operations.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Operations',
    interfaces: []
  };
  function Parser() {
    Parser_instance = this;
  }
  Parser.prototype.parse_61zpoe$ = function (content) {
    var raw = PegJsParser.parse(content);
    var result = ArrayList_init();
    var offset = {v: 0};
    var tmp$;
    for (tmp$ = 0; tmp$ !== raw.length; ++tmp$) {
      var element = raw[tmp$];
      var tmp$_0, tmp$_1;
      if (element.type == 'identifier' && element.subtype == 'label') {
        var tmp$_2;
        var element_0 = new Particle$Label(typeof (tmp$_2 = element.value) === 'string' ? tmp$_2 : Kotlin.throwCCE());
        result.add_11rb$(element_0);
      }
       else if (element.type == 'instruction') {
        var opcode = new Particle$OpCode(typeof (tmp$_0 = element.op.value) === 'string' ? tmp$_0 : Kotlin.throwCCE());
        var args = ArrayList_init();
        var $receiver = Kotlin.isArray(tmp$_1 = element.args) ? tmp$_1 : Kotlin.throwCCE();
        var tmp$_3;
        for (tmp$_3 = 0; tmp$_3 !== $receiver.length; ++tmp$_3) {
          var element_1 = $receiver[tmp$_3];
          var tmp$_4, tmp$_5;
          var value = typeof (tmp$_4 = element_1.value) === 'string' ? tmp$_4 : Kotlin.throwCCE();
          tmp$_5 = element_1.subtype + ' ' + element_1.type;
          if (Kotlin.equals(tmp$_5, 'label identifier')) {
            var element_2 = new Particle$Label(value);
            args.add_11rb$(element_2);
          }
           else if (Kotlin.equals(tmp$_5, 'binary literal')) {
            var element_3 = new Particle$BinaryLiteral(value);
            args.add_11rb$(element_3);
          }
           else if (Kotlin.equals(tmp$_5, 'decimal literal')) {
            var element_4 = new Particle$DecimalLiteral(value);
            args.add_11rb$(element_4);
          }
           else if (Kotlin.equals(tmp$_5, 'hexadecimal literal')) {
            var element_5 = new Particle$HexadecimalLiteral(value);
            args.add_11rb$(element_5);
          }
           else if (Kotlin.equals(tmp$_5, 'register identifier')) {
            var element_6 = new Particle$Register(value);
            args.add_11rb$(element_6);
          }
           else {
            console.error('unsupported argument: ' + element_1.subtype + ' ' + element_1.type);
          }
        }
        var element_7 = new Particle$Instruction(offset.v, opcode, args);
        result.add_11rb$(element_7);
        offset.v = offset.v + 4 | 0;
      }
    }
    return result;
  };
  Parser.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Parser',
    interfaces: []
  };
  var Parser_instance = null;
  function Parser_getInstance() {
    if (Parser_instance === null) {
      new Parser();
    }
    return Parser_instance;
  }
  function Argument() {
  }
  Argument.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'Argument',
    interfaces: []
  };
  function Line() {
  }
  Line.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'Line',
    interfaces: []
  };
  function Particle() {
  }
  function Particle$Instruction(offset, op, args) {
    Particle.call(this);
    this.offset = offset;
    this.op = op;
    this.args = args;
  }
  Particle$Instruction.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Instruction',
    interfaces: [Line, Particle]
  };
  function Particle$Label(value) {
    Particle.call(this);
    this.value = value;
  }
  Particle$Label.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Label',
    interfaces: [Line, Argument, Particle]
  };
  function Particle$OpCode(value) {
    Particle.call(this);
    this.value = value;
  }
  Particle$OpCode.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'OpCode',
    interfaces: [Particle]
  };
  function Particle$Register(value) {
    Particle.call(this);
    this.value = value;
  }
  Particle$Register.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Register',
    interfaces: [Argument, Particle]
  };
  function Particle$Literal(value, type) {
    Particle.call(this);
    this.value = value;
    this.type = type;
  }
  Particle$Literal.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Literal',
    interfaces: [Argument, Particle]
  };
  function Particle$BinaryLiteral(value) {
    Particle$Literal.call(this, value, 'binary');
    this.intValue_u1j5o7$_0 = toInt(value, 2);
  }
  Object.defineProperty(Particle$BinaryLiteral.prototype, 'intValue', {
    get: function () {
      return this.intValue_u1j5o7$_0;
    }
  });
  Particle$BinaryLiteral.prototype.toString = function () {
    return '#0b' + this.value;
  };
  Particle$BinaryLiteral.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'BinaryLiteral',
    interfaces: [Particle$Literal]
  };
  function Particle$DecimalLiteral(value) {
    Particle$Literal.call(this, value, 'decimal');
    this.intValue_n60dxl$_0 = toInt_0(value);
  }
  Object.defineProperty(Particle$DecimalLiteral.prototype, 'intValue', {
    get: function () {
      return this.intValue_n60dxl$_0;
    }
  });
  Particle$DecimalLiteral.prototype.toString = function () {
    return '#' + this.value;
  };
  Particle$DecimalLiteral.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'DecimalLiteral',
    interfaces: [Particle$Literal]
  };
  function Particle$HexadecimalLiteral(value) {
    Particle$Literal.call(this, value, 'hexadecimal');
    this.intValue_ndgjtd$_0 = toInt(value, 16);
  }
  Object.defineProperty(Particle$HexadecimalLiteral.prototype, 'intValue', {
    get: function () {
      return this.intValue_ndgjtd$_0;
    }
  });
  Particle$HexadecimalLiteral.prototype.toString = function () {
    return '#0x' + this.value;
  };
  Particle$HexadecimalLiteral.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'HexadecimalLiteral',
    interfaces: [Particle$Literal]
  };
  function Particle$CharacterLiteral(value) {
    Particle$Literal.call(this, value, 'character');
    this.intValue_j0m0lr$_0 = first(value) | 0;
  }
  Object.defineProperty(Particle$CharacterLiteral.prototype, 'intValue', {
    get: function () {
      return this.intValue_j0m0lr$_0;
    }
  });
  Particle$CharacterLiteral.prototype.toString = function () {
    return "#'" + this.value + "'";
  };
  Particle$CharacterLiteral.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'CharacterLiteral',
    interfaces: [Particle$Literal]
  };
  Particle.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Particle',
    interfaces: []
  };
  function toBit($receiver) {
    return Kotlin.toByte($receiver);
  }
  function toBit_0($receiver) {
    if ($receiver === true)
      return toBit(1);
    else if ($receiver === false)
      return toBit(0);
    else
      return Kotlin.noWhenBranchMatched();
  }
  var Array_0 = Array;
  function BitArray() {
    var array = Array_0(32);
    var tmp$;
    tmp$ = array.length - 1 | 0;
    for (var i = 0; i <= tmp$; i++) {
      array[i] = 0;
    }
    this.bits_ei26qv$_0 = array;
  }
  BitArray.prototype.copy_v30hsj$ = function (other) {
    var $receiver = this.bits_ei26qv$_0;
    var tmp$, tmp$_0;
    var index = 0;
    for (tmp$ = 0; tmp$ !== $receiver.length; ++tmp$) {
      var item = $receiver[tmp$];
      var index_0 = (tmp$_0 = index, index = tmp$_0 + 1 | 0, tmp$_0);
      this.bits_ei26qv$_0[index_0] = other.bits_ei26qv$_0[index_0];
    }
  };
  BitArray.prototype.get_za3lpa$ = function (index) {
    if (index > this.bits_ei26qv$_0.length) {
      console.warn('i32.get: ' + index + ' > ' + this.bits_ei26qv$_0.length + '!');
      return false;
    }
    return this.bits_ei26qv$_0[index] !== toBit(0);
  };
  BitArray.prototype.set_fzusl$ = function (index, value) {
    if (index > this.bits_ei26qv$_0.length) {
      console.warn('i32.set: ' + index + ' > ' + this.bits_ei26qv$_0.length + '!');
    }
    this.bits_ei26qv$_0[index] = toBit_0(value);
  };
  BitArray.prototype.set_6t1wet$ = function (index, value) {
    this.set_fzusl$(index, value !== toBit(0));
  };
  BitArray.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'BitArray',
    interfaces: []
  };
  function I32() {
    BitArray.call(this);
  }
  Object.defineProperty(I32.prototype, 'binary', {
    get: function () {
      var string = {v: ''};
      var tmp$;
      tmp$ = (new IntRange(0, 31)).iterator();
      while (tmp$.hasNext()) {
        var element = tmp$.next();
        var tmp$_0, tmp$_1, tmp$_2;
        tmp$_2 = string.v;
        tmp$_0 = this.get_za3lpa$(element);
        if (tmp$_0 === true)
          tmp$_1 = '1';
        else if (tmp$_0 === false)
          tmp$_1 = '0';
        else
          tmp$_1 = Kotlin.noWhenBranchMatched();
        string.v = tmp$_2 + tmp$_1;
      }
      return string.v;
    }
  });
  Object.defineProperty(I32.prototype, 'hexadecimal', {
    get: function () {
      return toString(this.value, 16).toUpperCase();
    }
  });
  Object.defineProperty(I32.prototype, 'value', {
    get: function () {
      return this.get_za3lpa$(0) ? this.unaryMinus().value : toInt(this.binary, 2);
    }
  });
  Object.defineProperty(I32.prototype, 'unsignedValue', {
    get: function () {
      return toLong(this.binary, 2);
    }
  });
  I32.prototype.flip = function () {
    var out = new I32();
    var tmp$;
    tmp$ = (new IntRange(0, 31)).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      out.set_fzusl$(element, !this.get_za3lpa$(element));
    }
    return out;
  };
  I32.prototype.copy_za3lpa$ = function (other) {
    this.copy_v30hsj$(toI32(other));
  };
  I32.prototype.plus_7u9hsx$ = function (other) {
    var result = new I32();
    var carries = arrayListOf([toBit(0)]);
    var tmp$;
    tmp$ = downTo(31, 0).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      var tmp = toBit_0(this.get_za3lpa$(element)) + toBit_0(other.get_za3lpa$(element)) + carries.get_za3lpa$(0);
      result.set_6t1wet$(element, toBit(tmp & 1));
      carries.add_wxm5ur$(0, toBit((tmp & 2) >> 1));
    }
    return result;
  };
  I32.prototype.plus_za3lpa$ = function (other) {
    return this.plus_7u9hsx$(toI32(other));
  };
  I32.prototype.minus_7u9hsx$ = function (other) {
    return this.plus_7u9hsx$(other.unaryMinus());
  };
  I32.prototype.minus_za3lpa$ = function (other) {
    return this.plus_7u9hsx$(toI32(other).unaryMinus());
  };
  I32.prototype.plusAssign_za3lpa$ = function (other) {
    this.copy_v30hsj$(this.plus_za3lpa$(other));
  };
  I32.prototype.plusAssign_7u9hsx$ = function (other) {
    this.copy_v30hsj$(this.plus_7u9hsx$(other));
  };
  I32.prototype.minusAssign_za3lpa$ = function (other) {
    this.copy_v30hsj$(this.minus_za3lpa$(other));
  };
  I32.prototype.minusAssign_7u9hsx$ = function (other) {
    this.copy_v30hsj$(this.minus_7u9hsx$(other));
  };
  I32.prototype.unaryMinus = function () {
    return this.flip().plus_7u9hsx$(toI32(1));
  };
  I32.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'I32',
    interfaces: [BitArray]
  };
  var iterator = Kotlin.kotlin.text.iterator_gw00vp$;
  var toBoxedChar = Kotlin.toBoxedChar;
  function toI32($receiver) {
    var out = new I32();
    var tmp$, tmp$_0;
    var index = 0;
    tmp$ = iterator(toString($receiver, 2, 32));
    while (tmp$.hasNext()) {
      var item = unboxChar(tmp$.next());
      out.set_fzusl$((tmp$_0 = index, index = tmp$_0 + 1 | 0, tmp$_0), unboxChar(toBoxedChar(item)) !== 48);
    }
    return out;
  }
  function toString($receiver, radix, width) {
    if (width === void 0)
      width = -1;
    return width <= 0 ? eval($receiver.toString() + '..toString( ' + radix + ' )').toString() : eval('(Array(' + width + " + 1).join('0') + " + $receiver + '..toString( ' + radix + ' ) ).substr( -' + width + ' )').toString().toUpperCase();
  }
  function Program(source) {
    this.lines_0 = Parser_getInstance().parse_61zpoe$(source);
    this.map_0 = ArrayList_init();
    this.labels_0 = HashMap_init();
    var offset = {v: 0};
    var tmp$;
    tmp$ = this.lines_0.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      if (Kotlin.isType(element, Particle$Instruction)) {
        this.map_0.add_11rb$(element);
        this.map_0.add_11rb$(null);
        this.map_0.add_11rb$(null);
        this.map_0.add_11rb$(null);
        offset.v = offset.v + 4 | 0;
      }
       else if (Kotlin.isType(element, Particle$Label)) {
        var $receiver = this.labels_0;
        var key = element.value;
        var value = offset.v;
        $receiver.put_xwzc9p$(key, value);
      }
       else {
        throw new UnsupportedOperationException('Unsupported line: ' + get_js(Kotlin.getKClassFromExpression(element)));
      }
    }
  }
  Program.prototype.forEachLine_6m5y3o$ = function (action) {
    var tmp$;
    tmp$ = this.lines_0.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      action(element);
    }
  };
  Program.prototype.get_s8cxhz$ = function (offset) {
    return this.get_za3lpa$(offset.toInt());
  };
  Program.prototype.get_za3lpa$ = function (offset) {
    var tmp$;
    tmp$ = this.map_0.get_za3lpa$(offset);
    if (tmp$ == null) {
      throw new UnsupportedOperationException('Offset is not word aligned (or instructions are unaligned!)');
    }
    return tmp$;
  };
  Program.prototype.get_61zpoe$ = function (label) {
    var tmp$;
    tmp$ = this.labels_0.get_11rb$(label);
    if (tmp$ == null) {
      throw new IllegalArgumentException('No label exists with the name: ' + label);
    }
    return tmp$;
  };
  Program.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Program',
    interfaces: []
  };
  function RegisterFile() {
    this.count = 16;
    var array = Array_0(this.count);
    var tmp$;
    tmp$ = array.length - 1 | 0;
    for (var i = 0; i <= tmp$; i++) {
      array[i] = new I32();
    }
    this.raw_0 = array;
  }
  RegisterFile.prototype.reset = function () {
    var $receiver = this.raw_0;
    var tmp$, tmp$_0;
    var index = 0;
    for (tmp$ = 0; tmp$ !== $receiver.length; ++tmp$) {
      var item = $receiver[tmp$];
      this.raw_0[tmp$_0 = index, index = tmp$_0 + 1 | 0, tmp$_0] = new I32();
    }
  };
  RegisterFile.prototype.forEach_1rftcc$ = function (action) {
    var $receiver = this.raw_0;
    var tmp$, tmp$_0;
    var index = 0;
    for (tmp$ = 0; tmp$ !== $receiver.length; ++tmp$) {
      var item = $receiver[tmp$];
      action((tmp$_0 = index, index = tmp$_0 + 1 | 0, tmp$_0), item);
    }
  };
  Object.defineProperty(RegisterFile.prototype, 'pc', {
    get: function () {
      return this.raw_0[15];
    }
  });
  RegisterFile.prototype.get_za3lpa$ = function (index) {
    return this.raw_0[index];
  };
  RegisterFile.prototype.get_61zpoe$ = function (name) {
    if (first(name) !== 114)
      throw new IllegalArgumentException('Invalid register identifier!');
    return this.raw_0[toInt_0(name.substring(1))];
  };
  RegisterFile.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'RegisterFile',
    interfaces: []
  };
  function WebView(viewport) {
    this.onStep_w19xd9$_0 = this.onStep_w19xd9$_0;
    this.registers_0 = this.registers_0;
    var tmp$;
    while (viewport.hasChildNodes()) {
      viewport.removeChild((tmp$ = viewport.lastChild) != null ? tmp$ : Kotlin.throwNPE());
    }
    append(viewport, WebView_init$lambda(this));
  }
  Object.defineProperty(WebView.prototype, 'onStep', {
    get: function () {
      return this.onStep_w19xd9$_0;
    },
    set: function (onStep) {
      this.onStep_w19xd9$_0 = onStep;
    }
  });
  WebView.prototype.get_0 = function ($receiver, selector) {
    var tmp$, tmp$_0;
    return Kotlin.isType(tmp$_0 = (tmp$ = $receiver.querySelector(selector)) != null ? tmp$ : Kotlin.throwNPE(), HTMLElement) ? tmp$_0 : Kotlin.throwCCE();
  };
  function WebView$init$lambda$lambda$lambda$lambda$lambda(closure$i) {
    return function ($receiver) {
      $receiver.text_61zpoe$('r' + closure$i);
      return Unit;
    };
  }
  function WebView$init$lambda$lambda$lambda$lambda$lambda_0(closure$i, closure$i32) {
    return function ($receiver) {
      set_id($receiver, 'r' + closure$i);
      $receiver.text_61zpoe$(closure$i32.binary);
      return Unit;
    };
  }
  function WebView$init$lambda$lambda$lambda$lambda(closure$i, closure$i32) {
    return function ($receiver) {
      th($receiver, void 0, void 0, WebView$init$lambda$lambda$lambda$lambda$lambda(closure$i));
      td($receiver, void 0, WebView$init$lambda$lambda$lambda$lambda$lambda_0(closure$i, closure$i32));
      return Unit;
    };
  }
  function WebView$init$lambda$lambda$lambda(this$) {
    return function (i, i32) {
      tr(this$, void 0, WebView$init$lambda$lambda$lambda$lambda(i, i32));
      return Unit;
    };
  }
  function WebView$init$lambda$lambda(closure$registers) {
    return function ($receiver) {
      closure$registers.forEach_1rftcc$(WebView$init$lambda$lambda$lambda($receiver));
      return Unit;
    };
  }
  function WebView$init$lambda(closure$registers) {
    return function ($receiver) {
      table($receiver, void 0, WebView$init$lambda$lambda(closure$registers));
      return Unit;
    };
  }
  function WebView$init$lambda$buildArguments$lambda$lambda(closure$it) {
    return function ($receiver) {
      var tmp$;
      set_classes($receiver, plus(get_classes($receiver), 'arg'));
      tmp$ = closure$it;
      if (Kotlin.isType(tmp$, Particle$Literal)) {
        set_classes($receiver, plus(get_classes($receiver), 'literal'));
        set_classes($receiver, plus(get_classes($receiver), closure$it.type));
        $receiver.text_61zpoe$(closure$it.toString());
      }
       else if (Kotlin.isType(tmp$, Particle$Label)) {
        set_classes($receiver, plus(get_classes($receiver), 'label'));
        $receiver.text_61zpoe$(closure$it.value);
      }
       else if (Kotlin.isType(tmp$, Particle$Register)) {
        set_classes($receiver, plus(get_classes($receiver), 'register'));
        $receiver.text_61zpoe$(closure$it.value);
      }
      return Unit;
    };
  }
  function WebView$init$lambda$buildArguments$lambda$lambda_0($receiver) {
    set_classes($receiver, plus(get_classes($receiver), 'separator'));
    $receiver.text_61zpoe$(', ');
    return Unit;
  }
  function WebView$init$lambda$buildArguments(this$) {
    return function (args) {
      var tmp$, tmp$_0;
      var index = 0;
      tmp$ = args.iterator();
      while (tmp$.hasNext()) {
        var item = tmp$.next();
        var this$_0 = this$;
        var i = (tmp$_0 = index, index = tmp$_0 + 1 | 0, tmp$_0);
        span(this$_0, void 0, WebView$init$lambda$buildArguments$lambda$lambda(item));
        if ((i + 1 | 0) !== args.size)
          span(this$_0, void 0, WebView$init$lambda$buildArguments$lambda$lambda_0);
      }
    };
  }
  function WebView$init$lambda$buildLine$lambda$lambda(closure$line) {
    return function ($receiver) {
      var tmp$;
      set_classes($receiver, plus(get_classes($receiver), 'addr'));
      if (Kotlin.isType(closure$line, Particle$Instruction))
        tmp$ = '+0x' + toString(closure$line.offset, 16, 6);
      else
        tmp$ = '';
      $receiver.text_61zpoe$(tmp$);
      return Unit;
    };
  }
  function WebView$init$lambda$buildLine$lambda$lambda_0(closure$line) {
    return function ($receiver) {
      set_classes($receiver, plus(get_classes($receiver), 'label'));
      $receiver.text_61zpoe$(closure$line.value + ':');
      return Unit;
    };
  }
  function WebView$init$lambda$buildLine$lambda$lambda_1(closure$line) {
    return function ($receiver) {
      set_classes($receiver, plus(get_classes($receiver), 'op'));
      $receiver.text_61zpoe$(closure$line.op.value);
      return Unit;
    };
  }
  function WebView$init$lambda$buildLine$lambda(closure$line, closure$buildArguments) {
    return function ($receiver) {
      var tmp$;
      if (Kotlin.isType(closure$line, Particle$Instruction)) {
        var $receiver_0 = $receiver.attributes;
        var value = closure$line.offset.toString();
        $receiver_0.put_xwzc9p$('addr', value);
      }
      span_0($receiver, void 0, WebView$init$lambda$buildLine$lambda$lambda(closure$line));
      tmp$ = closure$line;
      if (Kotlin.isType(tmp$, Particle$Label))
        span_0($receiver, void 0, WebView$init$lambda$buildLine$lambda$lambda_0(closure$line));
      else if (Kotlin.isType(tmp$, Particle$Instruction)) {
        span_0($receiver, void 0, WebView$init$lambda$buildLine$lambda$lambda_1(closure$line));
        closure$buildArguments(closure$line.args);
      }
      return Unit;
    };
  }
  function WebView$init$lambda$buildLine(closure$buildArguments, this$) {
    return function (line) {
      return li(this$, void 0, WebView$init$lambda$buildLine$lambda(line, closure$buildArguments));
    };
  }
  function WebView$init$lambda$lambda$lambda_0(closure$buildLine) {
    return function (it) {
      closure$buildLine(it);
      return Unit;
    };
  }
  function WebView$init$lambda$lambda_0(closure$program, closure$buildLine) {
    return function ($receiver) {
      closure$program.forEachLine_6m5y3o$(WebView$init$lambda$lambda$lambda_0(closure$buildLine));
      return Unit;
    };
  }
  function WebView$init$lambda_0(closure$program) {
    return function ($receiver) {
      var buildArguments = WebView$init$lambda$buildArguments($receiver);
      var buildLine = WebView$init$lambda$buildLine(buildArguments, $receiver);
      ul($receiver, void 0, WebView$init$lambda$lambda_0(closure$program, buildLine));
      return Unit;
    };
  }
  WebView.prototype.init_dzlk23$ = function (program, registers) {
    this.registers_0 = registers;
    var tmp$, tmp$_0;
    append(Kotlin.isType(tmp$_0 = (tmp$ = document.querySelector('div#tools div#raw')) != null ? tmp$ : Kotlin.throwNPE(), HTMLElement) ? tmp$_0 : Kotlin.throwCCE(), WebView$init$lambda(registers));
    var tmp$_1, tmp$_2;
    append(Kotlin.isType(tmp$_2 = (tmp$_1 = document.querySelector('div#source')) != null ? tmp$_1 : Kotlin.throwNPE(), HTMLElement) ? tmp$_2 : Kotlin.throwCCE(), WebView$init$lambda_0(program));
    var tmp$_3, tmp$_4;
    var tmp$_5, tmp$_6;
    (Kotlin.isType(tmp$_4 = (tmp$_3 = document.querySelector('div#source')) != null ? tmp$_3 : Kotlin.throwNPE(), HTMLElement) ? tmp$_4 : Kotlin.throwCCE()).setAttribute('style', 'margin-left: ' + (Kotlin.isType(tmp$_6 = (tmp$_5 = document.querySelector('div#tools')) != null ? tmp$_5 : Kotlin.throwNPE(), HTMLElement) ? tmp$_6 : Kotlin.throwCCE()).clientWidth + 'px');
  };
  function WebView$updateRegisters$lambda(this$WebView) {
    return function (i, i32) {
      var tmp$, tmp$_0;
      (Kotlin.isType(tmp$_0 = (tmp$ = document.querySelector('#r' + i)) != null ? tmp$ : Kotlin.throwNPE(), HTMLElement) ? tmp$_0 : Kotlin.throwCCE()).textContent = i32.hexadecimal;
      if (!Kotlin.equals(i32.unsignedValue, Kotlin.Long.fromInt(i32.value))) {
        println(i32.binary + ' := ' + Kotlin.toString(i32.value));
      }
      return Unit;
    };
  }
  WebView.prototype.updateRegisters = function () {
    this.registers_0.forEach_1rftcc$(WebView$updateRegisters$lambda(this));
  };
  WebView.prototype.updateLine = function () {
    var tmp$;
    var $receiver = document.querySelectorAll('.selected');
    var tmp$_0, tmp$_1, tmp$_2;
    tmp$_0 = $receiver.length;
    for (var i = 0; i <= tmp$_0; i++) {
      (tmp$_2 = Kotlin.isType(tmp$_1 = $receiver[i], Element) ? tmp$_1 : null) != null ? removeClass(tmp$_2, ['selected']) : null;
    }
    (tmp$ = document.querySelector('[addr=' + '"' + this.registers_0.pc.value + '"' + ']')) != null ? addClass(tmp$, ['selected']) : null;
  };
  function WebView_init$lambda$lambda$lambda$lambda$lambda(this$WebView) {
    return function (it) {
      this$WebView.onStep();
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda$lambda(this$WebView) {
    return function ($receiver) {
      $receiver.text_61zpoe$('Step');
      set_onClickFunction($receiver, WebView_init$lambda$lambda$lambda$lambda$lambda(this$WebView));
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda$lambda$lambda$lambda(this$WebView) {
    return function () {
      this$WebView.onStep();
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda$lambda$lambda_0(this$WebView) {
    return function (it) {
      window.setInterval(WebView_init$lambda$lambda$lambda$lambda$lambda$lambda(this$WebView), 500);
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda$lambda_0(this$WebView) {
    return function ($receiver) {
      $receiver.text_61zpoe$('Run');
      set_onClickFunction($receiver, WebView_init$lambda$lambda$lambda$lambda$lambda_0(this$WebView));
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda(this$WebView) {
    return function ($receiver) {
      set_id($receiver, 'controls');
      button($receiver, void 0, void 0, void 0, void 0, WebView_init$lambda$lambda$lambda$lambda(this$WebView));
      button($receiver, void 0, void 0, void 0, void 0, WebView_init$lambda$lambda$lambda$lambda_0(this$WebView));
      return Unit;
    };
  }
  function WebView_init$lambda$lambda$lambda_0($receiver) {
    set_id($receiver, 'raw');
    return Unit;
  }
  function WebView_init$lambda$lambda(this$WebView) {
    return function ($receiver) {
      set_id($receiver, 'tools');
      div($receiver, void 0, WebView_init$lambda$lambda$lambda(this$WebView));
      div($receiver, void 0, WebView_init$lambda$lambda$lambda_0);
      return Unit;
    };
  }
  function WebView_init$lambda$lambda_0($receiver) {
    set_id($receiver, 'source');
    return Unit;
  }
  function WebView_init$lambda(this$WebView) {
    return function ($receiver) {
      div_0($receiver, void 0, WebView_init$lambda$lambda(this$WebView));
      div_0($receiver, void 0, WebView_init$lambda$lambda_0);
      return Unit;
    };
  }
  WebView.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'WebView',
    interfaces: [View]
  };
  var package$com = _.com || (_.com = {});
  var package$addonovan = package$com.addonovan || (package$com.addonovan = {});
  package$addonovan.View = View;
  package$addonovan.Controller = Controller;
  package$addonovan.Interpreter = Interpreter;
  package$addonovan.find_61zpoe$ = find;
  package$addonovan.main_kand9s$ = main;
  package$addonovan.Operations = Operations;
  Object.defineProperty(package$addonovan, 'Parser', {
    get: Parser_getInstance
  });
  package$addonovan.Argument = Argument;
  package$addonovan.Line = Line;
  Particle.Instruction = Particle$Instruction;
  Particle.Label = Particle$Label;
  Particle.OpCode = Particle$OpCode;
  Particle.Register = Particle$Register;
  Particle.Literal = Particle$Literal;
  Particle.BinaryLiteral = Particle$BinaryLiteral;
  Particle.DecimalLiteral = Particle$DecimalLiteral;
  Particle.HexadecimalLiteral = Particle$HexadecimalLiteral;
  Particle.CharacterLiteral = Particle$CharacterLiteral;
  package$addonovan.Particle = Particle;
  package$addonovan.toBit_s8ev3n$ = toBit;
  package$addonovan.toBit_1v8dcc$ = toBit_0;
  package$addonovan.BitArray = BitArray;
  package$addonovan.I32 = I32;
  package$addonovan.toI32_s8ev3n$ = toI32;
  package$addonovan.toString_e4yvb3$ = toString;
  package$addonovan.Program = Program;
  package$addonovan.RegisterFile = RegisterFile;
  $$importsForInline$$.main = _;
  package$addonovan.WebView = WebView;
  main([]);
  Kotlin.defineModule('main', _);
  return _;
}(typeof main === 'undefined' ? {} : main, kotlin, this['kotlinx-html-js']);

//# sourceMappingURL=main.js.map
