'use strict';
(function(a,b){'object'==typeof exports&&'object'==typeof module?module.exports=b(require('clientnode'),require('internationalisation'),require('jQuery-scrollTo'),require('spin.js')):'function'==typeof define&&define.amd?define('website-utilities',['clientnode','internationalisation','$.fn.scrollTo','spin.js'],b):'object'==typeof exports?exports['website-utilities']=b(require('clientnode'),require('internationalisation'),require('jQuery-scrollTo'),require('spin.js')):a['website-utilities']=b(a.clientnode,a.internationalisation,a['$.fn.scrollTo'],a['spin.js'])})('undefined'==typeof self?this:self,function(a,b,c,d){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)}([function(a,b,c){c(1),a.exports=c(2)},function(){},function(a,b,c){'use strict';function d(a){return function(){var b=a.apply(this,arguments);return new Promise(function(a,c){function d(e,f){try{var g=b[e](f),h=g.value}catch(a){return void c(a)}return g.done?void a(h):Promise.resolve(h).then(function(a){d('next',a)},function(a){d('throw',a)})}return d('next')})}}function e(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function f(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function g(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}b.__esModule=!0,b.Website=b.$=void 0;var h=c(3),i=c(4),j=function(a){return a&&a.__esModule?a:{default:a}}(i);c(5);var k=c(6),l=b.$=h.$,m=b.Website=function(a){function b(){return e(this,b),f(this,a.apply(this,arguments))}return g(b,a),b.prototype.initialize=function(){var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},d=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{activateLanguageSupport:!0,additionalPageLoadingTimeInMilliseconds:0,domain:'auto',domNode:{mediaQueryIndicator:'<div class="media-query-indicator">',top:'header',scrollToTopButton:'a[href="#top"]',startUpAnimationClassPrefix:'.website-start-up-animation-number-',windowLoadingCover:'.website-window-loading-cover',windowLoadingSpinner:'.website-window-loading-cover > div'},domNodeSelectorPrefix:'body.{1}',knownScrollEventNames:'scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove',language:{},mediaQueryClassNameIndicator:[['extraSmall','xs'],['small','sm'],['medium','md'],['large','lg']],onViewportMovesToTop:b.noop,onViewportMovesAwayFromTop:b.noop,onChangeToLargeMode:b.noop,onChangeToMediumMode:b.noop,onChangeToSmallMode:b.noop,onChangeToExtraSmallMode:b.noop,onChangeMediaQueryMode:b.noop,onSwitchSection:b.noop,onStartUpAnimationComplete:b.noop,startUpAnimationElementDelayInMiliseconds:100,startUpShowAnimation:[{opacity:1},{}],startUpHide:{opacity:0},switchToManualScrollingIndicator:function(a){return 0<a.which||'mousedown'===a.type||'mousewheel'===a.type||'touchmove'===a.type},scrollToTop:{inLinearTime:!1,options:{duration:'normal'},button:{slideDistanceInPixel:30,showAnimation:{duration:'normal'},hideAnimation:{duration:'normal'}}},trackingCode:null,windowLoadingCoverHideAnimation:[{opacity:0},{}],windowLoadingSpinner:{lines:9,length:23,width:11,radius:40,scale:1,corners:1,rotate:0,color:'#000',fadeColor:'transparent',opacity:.2,speed:1.1,direction:1,trail:58,shadow:!1,hwaccel:!1,className:'spinner',zIndex:2e9,top:'auto',left:'auto',position:'absolute'},windowLoadedTimeoutAfterDocumentLoadedInMilliseconds:2e3},e=2<arguments.length&&void 0!==arguments[2]&&arguments[2],f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null,g=4<arguments.length&&void 0!==arguments[4]&&arguments[4],h=5<arguments.length&&void 0!==arguments[5]?arguments[5]:'',i=this,j=6<arguments.length&&void 0!==arguments[6]?arguments[6]:null,m=7<arguments.length&&void 0!==arguments[7]?arguments[7]:{initial:'\n                (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new window.Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');window.ga(\'create\', \'{1}\', \'{2}\');\n                window.ga(\'set\', \'anonymizeIp\', true);\n                window.ga(\'send\', \'pageview\', {page: \'{3}\'});\n            ',sectionSwitch:'window.ga(\'send\', \'pageview\', {page: \'{1}\'});',event:'window.ga(\n                \'send\', \'event\', eventCategory, eventAction, eventLabel,\n                eventValue, eventData);\n            '};return this._parentOptions=d,this.startUpAnimationIsComplete=e,this.viewportIsOnTop=g,this.currentMediaQueryMode=h,this.languageHandler=j,this._analyticsCode=m,f?this.currentSectionName=f:'location'in l.global&&l.global.location.hash?this.currentSectionName=l.global.location.hash.substring(1):this.currenSectionName='home',this._onViewportMovesToTop=this.constructor.debounce(this._onViewportMovesToTop.bind(this)),this._onViewportMovesAwayFromTop=this.constructor.debounce(this._onViewportMovesAwayFromTop.bind(this)),this._options=this.constructor.extendObject(!0,{},this._parentOptions,this._options),a.prototype.initialize.call(this,c),this.$domNodes=this.grabDomNode(this._options.domNode),this.disableScrolling(),new Promise(function(a){if(i._options.windowLoadingCoverHideAnimation[1].always=function(){i._handleStartUpEffects(),a(i)},i.$domNodes.windowLoadingSpinner.length&&(i.windowLoadingSpinner=new k.Spinner(i._options.windowLoadingSpinner),i.windowLoadingSpinner.spin(i.$domNodes.windowLoadingSpinner[0])),i._bindScrollEvents().$domNodes.parent.show(),'window'in i.$domNodes){var b=function(){i.windowLoaded||(i.windowLoaded=!0,i._removeLoadingCover())};l(function(){return i.constructor.timeout(b,i._options.windowLoadedTimeoutAfterDocumentLoadedInMilliseconds)}),i.on(i.$domNodes.window,'load',b)}i._addNavigationEvents()._addMediaQueryChangeEvents()._triggerWindowResizeEvents()._handleAnalyticsInitialisation(),i._options.language.logging||(i._options.language.logging=i._options.logging),i._options.activateLanguageSupport&&!i.languageHandler&&l.Language(i._options.language).then(function(a){i.languageHandler=a})})},b.prototype.scrollToTop=function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:b.noop;if(!('document'in l.global))return this;if(this._options.scrollToTop.options.onAfter=a,Object.defineProperty(l.global.document,'body',{value:l('body')[0]}),this._options.scrollToTop.inLinearTime){var c=this.$domNodes.window.scrollTop();this._options.scrollToTop.options.duration=c/4,this.$domNodes.window.scrollTo({top:'-='+c,left:'+=0'},this._options.scrollToTop.options)}else this.$domNodes.window.scrollTo({top:0,left:0},this._options.scrollToTop.options);return this},b.prototype.disableScrolling=function(){return this.$domNodes.parent.addClass('disable-scrolling').on('touchmove',function(a){return a.preventDefault()}),this},b.prototype.enableScrolling=function(){return this.off(this.$domNodes.parent.removeClass('disable-scrolling','touchmove')),this},b.prototype.triggerAnalyticsEvent=function(){if(this._options.trackingCode&&'location'in l.global&&'localhost'!==l.global.location.hostname){this.debug('Run analytics code: "#{this._analyticsCode.event}" with arguments:');for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];this.debug(b);try{var d;(d=new Function('eventCategory','eventAction','eventLabel','eventData','eventValue',this._analyticsCode.event)).call.apply(d,[this].concat(b))}catch(a){this.warn('Problem in google analytics event code snippet: {1}',a)}}return this},b.prototype._onViewportMovesToTop=function(){var a=this;return'hidden'===this.$domNodes.scrollToTopButton.css('visibility')?this.$domNodes.scrollToTopButton.css('opacity',0):(this._options.scrollToTop.button.hideAnimation.always=function(){return a.$domNodes.scrollToTopButton.css({bottom:'-='+a._options.scrollToTop.button.slideDistanceInPixel,display:'none'})},this.$domNodes.scrollToTopButton.finish().animate({bottom:'+='+this._options.scrollToTop.button.slideDistanceInPixel,opacity:0},this._options.scrollToTop.button.hideAnimation)),this},b.prototype._onViewportMovesAwayFromTop=function(){return'hidden'===this.$domNodes.scrollToTopButton.css('visibility')?this.$domNodes.scrollToTopButton.css('opacity',1):this.$domNodes.scrollToTopButton.finish().css({bottom:'+='+this._options.scrollToTop.button.slideDistanceInPixel,display:'block',opacity:0}).animate({bottom:'-='+this._options.scrollToTop.button.slideDistanceInPixel,queue:!1,opacity:1},this._options.scrollToTop.button.showAnimation),this},b.prototype._onChangeMediaQueryMode=function(){return this},b.prototype._onChangeToLargeMode=function(){return this},b.prototype._onChangeToMediumMode=function(){return this},b.prototype._onChangeToSmallMode=function(){return this},b.prototype._onChangeToExtraSmallMode=function(){return this},b.prototype._onSwitchSection=function(a){if(this._options.trackingCode&&'__none__'!==this._options.trackingCode&&'location'in l.global&&'localhost'!==l.global.location.hostname&&this.currentSectionName!==a){this.currentSectionName=a,this.debug('Run analytics code: "'+this._analyticsCode.sectionSwitch+'"',this.currentSectionName);try{new Function(this.constructor.stringFormat(this._analyticsCode.sectionSwitch,this.currentSectionName))()}catch(a){this.warn('Problem in analytics section switch code snippet: {1}',a)}}return this},b.prototype._onStartUpAnimationComplete=function(){return this.startUpAnimationIsComplete=!0,this},b.prototype._addMediaQueryChangeEvents=function(){return this.on(this.$domNodes.window,'resize',this._triggerWindowResizeEvents.bind(this)),this},b.prototype._triggerWindowResizeEvents=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];for(var d=this._options.mediaQueryClassNameIndicator,e=Array.isArray(d),f=0,d=e?d:d[Symbol.iterator]();;){var g;if(e){if(f>=d.length)break;g=d[f++]}else{if(f=d.next(),f.done)break;g=f.value}var h=g;this.$domNodes.mediaQueryIndicator.prependTo(this.$domNodes.parent).addClass('hidden-'+h[1]),this.$domNodes.mediaQueryIndicator.is(':hidden')&&h[0]!==this.currentMediaQueryMode&&(this.fireEvent.apply(this,['changeMediaQueryMode',!1,this,this.currentMediaQueryMode,h[0]].concat(b)),this.fireEvent.apply(this,[this.constructor.stringFormat('changeTo{1}Mode',this.constructor.stringCapitalize(h[0])),!1,this,this.currentMediaQueryMode,h[0]].concat(b)),this.currentMediaQueryMode=h[0]),this.$domNodes.mediaQueryIndicator.removeClass('hidden-'+h[1])}return this},b.prototype._bindScrollEvents=function(){for(var a=this,b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];if(!('window'in this.$domNodes))return this;var e=l('body, html').add(this.$domNodes.window);return e.on(this._options.knownScrollEventNames,function(b){a._options.switchToManualScrollingIndicator(b)&&e.stop(!0)}),this.on(this.$domNodes.window,'scroll',function(){a.$domNodes.window.scrollTop()?a.viewportIsOnTop&&(a.viewportIsOnTop=!1,a.fireEvent.apply(a,['viewportMovesAwayFromTop',!1,a].concat(c))):!a.viewportIsOnTop&&(a.viewportIsOnTop=!0,a.fireEvent.apply(a,['viewportMovesToTop',!1,a].concat(c)))}),this.$domNodes.window.scrollTop()?(this.viewportIsOnTop=!1,this.fireEvent.apply(this,['viewportMovesAwayFromTop',!1,this].concat(c))):(this.viewportIsOnTop=!0,this.fireEvent.apply(this,['viewportMovesToTop',!1,this].concat(c))),this},b.prototype._removeLoadingCover=function(){var a=d(regeneratorRuntime.mark(function a(){var b;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,this.constructor.timeout(this._options.additionalPageLoadingTimeInMilliseconds);case 2:return l(this.constructor.stringFormat('[class^="{1}"], [class*=" {1}"]',this.sliceDomNodeSelectorPrefix(this._options.domNode.startUpAnimationClassPrefix).substr(1))).css(this._options.startUpHide),this.$domNodes.windowLoadingCover.length?(b=this.enableScrolling().$domNodes.windowLoadingCover).animate.apply(b,this._options.windowLoadingCoverHideAnimation):this._options.windowLoadingCoverHideAnimation[1].always(),a.abrupt('return',this);case 5:case'end':return a.stop();}},a,this)}));return function(){return a.apply(this,arguments)}}(),b.prototype._handleStartUpEffects=function(){var a=d(regeneratorRuntime.mark(function a(){var b,c,d=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(this.$domNodes.windowLoadingCover.hide(),this.$domNodes.windowLoadingSpinner.length&&this.windowLoadingSpinner.stop(),!l(this.constructor.stringFormat('[class^="{1}"], [class*=" {1}"]',this.sliceDomNodeSelectorPrefix(this._options.domNode.startUpAnimationClassPrefix).substr(1))).length){a.next=17;break}return a.next=5,this.constructor.timeout(this._options.startUpAnimationElementDelayInMiliseconds);case 5:if(b=!1,this._options.startUpShowAnimation[1].always=function(){b&&d.fireEvent('startUpAnimationComplete')},c=l(this._options.domNode.startUpAnimationClassPrefix+e),c.animate.apply(c,this._options.startUpShowAnimation),!l(this._options.domNode.startUpAnimationClassPrefix+(e+1)).length){a.next=14;break}return a.next=12,this._handleStartUpEffects(e+1);case 12:a.next=15;break;case 14:b=!0;case 15:a.next=18;break;case 17:this.fireEvent('startUpAnimationComplete');case 18:return a.abrupt('return',this);case 19:case'end':return a.stop();}},a,this)}));return function(){return a.apply(this,arguments)}}(),b.prototype._addNavigationEvents=function(){var a=this;return'addEventListener'in l.global&&l.global.addEventListener('hashchange',function(){a.startUpAnimationIsComplete&&a.fireEvent('switchSection',!1,a,location.hash.substring(1))},!1),this._handleScrollToTopButton()},b.prototype._handleScrollToTopButton=function(){var a=this;return this.on(this.$domNodes.scrollToTopButton,'click',function(b){b.preventDefault(),a.scrollToTop()}),this},b.prototype._handleAnalyticsInitialisation=function(){var a=this;if(this._options.trackingCode&&'__none__'!==this._options.trackingCode&&'location'in l.global&&'localhost'!==l.global.location.hostname){this.debug('Run analytics code: "'+this._analyticsCode.initial+'"',this._options.trackingCode,this._options.domain,this.currentSectionName);try{new Function(this.constructor.stringFormat(this._analyticsCode.initial,this._options.trackingCode,this._options.domain,this.currentSectionName))()}catch(a){this.warn('Problem in analytics initial code snippet: {1}',a)}this.on(this.$domNodes.parent.find('a, button'),'click',function(b){var c=l(b.target);a.triggerAnalyticsEvent(a.currentSectionName,'click',c.text(),b.data||{},c.attr('website-analytics-value')||1)})}return this},b}(l.Tools.class);m._name='Website',b.default=m,l.Website=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return l.Tools().controller(m,b)},l.Website.class=m},function(b){b.exports=a},function(a){a.exports=b},function(a){a.exports=c},function(a){a.exports=d}])});