import { SnakePage } from './app.po';

describe('snake App', function() {
  let page: SnakePage;

  beforeEach(() => {
    page = new SnakePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
