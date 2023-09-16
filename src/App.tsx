import { useEffect, useRef, useState } from "react";
import {
  CanvasHoverPixelChangeHandler,
  Dotting,
  DottingRef,
  PixelModifyItem,
  useBrush,
  useData,
  useDotting,
  useGrids,
  useHandlers,
} from "dotting";

import { data_A, data_B, data_C } from "./alphabet";

const CreateEmptySquareData = (
  size: number,
): Array<Array<PixelModifyItem>> => {
  const data: Array<Array<PixelModifyItem>> = [];
  for (let i = 0; i < size; i++) {
    const row: Array<PixelModifyItem> = [];
    for (let j = 0; j < size; j++) {
      row.push({ rowIndex: i, columnIndex: j, color: "" });
    }
    data.push(row);
  }
  return data;
};

function App() {
  const ref = useRef<DottingRef>(null);
  const { colorPixels } = useDotting(ref);
  const { indices, dimensions } = useGrids(ref);
  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  } = useHandlers(ref);
  const [hoveredPixel, setHoveredPixel] = useState<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const emptyData= CreateEmptySquareData(28);
  const data=useData(ref);

  useEffect(()=>{
    document.addEventListener("keydown", (e)=>{
      console.log("pressed key: "+e.key);
      switch(e.key){
        case 'a'||'A':
          ref.current?.setData(data_A);
          break;
        case 'b'||'B':
          ref.current?.setData(data_B);
          break;
        case 'c'||'C':
          ref.current?.setData(data_C);
          break;
      }
    })
  }
  ,[]);

  useEffect(() => {
    const hoverPixelChangeListener: CanvasHoverPixelChangeHandler = (pixel) => {
      const { indices } = pixel;
      if (indices) {
        setHoveredPixel(indices);
      } else {
        setHoveredPixel(null);
      }
    };
    // addHoverPixelChangeListener(hoverPixelChangeListener);
    return () => {
      // removeHoverPixelChangeListener(hoverPixelChangeListener);
    };
  }, [addHoverPixelChangeListener, removeHoverPixelChangeListener]);

  function setColorInterval(r:number,c:number,fr:(r:number)=>number,fc:(c:number)=>number, breakIf: (r: number, c: number)=>boolean){
    if(breakIf(r,c)) return;
    colorPixels([{rowIndex: r, columnIndex: c, color: "red"}]);
    setTimeout(()=>setColorInterval(r+fr(r), c+fc(c), fr, fc, breakIf), 40);
    console.log(r,c);
  }

  useEffect(() => {
    const onCanvasClickListener = () => {
      // TASK: Make a firework effect when the user clicks on the canvas.
      // HINT1: You can use the `colorPixels` function to change the color of a pixel.
      // HINT2: You must know the boundaries of the current pixel canvas to take into considuration of the extent of the firework effect.
      // HINT3: You can use the indices and dimensions variables to get the boundaries of the current pixel canvas.
      // Check out the documentation for more information:
      // URL1: https://hunkim98.github.io/dotting/?path=/story/hooks-usedotting--page
      // URL2: https://hunkim98.github.io/dotting/?path=/story/hooks-usegrids--page
      // Do not modify any parts other than the below.
      // Modifiy ⬇️
      if (hoveredPixel) {
        console.log(
          `You clicked on rowIndex: ${hoveredPixel.rowIndex}, columnIndex: ${hoveredPixel.columnIndex}`
        );

        const [br, tr, rc, lc] = [indices.bottomRowIndex, indices.topRowIndex, indices.rightColumnIndex, indices.leftColumnIndex];

        // const arr= [];
        // let [x, y]= [hoveredPixel.columnIndex, hoveredPixel.rowIndex];
        // while(x<=rc && y<=br) arr.push({rowIndex: y++, columnIndex: x++, color: "red"});
        // [x, y]= [hoveredPixel.columnIndex, hoveredPixel.rowIndex];
        // while(x>=lc && y>=tr) arr.push({rowIndex: y--, columnIndex: x--, color: "red"});
        // [x, y]= [hoveredPixel.columnIndex, hoveredPixel.rowIndex];
        // while(x<=rc && y>=tr) arr.push({rowIndex: y--, columnIndex: x++, color: "red"});
        // [x, y]= [hoveredPixel.columnIndex, hoveredPixel.rowIndex];
        // while(x>=lc && y<=br) arr.push({rowIndex: y++, columnIndex: x--, color: "red"});
        // colorPixels(arr);

        setColorInterval(hoveredPixel.rowIndex, hoveredPixel.columnIndex, (r)=>1, (c)=>1, (r,c)=>r> br || c> rc);
        setColorInterval(hoveredPixel.rowIndex, hoveredPixel.columnIndex, (r)=>1, (c)=>-1, (r,c)=>r> br || c< lc);
        setColorInterval(hoveredPixel.rowIndex, hoveredPixel.columnIndex, (r)=>-1, (c)=>1, (r,c)=>r< tr || c> rc);
        setColorInterval(hoveredPixel.rowIndex, hoveredPixel.columnIndex, (r)=>-1, (c)=>-1, (r,c)=>r< tr || c< lc);

      }
      // Modify ⬆️
    };
    addCanvasElementEventListener("mousedown", onCanvasClickListener);
    return () => {
      removeCanvasElementEventListener("mousedown", onCanvasClickListener);
    };
  }, [
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    hoveredPixel,
    indices,
    colorPixels,
    dimensions,
  ]);

  const onClickLogData=()=>{
    console.log(data.dataArray);
  }

  return (
    <div
      style={{
        // backgroundColor: "#282c34",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
      {hoveredPixel && (
        <div
          style={{
            position: "absolute",
            transform: "translate(50%, 50%)",
            right: "50%",
            top: "10px",
          }}
        >
          Your canvas indices: {indices.leftColumnIndex},{indices.topRowIndex} ~ {indices.rightColumnIndex},{indices.bottomRowIndex}
          <br />
          You are hoveing rowIndex: {hoveredPixel.rowIndex}, columnIndex:{" "}
          {hoveredPixel.columnIndex}
        </div>
      )}
      <Dotting width={800} height={800} ref={ref} initLayers={[{id:"layer1",data:emptyData}]} />
      <div style={{ marginTop: "20px", width:40, height:40, background:'pink', zIndex:2 }} onClick={onClickLogData}>
          log data
      </div>
    </div>
  );
}

export default App;
