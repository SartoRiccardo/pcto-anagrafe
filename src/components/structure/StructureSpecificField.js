import React, {Component} from "react";

/**
 * Represents a simple field with a constant RegExp.
 *
 * @author Riccardo Sartori
 *
 * @abstract
 */
class StructureSimpleField extends Component {
  render() {
    return (
      <p className="text-muted text-center">{this.state.text}</p>
    );
  }
}

/**
 * Represents an E-Mail field.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureEmailField extends StructureSimpleField {
  constructor(props) {
    super(props);
    this.state = {
      text: "esempio@mail.com",
    };
  }
}
StructureEmailField.default = "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*";
StructureEmailField.regex = /^\[a-zA-Z0-9\.!#\$%&’\*\+\\\/=\?\^_`\{\|}~-]\+@\[a-zA-Z0-9-]\+\(\?:\\\.\[a-zA-Z0-9-]\+\)\*$/;
StructureEmailField.fieldTypeName = "E-Mail";

/**
 * Represents a field where anything goes.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureAllField extends StructureSimpleField {
  constructor(props) {
    super(props);
    this.state = {
      text: "Qualsiasi valore è ammesso",
    };
  }
}
StructureAllField.default = ".+";
StructureAllField.regex = /^\.\+$/;
StructureAllField.fieldTypeName = "Qualsiasi";

/**
 * Represents a telephone number field.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureNumberField extends StructureSimpleField {
  constructor(props) {
    super(props);
    const number = Math.trunc(
      Math.random() * Math.pow(10, 11)
    ).toString();
    const exampleNum = number.substring(0, 3) + " " + number.substring(3, 6) + " " + number.substring(6, 10);
    this.state = {
      text: "Esempio: " + exampleNum,
    };
  }
}
StructureNumberField.default = "[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\.\\/0-9]*";
StructureNumberField.regex = /^\[\+]\*\[\(]\{0,1}\[0-9]\{1,4}\[\)]\{0,1}\[-\\s\\\.\\\/0-9]\*$/;
StructureNumberField.fieldTypeName = "Numero di telefono";

/**
 * Represents a website link field.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureWebsiteField extends StructureSimpleField {
  constructor(props) {
    super(props);
    const chance = Math.trunc(Math.random() / (1/4));
    let prefix;
    switch(chance) {
      case 0:
        prefix = "https://";
        break;

      case 1:
        prefix = "http://";
        break;

      case 2:
        prefix = "https://www.";
        break;

      default:
        prefix = "www.";
        break;
    }
    this.state = {
      text: "Esempio: " + prefix + "esempio.com",
    };
  }
}
StructureWebsiteField.default = "(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:\\/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+";
StructureWebsiteField.regex = /^\(\?:http\(s\)\?:\\\/\\\/\)\?\[\\w\.-]\+\(\?:\\\.\[\\w\\\.-]\+\)\+\[\\w\\-\\\._~:\\\/\?#\[\\]@!\\\$&'\\\(\\\)\\\*\\\+,;=\.]\+$/;
StructureWebsiteField.fieldTypeName = "Sito Web";

/**
 * Represents a date field.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureDateField extends StructureSimpleField {
  constructor(props) {
    super(props);
    const separator = Math.random() > 0.5 ? "/" : "-";
    const date = (
      Math.trunc(Math.random()*27+1) + separator
      + Math.trunc(Math.random()*12+1) + separator
      + (2018 + Math.trunc(Math.random()*3))
    );
    this.state = {
      text: "Esempio: " + date,
    };
  }
}
StructureDateField.default = "(?:([\\d]{2}-[\\d]{2}-[\\d]{4})|([\\d]{2}\\/[\\d]{2}\\/[\\d]{4}))";
StructureDateField.regex = /^\(\?:\(\[\\d]\{2}-\[\\d]\{2}-\[\\d]\{4}\)\|\(\[\\d]\{2}\\\/\[\\d]\{2}\\\/\[\\d]\{4}\)\)$/;
StructureDateField.fieldTypeName = "Data";

/**
 * Represents a numeric field.
 *
 * @author Riccardo Sartori
 *
 * @extends StructureSimpleField
 */
export class StructureNumericField extends StructureSimpleField {
  constructor(props) {
    super(props);
    this.state = {
      text: "Esempio: " + Math.trunc(Math.random()*1000),
    };
  }
}
StructureNumericField.default = "\\d+";
StructureNumericField.regex = /^\\d\+$/;
StructureNumericField.fieldTypeName = "Numero";
