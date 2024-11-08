'use client';

import { forwardRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import RoleService from "@/services/common/RoleService";
import MenuService from "@/services/common/MenuService";

const MenuRoleTable = ( props, ref ) => {
  const {
    menuId,
    ...rest
  } = props;

  const [roles, setRoles] = useState([]);
  const [selection, setSelection] = useState([]);
  const [selectAll, setSelectAll] = useState(roles?.length === selection?.length);

  const handleCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  }

  const handleChangeSelection = (event) => {
    const value = event.value;
    setSelection(value);
    setSelectAll(value.length === roles.length);
  }

  const handleChangeSelectAll = (event) => {
    const selectAll = event.checked;
    if (selectAll) {
      setSelectAll(true);
      setSelection(roles);
    } else {
      setSelectAll(false);
      setSelection([]);
    }
};

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  const cellEditor = (options) => {
    return textEditor(options);
  };

  useEffect(()=>{
    Promise.all([
      RoleService.getDataList(),
      MenuService.getDataRole({ menuId }),
    ]).then(( results )=>{
      const [roles, menuRoles] = results;
      const selectionRoles = roles?.filter((role)=>(menuRoles.some((menuRole)=>(menuRole.roleId === role.roleId))));
      setRoles(roles);
      if( menuId ){
        setSelection(selectionRoles);
        setSelectAll(roles.length === selectionRoles.length);
      } else {
        setSelection([]);
        setSelectAll(false);
      }
    });
  }, [ menuId ]);

  useEffect(()=>{
    if( ref ){
      ref.current = {
        getRoles: () => ( selection )
      }
    }
  }, [ref, selection]);

  return (
    <div className="menu-role-table">
      <div className="menu-role-table-header flex flex-row">
        <div className="flex justify-content-start col-6">
          <b>접근권한</b>          
        </div>
        <div className="flex justify-content-end col-6">
          {/* <Button label="선택해제" onClick={()=>{ handleChangeSelectAll({ checked: false }) }} /> */}
        </div>
      </div>
      <div className="menu-role-table-content">
        <DataTable
          showGridlines
          scrollable
          scrollHeight="400px" 
          className="w-full h-full"
          value={roles}
          editMode="cell"
          tableStyle={{
            // minHeight: "400px",
          }}
          selection={selection}
          onSelectionChange={handleChangeSelection}
          selectAll={selectAll}
          onSelectAllChange={handleChangeSelectAll}
        >
          <Column
            selectionMode="multiple"
            style={{ width: '3rem' }}
          />
          <Column
            key={"roleId"}
            className="text-center"
            field={"roleId"}
            header={"ROLE ID"}
            style={{ width: '8rem' }}
            // editor={(options) => cellEditor(options)}
            // onCellEditComplete={handleCellEditComplete}
          />
          <Column
            key={"rolename"}
            field={"roleName"}
            header={"ROLE NAME"}
            // style={{ minWidth: '25%' }}
            // editor={(options) => cellEditor(options)}
            // onCellEditComplete={handleCellEditComplete}
          />
        </DataTable>
      </div>
    </div>
  );
}

export default forwardRef(MenuRoleTable);