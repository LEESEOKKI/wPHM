import Condition from "../Component/MainPage/Condition";
import ComponentList from "../Component/MainPage/ComponentList";
import Graph from "../Component/MainPage/Graph";
import react, { useState } from "react";
import usePushNotification from '../common/usePushNotification ';

const Mainpage = () => {
  const [moduleChild, setModuleChild] = useState([]);
  const [selectComponentData, setSelectComponentData] = useState([]); // ComponentList에서 선택한 컴포넌트(name, value) 들고옴
  const [selectedMachineName, setSelectedMachineName] = useState();
  const [selectedModuleName, setSelectedModuleName] = useState();


  const { fireNotificationWithTimeout } = usePushNotification();
    const notificationHandler = (e) => {
      console.log("실행은 됨 안뜨는 것 뿐")
      fireNotificationWithTimeout('Machine Error', {
        body: e+" 의 상태가 좋지않습니다.",
      });
    }  

  return (
    <div>
      <Condition
        setModuleChild={setModuleChild}
        setSelectedMachineName={setSelectedMachineName}
        setSelectedModuleName={setSelectedModuleName}
        selectedcompoDate={selectComponentData}
      />
      <ComponentList
        child={moduleChild}
        setSelectComponentData={setSelectComponentData}
      />
      <Graph
        selectedcompoData={selectComponentData}
        selectedMachineName={selectedMachineName}
        selectedModuleName={selectedModuleName}
        notificationHandler = {notificationHandler}
      />
    </div>
  );
};

export default Mainpage;
