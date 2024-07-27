import {$gridConfig} from "../../store";

export const updateValue = (id, value) => {
  const currentConfig = {...$gridConfig.get()};
  if(currentConfig[id]){
    currentConfig[id] = value;
  } else {
    currentConfig[id] = value;
  }
  $gridConfig.set(currentConfig);
};