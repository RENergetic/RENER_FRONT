
### DOCUMENTATION
- [DOCUMENTATION](#documentation)
- [Description](#description)
- [Examples](#examples)
    - [Lazy content](#lazy-content)
    - [Fixed content](#fixed-content)
- [Properties](#properties)
- [Emit](#emit)
- [PaginationObject](#paginationobject)
<!-- - [Slots](#slots) -->
<!-- - [Methods](#methods) -->
- [Properties](#properties)
- [Emit](#emit)

### Description
Run paginator - requires   `current-rows` or `total-rows`
### Examples

##### Lazy content 
```
<ren-paginator v-model:offset="mOffset" :current-rows="assetList.length" @update="reloadAssets" />
```
##### Fixed content 
```
 <RenPaginator  v-model:offset="mOffset" :total-rows="mDashboards.length" @update="searchAsset" />
``` 

<!-- ### Slots --> 

<!-- ### Methods -->
 


### Properties

currentRows: { default: 0, type: Number },
* `page` *int* - current page
  `0`

* `totalRows` *int* - total number of rows
  `null`

* `currentRows` *int* - current number of rows , used if `totalRows` is not defined
  `0`

* `offset` *int* - row offset
  `0`

* `limit` *int* - rows per page
  `10`  


### Emit
* `update:offset` *int* - on offset change
* `update:page` *int* - on page change
* `update` *PaginationObject* - on pagination state change
* `created` *PaginationObject* - on pagination initialized

### PaginationObject
```
{
	"offset": `int`,
	"limit": `int`,
	"page": `int`
}
```