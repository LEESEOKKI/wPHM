import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Conbox from '../Condition/Conbox';
import api from '../../../redux/api';

const Condition = ({ setModuleChild, setSelectedMachineName, setSelectedModuleName }) => {
  const [machineData, setMachineData] = useState({});
  const [moduleData, setModuleData] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [status, setStatus] = useState('');
  const [currentMachineName, setCurrentMachineName] = useState('');
  const [currentModuleName, setCurrentModuleName] = useState('');

  
  const collectionJSON = localStorage.getItem('collectionNames');
  const collectionNames = JSON.parse(collectionJSON);

  const secondSelect = useRef();

  useEffect(() => {
    const eventSource = new EventSource(
      'http://3.36.125.122:8082/sse/connect',
      { headers: { accept: 'text/event-stream' }}, { withCredentials: true}
    );

    eventSource.onmessage = (e) => {
      console.log(e);
    };

    eventSource.addEventListener("connect", (event) => {
      const { data: received } = event;
      console.log("connect", received);
      console.log(event.data);
    });
    
    eventSource.addEventListener("machine", (event) => {
      const newMachineData = event.data;
      //   console.log(newMachineData);
      //  console.log(newMachineData, currentMachineName);
      //   console.log(currentModuleName);

      if (newMachineData == currentMachineName) {
        //  console.log('장비 갱신 콘솔은 됨');

        api
          .post(`/data/${currentMachineName}`, JSON.stringify({})) // 추후 root 자리에 변수 넣어서 변경. 현재는 root로 그냥 테스트.
          .then((response) => {
            // console.log(response.data);
            const modulelist = []; // 모듈인 애들 담아 놓는 리스트.
            for (const a of response.data) {
              //    console.log(a);
              if (a.name === currentMachineName) {
                setMachineData(a);
                const value = a.value;
                if (value < 0) {
                  setStatus((a) => "unacceptable");
                } else if (value < 0.03) {
                  setStatus((a) => "unsatisfactory");
                } else if (value < 0.48) {
                  setStatus((a) => "satisfactory");
                } else {
                  setStatus((a) => "Good");
                }
              } else {
                modulelist.push(a);
              }
            }
            setModuleData(modulelist);
            //   console.log('--------------------', currentModuleName);

            api
              .post(
                `data/machine/module?machineName=${currentMachineName}&moduleName=${currentModuleName}`,
                JSON.stringify({})
              )
              .then((response) => {
                //     console.log(response.data);
                setModuleChild(response.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    eventSource.addEventListener('error', (error) => {
      console.log('SSE Error: ', error);
    });

    return () => {
      eventSource.close();
    };
  }, [machineData, currentModuleName]);

  const handleChangeMachine = (event) => {
    const selectMachineName = event.target.value;
    // console.log(secondSelect.current.value)
    setCurrentMachineName(selectMachineName);
    setModuleChild([]);     // 장비 드롭다운에서 다른 장비 선택 시 컴포넌트 리스트 출력 되는 것 초기화.
    secondSelect.current.value = ""  // 장비 드롭다운에서 다른 장비 선택 시 모듈 드롭다운 초기화
    setSelectedMachineName(selectMachineName);

    api
      .post(`/data/${selectMachineName}`, JSON.stringify({})) // 추후 root 자리에 변수 넣어서 변경. 현재는 root로 그냥 테스트.
      .then((response) => {
        //    console.log(response.data);
        const modulelist = []; // 모듈인 애들 담아 놓는 리스트.
        for (const a of response.data) {
          //    console.log(a);
          if (a.name === selectMachineName) {
            setMachineData(a);
            const value = a.value;
            if (value < 0) {
              setStatus((a) => "unacceptable");
            } else if (value < 0.03) {
              setStatus((a) => "unsatisfactory");
            } else if (value < 0.48) {
              setStatus((a) => "satisfactory");
            } else {
              setStatus((a) => "Good");
            }
          } else {
            modulelist.push(a);
          }
        }
        setModuleData(modulelist);
      });
  }

  const handleChangeModule = (event) => {
    const selectModuleName = event.target.value;
    // console.log("클릭", selectModuleName);
    setCurrentModuleName(selectModuleName);
    setSelectedModuleName(selectModuleName);

    api
      .post(
        `data/machine/module?machineName=${currentMachineName}&moduleName=${selectModuleName}`,
        JSON.stringify({})
      )
      .then((response) => {
        setModuleChild(response.data);
        // console.log(response.data);
      });
  };

  return (
    <div>
      <Big>
        <div className="d-flex mt-3 ms-5 me-5 justify-content-between">
          <Fontst size={24}>CONDITION</Fontst>
          <Fontrmargin size={24}>MODULE</Fontrmargin>
        </div>
        <div className="d-flex mt-3 ms-5 me-5 space-between">
          <Form.Select
            size="sm"
            defaultValue=""
            style={{ margin: '0 20px 0 0' }}
            onChange={handleChangeMachine}
          >
            <option value="" disabled>
              ---------
            </option>
            {collectionNames &&
              collectionNames.map((data) => <option key={data}>{data}</option>)}
          </Form.Select>
          <Form.Select
            size="sm"
            defaultValue=""
            style={{ margin: '0 0 0 20px' }}
            onChange={handleChangeModule}
            ref={secondSelect}
          >
            <option value="" disabled>
              ---------
            </option>
            {moduleData.map((data) => (
              <option key={data.name}>{data.name}</option>
            ))}
          </Form.Select>
        </div>
        <div className="mt-4 d-flex justify-content-center align-items-center">
          <Conbox mstate={status} width={200} fontsize={24} />
        </div>
      </Big>
    </div>
  );
  
}

export default Condition;

const Big = styled.div`
  position: absolute;
  top: 20px;
  left: 1070px;
  background: linear-gradient(90deg, #0051C4 0%, #002962 100%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 429px;
  height: 210px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;
const Fontst = styled.div`
  font-family: 'Domine';
  font-style: normal;
  font-size: ${(props) => props.size}px;
  color: #ffffff;
  margin-left: 5px;
`;
const Fontrmargin = styled.div`
  font-family: 'Domine';
  font-style: normal;
  font-size: ${(props) => props.size}px;
  color: #ffffff;
  margin-right: 30px;
`;

const SelectContainer = styled.div`
  flex: 1; /* 추가 */
  display: flex; /* 추가 */
  justify-content: space-between; /* 추가 */
`;