import React, { useState } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import api from "../../redux/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPopper } from "@popperjs/core";

const Period = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  onChangeStartDate,
  onChangeEndDate,
  selectComponentName,
}) => {
  const [localStartDate, setLocalStartDate] = useState(
    initialStartDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const [localEndDate, setLocalEndDate] = useState(
    initialEndDate || new Date()
  );

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleStartDateChange = (date) => {
    setLocalStartDate(date);
    if (onChangeStartDate) {
      onChangeStartDate(date);
    }
  };
  const handleEndDateChange = (date) => {
    setLocalEndDate(date);
    if (onChangeEndDate) {
      onChangeEndDate(date);
    }
  };
  return (
    <PeriodBox>
      <p style={{margin: '10px 0px -5px 0px', fontWeight: 'bold'}}>{selectComponentName}</p>
      <hr/>
      <AlignPeriod>
      {" PERIOD "}
      <CalendarIcon
        src="image/Calendar-icon.png"
        onClick={() => setStartDateOpen(!startDateOpen)}
      />
      <DatePickerContainer>
        <DatePicker
          selected={localStartDate}
          onChange={(date) => {
            handleStartDateChange(date);
          }}
          selectsStart
          startDate={localStartDate}
          open={startDateOpen}
          onCalendarClose={() => setStartDateOpen(false)}
          onBlur={() => setStartDateOpen(false)}
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
      </DatePickerContainer>
      {"   "}~{"  "}
      <CalendarIcon
        src="image/Calendar-icon.png"
        onClick={() => setEndDateOpen(!endDateOpen)}
      />
      <DatePickerContainer>
        <DatePicker
          selected={localEndDate}
          onChange={(date) => {
            handleEndDateChange(date);
          }}
          selectsEnd
          endDate={localEndDate}
          open={endDateOpen}
          onCalendarClose={() => setEndDateOpen(false)}
          onBlur={() => setEndDateOpen(false)}
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
      </DatePickerContainer>
      </AlignPeriod>
    </PeriodBox>
  );
};

export default Period;

const PeriodBox = styled.div`
  position: relative;
  align-items: center;
  z-index: 4;
  font-size: 12px;
  margin: auto;
`;

const CalendarIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
`;

const DatePickerContainer = styled.div`
  overflow: visible;
`;

const AlignPeriod = styled.div`
  display: flex;
  align-items: center;
  width: 850px;
`;
