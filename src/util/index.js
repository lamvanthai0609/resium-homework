import * as Cesium from "cesium";

const convertStringToHtml = (str) => {
  const parser = new DOMParser();
  const doc3 = parser.parseFromString(str, "application/xml");
  return doc3;
};

export const handlerData = (respon, element, atribute) => {
  const $ = convertStringToHtml(respon).querySelectorAll.bind(
    convertStringToHtml(respon)
  );
  let data = {};
  Object.values($(element)).map(
    (item) =>
      (data = {
        ...data,
        [item.id]: item.getAttribute(atribute).replace(/\s/g, "").split(","),
      })
  );
  return data;
};

export const handlerObj = (data) => {
  //console.log(data);
  if (data) {
    let dataLineNew = {};
    const keyLine = Object.keys(data.line);
    const valueLine = Object.values(data.line);
    valueLine.forEach((item, index) => {
      const pointOne = data.point[item[0]];
      const pointTwo = data.point[item[1]];
      dataLineNew = {
        ...dataLineNew,
        [keyLine[index]]: [...pointOne, ...pointTwo].map((x) => +x),
      };
    });
    console.log(dataLineNew);
    let dataPolygonNew = {};
    const keyPolygon = Object.keys(data.polygon);
    const valuePolygon = Object.values(data.polygon);

    valuePolygon.forEach((item, index) => {
      let datachild = [];
      item.forEach((item2, index2) => {
        datachild = [...datachild, ...dataLineNew[item2]];
      });

      dataPolygonNew = {
        ...dataPolygonNew,
        [keyPolygon[index]]: { line: item, coordinates: datachild },
      };
    });
    return { dataLineNew, dataPolygonNew };
  }
};

/// tính khoảng cách 2 điểm
const getDistanceTwoPoint = (point1, point2) => {
  const point1GeoPosition = Cesium.Cartographic.fromCartesian(point1);
  const point2GeoPosition = Cesium.Cartographic.fromCartesian(point2);
  const auxiliary =
    point1GeoPosition.height > point2GeoPosition.height
      ? new Cesium.Cartesian3.fromRadians(
          point1GeoPosition.longitude,
          point1GeoPosition.latitude,
          point2GeoPosition.height
        )
      : new Cesium.Cartesian3.fromRadians(
          point2GeoPosition.longitude,
          point2GeoPosition.latitude,
          point1GeoPosition.height
        );
  const distancenHorizontal =
    point1GeoPosition.height > point2GeoPosition.height
      ? Cesium.Cartesian3.distance(auxiliary, point2)
      : Cesium.Cartesian3.distance(point1, auxiliary);
  return distancenHorizontal;
};

export const countCooLine = (data) => {
  let datanew = {};
  const keyData = Object.keys(data);
  const valueData = Object.values(data);
  valueData.forEach((item, index) => {
    const fisrt = new Cesium.Cartesian3(item[0], item[1], item[2]);
    const secon = new Cesium.Cartesian3(item[3], item[4], item[5]);
    let result = new Cesium.Cartesian3();
    datanew = {
      ...datanew,
      [keyData[index]]: {
        coordinates: item,
        length: getDistanceTwoPoint(fisrt, secon).toFixed(2),
        middpoint: Cesium.Cartesian3.midpoint(fisrt, secon, result),
      },
    };
  });
  return datanew;
};
