
### DOCUMENTATION
- [DOCUMENTATION](#documentation)
- [Description](#description)
- [Default properties](#default-properties)
- [List](#list)
  - [RenInput](#reninput)
  - [RenInputText](#reninputtext)
    - [Properties](#properties)
  - [RenPassword](#renpassword)
  - [RenSubmit](#rensubmit)
    - [Properties](#properties-1)
    - [Emits:](#emits)
  - [RenSwitch](#renswitch)
  - [RenInputWrapper](#reninputwrapper)
    - [Slot](#slot)

### Description
Form components wrappers are loaded globally. Their defination are stored in: ```@/components/miscellaneous/form```

### Default properties

Simple input component
* modelValue *object* - input model object, default: `null`
* invalid *bool* - determines if model's value is invalid, default:  `false`
* errors *object* - vuelidate error object, default: `null`
* textLabel *string* - i18n label key, default: `null`
* disabled *bool* - determines if component is disabled, default:  `false` 
 

### List
- [DOCUMENTATION](#documentation)
- [Description](#description)
- [Default properties](#default-properties)
- [List](#list)
  - [RenInput](#reninput)
  - [RenInputText](#reninputtext)
    - [Properties](#properties)
  - [RenPassword](#renpassword)
  - [RenSubmit](#rensubmit)
    - [Properties](#properties-1)
    - [Emits:](#emits)
  - [RenSwitch](#renswitch)
  - [RenInputWrapper](#reninputwrapper)
    - [Slot](#slot)

 
#### RenInput 
Simple input component 

Example:
```
<ren-input  v-model="mUser.firstName" :invalid="v$.mUser.firstName.$invalid" :errors="v$.mUser.firstName.$silentErrors" :text-label="'model.user.firstname'"   />
```

#### RenInputText
Input multiline text area component 

##### Properties 
* maxlength *int* - maximum number of characted, default:  `250`  

Example:
```
<ren-input-text v-model="mModel.description" :text-label="'model.asset.description'" />
```
 

#### RenPassword
Password input component  

Example:
```   
<ren-password v-model="mUser.password" :invalid="v$.mUser.password.$invalid" :errors="v$.mUser.password.$silentErrors" :text-label="'model.user.password'"/>
```


#### RenSubmit
Submit button component

##### Properties 
* cancelButton *boolean* - display cancel button, default:  `false`   
  

##### Emits:
* cancel
* submit

Example:
```
<ren-submit :disabled="v$.$invalid" @submit="submit" />
```
#### RenSwitch
Boolean yes/no component

Example:
```
      <ren-switch v-model="twoDirection" :text-label="'model.asset_connection.bi_directional'" />
```
 


#### RenInputWrapper
Component to wrap custom input form components  
##### Slot 
- content 

Example:
```
  <ren-input-wrapper :text-label="'model.dashboard.unit'">
          <template #content>
            <Dropdown
              id="dasboardUnit"
              v-model="mDashboard.measurement_type"
              :option-label="(opt) => `[${opt.unit}]`"
              :options="mUnits"
              :placeholder="$t('view.select_dashboard_unit')"
            />
          </template>
        </ren-input-wrapper>
```