import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

const IBM_PLEX_SANS_BOLD_URL =
  "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSDDV5zAA.ttf";

export default async function Icon() {
  const ibmPlexSansBold = await fetch(IBM_PLEX_SANS_BOLD_URL).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
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
          fontFamily: "IBM Plex Sans",
          fontSize: 22,
          fontWeight: 700,
          color: "#000000",
          lineHeight: 1,
        }}
      >
        A
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Sans",
          data: ibmPlexSansBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
