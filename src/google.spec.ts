import * as fs from 'fs-extra';
import { GoogleSERP } from './index';
import { Serp } from './models';

const root = 'test/google/desktop/';

test('GoogleSERP should return empty organic array on empty html string', () => {
  expect(new GoogleSERP('').serp.organic).toEqual([]);
});

describe('Parsing Google page with 10 resuts', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}google.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('Page should have 11,310,000,000 results', () => {
    expect(serp.totalResults).toBe(11910000000);
  });
  test('Search should be done in 1.17 seconds', () => {
    expect(serp.timeTaken).toBe(0.66);
  });
  test('Current page should be 1', () => {
    expect(serp.currentPage).toBe(1);
  });
  test('Page should have 8 related keywords', () => {
    expect(serp.relatedKeywords).toHaveLength(8);
  });
  test('1st related keyword', () => {
    expect(serp.relatedKeywords[0].keyword).toBe('google drive');
  });
  test('1st related keyword should have path', () => {
    expect(serp.relatedKeywords[0].path).toBe(
      '/search?safe=off&gl=US&pws=0&nfpr=1&q=Google+Drive&sa=X&ved=2ahUKEwiEq7bs7ZL0AhX3TjABHUAFBVUQ1QJ6BAgaEAE',
    );
  });
  test(`Link to 2nd page should have path`, () => {
    expect(serp.pagination[1].path).toBe(
      '/search?q=google&safe=off&gl=US&pws=0&nfpr=1&ei=cGKOYYSzEPedwbkPwIqUqAU&start=10&sa=N&filter=0&ved=2ahUKEwiEq7bs7ZL0AhX3TjABHUAFBVUQ8tMDegQIARA6',
    );
  });
  test('serp should have 8 results', () => {
    expect(serp.organic).toHaveLength(8);
  });
  test('2nd result should have url https://www.google.com/account/about/', () => {
    expect(serp.organic[1].url).toBe('https://www.google.com/account/about/');
  });

  test('4th result should have title "Google My Business - Manage Your Business Profile"', () => {
    expect(serp.organic[3].title).toBe('Google My Business - Manage Your Business Profile');
  });

  test('4th result should have snippet to start with "Learn how Google.org uses the best of Google to help nonprofits and social...', () => {
    expect(serp.organic[4].snippet).toBe(`Google Images. The most comprehensive image search on the web.`);
  });

  test('1st result should have card sitelinks', () => {
    expect(serp).toHaveProperty(['organic', 0, 'sitelinks', 0, 'title'], 'Docs');
    expect(serp).toHaveProperty(['organic', 0, 'sitelinks', 0, 'href'], 'https://www.google.com/docs/about/');
    // expect(serp).toHaveProperty(
    //   ['organic', 0, 'sitelinks', 0, 'snippet'],
    //   'In your Google Account, you can see and manage your info ...',
    // );
    expect(serp).toHaveProperty(['organic', 0, 'sitelinks', 0, 'type'], 'INLINE');
  });
  test('2nd result should not have sitelinks', () => {
    expect(serp).not.toHaveProperty(['organic', '1', 'sitelinks']);
  });

  test('testing videos property for non existent results', () => {
    expect(serp.videos).toBeUndefined();
  });
  test('testing adwords property for non existent results', () => {
    expect(serp.adwords).toBeUndefined();
  });
  test('testing Locals property for non existent results', () => {
    expect(serp.locals).toBeUndefined();
  });
  test('testing shop property for non existent results', () => {
    expect(serp.shopResults).toBeUndefined();
  });

  describe('Testing top stories feature', () => {
    test('Page should have topStories feature', () => {
      expect(serp.topStories).toBeDefined();
    });

    test('2nd top stories card should have title "Google loses challenge against EU antitrust ruling, $2.8-bln fine"', () => {
      expect(serp).toHaveProperty(
        ['topStories', 1, 'title'],
        'Google loses challenge against EU antitrust ruling, $2.8-bln fine',
      );
      expect(serp).toHaveProperty(
        ['topStories', 1, 'url'],
        'https://www.reuters.com/technology/eu-court-upholds-eu-antitrust-ruling-against-google-2021-11-10/',
      );
      expect(serp).toHaveProperty(['topStories', 1, 'publisher'], 'Reuters');
      expect(serp).toHaveProperty(['topStories', 1, 'published'], '1 day ago');
    });
  });
});

describe('Parsing Google page with 100 results', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}google-100.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('serp should have 99 results', () => {
    expect(serp.organic).toHaveLength(97);
  });

  test('all results should have domain domains.google', () => {
    expect(serp.organic.filter((x) => x.domain === '')).toEqual([]);
  });

  test('3rd result should have url https://www.google.com/docs/about/', () => {
    expect(serp.organic[2].url).toBe('https://www.google.com/docs/about/');
  });

  test('3rd result should have title "Google Docs: Free Online Document Editor"', () => {
    expect(serp.organic[2].title).toBe('Google Docs: Free Online Document Editor');
  });

  test('3rd result should have snippet to be "Google Images. The most comprehensive image search on the web.', () => {
    expect(serp.organic[4].snippet.replace(/\s+/g, ' ').trim()).toBe(
      'Google Images. The most comprehensive image search on the web.'.replace(/\s+/g, ' ').trim(),
    );
  });

  test('Keyword should be google', () => {
    expect(serp.keyword).toBe('google');
  });
});

describe('Parsing Google featured snippet page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}featured-snippet.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('serp should have 10 results', () => {
    expect(serp.organic).toHaveLength(10);
  });

  test('1th result should have featured snippet', () => {
    expect(serp.organic[0].featured).toBeTruthy();
  });

  test('1st result should have domain backlinko.com', () => {
    expect(serp.organic[0].domain).toBe('backlinko.com');
  });

  test('1st result should have title "What Are Featured Snippets? And How to Get Them - Backlinko"', () => {
    expect(serp.organic[0].title).toBe('What Are Featured Snippets? And How to Get Them - Backlinko');
  });

  test('1st result should have snippet to start with "Featured Snippets are short snippets ...', () => {
    expect(serp.organic[0].snippet).toBe(
      `Featured Snippets are short snippets of text that appear at the top of Google's search results in order to quickly answer a searcher's query. The content that appears inside of a Featured Snippet is automatically pulled from web pages in Google's index.`,
    );
  });
});

describe('Parsing "The Matrix" search page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}matrix.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('serp should have 8 results', () => {
    expect(serp.organic).toHaveLength(6);
  });

  test('Keyword should be "The Matrix"', () => {
    expect(serp.keyword).toBe('The Matrix');
  });

  test('2nd result should have sitelinks and second sitelink should have title "‎Plot Summary"', () => {
    expect(serp).toHaveProperty(['organic', 1, 'sitelinks', 0, 'title']);
    expect(serp).toHaveProperty(
      ['organic', 1, 'sitelinks', 0, 'href'],
      'https://en.wikipedia.org/wiki/The_Matrix_(franchise)',
    );
    expect(serp).toHaveProperty(['organic', 1, 'sitelinks', 0, 'type'], 'INLINE');
  });

  test('video card feature', () => {
    expect(serp.videos).toHaveLength(4);
    expect(serp).toHaveProperty(['videos', 0, 'title'], 'The Matrix Resurrections – Official Trailer 1');
    expect(serp).toHaveProperty(['videos', 0, 'sitelink'], 'https://www.youtube.com/watch?v=9ix7TUGVYIo');
    expect(serp).toHaveProperty(['videos', 0, 'source'], 'YouTube');
    // expect(serp).toHaveProperty(['videos', 0, 'date'], new Date('2013-11-19'));
    expect(serp).toHaveProperty(['videos', 0, 'channel'], 'Warner Bros. Pictures · ');
    expect(serp).toHaveProperty(['videos', 0, 'videoDuration'], '2:53');
  });
  test.skip('thumbnailGroups feature test', () => {
    expect(serp.thumbnailGroups).toHaveLength(3);
    expect(serp).toHaveProperty(['thumbnailGroups', 0, 'heading'], 'The Matrix movies');
    expect(serp).toHaveProperty(['thumbnailGroups', 0, 'thumbnails', 0, 'title'], 'The Matrix Reloaded');
    expect(serp).toHaveProperty(
      ['thumbnailGroups', 0, 'thumbnails', 0, 'sitelink'],
      '/search?q=The+Matrix+Reloaded&stick=H4sIAAAAAAAAAONgFuLQz9U3ME-uMlICsyqMTAu1pLKTrfTTMnNywYRVUWpOYklqikJxaknxKkapNKvs1Mry_KIUq9z8sszUYiuQPiNDQ7O0RazCIRmpCr6JJUWZFQpBqTn5iSmpKQDpFzxLZQAAAA&sa=X&ved=2ahUKEwji-vSCuarsAhVTvZ4KHa3yDYsQxA0wG3oECAQQAw',
    );
    expect(serp).toHaveProperty(['thumbnailGroups', 1, 'heading'], 'Keanu Reeves movies');
    expect(serp).toHaveProperty(['thumbnailGroups', 1, 'thumbnails', 0, 'title'], 'Johnny Mnemonic');
    expect(serp).toHaveProperty(
      ['thumbnailGroups', 1, 'thumbnails', 0, 'sitelink'],
      '/search?q=Johnny+Mnemonic&stick=H4sIAAAAAAAAAONgFuLQz9U3ME-uMlICs7JLUpK0pLKTrfTTMnNywYRVUWpOYklqikJxaknxKkbJNKvs1Mry_KIUq9z8sszUYiuQPhNzy6RFrPxe-Rl5eZUKvnmpufl5mckAmNNcvGAAAAA&sa=X&ved=2ahUKEwji-vSCuarsAhVTvZ4KHa3yDYsQxA0wHHoECAYQBA',
    );
  });
});

describe('Parsing Hotels search page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}hotels.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('There should be 1231 similar hotels in the area', () => {
    expect(serp).toHaveProperty(['hotels', 'moreHotels'], 1219);
  });

  test('The searchTitle in searchFilters of hotels feature should be "Hotels | New York City, NY"', () => {
    expect(serp).toHaveProperty(['hotels', 'searchFilters', 'searchTitle'], 'Hotels | New York, NY');
  });
  test('The checkIn date in searchFilters of hotels feature should be "Mon, Jun 21 2021"', () => {
    expect(serp).toHaveProperty(['hotels', 'searchFilters', 'checkIn'], new Date('2021-11-24T00:00:00.000Z'));
  });
  test('The checkOut date in searchFilters of hotels feature should be "Tue, June 22 2021"', () => {
    expect(serp).toHaveProperty(['hotels', 'searchFilters', 'checkOut'], new Date('2021-11-25T00:00:00.000Z'));
  });
  test('The guests number in searchFilters of hotels feature should be 2', () => {
    expect(serp).toHaveProperty(['hotels', 'searchFilters', 'guests'], 2);
  });
  test(`First search filter should have title 'Top-rated'`, () => {
    expect(serp).toHaveProperty(['hotels', 'searchFilters', 'filters', 0, 'title'], 'Top-rated');

    // There is no explanation on the new search filters
    // expect(serp.hotels.searchFilters.filters[0].explanation).toBe('Based on your search, prices & quality');
  });
  test('The second hotel filter should not have a property called isActive', () => {
    expect(serp).not.toHaveProperty(['hotels', 'searchFilters', 'filters', 1, 'isActive']);
  });

  test('There should be 4 featured hotels in the hotels feature', () => {
    expect(serp.hotels?.hotels).toHaveLength(4);
  });
  test('First featured hotel should have name "Made Hotel"', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 0, 'name'], 'Arlo Midtown');
  });
  test('Third featured hotel should have currency "$"', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'currency'], '$');
  });
  test('Third featured hotel should have price 153', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'price'], 111);
  });
  test('Third featured hotel should have rating 3.4', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'rating'], 3.4);
  });
  test('Third featured hotel should have 862 votes', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'votes'], 862);
  });

  test('3rd featured hotel should have deal property', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'deal']);
  });
  test('3rd featured hotel should not have originalPrice property', () => {
    expect(serp).not.toHaveProperty(['hotels', 'hotels', 2, 'deal', 'originalPrice']);
  });

  // TODO there is no featured review on the new hotels page, find one to test

  test(`Third featured hotel should be labeled with deal,
   having dealType: "GREAT DEAL" and
   dealDetails: "65% less than usual"`, () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'deal', 'dealType'], 'GREAT DEAL');
    expect(serp).toHaveProperty(['hotels', 'hotels', 2, 'deal', 'dealDetails'], '65% less than usual');
  });

  describe('Testing ads', () => {
    test('There should be top ads', () => {
      expect(serp.adwords).toBeDefined();
      expect(serp.adwords?.adwordsTop).toBeDefined();
      expect(serp.adwords?.adwordsBottom).not.toBeDefined();
    });

    test('There should be 3 ads on the top of the page', () => {
      expect(serp.adwords?.adwordsTop).toHaveLength(2);
    });

    test('Testing first ad', () => {
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'position'], 1);
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'title'], `Hotels in New York, NY - Booking.com`);
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'url'], 'https://www.booking.com/city/us/new-york.html');
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'domain'], 'www.booking.com');
      expect(serp).toHaveProperty(
        ['adwords', 'adwordsTop', 0, 'snippet'],
        `Book your Hotel in New York City now. Quick, Easy Booking. No Reservation Costs. Choose from a wide range of properties which Booking.com offers. Search now! Save 10% with Genius. Motels. We speak your language. Hostels. Bed and Breakfasts. Villas.Find deals for your budget and be a Booker today.Book now. No cancellation fees on most rooms. You stay in control.`,
      );
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'linkType'], 'LANDING');
    });

    test('Testing 1st ad sitelink', () => {
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 0]);
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 0, 'title'], 'Deals for any Budget');
      expect(serp).toHaveProperty(
        ['adwords', 'adwordsTop', 0, 'sitelinks', 0, 'href'],
        'https://www.google.com/aclk?sa=l&ai=DChcSEwier8Ds7ZL0AhWabG8EHd1WA_oYABACGgJqZg&ae=2&sig=AOD64_2UgzaMX79jlT6GsMbghBTlJfhP6A&ved=2ahUKEwjJ_bfs7ZL0AhX8TjABHS2XD3oQqyQoAHoECAQQBw&adurl=',
      );
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 0, 'type'], 'CARD');
    });
  });

  describe.skip('Testing top stories feature', () => {
    test('Page should have topStories feature', () => {
      expect(serp.topStories).toBeDefined();
    });

    test('1st top stories card should have title "De Blasio: NYC ready to 8,000 homeless out of hotels, back into shelters"', () => {
      expect(serp).toHaveProperty(
        ['topStories', 0, 'title'],
        'De Blasio: NYC ready to 8,000 homeless out of hotels, back into shelters',
      );
      expect(serp).toHaveProperty(
        ['topStories', 0, 'url'],
        'https://www.nydailynews.com/news/politics/new-york-elections-government/ny-nyc-de-blasio-homeless-relocation-hotels-shelters-20210616-ys23jfsiffcf5b4encjzcka55a-story.html',
      );
      expect(serp).toHaveProperty(['topStories', 0, 'publisher'], '');
      expect(serp).toHaveProperty(['topStories', 0, 'published'], '1 day ago');
    });
  });
});

describe('Parsing Hotels-London search page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}hotels-london.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test.skip('Second featured hotel should have originalPrice property and should have value 113', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 1, 'deal', 'originalPrice'], 113);
  });

  test('Expect to have one active filter', () => {
    const activeFiltersNumber = serp.hotels?.searchFilters?.filters.reduce((acc, curr) => {
      if (curr.isActive === true) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    expect(activeFiltersNumber).toBe(1);
  });

  test('Second featured hotel should have have amenities property', () => {
    expect(serp).toHaveProperty(['hotels', 'hotels', 1, 'amenities'], 'SpaIndoor pool');
  });
});

describe('Testing functions', () => {
  let serp: Serp;

  beforeAll(() => {
    serp = new GoogleSERP('<body class="srp"><div></div></body>').serp;
  });

  test('testing getResults and getTime function for non existent results', () => {
    expect(serp.totalResults).toBeUndefined();
    expect(serp.timeTaken).toBeUndefined();
  });

  test('testing getHotels function for non existent results', () => {
    expect(serp.hotels).toBeUndefined();
  });
});

describe('Parsing Domain page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}domain.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  describe('Testing ads', () => {
    test.skip('There should be top ads', () => {
      expect(serp.adwords).toBeDefined();
      expect(serp.adwords?.adwordsTop).toBeDefined();
      expect(serp.adwords?.adwordsBottom).toBeDefined();
    });

    test('There should be 1 ad on the top of the page', () => {
      expect(serp.adwords?.adwordsTop).toHaveLength(4);
    });

    test('Testing first ad', () => {
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'position'], 1);
      expect(serp).toHaveProperty(
        ['adwords', 'adwordsTop', 0, 'title'],
        `Cheap Domain Names From $0.80 - Free Private Registration`,
      );
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'url'], 'https://www.ionos.com/domains/domain-names');
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'domain'], 'www.ionos.com');
      expect(serp).toHaveProperty(
        ['adwords', 'adwordsTop', 0, 'snippet'],
        `Also included: 1 email account with 2 GB mailbox space. Find your perfect domain now! New Domain Extensions. Email Account Included. One-click activation. Up to 10,000 subdomains. Personal Consultant. 24/7 Support. Easy Domain Transfer.`,
      );
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'linkType'], 'LANDING');
    });

    test('Testing first ad sitelink', () => {
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 1]);
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 1, 'title'], '$0.50 Web Hosting');
      expect(serp).toHaveProperty(
        ['adwords', 'adwordsTop', 0, 'sitelinks', 1, 'href'],
        'https://www.google.com/aclk?sa=l&ai=DChcSEwj3-L3s7ZL0AhWZoIYKHWwPBDsYABAJGgJ2dQ&ae=1&sig=AOD64_0PegvCphWbulkNGBiIMg8sepBd6Q&q=&ved=2ahUKEwiL_Lfs7ZL0AhUeQzABHbfABQ8QpigoAXoECAUQCg&adurl=https://www.ionos.com/hosting/web-hosting%3Fac%3DOM.US.USo42K356154T7073a%26utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3DDOMAIN_NAME_INFO_GEN_USA-GE-EX-SEA%26utm_term%3Ddomain%26utm_content%3DEX-Domain%26gclsrc%3Daw.ds%26gclid%3DEAIaIQobChMI9_i97O2S9AIVmaCGCh1sDwQ7EAAYASACEgLBMvD_BwE',
      );
      expect(serp).not.toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 1, 'snippet']);
      expect(serp).toHaveProperty(['adwords', 'adwordsTop', 0, 'sitelinks', 1, 'type'], 'INLINE');
    });
  });
});

describe('Parsing .com-domains page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}_com-domains.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('There should be all ads', () => {
    expect(serp.adwords).toBeDefined();
    expect(serp.adwords?.adwordsTop).toBeDefined();
    expect(serp.adwords?.adwordsBottom).toBeDefined();
  });

  test(`Testing 3rd bottom ad sitelinks`, () => {
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 2, 'sitelinks', 1]);
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 2, 'sitelinks', 1, 'title'], 'Free Domain with Hosting');
    expect(serp).toHaveProperty(
      ['adwords', 'adwordsBottom', 2, 'sitelinks', 1, 'href'],
      'https://www.google.com/aclk?sa=l&ai=DChcSEwjor73s7ZL0AhVLfG8EHfffBYMYABAMGgJqZg&ae=1&sig=AOD64_3iTRiW_HptXNrXKs2LPVE_Na0-Gg&q=&ved=2ahUKEwjLkbbs7ZL0AhU5RjABHXyXAa0QpigoAXoECAQQCg&adurl=https://www.hostgator.com/web-hosting%3Futm_source%3Dgoogle%26utm_medium%3Dgenericsearch%26gclsrc%3Daw.ds%26gclid%3DEAIaIQobChMI6K-97O2S9AIVS3xvBB333wWDEAMYAyACEgK67fD_BwE',
    );
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 2, 'sitelinks', 1, 'type'], 'INLINE');
  });

  test('There should be 1 ad on the bottom of the page', () => {
    expect(serp.adwords?.adwordsBottom).toHaveLength(3);
  });
  test('First bottom ad tests', () => {
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 1]);
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 1, 'position'], 2);
    expect(serp).toHaveProperty(
      ['adwords', 'adwordsBottom', 1, 'url'],
      'https://www.networksolutions.com/domain-name-registration/index.jsp',
    );
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 1, 'domain'], 'www.networksolutions.com');
    expect(serp).toHaveProperty(['adwords', 'adwordsBottom', 1, 'linkType'], 'LANDING');
    expect(serp).toHaveProperty(
      ['adwords', 'adwordsBottom', 1, 'snippet'],
      `Get the right extension for your domain name. Search .COM .NET .ORG .BIZ & .INFO domains. Get the most out of your domain with private registration and website forwarding. 30+ Years in Business. Premium Domains Available. Find Expiring Domains.`,
    );
  });
});

describe('Parsing Coffee page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}coffee.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('Page should have locals feature', () => {
    expect(serp.locals).toBeDefined();
  });

  test('3rd locals card should have title "Peets Coffee"', () => {
    expect(serp).toHaveProperty(['locals', 1, 'name'], "Peet's Coffee");
    expect(serp).toHaveProperty(['locals', 1, 'rating'], '4.3');
    expect(serp).toHaveProperty(['locals', 1, 'reviews'], '419');
    expect(serp).toHaveProperty(['locals', 1, 'expensiveness'], 1);
    expect(serp).toHaveProperty(['locals', 1, 'type'], 'Coffee shop');
    expect(serp).toHaveProperty(['locals', 1, 'address'], '1400 Mission St Suite 130');
    // expect(serp).toHaveProperty(['locals', 1, 'distance'], '0.2 mi');
    expect(serp).toHaveProperty(['locals', 0, 'description'], '"Good value filter coffee"');
  });
});

describe('Parsing Pizza page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}pizza.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  
  test('Page should have organic results', () => {
    expect(serp.organic).toHaveLength(10);
  });

  test('Snippet metched test', () =>{
    const firstOrganic  = serp.organic[0];
    const secendOrganic = serp.organic[1];
    expect(firstOrganic.sippetMatched).toEqual(["pizza", "pizza"]);
    expect(secendOrganic.sippetMatched).toEqual(["pizzas","pizza"]);
  });

  test('Rich snippet test', ()=>{
    const richSnippet = serp.organic[0].richSnippet;
    expect(richSnippet).toHaveProperty(["0", "key"],"Main ingredients: ");
    expect(richSnippet).toHaveProperty(["0","value"], "Dough, sauce (usually tomato ...");
  })

  test('Page should have knowledge graph', () => {
    expect(serp.knowledgeGraph).toBeDefined();
  });

  test('Title and type of knowledge graph', () => {
    expect(serp).toHaveProperty(["knowledgeGraph","title"], "Pizza");
    expect(serp).toHaveProperty(["knowledgeGraph","type"], "Dish");
  });
});


describe('Parsing humburger page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}humburger.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  
  test('Page should have organic results', () => {
    expect(serp.organic).toHaveLength(9);
  });

  test('Page should have knowledge graph', () => {
    expect(serp.knowledgeGraph).toBeDefined();
  });

  test('Title and type of knowledge graph', () => {
    expect(serp).toHaveProperty(["knowledgeGraph","title"], "Burger");
    expect(serp).toHaveProperty(["knowledgeGraph","type"], "Food");
  });
});


describe('Parsing royal beach page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}royal-beach.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  
  test('Page should have organic results', () => {
    expect(serp.organic).toHaveLength(9);
  });

  test('Page should have knowledge graph', () => {
    expect(serp.knowledgeGraph).toBeDefined();
  });

  test('hotel knoledge graph test', () => {
    expect(serp).toHaveProperty(["knowledgeGraph","category"], "5-star hotel");
    expect(serp).toHaveProperty(["knowledgeGraph", "address"], "Ha-Yam St 1, Eilat");
    expect(serp).toHaveProperty(["knowledgeGraph", "phone"], "08-636-8888");
    expect(serp).toHaveProperty(["knowledgeGraph", "rating"], "4.5");
    expect(serp).toHaveProperty(["knowledgeGraph", "reviewers"], "4,554 Google reviews");
    expect(serp).toHaveProperty(["knowledgeGraph", "website"], "https://www.isrotel.com/royal-beach");
    expect(serp).toHaveProperty(["knowledgeGraph", "pepoleAlsoSearchForLink"], "https://www.google.com/search?biw=836&bih=821&hotel_occupancy=2&tbm=lcl&q=Royal+Beach+Eilat&rflfq=1&num=20&stick=H4sIAAAAAAAAAB2QO04cYRCEtYGRUzOIYKI9Qr-qHykSucUNRmgRSCstWkh8HU7gc_kUriH79f3VVdX982ZdXHXEADHX8MlwXe9UGmWSEpmFFCkx0pKWaVcrlWgtxaxLjHm6mIZZivKV61IT0aGV0ACVAGF6wBAugCow01iXEZeRmOEsJ2ipLGURIgOjPAoC3-MtWCWg1tZt6ppJGvT2wTBNVCTUi1STcvUJh7eiESzAxBJYS3WNuknFbpBGJ2_LNqa3o3cDblTVjQ6xqP0269LJ7mMK_rpVDmS9zdkJaO1ZTmv7bmVwD0FVBfUeeysMtCdBnVEajCB1cfCiVGvN8Lrj66LDEedSxVc2-8jfw-Hf4f736fJ-Ph2388fl-HHars-vx5fL9evHr6fLn-18fDhtJI9v5-3zP9ZTnWXfAQAA&sa=X&ved=2ahUKEwj0opCzid70AhUsREEAHWb5DIUQ63UoAXoECBUQAg");
    expect(serp).toHaveProperty(["knowledgeGraph", "peopleAlsoSearchFor",0,"name"], "מלון ארקדיה ספא אילת");
    expect(serp).toHaveProperty(["knowledgeGraph", "peopleAlsoSearchFor",0,"type"], "Hotel");
    expect(serp).toHaveProperty(["knowledgeGraph", "peopleAlsoSearchFor",0,"link"], "https://www.google.com/#");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelDetails"], "This upscale beachfront hotel on the Gulf of Eilat is 9 km from the Coral World Underwater Observatory and 18 km from Aqaba Archaeological Museum. … MOREElegant rooms feature minibars, free Wi-Fi and flat-screen TVs; most have balconies. Upgraded rooms come with whirlpool tubs, executive lounge access and/or hot tubs. Suites offer separate living rooms. Upgraded suites have spa access. Room service is available.Breakfast and parking are complimentary. Other amenities consist of 4 restaurants, including Italian and Japanese eateries, plus a bar and a spa. There's also an outdoor pool, a gym and a kids' club, as well as a synagogue.");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelsAdds",0,"host"], "FindHotel.net");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelsAdds",0,"price"], "₪1,036");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelsAdds",0,"link"], "https://www.google.com/url?q=https://www.google.com/aclk?sa%3Dl%26ai%3DCngdZqNG1YbWAN8WHwuIPsMOjmAat_e-6ZKyu0I_1Da22gqH0KQgKEAEoAmD5AqABiueC3gOpAkp6GFqd_LI-qAMFqgRHT9CweXpDuulBRUoWwuRPqKSYBgi1EjvE7P0XDXvNjv4s6kUN5AQEsGjeXSyRyJusNZuRKHjW-WPfDI6JCFphUbcrC4WH41nABLuLpoW8A4gFoqfO6i7ABZIBoAZliAcBkAcByAmsAaIKpgEKCjIwMjEtMTItMjEQASk46g86ehEIJDIJZmluZGhvdGVsOAJIAVImaWxfbGl2ZXB1c2hfcmZkXzExNjMxOTZfMjAyMS0xMi0yMV8xXzJdPvpWRGVIITBDcgNJTFOCAQ0KC0xLYmVUd1pWRHZrigELSUxfTGl2ZVB1c2iwAQG4AQDIAe3fkvUF4AEA6AEB8AEB-AEAoAIA4AIA6gIDSUxT8AIBigMA6AoBkAsD0AscqgwCCAG4DAHQFQGAFwE%26sig%3DAOD64_210Aj92pU914rfnfFXgpDu0XkYJw%26adurl%3Dhttps://search.findhotel.net/Hotel/Search?checkIn%253D2021-12-21%2526checkOut%253D2021-12-22%2526curr%253DILS%2526rooms%253D2:%2526utm_source%253Dgha%2526utm_medium%253Dcpc%2526hotelId%253D1163196%2526userCountry%253DIL%2526utm_campaign%253Dgha%2526profile%253Dr2d2m73kn8%2526preferredRate%253D1036.04%2526isG1%253D0%2526label%253Dsrc%25253Dgha%252526cltype%25253Dhotel%252526datype%25253Ddefault%252526gsite%25253Dlocaluniversal%252526ucountry%25253DIL%252526udevice%25253Ddesktop%252526hotel%25253D1163196%252526day%25253D21%252526month%25253D12%252526year%25253D2021%252526los%25253D1%252526price%25253D1036.04%252526currency%25253DILS%252526userlang%25253Den%252526cid%25253D12571612066%252526listid%25253D%252526rateid%25253DIL_LivePush%252526closerateid%25253D%252526_th%25253Da989382189d2225bd72da5ce802c1659bbccb8ac91541344%252526query%25253DLivePush%252526g1%25253D0%252526promo%25253D0%252526isPrivateRate%25253D0%252526isAudienceUser%25253D0%252526isPaidClick%25253D1");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelsAdds",0,"details"], "Free cancellation until Dec 17");
    expect(serp).toHaveProperty(["knowledgeGraph", "hotelProperties"], ["Free Wi-Fi","Free breakfast","Free parking","Accessible", "Outdoor pool","Air-conditioned"]);
    expect(serp).toHaveProperty(["knowledgeGraph", "image"], "https://www.google.com/travel/hotels/entity/CgsIy7y07JafyoKQARAB/lightbox/CAESUmh0dHBzOi8vZDJoeXoyYmZpZjNjcjguY2xvdWRmcm9udC5uZXQvaW1hZ2VSZXBvLzEvMC8zMi82MjAvMTkxL1N3aW1taW5nX3Bvb2xfUC5qcGc?g2lb=4419364,4597339,4596364,4679296,4258168,4306835,4649665,4640247,4672717,4270442,4317915,4371335,2503771,4401769,4624411,4685122,4680343,4659203,4641139,4605861,2503781,2502548,4670987,4291517,4270859,4284970&hl=en-IL&gl=il&cs=1&ssta=1&grf=EmQKLAgOEigSJnIkKiIKBwjlDxAMGBUSBwjlDxAMGBYgADAeQMoCSgcI5Q8QDBgMCjQIDBIwEi6yASsSKQonCiUweDE1MDA3MjMxOTQ5MTEyYjk6MHg5MDA1MjhmOTZkOGQxZTRi&rp=EMu8tOyWn8qCkAE4AkAASAHAAQI&ictx=1&sa=X&ved=2ahUKEwj0opCzid70AhUsREEAHWb5DIUQoip6BAgOEAM");


  });
});


describe('Parsing inline hotels page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}hotelsInline.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  
  test('Page should have organic results', () => {
    expect(serp.organic).toHaveLength(10);
  });

  test('Page should have knowledge graph', () => {
    expect(serp.hotels).toBeDefined();
    expect(serp).toHaveProperty('hotels',[]);
  });

  
});




describe('Parsing Dell page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}dell.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('Page should have shop feature', () => {
    expect(serp.shopResults).toBeDefined();
  });

  test(`Page should have shop results and the title of the first shop result should be 
    "Dell XPS 13 Laptop - w/ 11th gen Intel Core - 13.3" FHD Screen - 8GB - 256G"`, () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'title'], 'Dell XPS 13 Laptop - w/ Windows 11 & 11th gen Intel ...');
  });

  test('First shop results on the page should have img link', () => {
    expect(serp).toHaveProperty(
      ['shopResults', 0, 'imgLink'],
      'https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9305-laptop/xn9305ezwkh',
    );
  });

  test('First shop result on the page should have price 899.99', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'price'], 649.99);
  });

  test('First shop result on the page should have currency "$"', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'currency'], '$');
  });

  test('Shopping site for the first shop result on the page should be "Dell"', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'shoppingSite'], 'Dell');
  });

  test('First shop result on the page should not have specialOffer', () => {
    expect(serp).not.toHaveProperty(['shopResults', 0, 'specialOffer']);
  });

  // TODO there is no special offer on this page, find one to test
  test.skip('First shop result on the page should have specialOffer saying "Special offer"', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'specialOffer'], 'Special offer');
  });

  test('3rd shop result on the page should not have rating, votes, but will have commodity', () => {
    expect(serp).not.toHaveProperty(['shopResults', 2, 'votes']);
    expect(serp).not.toHaveProperty(['shopResults', 2, 'rating']);
    expect(serp).toHaveProperty(['shopResults', 2, 'commodity'], 'Free shipping');
  });

  test.skip('3rd shop result on the page should have rating 3.9', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'rating'], 3.9);
  });

  test('5th shop result on the page should have less than 1k votes', () => {
    expect(serp).toHaveProperty(['shopResults', 0, 'votes'], '596');
  });

  test('3rd shop result on the page should have 2k+ votes', () => {
    expect(serp).toHaveProperty(['shopResults', 1, 'votes'], '5k+');
  });
});







describe('Parsing no results page', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}no-results.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html).serp;
  });

  test('There should be 0 results', () => {
    expect(serp.organic).toHaveLength(0);
    expect(serp.error).toBe('No results page');
  });
});

describe('Testing optional module parsing', () => {
  let html: string;
  let serp: Serp;

  beforeAll(() => {
    html = fs.readFileSync(`${root}google.html`, { encoding: 'utf8' });
    serp = new GoogleSERP(html, {}).serp;
  });

  test('Do not detect any module parsing', () => {
    expect(serp.organic).toHaveLength(0);
    expect(serp.pagination).toHaveLength(0);
    expect(serp.relatedKeywords).toHaveLength(0);
    expect(serp).not.toHaveProperty(['thumbnailGroups']);
    expect(serp).not.toHaveProperty(['videos']);
    expect(serp).not.toHaveProperty(['hotels']);
    expect(serp).not.toHaveProperty(['adwords']);
    expect(serp).not.toHaveProperty(['availableOn']);
    expect(serp).not.toHaveProperty(['topStories']);
    expect(serp).not.toHaveProperty(['shopResults']);
    expect(serp).not.toHaveProperty(['locals']);
    expect(serp).not.toHaveProperty(['error']);
  });
});
