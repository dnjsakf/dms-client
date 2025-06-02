import {
  getFetch,
} from '@/utils/api';

const API_FREFIX = '/mb';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/list`, params);
  const rows = (result?.data || []);
  rows.filterRune = filterRune;
  return rows.filterRune();
}

const filterRune = function(filter=""){
  const dataJson = this;
  const retval = {}

  const filters = filter.split(",").map((item)=>(item.split('=')));
  dataJson
    .filter((rune)=>{
      let filtered = [];
      for(let i = 0; i < filters.length; i++){
        const filterField = filters[i][0];
        const filterValue = filters[i][1];
        let filtering = rune[filterField] === filterValue;
        if( filterField === 'classId' && !filtering ){
          filtering = rune[filterField] === "공용";
        }
        filtered.push(filtering);
      }
      return filtered.filter((filter)=>(filter)).length >= filters.length;
    })
    .forEach((rune)=>{
      if( !retval[rune.runeSlot] ){
        retval[rune.runeSlot] = [];
      }
      retval[rune.runeSlot].push(rune);
    });
  return retval;
}

const MobinogiService = {
  getDataList,
}

export default MobinogiService;
