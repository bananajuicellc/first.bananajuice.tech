// mock Chrome APIs
chrome = {
  i18n: {
    getMessage: function() {
      return 'translated message';
    }
  }
};

describe('Random card', function() {

  it('sets hash to a new card', function() {
    wgf.card.randomCard();
    expect(location.hash).toMatch(/#\/cards\//);
  });
});