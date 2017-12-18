const should = require('should');

const commander = require('../');

describe('literal arguments', () => {
  let program;
  beforeEach(() => {
    program = new commander.Command()
      .version('0.0.1')
      .option('-f, --foo', 'add some foo')
      .option('-b, --bar', 'add some bar');

  });

  it('should be forwarded as args, not consumed', () => {
    program.parse(['node', 'test', '--foo', '--', '--bar', 'baz']);
    program.foo.should.be.true;
    should.equal(undefined, program.bar);
    program.args.should.eql(['--bar', 'baz']);
  });

  it('should include subsequent literals, passing them through as args', () => {
    program.parse(['node', 'test', '--', 'cmd', '--', '--arg']);
    program.args.should.eql(['cmd', '--', '--arg']);
  });
});
