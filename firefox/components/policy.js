/*
  An XPCOM component that stops Google from tracking the webpages you go to.

  Copyright 2010-2012 Disconnect, Inc.

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

    Gary Teh <garyjob@gmail.com>
    Brian Kennish <byoogle@gmail.com>
*/
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/**
 * Constants.
 */
var contentPolicy = Components.interfaces.nsIContentPolicy;
var accept = contentPolicy.ACCEPT;

/**
 * Creates the component.
 */
function GoogleDisconnect() { this.wrappedJSObject = this; }

/**
 * A content policy that stops Google from tracking the webpages you go to.
 */
GoogleDisconnect.prototype = {
  /**
   * The properties required for XPCOM registration.
   */
  classID: Components.ID('{f5c41390-4b80-43a1-80da-4cf4c3fae81a}'),
  classDescription:
      'A content policy that stops Google from tracking the webpages you go to.',
  contractID: '@disconnect.me/google;1',

  /**
   * The categories to register the component in.
   */
  _xpcom_categories: [{category: 'content-policy'}],

  /**
   * Gets a component interface.
   */
  QueryInterface:
      XPCOMUtils.generateQI([Components.interfaces.nsIContentPolicy]),

  /**
   * The domain names Google phones home with, lowercased.
   */
  domains: [
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
    'voice.google.com',
    'youtube.com'
  ],

  /**
   * Determines whether any of a bucket of domains is part of a host name, regex
   * free.
   */
  isMatching: function(host, domains) {
    var domainCount = domains.length;
    host = host.toLowerCase();
    for (var i = 0; i < domainCount; i++)
        if (host.indexOf(domains[i]) + 1) return true;
  },

  /**
   * Traps and selectively cancels a request.
   */
  shouldLoad: function(contentType, contentLocation, requestOrigin, context) {
    var isMatching = this.isMatching;
    var domains = this.domains;
    var result = accept;

    if (context) {
      var html = context.ownerDocument;
      var content = html.defaultView.content;

      if (
        contentType != contentPolicy.TYPE_DOCUMENT && // The MIME type.
            requestOrigin && requestOrigin.asciiHost &&
                !isMatching(requestOrigin.host, domains) &&
                    !isMatching(content.top.location.hostname, domains) &&
                        // The whitelist.
                            contentLocation.asciiHost &&
                                isMatching(contentLocation.host, domains)
                                    // The blacklist.
      ) {
        var googleRequestCount = html.googleRequestCount;
        html.googleRequestCount =
            typeof googleRequestCount == 'undefined' ? 1 : ++googleRequestCount;
        if (!JSON.parse(content.localStorage.googleUnblocked))
            result = contentPolicy.REJECT_SERVER; // The blocking state.
      }
    }

    return result;
  },

  /**
   * Passes a request through.
   */
  shouldProcess: function() { return accept; }
}

/**
 * The component entry point.
 */
if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([GoogleDisconnect]);
else var NSGetModule = XPCOMUtils.generateNSGetModule([GoogleDisconnect]);
