import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

const ARCHIVO_BOLD_URL =
  "https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT0zRp8A.ttf";

export default async function Icon() {
  const archivoBold = await fetch(ARCHIVO_BOLD_URL).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 22,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1,
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Archivo",
          data: archivoBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
