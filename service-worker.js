"use strict";var precacheConfig=[["/index.html","9f5e829db7c1e60d8f6f4f5b88f3ff67"],["/static/css/main.d26fa38c.css","bd4a246744617b58c5b730387cc408b8"],["/static/js/main.0a770faf.js","ba6e87ca14dbdc65f15144e945586db6"],["/static/media/3.cf91de8d.png","cf91de8d9a7be6e07fbb9cf95382bfab"],["/static/media/4.c607ecb9.png","c607ecb97cebdf2386533fc6763b222c"],["/static/media/5.3db421db.png","3db421db0f94a4de032f2d6a5e021072"],["/static/media/Alethkar.372a5307.jpg","372a5307f149f7be561d8be7bb898924"],["/static/media/Asp.Net-Core.04f8368f.jpg","04f8368f0500b9179332f8e80fee6db9"],["/static/media/Bondsmiths_glyph.6c2c9972.svg","6c2c9972ad6cc45b5195154ff986063c"],["/static/media/Dustbringers_glyph.8a70b48b.svg","8a70b48b0d8b63a7934334e22b4298eb"],["/static/media/EF.3be0207e.png","3be0207e852a253ff781d796cb79292a"],["/static/media/Edgedancers_glyph.88327a00.svg","88327a00e36737308cfe58ee4d669144"],["/static/media/Elsecallers_glyph.aac7aa85.svg","aac7aa85b0d26cfc69c509a4aa8661f3"],["/static/media/Highstorm.b19f22e1.png","b19f22e193d7eb07aa4c7a682cc24ceb"],["/static/media/Highstorm.f5505487.png","f5505487f47455b1b422628c9c1239cf"],["/static/media/JahKeved.41b2a966.jpg","41b2a966fa3112f26acb76d758661613"],["/static/media/Lightwearers_glyph.2a3e513d.svg","2a3e513d1669c173e254c5ce7e47c974"],["/static/media/Location1.3cd72efe.png","3cd72efe60c2dce998dbdac62331000c"],["/static/media/Location2.2256ccd9.png","2256ccd936a2d25edfdb99aa53267338"],["/static/media/Map_roshar.e199b3bf.jpg","e199b3bf2ebd0ec95b38c353eaba6f08"],["/static/media/Map_roshar_small.a059fbe3.jpg","a059fbe3eccc41a7760bfcd95ba5e411"],["/static/media/Plains_exm.2329332b.png","2329332bfb4fc0c571c7683231fe382d"],["/static/media/Plains_exm.99e0dee4.png","99e0dee413a6c8b81811c65ab07939f0"],["/static/media/React.06e73328.svg","06e733283fa43d1dd57738cfc409adbd"],["/static/media/Sas.fec1907b.svg","fec1907b9299d9fc316fba6024f3d7af"],["/static/media/Skybreakers_glyph.218429e0.svg","218429e0472bd01738ad6c57d450f583"],["/static/media/Stonewards_glyph.cd263ab7.svg","cd263ab7be47b5af1f455d8f2109fda4"],["/static/media/Surgebinders.a4d3cf2b.jpg","a4d3cf2b3823cbd0ed4c39f23a955519"],["/static/media/TravelBGR2.9b92f2b2.png","9b92f2b220b3e265ee5796b184fa8813"],["/static/media/Truthwatchers_glyph.6d190273.svg","6d190273ccacb973fd5ddb8ef4329eb5"],["/static/media/Willshapers_glyph.7cef707f.svg","7cef707fb9c8d0b6ef05c2fb201be56e"],["/static/media/Windrunners_glyph.8554760c.svg","8554760cbc43b91e079645f3e46f04af"],["/static/media/account_1.d97a813d.png","d97a813da051ae672b6971687b2a3b17"],["/static/media/account_2.d9e738be.png","d9e738beb314eeff2001f2bffb56c6c6"],["/static/media/account_3.a45ec3b3.png","a45ec3b33ce60692a26f6918a2659aa4"],["/static/media/ardent2.96cba8cf.jpg","96cba8cf94e719c71acde9ef9c61429c"],["/static/media/armour.2ad2e3f3.svg","2ad2e3f34ea63e42fe9312dab972843d"],["/static/media/attack.e7eb17ed.svg","e7eb17edb4d1ea142642cbdc7101edd7"],["/static/media/back.115b5fb5.svg","115b5fb5661ef710b7feef3eeb2233f3"],["/static/media/background.373e08c7.jpg","373e08c7c06335cfcbfd165bf57b1b86"],["/static/media/backpack.09359a55.svg","09359a553b57172f633e23168a6269b7"],["/static/media/bracelet.938b6313.svg","938b63131b51e30ebbc7851da308a4a7"],["/static/media/camping.206f6f23.svg","206f6f236207d04d089705532b0d396f"],["/static/media/cog.f794cec9.svg","f794cec9b31e27eb93eb522dac964b0e"],["/static/media/construction.f74743ec.svg","f74743ecf6f1ba62d792f8c690ed19d9"],["/static/media/css3_logo.faae11a6.png","faae11a6b87547339411b40ac228d4d7"],["/static/media/defense.f5865c20.svg","f5865c20f8d61e63066964aaa4f8e82c"],["/static/media/drop.fe8a3476.svg","fe8a34761dd4857ecbbc34582f69f68b"],["/static/media/equipment_1.3e46f6a8.png","3e46f6a85402719d14230d4c5b5bcec7"],["/static/media/equipment_2.4140c9f9.png","4140c9f9127b9162aef313736762d593"],["/static/media/equipment_3.58bae684.png","58bae684a2d9f51105ae565c9ae83240"],["/static/media/from-to.ee75e51c.svg","ee75e51c4f8152ea01b3c9c71d28ada4"],["/static/media/gem0.9f19664f.svg","9f19664f9b4594d879a7f15346696b6e"],["/static/media/gem1.d02e1a98.svg","d02e1a98bfc046872e4437285847257d"],["/static/media/gem2.edb0a594.svg","edb0a59480270eb35ef77fece7f72dbf"],["/static/media/gems.dbca2df5.jpg","dbca2df5438fd266cc8a3be277294be6"],["/static/media/gems.deac13c1.jpg","deac13c1579f912e95e8883053d3acc7"],["/static/media/gloves.41d783b5.svg","41d783b588bf9dd27ccf85a5db9046ff"],["/static/media/health.94447f45.svg","94447f455dc6ed737187c37460e36c3f"],["/static/media/helmet.6ede10cd.svg","6ede10cd50594aab57c25912108b8e98"],["/static/media/location.3cded898.svg","3cded89889caf606bf64b080a0b2a8c4"],["/static/media/map.f7f1f74a.svg","f7f1f74a4b3f17ae7d9cec24277cc5ef"],["/static/media/map_1.3327d166.png","3327d166e4a29d5d246f44b061962fa5"],["/static/media/map_2.6e205c09.png","6e205c09c2231b9244586b95574c4ebb"],["/static/media/map_3.cdee5abb.png","cdee5abb12020a7ba8dbfa3a15fb891b"],["/static/media/map_4.5290cf80.png","5290cf80441d289b118da31b6b9116f6"],["/static/media/mental.b5bcc30e.svg","b5bcc30eaba292d66b7cb9789e56c47b"],["/static/media/mssql.b25bae44.png","b25bae44ff516c7dcc3eacdb14d2c499"],["/static/media/mystery.c16feca0.svg","c16feca03fb522981a990927f6b3a09b"],["/static/media/necklace.f965c092.svg","f965c09200b7618fcda7f93e009f7066"],["/static/media/noble.abf80b02.png","abf80b025e64ae78e230dcade0013a64"],["/static/media/parshendi.6ae613a6.jpg","6ae613a6cf4aa5a4df379b45ad2c4a15"],["/static/media/phaser.b887c333.png","b887c333d5ec8274b78d0851e7b3337b"],["/static/media/physical.693384e5.svg","693384e572b72bb70bc04cf4949f30de"],["/static/media/plains.be496543.svg","be49654383cc5100846bbb3e70305b99"],["/static/media/presentation.fce632ec.svg","fce632ec05c80eead3bd77289f20390e"],["/static/media/quest.4107444e.svg","4107444e57d63b4a695a0b761409f73f"],["/static/media/react-router.6476ea98.svg","6476ea98a4b4d2d05f730db402a62ea1"],["/static/media/redux.b51d1861.png","b51d1861e7fe5782d20d5455c7c9f1f4"],["/static/media/rings.62855b21.svg","62855b21bc84f8d03f07ff016d5bfa86"],["/static/media/roadsign.46daea2c.svg","46daea2cd350b83889acefe2adbb576f"],["/static/media/sanderson.73bcf95a.png","73bcf95a283163b5486df700339b961d"],["/static/media/sanderson.9189303e.png","9189303ea54667b4ee78f5832773bad3"],["/static/media/shardblade.d1ef6051.jpg","d1ef6051a75e605f25f55b4ae6c24ec7"],["/static/media/shardplate.ab6bc3c1.jpg","ab6bc3c119c7a4569008b727c9cc0621"],["/static/media/shash.2e8fc39d.png","2e8fc39de9e0b6a271e12c14dae5ee8b"],["/static/media/shash_white.374012b6.png","374012b65b5fa601c32a0ddf5fd2c677"],["/static/media/shatteredplains.1af2a07c.jpg","1af2a07c1199054f3ccd53eb5c0729fe"],["/static/media/shield.29cb491a.svg","29cb491ae3f52a7473ba8c3b640dea20"],["/static/media/shoe.3a6e5787.svg","3a6e57878a3679bda51ca3ab486e054c"],["/static/media/skills.7f43d5b8.svg","7f43d5b8bb9f7f0488bd0426a67c5e99"],["/static/media/slave.2f40b9de.png","2f40b9def25ba9cfc8d712cea581e0bf"],["/static/media/sprens.2b80d1ea.jpg","2b80d1eab5fce4fab5154bd1d06cb2fb"],["/static/media/stall.b4aaad05.svg","b4aaad05302bf63ce58d315b34c1e501"],["/static/media/stormlight.27fa1c06.jpg","27fa1c06ec18bdcad07db7657435b741"],["/static/media/stormlight.499f7caf.jpg","499f7caf2260fa7b120b90d3101c09c9"],["/static/media/stormlight.5667b0dc.svg","5667b0dc4952d382f35f6ae74ec26fbc"],["/static/media/swordman.824da2ae.png","824da2ae82f7ad4942ec55d9431c1ba6"],["/static/media/target.4ec55a8c.svg","4ec55a8c81faaed81ead0d2d4d7af2f5"],["/static/media/travel.169164fa.svg","169164fa8d62201a9ea109add9757fc3"],["/static/media/travel.a96cc57c.png","a96cc57cfd49108613662dcdb0fdfdc8"],["/static/media/travelling-warrior-jay.55811e8e.jpg","55811e8eccb99128654883eae7cc4041"],["/static/media/trousers.6353049a.svg","6353049ab938069a668b00b508020495"],["/static/media/ts.26cc95f2.png","26cc95f255ccb936d154b43614f61602"],["/static/media/warrior.293338fd.png","293338fd08b1b2d8dfb7e44efd308601"],["/static/media/webdesign.903ad000.jpg","903ad0006edf819f31c5fa03c12dac30"],["/static/media/webpack.c500a380.png","c500a3801d8356a86da86a06c3d13a4d"],["/static/media/whoissanderson.6a76e8a9.jpg","6a76e8a96bc85fb92631bb3212afec23"],["/static/media/whoissanderson.dc1ebe8d.jpg","dc1ebe8d6cbe45c320a4f4fcc469b05f"],["/static/media/windrunners.bd6ab042.jpg","bd6ab042492ad014c9cb693abdb92bb8"],["/static/media/woman_warrior.35b497af.png","35b497af13b6ae92fa5c6c4e495be040"],["/static/media/world.a2448f1e.svg","a2448f1e44ef7de093e6cb2f1ca7f89d"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var c=new URL(e);return"/"===c.pathname.slice(-1)&&(c.pathname+=a),c.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,c,t){var d=new URL(e);return t&&d.pathname.match(t)||(d.search+=(d.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(c)),d.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var c=new URL(a).pathname;return e.some(function(e){return c.match(e)})},stripIgnoredUrlParameters=function(e,c){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return c.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],c=e[1],t=new URL(a,self.location),d=createCacheKey(t,hashParamName,c,/\.\w{8}\./);return[t.toString(),d]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(t){return setOfCachedUrls(t).then(function(c){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!c.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return t.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var c=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!c.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,c=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),t="index.html";(e=urlsToCacheKeys.has(c))||(c=addDirectoryIndex(c,t),e=urlsToCacheKeys.has(c));var d="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(c=new URL(d,self.location).toString(),e=urlsToCacheKeys.has(c)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(c)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});