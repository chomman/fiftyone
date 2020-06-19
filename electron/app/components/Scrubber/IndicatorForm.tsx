import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSpring, animated } from "react-spring";

import "../../app.global.css";
import { currentIndex, viewCount } from "../../state/atoms";
import { indicatorIndex } from "../../state/selectors";

import indicatorFormMachine from "./IndicatorForm.machine.ts";
import { stat } from "fs";

const IndicatorForm = animated(styled.input`
  width: 3rem;
  height: 2rem;
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;

  &:focus {
    outline: none;
    padding: 0;
    cursor: pointer;
  }
`);

export default function () {
  const ref = useRef();
  const indicatorIndexValue = useRecoilValue(indicatorIndex);
  const viewCountValue = useRecoilValue(viewCount);
  const setCurrentIndex = useSetRecoilState(currentIndex);
  const [state, send] = useMachine(indicatorFormMachine);
  const focused = state.value === "focused" || state.value === "typing";
  const props = useSpring({
    width: focused ? "2.5rem" : "3rem",
    marginLeft: focused ? "0.5rem" : "0rem",
  });

  const onMouseOver = () => {
    ref.current.focus();
    send({ type: "FOCUS", payload: indicatorIndexValue });
  };
  const onMouseOut = () => {
    ref.current.blur();
    send("BLUR");
  };

  const onBlur = () => send("BLUR");

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (state.context.currentInput !== "") {
        setCurrentIndex(parseInt(state.context.currentInput));
      }
    }
  };

  const onChange = (e) => {
    const currentInput = state.context.currentInput;
    const nextInput = e.target.value;
    const nextInputEmpty = !nextInput.length;
    const nextInputInt = parseInt(nextInput);
    const payload =
      (nextInputInt <= viewCountValue && nextInputInt >= 0) || nextInputEmpty
        ? nextInput
        : currentInput;
    send({ type: "TYPE", payload });
  };

  return (
    <IndicatorForm
      style={props}
      ref={ref}
      value={
        state.value === "blurred"
          ? indicatorIndexValue
          : state.context.currentInput
      }
      onKeyDown={onKeyDown}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onBlur={onBlur}
      onChange={onChange}
      type="number"
      min={0}
      max={viewCountValue}
    />
  );
}