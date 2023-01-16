
### DOCUMENTATION
- [DOCUMENTATION](#documentation)
- [Description](#description)
- [Examples](#examples)
    - [Without content](#without-content)
    - [With content](#with-content)
- [Slots](#slots)
- [Methods](#methods)
- [Properties](#properties)

### Description
Run spinner in the VUE component if it's counter != 0

### Examples

##### Without content
```
<RenSpinner ref="spinner1"></RenSpinner>
```
##### With content
template:
```
<RenSpinner ref="spinner" :lock="true">
    <template #content>
    <Card>
        <template #title> {{ $t("view.information_panel_list") }} </template>
        <template #content><DataTable :value="itemList"></DataTable></template>
    </Card>
    </template>
</RenSpinner>
```
component:
```
//wrap multiple methods in same spinner - spinner will stop after all tasks are finished
this.$refs.spinner.run(async () => {
    await this.loadData.then((data) => { this.data = data; });
});

this.$refs.spinner.run(async () => {
    await this.loadData1.then((data) => { this.data = data; });
});

this.$refs.spinner.run(async () => {
    await this.loadData2.then((data) => { this.data = data; });
});
```
or
```
this.$refs.spinner.start();
await this.loadData.then((data) => {this.data = data; });
});
this.$refs.spinner.stop();
```


### Slots

* content

### Methods

* start():*void*  - Start spinner (increase spinner counter)
* stop():*void*  - Stop spinner (decrease spinner counter)
* run(method:*asyncFunc*):*void* - wrap time consuming method in the spinner


### Properties

* lock *bool* - hide component behind transparent background
  `null`
* inputClass *string* - style class of the spinner component.
  `null`