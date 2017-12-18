require('should');
const sinon = require('sinon');

const commander = require('../');

describe('options', () => {
  describe('args', () => {
    let program;
    beforeEach(() => {
      program = new commander.Command()
        .version('0.0.1');
    });

    it('are read when provided', () => {
      program
        .option('-c, --cheese [type]', 'optionally specify the type of cheese');

      program.parse(['node', 'test', '--cheese', 'feta']);
      program.cheese.should.equal('feta');
    });

    it('can be omitted when optional', () => {
      program
        .option('-c, --cheese [type]', 'optionally specify the type of cheese');

      program.parse(['node', 'test', '--cheese']);
      program.cheese.should.be.true;
    });

    // Pending - needs a rewrite
    it('cannot be omitted when required', () => {
      const sandbox = sinon.sandbox.create();

      const stubError = sandbox.stub(console, 'error');
      const stubExit = sandbox.stub(process, 'exit');

      //process.on('exit', function (code) {
      //  code.should.equal(1);
      //  info.length.should.equal(3);
      //  info[1].should.equal("  error: option `-c, --cheese <type>' argument missing");
      //  process.exit(0)
      //});

      program
        .option('-c, --cheese <type>', 'specify the type of cheese (required)');

      program.parse(['node', 'test', '--cheese']);

      stubExit.calledWith(1).should.be.true();

      sandbox.restore();
    })
  });
});
