import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { Icon } from "@iconify/react";
import { Oval } from "react-loader-spinner";
import ECharts, { EchartsReactprops } from "echarts-for-react";
import axios from "axios";
import * as echarts from "echarts";

import { cloneDeep } from "lodash";

const Graph = ({
  selectedcompoData,
  selectedMachineName,
  selectedModuleName,
  notificationHandler
}) => {
  const [startDate, setstartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setendDate] = useState(new Date());
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [realGraphBtn, setRealGraphBtn] = useState(false); // 실시간 그래프 버튼상태
  const [saveResultArr, setSaveResultArr] = useState();
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  //ㅡㅡㅡ마우스 외부클릭
  const outsideClickRefstart = useRef();
  const outsideClickRefend = useRef();

  //---- 내가 가진 장비 목록
  const collectionJSON = localStorage.getItem('collectionNames');
  const collectionNames = JSON.parse(collectionJSON);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        outsideClickRefstart.current &&
        !outsideClickRefstart.current.contains(event.target)
      ) {
        setStartDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick2 = (event) => {
      if (
        outsideClickRefend.current &&
        !outsideClickRefend.current.contains(event.target)
      ) {
        setEndDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick2);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick2);
    };
  }, []);
  //ㅡㅡㅡㅡ마우스 외부클릭 끝

  useEffect(() => {
    if (!selectedMachineName || !selectedModuleName) {
      setOption(getInitialOptions());
    } else {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.clear();
      chartInstance.setOption(getInitialOptions());
      setOption(getInitialOptions());
    }
  }, [selectedcompoData?.name, selectedMachineName, selectedModuleName]);
  const [option, setOption] = useState({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [],
    },
    // toolbox: {
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: "none",
    //       bottom: 0,
    //     },
    //     // restore: {},
    //   },
    //   right: 0,
    //   top: 30,
    // },
    xAxis: {
      type: "time",
      min: new Date("2021-12-31T23:59:59.999Z").getTime(),
      max: new Date("2022-12-31T23:59:59.999Z").getTime(),
      show: true,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "1%"],
      show: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        start: 0,
        end: 100,
        handleSize: 8,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
    series: [],
  });

  const [option2, setOption2] = useState({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [],
    },
    dataZoom: {
      show: false,
      start: 0,
      end: 100,
      disabled: true, // 줌 비활성화
    },
    xAxis: [
      {
        type: "time",
        min: new Date("2021-12-31T23:59:59.999Z").getTime(),
        max: new Date("2022-12-31T23:59:59.999Z").getTime(),
      },
    ],
    yAxis: {
      type: "value",
      boundaryGap: [0, "1%"],
      show: true,
    },
    series: [],
  });

  let resultArrData = [];

  const samplingOpt = {
    large: true,
    sample: 1,
  };

  // 이 옵션으로 chart를 만듦
  const getInitialOptions = () => ({
    tooltip: {
      trigger: "axis",
    },
    // toolbox: {
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: "none",
    //       bottom: 0,
    //     },
    //     // restore: {},
    //   },
    //   right: 0,
    //   top: 30,
    // },
    xAxis: {
      type: "time",
      min: new Date("2021-12-31T23:59:59.999Z").getTime(),
      max: new Date("2022-12-31T23:59:59.999Z").getTime(),
      show: true,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0 , "1%"],
      show: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        start: 0,
        end: 100,
        handleSize: 8,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
    series: [],
  });

  const newRealGraph = (newData) => {
    setOption2((prev) => {
      const newOption = { ...prev }; // 깊은 복사
      let minTime = new Date(newData[0].date);
      minTime.setHours(minTime.getHours()-1);
      console.log(minTime)
      for (let j = 0; j < newData.length; j++) {
        for (let i = 0; i < newOption.series.length; i++) {
          console.log(newOption.series[i].name, newData[j].name)
          if (newOption.series[i].name === newData[j].name) {
            console.log(new Date(newOption.series[i].data[0][0]).getTime(), ",",minTime.getTime())
            let cnt = 0
            for (let k = 0; k < newOption.series[i].data.length; k++){
              if(new Date(newOption.series[i].data[k][0]).getTime() < minTime.getTime()){
                cnt += 1;
              }
            }
            console.log("for문 갯수", cnt)
            for (let k = 0; k < cnt; k++){
              console.log("밀어내")
              newOption.series[i].data.shift();
            }
            newOption.series[i].data.push([newData[j].date, newData[j].value]);
            break;
          }
        }
      }

      newOption.xAxis.max = new Date(newData[0].date).getTime();
      newOption.xAxis.min = minTime.getTime();

      if (chartRef.current) {
        const myChart = chartRef.current.getEchartsInstance();
        var zoomStart = myChart.getOption().dataZoom[0].start;
        var zoomEnd = myChart.getOption().dataZoom[0].end;
        myChart.setOption(newOption, false);
        myChart.setOption({
          dataZoom: [
            {
              start: zoomStart,
              end: zoomEnd,
            },
          ],
        });
      }
      return newOption;
    });
  };
  const prevdata = (realTimeFlag, resultArr, nameArr) => {
    let realStart = new Date();
    let newEnd = new Date();
    realStart = new Date(
      realStart.getTime() - realStart.getTimezoneOffset() * 60000
    );
    realStart.setHours(realStart.getHours() - 10);
    if (realTimeFlag) {
      console.log("실시간 결과 값들", resultArr);
      const newOption2 = option2;
      newOption2.xAxis = {
        type: "time",
        min: realStart.getTime(),
        max: newEnd.getTime(),
      };
      newOption2.legend = {
        data: nameArr,
        selectedMode: true,
      };
      newOption2.series = resultArr;
      setOption2((prev) => ({
        ...prev,
        xAxis: {
          type: "time",
          min: realStart.getTime(),
          max: endDate.getTime(),
        },
        legend: {
          data: nameArr,
          selectedMode: true,
        },
        series: resultArr,
      }));
      if (chartRef.current) {
        const myChart = chartRef.current.getEchartsInstance();
        myChart.setOption(newOption2);
      }
    } else {
      const t0 = performance.now();
      setOption((prev) => ({
        ...prev,
        xAxis: {
          type: "time",
          min: startDate.getTime(),
          max: endDate.getTime(),
          show: true,
        },
        legend: {
          data: nameArr,
          selectedMode: true,
        },
        series: resultArr,
      }));
      const t1 = performance.now();
      const elapsed = t1 - t0;
      console.log(elapsed);
      if (chartRef.current) {
        const myChart = chartRef.current.getEchartsInstance();
        myChart.setOption(option);
      }
    }
  };

  const onGraphHandler = () => {
    if (!selectedcompoData || !selectedcompoData.name) {
      alert("값을 선택해주세요");
    } else {
      const time1 = performance.now();
      setRealGraphBtn(false);
      setIsLoading(true);
      axios
        .post("https://k8s101.p.ssafy.io/be/data/parameter", {
          componentName: selectedcompoData.name,
          endDate: endDate,
          machineName: selectedMachineName,
          moduleName: selectedModuleName,
          startDate: startDate,
        })
        .then((res1) => {
            const t0 = performance.now();
            const minus = time1 - t0;
            console.log("name api문", minus);
            console.log(res1.data);
            let nameArr = [];
            for (let i = 0; i < res1.data.length; i++) {
              nameArr.push(res1.data[i].name);
            }

            let machineName = selectedMachineName;
            let moduleName = selectedModuleName;
            let componentName = selectedcompoData.name;
            nameArr.push(componentName);
            console.log(nameArr)
            let resultArr = [];

            const t1 = performance.now();

            Promise.all(
              nameArr.map(async (name) => {
                let parent = componentName;
                if (name == componentName) {
                  parent = moduleName;
                }
                console.log(startDate);
                console.log(endDate);
                const res2 = await axios.post(
                  "https://k8s101.p.ssafy.io/be/data/pgraph",
                  {
                    endDate: endDate,
                    startDate: startDate,
                    machineName: machineName,
                    componentName: parent,
                    parameterName: name,
                  }
                );
                let dataArr = [];
                const perfor1 = performance.now();
                for (let j = 0; j < res2.data.length; j++) {
                  dataArr.push([
                    new Date(res2.data[j].date).toISOString(),
                    res2.data[j].value,
                  ]);
                }
                const perfor2 = performance.now();
                console.log("for문 시간 : ", perfor2 - perfor1);
                return {
                  name: name,
                  type: "line",
                  symbol: "none",
                  sampling: "average",
                  colorBy: "series",
                  large: true,
                  data: dataArr,
                };
              })
            )
              .then((result) => {
                let resultFlag = true
                console.log("결과들",result)
                for (let i = 0; i<result.length; i++){
                  if(result[i].data.length > 0){
                    resultFlag = false
                  }
                }
                if (resultFlag){
                  alert("해당 기간에는 데이터가 없습니다.")
                  return;
                }
                console.log(result);
                resultArr.push(result);
                console.log(resultArr);
                resultArrData = resultArr;
                console.log(resultArrData);
                const prev1 = performance.now();
                const realTimeFlag = false;
                prevdata(realTimeFlag, resultArr[0], nameArr);
                const prev2 = performance.now();
                console.log("그래프시간 시간 : ", prev2 - prev1);
              })
              .finally(() => {
                setIsLoading(false);
              });
            const t2 = performance.now();
            console.log("Promise 문 ", t2 - t1);
          });
    }
  };

  const onRealtimeGraphHandler = () => {
      if (!selectedcompoData || !selectedcompoData.name) {
        alert("값을 선택해주세요");
      } else {
        const time1 = performance.now();

        //------------실시간 그래프 api 보내기 위해 startdate 설정.(현재시간 - 1)-------
        let realStart = new Date();
        realStart = new Date(
          realStart.getTime() - realStart.getTimezoneOffset() * 60000
        );
        realStart.setHours(realStart.getHours() - 10);
        // 날짜를 ISO 8601 형식의 문자열로 변환합니다
        let realtimeAnHourAgo = realStart.toISOString();
        // 초 이하의 정보를 제거합니다.
        realtimeAnHourAgo = realtimeAnHourAgo.slice(0, 19);
        console.log("시작시간",realtimeAnHourAgo);
        //----------------------------------------------------------------------------
        //-------------실시간 그래프 api 보내기 위해 endDate 설정-----------------------
        let realEnd = new Date();
        realEnd = new Date(
          realEnd.getTime() - realEnd.getTimezoneOffset() * 60000
        );
        let realtime = realEnd.toISOString();
        realtime = realtime.slice(0, 19);
        console.log("끝시간",realtime);
        //-----------------------------------------------------------------------------

        setIsLoading(true);
        axios
          .post("https://k8s101.p.ssafy.io/be/data/parameter", {
            componentName: selectedcompoData.name,
            endDate: realtime,
            machineName: selectedMachineName,
            moduleName: selectedModuleName,
            startDate: realtimeAnHourAgo,
          })
          .then((res1) => {
              const t0 = performance.now();
              const minus = time1 - t0;
              console.log("name api문", minus);
              console.log(res1.data);
              let nameArr = [];
              for (let i = 0; i < res1.data.length; i++) {
                nameArr.push(res1.data[i].name);
              }

              let machineName = selectedMachineName;
              let moduleName = selectedModuleName;
              let componentName = selectedcompoData.name;
              nameArr.push(componentName);

              let resultArr = [];

              const t1 = performance.now();

              Promise.all(
                nameArr.map(async (name) => {
                  let parent = componentName;
                  if (name == componentName) {
                    parent = moduleName;
                  }
                  const res2 = await axios.post(
                    "https://k8s101.p.ssafy.io/be/data/pgraph",
                    {
                      endDate: realtime,
                      startDate: realtimeAnHourAgo,
                      machineName: machineName,
                      componentName: parent,
                      parameterName: name,
                    }
                  );
                  console.log("res2",res2)
                  let dataArr = [];
                  const perfor1 = performance.now();
                  for (let j = 0; j < res2.data.length; j++) {
                    dataArr.push([
                      new Date(res2.data[j].date).toISOString(),
                      res2.data[j].value,
                    ]);
                  }
                  const perfor2 = performance.now();
                  console.log("for문 시간 : ", perfor2 - perfor1);
                  return {
                    name: name,
                    type: "line",
                    symbol: "none",
                    colorBy: "series",
                    data: dataArr.reverse(),
                  };
                })
              )
                .then((result) => {
                  let resultFlag = true
                  console.log("결과들",result)
                  for (let i = 0; i<result.length; i++){
                    if(result[i].data.length > 0){
                      resultFlag = false
                    }
                  }
                  if (resultFlag){
                    alert("해당 기간에는 데이터가 없습니다.");
                    setRealGraphBtn(false);
                    return;
                  }
                  console.log(result);
                  resultArr.push(result);
                  console.log(resultArr);
                  resultArrData = resultArr;
                  console.log(resultArrData);
                  const prev1 = performance.now();
                  const realTimeFlag = true;
                  prevdata(realTimeFlag, resultArr[0], nameArr);
                  const prev2 = performance.now();
                  console.log("그래프시간 시간 : ", prev2 - prev1);
                })
                .finally(() => {
                  setIsLoading(false);
                });
              const t2 = performance.now();
              console.log("Promise 문 ", t2 - t1);
            }
          );
    }
    setRealGraphBtn(true);
  };

  useEffect(() => {
    const eventSource = new EventSource(
      "https://k8s101.p.ssafy.io/be/sse/connect",
      { headers: { accept: "text/event-stream" } },
      { withCredentials: true }
    );
    eventSource.addEventListener("connect", (event) => {
      const { data: received } = event;
      console.log("Graph connect", received);
      console.log(event.data);
    });

    eventSource.addEventListener("machine", (event) => {
      const newMachineData = event.data;
      console.log("스웨거 실행")

      if (newMachineData === selectedMachineName && realGraphBtn === true) {
        realGraphMove();
      }

    });
    eventSource.addEventListener("errorMachine", (event) => {
      console.log("이거 실행", event.data)
      if(collectionNames.includes(event.data)){ //event.data != selectedMachineName && 
        notificationHandler(event.data)
      }
  });
    return () => {
      eventSource.close();
    };
  }, [realGraphBtn]);

  const realGraphMove = () => {
    axios
      .post("https://k8s101.p.ssafy.io/be/data/graph/now", {
        componentName: selectedcompoData?.name,
        machineName: selectedMachineName,
        moduleName: selectedModuleName,
      })
      .then((res) => {
        console.log(res);
        newRealGraph(res.data);
      });
  };

  return (
    <div>
      <Box>
        <PeriodBox>
          <Font>
            {realGraphBtn
              ? `RealTime Graph (${selectedcompoData?.name || "None"})`
              : `Period Graph (${selectedcompoData?.name || "None"})`}
          </Font>
          <Line></Line>

          <AlignPeriod style={{ display: "flex", alignItems: "center" }}>
            <PFont>PERIOD</PFont>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SIconContainer>
                <Icon
                  icon="material-symbols:calendar-today-outline-rounded"
                  width="27"
                  color="steelblue"
                  onClick={() => setStartDateOpen(!startDateOpen)}
                />
              </SIconContainer>
              <SDatePickerWrapper ref={outsideClickRefstart}>
                <SDatePicker
                  preventOpenFocus={true}
                  showPopperArrow={false}
                  selected={startDate}
                  open={startDateOpen}
                  onChange={(date) => {
                    setstartDate(date);
                    setStartDateOpen(false);
                  }}
                  onSelect={() => {
                    setStartDateOpen(false);
                  }}
                  locale={ko}
                  selectsStart
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  dateFormat="yyyy-MM-dd HH:mm"
                  popperProps={{
                    modifiers: [
                      {
                        name: "flip",
                        enabled: false,
                      },
                      {
                        name: "preventOverflow",
                        options: {
                          enabled: true,
                          escapeWithReference: false,
                          boundary: "viewport",
                        },
                      },
                    ],
                  }}
                />
              </SDatePickerWrapper>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 20px 0 15px",
              }}
            />
            ~
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 60px 0 30px",
              }}
            >
              <SIconContainer>
                <Icon
                  icon="material-symbols:calendar-today-outline-rounded"
                  width="27"
                  color="steelblue"
                  onClick={() => setEndDateOpen(!endDateOpen)}
                />
              </SIconContainer>
              <SDatePickerWrapper ref={outsideClickRefend}>
                <SDatePicker
                  showPopperArrow={false}
                  selected={endDate}
                  open={endDateOpen}
                  onChange={(date) => {
                    setendDate(date);
                    setEndDateOpen(false);
                  }}
                  onSelect={() => {
                    setEndDateOpen(false);
                  }}
                  locale={ko}
                  minDate={startDate}
                  selectsEnd
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  dateFormat="yyyy-MM-dd HH:mm"
                  popperProps={{
                    modifiers: [
                      {
                        name: "flip",
                        enabled: false,
                      },
                      {
                        name: "preventOverflow",
                        options: {
                          enabled: true,
                          escapeWithReference: false,
                          boundary: "viewport",
                        },
                      },
                    ],
                  }}
                />
              </SDatePickerWrapper>
            </div>
            <Button1 onClick={onGraphHandler}>
              <Icon
                icon="mdi:calendar-clock"
                style={{ marginRight: "3px", fontSize: "18px" }}
              />{" "}
              Period Set
            </Button1>
            <Button2 onClick={onRealtimeGraphHandler}>
              <Icon
                icon="mdi:flash"
                style={{ marginRight: "3px", fontSize: "18px" }}
              />
              RealTime
            </Button2>
          </AlignPeriod>
        </PeriodBox>

        <div
          style={{
            position: "relative",
          }}
        >
          <EChartsWrapper
            id="main"
            ref={chartRef}
            option={option}
            opts={{ width: "auto", height: "auto" }}
          />
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                background: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Oval color="#00BFFF" height={100} width={100} timeout={5000} />
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Graph;
const EChartsWrapper = styled(ECharts)`
  width: 100%; /* 가로 크기 조정 */
  height: 200%; /* 세로 크기 조정 */
  margin-top: 50px; /* 위쪽 여백 조정 */
`;

const SIconContainer = styled.div`
  width: 20px;
  margin-right: 15px;
  margin-left: 10px;
  color: steelblue;
  cursor: pointer;
`;

const Box = styled.div`
  position: absolute;
  top: 260px;
  left: 600px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 900px;
  height: 470px;
  border-radius: 20px;
  overflow: hidden;
`;

const Font = styled.div`
  margin: 10px 0px 0px 20px;
  font-size: 18px;
  text-transform: uppercase;
  color: #707070;
  font-weight: 600;
  font-family: "Segoe UI";
`;
const Line = styled.div`
  position: absolute;
  width: 850px;
  height: 0px;
  left: 15px;
  top: 35px;
  border: 1px solid #B7B7B7;
`;

const PFont = styled.div`
  margin-left: 30px;
  margin-right: 5px;
  font-weight: 400;
  font-family: "Segoe UI";

  font-size: 13px;
  color: #707070;
`;
const PeriodBox = styled.div`
  position: relative;
  align-items: center;
  z-index: 4;
  font-size: 12px;
`;
const AlignPeriod = styled.div`
  margin-top: 20px;
  display: flex;
`;
const SDatePicker = styled(DatePicker)`
  border: none;
  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #a8dadc;
  }
  width: 110px;
`;
const SDatePickerWrapper = styled.div`
  .react-datepicker__input-container input {
    font-family: Arial, sans-serif;
    font-size: 12px;
  }
`;
const Button1 = styled.button`
  background-color: hsl(10, 50%, 50%);
  color: white;
  padding: 3px 10px;
  margin : 0px 5px 0px 5px;
  border: none;
  border-radius: 5px;
  width : 30px
  cursor: pointer;
`;

const Button2 = styled.button`
  background-color: hsl(210, 100%, 30%);
  color: white;
  padding: 3px 10px;
  margin : 0px 5px 0px 5px;
  border: none;
  border-radius: 5px;
  width : 30px
  cursor: pointer;
`;
