/*
  An XPCOM component that stops Google from tracking the webpages you go to.

  Copyright 2010-2013 Disconnect, Inc.

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
    'doubleclick.net',
    'feedburner.com',
    'gmodules.com',
    'google-analytics.com',
    // From http://www.google.com/supported_domains.
    'google.com',
    'google.ad',
    'google.ae',
    'google.com.af',
    'google.com.ag',
    'google.com.ai',
    'google.am',
    'google.co.ao',
    'google.com.ar',
    'google.as',
    'google.at',
    'google.com.au',
    'google.az',
    'google.ba',
    'google.com.bd',
    'google.be',
    'google.bf',
    'google.bg',
    'google.com.bh',
    'google.bi',
    'google.bj',
    'google.com.bn',
    'google.com.bo',
    'google.com.br',
    'google.bs',
    'google.co.bw',
    'google.by',
    'google.com.bz',
    'google.ca',
    'google.cat',
    'google.cd',
    'google.cf',
    'google.cg',
    'google.ch',
    'google.ci',
    'google.co.ck',
    'google.cl',
    'google.cm',
    'google.cn',
    'google.com.co',
    'google.co.cr',
    'google.com.cu',
    'google.cv',
    'google.com.cy',
    'google.cz',
    'google.de',
    'google.dj',
    'google.dk',
    'google.dm',
    'google.com.do',
    'google.dz',
    'google.com.ec',
    'google.ee',
    'google.com.eg',
    'google.es',
    'google.com.et',
    'google.fi',
    'google.com.fj',
    'google.fm',
    'google.fr',
    'google.ga',
    'google.ge',
    'google.gg',
    'google.com.gh',
    'google.com.gi',
    'google.gl',
    'google.gm',
    'google.gp',
    'google.gr',
    'google.com.gt',
    'google.gy',
    'google.com.hk',
    'google.hn',
    'google.hr',
    'google.ht',
    'google.hu',
    'google.co.id',
    'google.ie',
    'google.co.il',
    'google.im',
    'google.co.in',
    'google.iq',
    'google.is',
    'google.it',
    'google.je',
    'google.com.jm',
    'google.jo',
    'google.co.jp',
    'google.co.ke',
    'google.com.kh',
    'google.ki',
    'google.kg',
    'google.co.kr',
    'google.com.kw',
    'google.kz',
    'google.la',
    'google.com.lb',
    'google.li',
    'google.lk',
    'google.co.ls',
    'google.lt',
    'google.lu',
    'google.lv',
    'google.com.ly',
    'google.co.ma',
    'google.md',
    'google.me',
    'google.mg',
    'google.mk',
    'google.ml',
    'google.mn',
    'google.ms',
    'google.com.mt',
    'google.mu',
    'google.mv',
    'google.mw',
    'google.com.mx',
    'google.com.my',
    'google.co.mz',
    'google.com.na',
    'google.ne',
    'google.com.nf',
    'google.com.ng',
    'google.com.ni',
    'google.nl',
    'google.no',
    'google.com.np',
    'google.nr',
    'google.nu',
    'google.co.nz',
    'google.com.om',
    'google.com.pa',
    'google.com.pe',
    'google.com.ph',
    'google.com.pk',
    'google.pl',
    'google.pn',
    'google.com.pr',
    'google.ps',
    'google.pt',
    'google.com.py',
    'google.com.qa',
    'google.ro',
    'google.rs',
    'google.ru',
    'google.rw',
    'google.com.sa',
    'google.com.sb',
    'google.sc',
    'google.se',
    'google.com.sg',
    'google.sh',
    'google.si',
    'google.sk',
    'google.com.sl',
    'google.sm',
    'google.sn',
    'google.so',
    'google.st',
    'google.com.sv',
    'google.td',
    'google.tg',
    'google.co.th',
    'google.com.tj',
    'google.tk',
    'google.tl',
    'google.tm',
    'google.tn',
    'google.to',
    'google.com.tr',
    'google.tt',
    'google.com.tw',
    'google.co.tz',
    'google.com.ua',
    'google.co.ug',
    'google.co.uk',
    'google.com.uy',
    'google.co.uz',
    'google.com.vc',
    'google.co.ve',
    'google.vg',
    'google.co.vi',
    'google.com.vn',
    'google.vu',
    'google.ws',
    'google.co.za',
    'google.co.zm',
    'google.co.zw',
    'googleadservices.com',
    'googlesyndication.com',
    'gstatic.com',
    'orkut.com',
    'panoramio.com',
    'picnik.com',
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

    if (context && context.ownerDocument) {
      var html = context.ownerDocument;
      var content = html.defaultView.content;

      if (
        contentType != contentPolicy.TYPE_DOCUMENT && // The MIME type.
            requestOrigin && requestOrigin.asciiHost &&
                !isMatching(requestOrigin.host, domains) && content &&
                    !isMatching(content.top.location.hostname, domains) &&
                        // The whitelist.
                            contentLocation.asciiHost &&
                                isMatching(contentLocation.host, domains)
                                    // The blacklist.
      ) {
        var googleRequestCount = html.googleRequestCount;
        html.googleRequestCount =
            typeof googleRequestCount == 'undefined' ? 1 : ++googleRequestCount;
        var googleUnblocked = content.localStorage.googleUnblocked;
        if (typeof googleUnblocked == 'undefined')
            googleUnblocked = content.localStorage.googleUnblocked = false;
        if (!JSON.parse(googleUnblocked)) result = contentPolicy.REJECT_SERVER;
            // The blocking state.
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
