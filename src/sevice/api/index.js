import axios from "axios";

export const getDataXmlAPI = async () => {
  const respon = await axios.get(
    "https://s3.amazonaws.com/CMSTest/squaw_creek_container_info.xml",
    {
      "Content-Type": "application/xml; charset=utf-8",
    }
  );
  return respon && respon.data;
};
