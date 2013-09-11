# Loconot

Ideas:
- Add a simple annotation to a current address.
- Add a simple annotation to any address.

Design:
- Backend (API Restfull)  RoR ou bien microframework:
Sinatra (Restful gem "Grape") ou bien "rabbit".
Setup a Facebook and Twitter oauth.
- FrontEnd Backbone.js. Add Maps V3 js api.
- Titanium or phonegap portage.

Token Facebook contre une cle api:


## @TODO:

- Use requirejs async plugin to load gmaps
- Choose between addBox Bacbone View ou just std DOM elt? => Backbone View Definitly!
- On right click on a place: display a new addBox and resolve address
- Remove tmp and use View object to store results
- Keep a simple Windows box on Marker on map @ la tooltip


Client full stateless. Client s'authentifie auprès de Twitter. Renvoie access_token.
Cookie passenger mode Apache pour hoster l'api sur un sous domaine et ainsi ne pas s'embeter



@todo
lintjs

Why listenTO? Unbind event on destroy view ?
Utiliser listenTO seulement sur un autre object SINON this.on(ev,callback)

Revoir le pattern singleton: new app.user ...
