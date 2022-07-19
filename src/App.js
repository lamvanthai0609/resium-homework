import * as Cesium from "cesium";
import { useEffect, useState } from "react";
import {
  Viewer,
  Entity,
  PolylineGraphics,
  EntityDescription,
  PolygonGraphics,
  Camera,
  Scene,
  Globe,
  Label,
  LabelCollection,
  Primitive,
} from "resium";
import { getDataXmlAPI } from "./sevice/api";
import { countCooLine, handlerData, handlerObj } from "./util";

const position = Cesium.Cartesian3.fromDegrees(
  -93.62033081054688,
  42.01864242553711,
  1000
);

function App() {
  const [data, setData] = useState();
  const [dataLine, setDataLine] = useState();

  useEffect(() => {
    const getData = async () => {
      const respon = await getDataXmlAPI();
      const dataObj = {
        polygon: handlerData(respon, "POLYGON", "path"),
        line: handlerData(respon, "LINE", "path"),
        point: handlerData(respon, "POINT", "data"),
      };

      const { dataLineNew, dataPolygonNew } = handlerObj(dataObj);
      const dataLineupdate = countCooLine(dataLineNew);
      setData(dataPolygonNew);
      setDataLine(dataLineupdate);
    };
    getData();
  }, []);
  console.log(data);
  console.log(dataLine);
  return (
    <div className="App">
      <Viewer full>
        <Scene terrainProvider={Cesium.createWorldTerrain()}>
          <Primitive geometryInstances={Cesium.createOsmBuildings()}>
            <Globe />
            <Camera position={position} />
            {dataLine &&
              Object.values(dataLine).map((item, index) => (
                <Entity key={index}>
                  <PolylineGraphics
                    width={5}
                    positions={
                      new Cesium.Cartesian3.fromDegreesArrayHeights(
                        item.coordinates
                      )
                    }
                    material={Cesium.Color.TRANSPARENT}
                  />
                  <LabelCollection show={true}>
                    <Label
                      id={"my label" + index}
                      text={Object.keys(dataLine)[index] + " : " + item.length}
                      font={"13px Bold Arial"}
                      outlineColor={Cesium.Color.CYAN}
                      position={
                        new Cesium.Cartesian3.fromDegrees(
                          item.middpoint.x,
                          item.middpoint.y,
                          item.middpoint.z
                        )
                      }
                      fillColor={Cesium.Color.YELLOW}
                    />
                  </LabelCollection>
                </Entity>
              ))}

            {data &&
              Object.values(data).map((item, index) => (
                <Entity
                  position={position}
                  name={Object.keys(data)[index]}
                  key={index}
                >
                  {/* <PolylineGraphics
                  width={2}
                  positions={Cesium.Cartesian3.fromDegreesArrayHeights(
                    item.coordinates
                  )}
                  material={Cesium.Color.TRANSPARENT}
                /> */}
                  <PolygonGraphics
                    outline={true}
                    outlineColor={Cesium.Color.CYAN}
                    perPositionHeight={true}
                    material={Cesium.Color.CYAN.withAlpha(0.5)}
                    fill={true}
                    hierarchy={Cesium.Cartesian3.fromDegreesArrayHeights(
                      item.coordinates
                    )}
                  />

                  <EntityDescription>
                    <h1>Mặt : {Object.keys(data)[index]}</h1>
                    <p> Cạnh: {item.line.toString()}</p>
                  </EntityDescription>
                </Entity>
              ))}
          </Primitive>
        </Scene>
      </Viewer>
    </div>
  );
}

export default App;
