import { initialScroll } from '@/lib/initialScroll';

describe('initialScroll (where a full page load starts)', () => {
  it('always starts at the top on reload, ignoring the saved position and #hash', () => {
    expect(initialScroll('reload', '', '5927')).toEqual({ kind: 'top' });
    expect(initialScroll('reload', '#contact', '5927')).toEqual({ kind: 'top' });
  });

  it('restores the saved position when coming back with the Back/Forward button', () => {
    expect(initialScroll('back_forward', '', '1200')).toEqual({ kind: 'position', y: 1200 });
  });

  it('follows a #hash on a fresh visit, so shared links like /#contact still work', () => {
    expect(initialScroll('navigate', '#contact', '5927')).toEqual({ kind: 'hash', hash: '#contact' });
  });

  it('starts at the top on a normal fresh visit, even if an old position was saved', () => {
    expect(initialScroll('navigate', '', '5927')).toEqual({ kind: 'top' });
    expect(initialScroll(undefined, '', null)).toEqual({ kind: 'top' });
  });

  it('ignores junk saved values', () => {
    expect(initialScroll('back_forward', '', 'abc')).toEqual({ kind: 'top' });
    expect(initialScroll('back_forward', '', '0')).toEqual({ kind: 'top' });
  });
});
