const ini = require('ini');

describe('ini package tests', () => {
  describe('parse', () => {
    test('should parse basic INI string', () => {
      const iniString = `
[section1]
key1=value1
key2=value2

[section2]
key3=value3
`;
      const parsed = ini.parse(iniString);
      
      expect(parsed).toHaveProperty('section1');
      expect(parsed.section1.key1).toBe('value1');
      expect(parsed.section1.key2).toBe('value2');
      expect(parsed).toHaveProperty('section2');
      expect(parsed.section2.key3).toBe('value3');
    });

    test('should parse INI with numbers', () => {
      const iniString = `
[database]
port=3306
timeout=30
`;
      const parsed = ini.parse(iniString);
      
      expect(parsed.database.port).toBe('3306');
      expect(parsed.database.timeout).toBe('30');
    });

    test('should parse INI with boolean values', () => {
      const iniString = `
[settings]
enabled=true
disabled=false
`;
      const parsed = ini.parse(iniString);
      
      expect(parsed.settings.enabled).toBe(true);
      expect(parsed.settings.disabled).toBe(false);
    });

    test('should handle empty sections', () => {
      const iniString = `
[empty]

[nonempty]
key=value
`;
      const parsed = ini.parse(iniString);
      
      expect(parsed).toHaveProperty('empty');
      expect(parsed.nonempty.key).toBe('value');
    });
  });

  describe('stringify', () => {
    test('should stringify basic object to INI format', () => {
      const obj = {
        section1: {
          key1: 'value1',
          key2: 'value2'
        },
        section2: {
          key3: 'value3'
        }
      };
      
      const stringified = ini.stringify(obj);
      
      expect(stringified).toContain('[section1]');
      expect(stringified).toContain('key1=value1');
      expect(stringified).toContain('key2=value2');
      expect(stringified).toContain('[section2]');
      expect(stringified).toContain('key3=value3');
    });

    test('should stringify object with numbers', () => {
      const obj = {
        database: {
          port: 3306,
          timeout: 30
        }
      };
      
      const stringified = ini.stringify(obj);
      
      expect(stringified).toContain('[database]');
      expect(stringified).toContain('port=3306');
      expect(stringified).toContain('timeout=30');
    });

    test('should stringify object with boolean values', () => {
      const obj = {
        settings: {
          enabled: true,
          disabled: false
        }
      };
      
      const stringified = ini.stringify(obj);
      
      expect(stringified).toContain('[settings]');
      expect(stringified).toContain('enabled=true');
      expect(stringified).toContain('disabled=false');
    });
  });

  describe('round-trip', () => {
    test('should parse and stringify back to similar structure', () => {
      const original = {
        section1: {
          key1: 'value1',
          key2: 'value2'
        }
      };
      
      const stringified = ini.stringify(original);
      const parsed = ini.parse(stringified);
      
      expect(parsed).toEqual(original);
    });
  });
});
