import Condition from "../Component/MainPage/Condition";
import ComponentList from "../Component/MainPage/ComponentList";
import Graphtest from "../Pages/Graphtest";
import react, { useState } from "react";

const Mainpage = () => {
  const [moduleChild, setModuleChild] = useState([]);
  const [selectComponentData, setSelectComponentData] = useState([]); // ComponentList에서 선택한 컴포넌트(name, value) 들고옴
  const [selectedMachineName, setSelectedMachineName] = useState();
  const [selectedModuleName, setSelectedModuleName] = useState();

  //  console.log(moduleChild)
  // console.log(selectComponentData);
  // console.log(selectedMachineName);
  // console.log(selectedModuleName);

  return (
    <div>
      <Condition
        setModuleChild={setModuleChild}
        setSelectedMachineName={setSelectedMachineName}
        setSelectedModuleName={setSelectedModuleName}
      />
      <ComponentList
        child={moduleChild}
        setSelectComponentData={setSelectComponentData}
      />
      <Graphtest
        selectedcompoData={selectComponentData}
        selectedMachineName={selectedMachineName}
        selectedModuleName={selectedModuleName}
      />
    </div>
  );
};

export default Mainpage;
