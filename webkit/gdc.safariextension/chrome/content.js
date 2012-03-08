/*
  A content script that stops Google from tracking the webpages you go to.

  Copyright 2010, 2011 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

/* The domain names Google phones home with, lowercased. */
const DOMAINS = [
  '2mdn.net',
  'accounts.google.com',
  'apis.google.com',
  'blogger.com',
  'books.google.com',
  'code.google.com',
  'docs.google.com',
  'doubleclick.net',
  'earth.google.com',
  'feedburner.com',
  'gmodules.com',
  'google-analytics.com',
  'google.com/alerts',
  'google.com/blogsearch',
  'google.com/bookmarks',
  'google.com/calendar',
  'google.com/chrome',
  'google.com/coop',
  'google.com/cse',
  'google.com/finance',
  'google.com/fusiontables',
  'google.com/health',
  'google.com/ig',
  'google.com/imghp',
  'google.com/intl',
  'google.com/latitude',
  'google.com/mobile',
  'google.com/offers',
  'google.com/patents',
  'google.com/prdhp',
  'google.com/products',
  'google.com/reader',
  'google.com/schhp',
  'google.com/shopping',
  'google.com/talk',
  'google.com/trends',
  'google.com/videohp',
  'google.com/voice',
  'google.com/wallet',
  'google.com/webhp',
  'googleadservices.com',
  'googlesyndication.com',
  'groups.google.com',
  'gstatic.com',
  'health.google.com',
  'images.google.com',
  'knol.google.com',
  'latitude.google.com',
  'mail.google.com',
  'music.google.com',
  'news.google.com',
  'orkut.com',
  'panoramio.com',
  'picasa.google.com',
  'picasaweb.google.com',
  'picnik.com',
  'plus.google.com',
  'plusone.google.com',
  'scholar.google.com',
  'sites.google.com',
  'sketchup.google.com',
  'toolbar.google.com',
  'translate.google.com',
  'video.google.com',
  'voice.google.com'
];

/*
  Determines whether any of a bucket of domains is part of a URL, regex free.
*/
function isMatching(url, domains) {
  const DOMAIN_COUNT = domains.length;
  for (var i = 0; i < DOMAIN_COUNT; i++)
      if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
          // A valid URL has at least two characters ("//"), then the domain.
}

/* Traps and selectively cancels a request. */
if (!isMatching(location.href, DOMAINS))
    document.addEventListener('beforeload', function(event) {
      if (isMatching(event.url, DOMAINS)) event.preventDefault();
    }, true);
