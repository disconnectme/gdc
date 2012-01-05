/*
  An overlay script that stops Google from tracking the webpages you go to.

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



if (typeof Ggdc == "undefined") {  

  var Ggdc = {
	  
	/* The inclusion of the jQuery library*/
	jQuery : jQuery.noConflict(),
	  
	/*
	  Determines whether any of a bucket of domains is part of a URL, regex free.
	*/
	isMatching: function(url, domains) {
	  const DOMAIN_COUNT = domains.length;
	  for (var i = 0; i < DOMAIN_COUNT; i++)
		  if (url.toLowerCase().indexOf(domains[i], 2) >= 2) return true;
			  // A valid URL has at least two characters ("//"), then the domain.
	},
	
	/* updates the menu icon with the number of blocks */
	updateCount: function(){

		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);		
				
		//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount);
		if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount == "undefined"){
			mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount= 0;
		}
		
		if(	mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount > 0 ){
			Ggdc.jQuery("#GgdcBlockingIcon").attr("src", "chrome://ggdc/content/google-blocked.png" );
		}
		else{
			Ggdc.jQuery("#GgdcBlockingIcon").attr("src", "chrome://ggdc/content/google-activated.png" );			
		}
		
		if(window.content.localStorage.getItem('GgdcStatus')=="unblock"){
			Ggdc.jQuery("#GgdcBlock").attr("value","Block");			
			Ggdc.jQuery("#GgdcUnblock").attr("value",mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount+" unblocked");						
		}
		else{
			Ggdc.jQuery("#GgdcBlock").attr("value",mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount+" blocked");			
			Ggdc.jQuery("#GgdcUnblock").attr("value","Unblock");						
		}		


	},
	
	/* show Xpcom status */
	showXpcom: function(){
		var myComponent = Cc['@disconnect.me/ggdc/contentpolicy;1'].getService().wrappedJSObject;;
    	alert(myComponent.showStatus()); 		

		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
		alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount);
	},

	/* Lifts international trade embargo on Facebook */
	unblock: function(){

		if(window.content.localStorage.getItem('GgdcStatus')=="unblock"){		
			return;
		}
		window.content.localStorage.setItem('GgdcStatus', "unblock");	
		window.content.location.reload();

	},
	
	/* Enforce international trade embargo on Facebook */
	block: function(){
		if(window.content.localStorage.getItem('GgdcStatus')!="unblock"){		
			return;
		}		
		window.content.localStorage.setItem('GgdcStatus', "block");	
		window.content.location.reload();		
	},
	
	/* Switches the image displayed by the Url Bar icon */
	iconAnimation : function(){

		Ggdc.jQuery("#ggdc-image-urlbar").mouseover(function(){												 
			Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar.png");
		});	
		Ggdc.jQuery("#ggdc-image-urlbar").mouseout(function(){
			if(window.content.localStorage.getItem('GgdcStatus')=="unblock"){
				Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_inactive.png");								
			}
			else{
				Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_active.png");
			}
		});			

		if(window.content.localStorage.getItem('GgdcStatus')=="unblock"){
			Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_inactive.png");								
		}
		else{
			Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_active.png");
		}
		
		
	},
	
	/* Initialization */	  
    init : function() {  

		/* handles the url bar icon animation */
		Ggdc.iconAnimation();	

		if(gBrowser){
			gBrowser.addEventListener("DOMContentLoaded", Ggdc.onPageLoad, false);  
			gBrowser.tabContainer.addEventListener("TabAttrModified", Ggdc.onTabChanged, false);  		
		}
	},
	
	/* called when another tab is clicked */
	onTabChanged: function(aEvent){
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
						   
		//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.DcGgdcCount);
		
		if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount == "undefined"){
			mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount = 0;			
			Ggdc.jQuery("#ggdc-image-urlbar").hide();			
		}
		else if(mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount == 0){
			Ggdc.jQuery("#ggdc-image-urlbar").hide();			
		}
		else{
			Ggdc.jQuery("#ggdc-image-urlbar").show();						
		}
		if(window.content.localStorage.getItem('GgdcStatus')=="unblock"){
			Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_inactive.png");								

		}
		else{
			Ggdc.jQuery("#ggdc-image-urlbar").attr("src", "chrome://ggdc/content/icon_urlbar_active.png");
		}		
		
	},
	
	/* called when page is loaded */	
    onPageLoad: function(aEvent) {  
        //var doc = aEvent.originalTarget; // doc is document that triggered the event  
        //var win = doc.defaultView; // win is the window for the doc  
        // test desired conditions and do something  
        // if (doc.nodeName == "#document") return; // only documents  
        // if (win != win.top) return; //only top window.  
        // if (win.frameElement) return; // skip iframes/frames  
        //alert("Number of Facebook Widgets : " +doc.DcGgdcCount); 
		
		window.setTimeout(function() {
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
							   
			if(typeof mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount == "undefined"){
				mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount = 0;			
				Ggdc.jQuery("#ggdc-image-urlbar").hide();			
			}
			else if(mainWindow.getBrowser().selectedBrowser.contentWindow.document.GgdcCount == 0){
				Ggdc.jQuery("#ggdc-image-urlbar").hide();			
			}
			else{
				Ggdc.jQuery("#ggdc-image-urlbar").show();						
			}

		}, 500);
    },
	
	/* Returns all attributes in any javascript/DOM Object in a string */
	getAllAttrInObj: function(obj){
		status = "";	
		status += "<p>";
		Ggdc.jQuery.each(obj , function(name, value) {
			status += name + ": " + value+"<br>";
		});	
		status += "</p>";	
		return status;
	},	
	
	
  }
}

/* Initialization of Ggdc object on load */
window.addEventListener("load", function() { Ggdc.init(); }, false);  
