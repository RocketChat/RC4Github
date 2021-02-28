import {useEffect, useState} from "react";

export default function Countup(props) {
  const [count, setCount] = useState(0);
  const speed = 1000 / props.end;
  useEffect(() => {
    if (count < props.end) {
      setTimeout(() => {
        setCount((prevCount) => prevCount + 1);
      }, speed);
    }
  });
  return <div className={props.className}>{count}</div>;
}
