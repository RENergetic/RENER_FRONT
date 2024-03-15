
## Source path
```src/plugins/model```

### Information panel
* tile layout  (position in the grid) -  json , w -column span (12 max) , h - row span (12 max), x,y -  column ,row offset, example : ```{"w":1,"h":1,"x":3,"y":5}```
  
* tile props -  key-value dictionary of properties: 
	* "icon":str -default: true,  css class from https://www.primefaces.org/primevue/icons,https://fontawesome.com/search?q=open&o=r
	* "icon_visibility": bool -  default: true,
	* "legend":bool -  default: true, (false - hide legend on chart)
	* "title_visibility" :bool -  default: true,
	* "background": str  -  default: null, css background of a tile 
	* "mask": str  -  default: null, background hex color of tile content 
	* "template": bool -  default: false, determines if tile is a template. Possible values: [energy_island_production,energy_island_import]
 
	* fontSize -> TODO?
 
 
 
 






