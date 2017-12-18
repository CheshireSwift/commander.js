require('should');
const sinon = require('sinon');

const commander = require('../');

describe('command', () => {
  let program;
  beforeEach(function () {
    program = new commander.Command();
  });

  describe('action', () => {
    it('receives arguments', () => {
      let val = false;
      program
        .command('info [options]')
        .option('-C, --no-color', 'turn off color output')
        .action(function () {
          val = this.color;
        });

      program.parse(['node', 'test', 'info']);

      program.commands[0].color.should.equal(val);
    })
  });

  describe('alias', () => {
    it('is reported in help', () => {
      program
        .command('info [thing]')
        .alias('i')
        .action(function () {
        });

      program
        .command('save [file]')
        .alias('s')
        .action(function () {
        });

      program.parse(['node', 'test']);

      program.commandHelp().should.containEql('info|i');
      program.commandHelp().should.containEql('save|s');
      program.commandHelp().should.not.containEql('test|');
    });
  });

  describe('an unknown option', () => {
    let sandbox, stubError, stubExit;

    before(function() {
      sandbox = sinon.sandbox.create();
      stubError = sandbox.stub(console, 'error');
      stubExit = sandbox.stub(process, 'exit');
    });

    afterEach(function () {
      stubError.reset();
      stubExit.reset();
    });

    after(function() {
      sandbox.restore();
    });

    it('throws errors when supplied to a command', () => {
      program
        .version('0.0.1')
        .option('-p, --pepper', 'add pepper');
      program.parse('node test -m'.split(' '));

      stubError.callCount.should.equal(3);
    });


    it('throws errors when supplied to a subcommand', () => {
      program
        .command('sub')
        .action(function () {
        });
      program.parse('node test sub -m'.split(' '));

      stubError.callCount.should.equal(3);
      stubExit.calledOnce.should.be.true();
    });

    it('does not throw errors when supplied to a command with allowUnknownOption', () => {
      program
        .version('0.0.1')
        .option('-p, --pepper', 'add pepper');
      program
        .allowUnknownOption()
        .parse('node test -m'.split(' '));

      stubError.callCount.should.equal(0);
      stubExit.calledOnce.should.be.false();
    });

    it('does not throw errors when supplied to a subcommand with allowUnknownOption', () => {
      program
        .command('sub2')
        .allowUnknownOption()
        .action(function () {
        });
      program.parse('node test sub2 -m'.split(' '));

      stubError.callCount.should.equal(0);
      stubExit.calledOnce.should.be.false();
    });
  });

  require('./partial/command.executableSubcommand');
});
